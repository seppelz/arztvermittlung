import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import authService from '@/services/auth.service'

// Admin role check
const isAdmin = () => {
  return authService.isAdmin()
}

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

// Wrap dynamic imports with error handling
routes.forEach(route => {
  if (typeof route.component === 'function') {
    const originalComponent = route.component;
    route.component = () => {
      return originalComponent().catch(err => {
        console.error(`Error loading component for route ${route.path}:`, err);
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

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Prüfen, ob die Route eine Authentifizierung erfordert
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      // Nicht eingeloggt -> Weiterleitung zur Login-Seite
      next({
        name: 'AdminLogin',
        query: { redirect: to.fullPath }
      })
    } else if (to.path.startsWith('/admin') && !isAdmin()) {
      // Versucht auf Admin-Bereich zuzugreifen, ist aber kein Admin
      next({ name: 'Home' })
    } else {
      // Eingeloggt -> Zugriff erlauben
      next()
    }
  } else {
    // Keine Authentifizierung erforderlich -> Zugriff erlauben
    next()
  }
})

// Error handling for navigation failures
router.onError((error) => {
  console.error('Router error:', error);
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    console.error('Module loading error - this might be caused by a network issue or incorrect build configuration');
  } else if (error.message.includes('expected expression, got')) {
    console.error('Parsing error - this might be caused by invalid JavaScript being returned from the server');
  }
});

export default router 