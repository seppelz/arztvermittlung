import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

// Lazy load the auth service to prevent circular dependencies
const getAuthService = () => import('@/services/auth.service').then(module => module.default)

// Verbesserte Implementierung der Authentifizierungsprüfung
// Cache für Auth-Status, um redundante Prüfungen in schnellen Navigationsketten zu vermeiden
let authCache = {
  isAuthenticated: null,
  isAdmin: null,
  timestamp: 0
};

// Cache-Gültigkeitsdauer in Millisekunden (5 Sekunden)
const CACHE_TTL = 5000; 

// Verbesserte Authentifizierungsprüfung
const isAuthenticated = async () => {
  try {
    // Cache verwenden, wenn vorhanden und noch gültig
    const now = Date.now();
    if (authCache.isAuthenticated !== null && (now - authCache.timestamp) < CACHE_TTL) {
      return authCache.isAuthenticated;
    }

    // Wenn kein gültiger Cache, lokale Speicher direkt prüfen, um schneller zu sein
    const token = localStorage.getItem('token');
    if (!token) {
      authCache.isAuthenticated = false;
      authCache.timestamp = now;
      return false;
    }
    
    // Nur bei gültigem Token den Service laden
    const authService = await getAuthService();
    const authenticated = authService.isAuthenticated();
    
    // Cache aktualisieren
    authCache.isAuthenticated = authenticated;
    authCache.timestamp = now;
    
    return authenticated;
  } catch (error) {
    console.error('Error in isAuthenticated check:', error);
    // Im Fehlerfall sicherheitshalber als nicht authentifiziert behandeln
    return false;
  }
};

// Verbesserte Admin-Prüfung
const isAdmin = async () => {
  try {
    // Cache verwenden, wenn vorhanden und noch gültig
    const now = Date.now();
    if (authCache.isAdmin !== null && (now - authCache.timestamp) < CACHE_TTL) {
      return authCache.isAdmin;
    }

    // Wenn kein gültiger Cache, lokale Speicher direkt prüfen, um schneller zu sein
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
    
    // Nur im Zweifelsfall den Service laden
    const authService = await getAuthService();
    const admin = authService.isAdmin();
    
    // Cache aktualisieren
    authCache.isAdmin = admin;
    authCache.timestamp = now;
    
    return admin;
  } catch (error) {
    console.error('Error in isAdmin check:', error);
    // Im Fehlerfall sicherheitshalber als kein Admin behandeln
    return false;
  }
};

// Möglichkeit, den Cache manuell zu invalidieren (z.B. nach Login/Logout)
const clearAuthCache = () => {
  authCache.isAuthenticated = null;
  authCache.isAdmin = null;
  authCache.timestamp = 0;
};

// Event-Listener für Änderungen am localStorage hinzufügen, um den Cache zu invalidieren
window.addEventListener('storage', (event) => {
  if (event.key === 'token' || event.key === 'user') {
    clearAuthCache();
  }
});

const routes = [
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
    path: '/for-doctors',
    name: 'ForDoctors',
    component: () => import('@/views/ForDoctorsPage.vue')
  },
  {
    path: '/for-hospitals',
    name: 'ForHospitals',
    component: () => import('@/views/ForHospitalsPage.vue')
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
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue')
  }
]

// Wrap dynamic imports with error handling - improve error handling
routes.forEach(route => {
  if (typeof route.component === 'function') {
    const originalComponent = route.component;
    route.component = () => {
      return originalComponent().catch(err => {
        console.error(`Error loading component for route ${route.path}:`, err);
        // Log additional details about the error
        if (err.stack) {
          console.error('Stack trace:', err.stack);
        }
        if (err.cause) {
          console.error('Cause:', err.cause);
        }
        // Return a fallback component
        return import('@/views/NotFoundPage.vue');
      });
    };
  }
  
  if (route.children) {
    route.children.forEach(childRoute => {
      if (typeof childRoute.component === 'function') {
        const originalChildComponent = childRoute.component;
        childRoute.component = () => {
          return originalChildComponent().catch(err => {
            console.error(`Error loading component for child route ${route.path}/${childRoute.path}:`, err);
            // Log additional details about the error
            if (err.stack) {
              console.error('Stack trace:', err.stack);
            }
            if (err.cause) {
              console.error('Cause:', err.cause);
            }
            // Return a fallback component
            return import('@/views/NotFoundPage.vue');
          });
        };
      }
    });
  }
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guards - verbessert mit robusterer Fehlerbehandlung
router.beforeEach(async (to, from, next) => {
  try {
    // Maximale Ausführungszeit für die Navigation setzen, um Endlosschleifen zu verhindern
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Navigation guard timeout exceeded')), 2000);
    });
    
    // Navigation Guard Logik mit Timeout-Schutz
    const navigationCheck = async () => {
      // Prüfen, ob die Route Authentifizierung erfordert
      if (to.matched.some(record => record.meta.requiresAuth)) {
        const authenticated = await isAuthenticated();
        
        if (!authenticated) {
          // Nicht eingeloggt -> Zur Login-Seite umleiten
          return {
            name: 'AdminLogin',
            query: { redirect: to.fullPath }
          };
        } 
        
        if (to.path.startsWith('/admin')) {
          const admin = await isAdmin();
          if (!admin) {
            // Versucht, auf Admin-Bereich zuzugreifen, ist aber kein Admin
            return { name: 'Home' };
          }
        }
        
        // Authentifiziert und autorisiert -> Zugriff erlauben
        return true;
      } else {
        // Keine Authentifizierung erforderlich -> Zugriff erlauben
        return true;
      }
    };
    
    // Promise.race, um entweder die Navigation abzuschließen oder Timeout auszulösen
    const result = await Promise.race([navigationCheck(), timeoutPromise]);
    
    // Wenn das Ergebnis ein Weiterleitungsobjekt ist
    if (result !== true && typeof result === 'object') {
      next(result);
    } else {
      next();
    }
  } catch (error) {
    console.error('Navigation guard error:', error);
    // Bei Fehler zur Startseite umleiten
    clearAuthCache(); // Cache im Fehlerfall zurücksetzen
    next({ name: 'Home' });
  }
});

// Enhanced error handling for navigation failures
router.onError((error) => {
  console.error('Router error:', error);
  
  // Log error details to help with debugging
  if (error.stack) {
    console.error('Error stack:', error.stack);
  }
  
  if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
    console.error('Module loading error - this might be caused by a network issue or incorrect build configuration');
    console.error('Module path:', error.message.split('Failed to fetch dynamically imported module')[1]);
  } else if (error.message && error.message.includes('expected expression, got')) {
    console.error('Parsing error - this might be caused by invalid JavaScript being returned from the server');
    console.error('Syntax error details:', error.message);
  } else if (error.name === 'TypeError' || error.name === 'ReferenceError') {
    console.error('JavaScript error during routing:', error.message);
  } else if (error.name === 'ChunkLoadError') {
    console.error('Failed to load chunk - try clearing your browser cache');
  } else if (error.type && error.type === 4) { // Navigation aborted
    console.error('Navigation aborted - likely caused by a navigation guard or redirects');
  } else if (error.type && error.type === 8) { // Navigation cancelled
    console.error('Navigation cancelled - likely caused by a new navigation occurring before the current one completed');
  }
});

// Enhanced global catch for Promises in Vue Router with better error reporting
const originalPush = router.push;
router.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err);
      console.error('Failed navigation to:', location);
      console.error('Error type:', err.type);
      
      if (err.from && err.to) {
        console.error('Navigation details:', {
          from: err.from.fullPath,
          to: err.to.fullPath
        });
      }
    }
    return Promise.reject(err);
  });
};

export default router 