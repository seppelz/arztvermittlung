import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory, Router, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import App from './App.vue'
import { trackPageView, initOutboundLinkTracking } from './services/analyticsService.ts'

// Error and rejection types
interface ErrorWithStack extends Error {
  stack?: string;
}

interface NavigationError extends ErrorWithStack {
  from?: { fullPath: string };
  to?: { fullPath: string };
  type?: number;
}

// Global error handler with improved stack logging
window.addEventListener('error', (event: ErrorEvent) => {
  console.error('Global error caught:', event.error);
  // Split stack trace into array for better readability
  if (event.error && event.error.stack) {
    const stackLines = event.error.stack.split('\n');
    console.error('Error stack:', stackLines);
  }
});

// Unhandled promise rejections with improved stack logging
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  if (event.reason && event.reason.stack) {
    const stackLines = event.reason.stack.split('\n');
    console.error('Promise rejection stack:', stackLines);
  }
});

// Timeout protection for initialization to avoid deadlocks
const initTimeout = setTimeout(() => {
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Initialization Error</h1>
      <p>The application could not be started within the expected time.</p>
      <p>Please refresh the page or clear your browser cache.</p>
    </div>
  `;
  console.error('Application initialization timeout - possible deadlock detected');
}, 10000);

// Create app with enhanced error handler
const app = createApp(App)
app.config.errorHandler = (err, _vm, info) => {
  console.error('Vue Error Handler:', err);
  console.error('Error Info:', info);
  
  // Additional logging for specific error types
  const error = err as NavigationError;
  if (error && error.name === 'NavigationFailure') {
    console.error('Navigation Failure Details:', {
      from: error.from && error.from.fullPath,
      to: error.to && error.to.fullPath,
      type: error.type
    });
  }
  
  // Stack analysis for detecting circular dependencies
  if (error && error.stack) {
    const stackLines = error.stack.split('\n');
    
    // Search for frequently repeated function names as an indicator for recursion
    const functionCalls = stackLines
      .filter(line => line.includes('at '))
      .map(line => line.trim());
    
    const duplicates = functionCalls.filter((call, index, arr) => 
      arr.indexOf(call) !== index
    );
    
    if (duplicates.length > 5) {
      console.error('Possible circular dependency detected!', {
        repeatedCalls: [...new Set(duplicates)].slice(0, 5),
        totalDuplicates: duplicates.length
      });
    }
  }
};

// Export app object for explicit importing in other modules
// This prevents implicit circular dependencies
export { app };

// Add more enhanced handling for Router errors with recovery
const loadRouter = async (): Promise<Router> => {
  try {
    console.log('Loading router...');
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Router loading timeout')), 3000);
    });
    
    // Race condition to detect slow loading
    const routerModule = await Promise.race([
      import('./router/index'),
      timeoutPromise
    ]);
    
    const router = routerModule.default;
    
    // Setup analytics page tracking with router
    router.afterEach((to: RouteLocationNormalized) => {
      // Track page view on route change
      trackPageView(window.location.origin + to.fullPath);
    });
    
    return router;
  } catch (error) {
    console.error('Router loading error:', error);
    
    // Try one more time with a simplified import approach
    try {
      // Use the direct path to avoid any potential dynamic import issues
      const HomePage = (await import('./views/HomePage.vue')).default;
      
      // Create minimal router with only essential routes
      const routes: RouteRecordRaw[] = [
        {
          path: '/',
          name: 'Home',
          component: HomePage
        },
        {
          path: '/login',
          name: 'Login',
          component: () => import('./views/LoginPage.vue')
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('./views/NotFoundPage.vue')
        }
      ];
      
      const router = createRouter({
        history: createWebHistory(),
        routes
      });
      
      console.warn('Using fallback router with minimal routes');
      return router;
    } catch (fallbackError) {
      console.error('Failed to create fallback router:', fallbackError);
      throw new Error('Router initialization failed completely');
    }
  }
};

// Optimized initialization sequence
const initializeApp = async (): Promise<void> => {
  try {
    console.log('Starting application initialization...');
    
    // 1. Initialize Pinia before everything else
    const pinia = createPinia();
    app.use(pinia);
    console.log('Pinia initialized');
    
    // 2. Initialize auth state
    console.log('Initializing auth state...');
    const { useAuthStore } = await import('@/stores/auth');
    const authStore = useAuthStore();
    await authStore.initAuth();
    console.log('Auth state initialized');
    
    // 3. Initialize router
    console.log('Loading router...');
    const router = await loadRouter();

    // Wrap router installation in a try-catch to handle potential runtime errors
    try {
      // 4. Attach router to the app
      app.use(router);
      console.log('Router initialized');
    } catch (error) {
      console.error('Error installing router:', error);
      const err = error as ErrorWithStack;
      console.error('Router installation error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack?.split('\n').slice(0, 5).join('\n')
      });
      
      // Create a minimal router as fallback in case the main router fails
      const routes: RouteRecordRaw[] = [
        { path: '/', component: () => import('./views/HomePage.vue') },
        { path: '/:pathMatch(.*)*', component: () => import('./views/NotFoundPage.vue') }
      ];
      
      const fallbackRouter = createRouter({
        history: createWebHistory(),
        routes
      });
      
      console.log('Using fallback router due to initialization error');
      app.use(fallbackRouter);
    }
    
    // 5. Initialize outbound link tracking
    initOutboundLinkTracking();
    
    // 6. Mount app
    app.mount('#app');
    console.log('Application successfully initialized');
    
    // Clear initialization timeout
    clearTimeout(initTimeout);
  } catch (error) {
    console.error('Fatal error during app initialization:', error);
    
    // Show detailed error information to the user
    const err = error as ErrorWithStack;
    let errorDetails = err.message || 'Unknown error';
    if (err.stack) {
      const stackLines = err.stack.split('\n').slice(0, 3);
      errorDetails += `\n\nStack: ${stackLines.join('\n')}`;
    }
    
    // Show error in a more user-friendly way
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding: 20px; text-align: center;';
    errorDiv.innerHTML = `
      <h1>Application Error</h1>
      <p>An error occurred during application initialization.</p>
      <p>Please refresh the page or clear your browser cache.</p>
      <details style="margin-top: 20px; text-align: left;">
        <summary>Technical Details</summary>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; margin-top: 10px;">${errorDetails}</pre>
      </details>
    `;
    
    // Clear any existing content
    document.body.innerHTML = '';
    document.body.appendChild(errorDiv);
    
    // Clear initialization timeout
    clearTimeout(initTimeout);
  }
};

// Short delay to ensure DOM is ready
setTimeout(initializeApp, 0);
