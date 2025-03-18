import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Global error handler
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  // Log additional details about the error
  if (event.error && event.error.stack) {
    console.error('Error stack:', event.error.stack);
  }
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  if (event.reason && event.reason.stack) {
    console.error('Promise rejection stack:', event.reason.stack);
  }
});

// Create app with error handler
const app = createApp(App)
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error Handler:', err);
  console.error('Error Info:', info);
  
  // Additional logging for specific error types
  if (err && err.name === 'NavigationFailure') {
    console.error('Navigation Failure Details:', {
      from: err.from,
      to: err.to,
      type: err.type
    });
  }
};

// Create Pinia and use it before importing any store-dependent modules
const pinia = createPinia()
app.use(pinia)

// Use a function to load the router asynchronously to prevent circular dependencies
const setupRouter = async () => {
  try {
    // Dynamically import router to ensure Pinia is initialized first
    const routerModule = await import('./router')
    const router = routerModule.default
    
    // Mount app only after both Pinia and Router are initialized
    app.use(router)
    
    return router
  } catch (error) {
    console.error('Fatal error setting up router:', error)
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Sorry, an error occurred while initializing the application</h1>
        <p>Please try refreshing the page or clearing your browser cache.</p>
        <p>Error details: ${error.message}</p>
      </div>
    `
    throw error
  }
}

// Initialize auth state and mount the app with proper error handling
const initializeApp = async () => {
  try {
    // Initialize router first before using stores that might depend on router
    const router = await setupRouter()
    
    // Initialize auth after router is set up
    const { useAuthStore } = await import('./stores/auth')
    const authStore = useAuthStore()
    authStore.initAuth()
    
    // Only mount the app when everything is properly initialized
    app.mount('#app')
    
    console.log('Application successfully initialized')
  } catch (error) {
    console.error('Error during app initialization:', error)
    // Display a fallback error message to the user
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Sorry, an error occurred</h1>
        <p>Please try refreshing the page or clearing your browser cache.</p>
        <p>Error details: ${error.message}</p>
      </div>
    `
  }
}

// Start app initialization
initializeApp()
