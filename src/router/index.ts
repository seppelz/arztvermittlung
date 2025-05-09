import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import { h, Component, defineComponent } from 'vue'

// Lazy load the auth service to prevent circular dependencies
const getAuthService = () => import('@/services/auth.service').then(module => module.default)

// Auth cache interface
interface AuthCache {
  isAuthenticated: boolean | null;
  isAdmin: boolean | null;
  timestamp: number;
}

// Improved implementation of authentication check
// Cache for auth status to avoid redundant checks in rapid navigation chains
let authCache: AuthCache = {
  isAuthenticated: null,
  isAdmin: null,
  timestamp: 0
};

// Cache validity duration in milliseconds (5 seconds)
const CACHE_TTL = 5000; 

// Improved authentication check
const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Use cache if available and still valid
    const now = Date.now();
    if (authCache.isAuthenticated !== null && (now - authCache.timestamp) < CACHE_TTL) {
      return authCache.isAuthenticated;
    }

    // If no valid cache, check local storage directly to be faster
    const token = localStorage.getItem('token');
    if (!token) {
      authCache.isAuthenticated = false;
      authCache.timestamp = now;
      return false;
    }
    
    // Only load the service if token is valid
    const authService = await getAuthService();
    const authenticated = authService.isAuthenticated();
    
    // Update cache
    authCache.isAuthenticated = authenticated;
    authCache.timestamp = now;
    
    return authenticated;
  } catch (error) {
    console.error('Error in isAuthenticated check:', error);
    // In case of error, treat as not authenticated for safety
    return false;
  }
};

// Improved admin check
const isAdmin = async (): Promise<boolean> => {
  try {
    // Use cache if available and still valid
    const now = Date.now();
    if (authCache.isAdmin !== null && (now - authCache.timestamp) < CACHE_TTL) {
      return authCache.isAdmin;
    }

    // If no valid cache, check local storage directly to be faster
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      authCache.isAdmin = false;
      authCache.timestamp = now;
      return false;
    }
    
    try {
      const user = JSON.parse(userJson);
      if (user && user.role === 'admin') {
        authCache.isAdmin = true;
        authCache.timestamp = now;
        return true;
      }
    } catch (parseError) {
      console.error('Error parsing user data:', parseError);
    }
    
    // Only load the service in case of doubt
    const authService = await getAuthService();
    const admin = authService.isAdmin();
    
    // Update cache
    authCache.isAdmin = admin;
    authCache.timestamp = now;
    
    return admin;
  } catch (error) {
    console.error('Error in isAdmin check:', error);
    // In case of error, treat as not admin for safety
    return false;
  }
};

// Possibility to manually invalidate the cache (e.g. after login/logout)
const clearAuthCache = (): void => {
  authCache.isAuthenticated = null;
  authCache.isAdmin = null;
  authCache.timestamp = 0;
};

// Add event listener for changes to localStorage to invalidate the cache
window.addEventListener('storage', (event) => {
  if (event.key === 'token' || event.key === 'user') {
    clearAuthCache();
  }
});

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutPage.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactPage.vue')
  },
  {
    path: '/bulletin-board',
    name: 'BulletinBoard',
    component: () => import('@/views/BulletinBoardPage.vue')
  },
  {
    path: '/arztboerse',
    name: 'Arztboerse',
    component: () => import('@/views/ArztboersePage.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/PrivacyPage.vue')
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/TermsPage.vue')
  },
  {
    path: '/imprint',
    name: 'Imprint',
    component: () => import('@/views/ImprintPage.vue')
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('@/views/TeamPage.vue')
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/AdminLogin.vue')
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'bulletin',
        name: 'AdminBulletin',
        component: () => import('@/views/admin/AdminBulletin.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'jobs',
        name: 'AdminJobs',
        component: () => import('@/views/admin/AdminJobs.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/AdminUsers.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'contacts',
        name: 'AdminContacts',
        component: () => import('@/views/admin/AdminContacts.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'matches',
        name: 'AdminMatches',
        component: () => import('@/views/admin/MatchesView.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue')
  }
];

// Define a type for route component with error handling
type RouteComponentImport = () => Promise<Component>;

// Wrap dynamic imports with error handling - improve error handling
routes.forEach(route => {
  if (typeof route.component === 'function') {
    const originalComponent = route.component as RouteComponentImport;
    route.component = () => {
      return originalComponent().catch(err => {
        console.error(`Error loading component for route ${route.path}:`, err);
        // Log additional details about the error
        if (err.stack) {
          console.error('Stack trace:', err.stack);
        }
        if ((err as any).cause) {
          console.error('Cause:', (err as any).cause);
        }
        // Return a fallback component
        return {
          render() {
            return h('div', { class: 'error-page' }, [
              h('h1', null, 'Error Loading Page'),
              h('p', null, `There was an error loading this page. ${err.message}`),
              h('button', {
                onClick: () => window.location.reload(),
                class: 'reload-btn'
              }, 'Try Again')
            ]);
          }
        };
      });
    };
  }
  // Handle child routes recursively if they exist
  if (route.children) {
    route.children.forEach(childRoute => {
      if (typeof childRoute.component === 'function') {
        const originalComponent = childRoute.component as RouteComponentImport;
        childRoute.component = () => {
          return originalComponent().catch(err => {
            console.error(`Error loading component for route ${route.path}/${childRoute.path}:`, err);
            return {
              render() {
                return h('div', { class: 'error-page' }, [
                  h('h1', null, 'Error Loading Page'),
                  h('p', null, `There was an error loading this page. ${err.message}`),
                  h('button', {
                    onClick: () => window.location.reload(),
                    class: 'reload-btn'
                  }, 'Try Again')
                ]);
              }
            };
          });
        };
      }
    });
  }
});

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If the user explicitly saves position, restore it
    if (savedPosition) {
      return savedPosition;
    }
    
    // Handle hash fragments inside the page
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
    
    // If routes have a meta property that specifies scroll, use that
    const toMeta = to.meta?.scrollToTop;
    const fromMeta = from.meta?.scrollToTop;
    
    if (toMeta !== undefined || fromMeta !== undefined) {
      if (toMeta === false) {
        // Don't scroll if explicitly set to false in route meta
        return false;
      }
    }
    
    // Default behavior: scroll to top of the page
    return { top: 0 };
  }
});

// Fast authentication check that only reads from localStorage to avoid delays
function fastAuthCheck(): boolean {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available, cannot perform fast auth check');
      return false;
    }
    
    return !!localStorage.getItem('token');
  } catch (error) {
    console.error('Error in fastAuthCheck:', error);
    return false;
  }
}

// Global navigation guard to check authentication
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  try {
    // Emit events for analytics tracking
    window.dispatchEvent(new CustomEvent('router:before-navigation', {
      detail: { to, from }
    }));
    
    // Simple flag to avoid rate limiting of auth checks
    const now = Date.now();
    const lastCheckKey = '_lastAuthCheck';
    let lastCheck = 0;
    
    try {
      lastCheck = parseInt(sessionStorage.getItem(lastCheckKey) || '0');
    } catch (error) {
      console.warn('Error accessing sessionStorage:', error);
    }
    
    // If checks are happening too frequently (within 1 second), 
    // skip detailed checks and proceed
    if (now - lastCheck < 1000) {
      if (requiresAuth(to)) {
        const isAuthed = await Promise.resolve(fastAuthCheck());
        return isAuthed ? next() : next('/login');
      } else {
        return next();
      }
    }
    
    // Update last check timestamp
    try {
      sessionStorage.setItem(lastCheckKey, now.toString());
    } catch (error) {
      console.warn('Error writing to sessionStorage:', error);
    }
    
    if (requiresAuth(to)) {
      // Check if user is authenticated
      const authenticated = await isAuthenticated();
      
      if (!authenticated) {
        // Redirect to login page with return URL
        return next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
      }
      
      // For admin routes, check if user is admin
      if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
        const admin = await isAdmin();
        if (!admin) {
          // Redirect non-admins trying to access admin routes
          return next('/');
        }
      }
    }
    
    // Continue with navigation
    next();
  } catch (error) {
    console.error('Navigation guard error:', error);
    next('/');
  }
});

// Optimized check for routes that require authentication
function requiresAuth(route: RouteLocationNormalized): boolean {
  return route.matched.some(record => record.meta.requiresAuth === true);
}

// Navigation analytics tracking
router.afterEach((to, from) => {
  window.dispatchEvent(new CustomEvent('router:after-navigation', {
    detail: { to, from }
  }));
  
  // Automatically update document title based on route name
  if (to.name) {
    const siteName = 'Arztvermittlung';
    const pageTitle = typeof to.name === 'string' ? to.name : 'Page';
    document.title = `${pageTitle} | ${siteName}`;
  }
  
  // Track page view - handled in main.js with analytics service
});

// Add safer push method with error handling
const originalPush = router.push;
router.push = function push(location) {
  // Use a bind to preserve this context
  return originalPush.bind(this)(location).finally(() => {
    // Success or error both end up here
    console.log('Navigation completed');
  });
};

// Export clearAuthCache for use when logging in/out
export { clearAuthCache };

// Register global error component
router.addRoute({
  path: '/error',
  name: 'Error',
  component: defineComponent({
    props: {
      error: Object
    },
    setup() {
      // Get error details from route query parameters
      const route = router.currentRoute.value;
      const errorMessage = route.query.message || 'An unexpected error occurred';
      const errorCode = route.query.code || '500';
      
      return () => h('div', { class: 'error-container' }, [
        h('h1', null, `Error ${errorCode}`),
        h('p', null, errorMessage),
        h('button', {
          onClick: () => router.push('/'),
          class: 'home-button'
        }, 'Go to Home')
      ]);
    }
  })
});

export default router; 