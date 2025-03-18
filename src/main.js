import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

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

const pinia = createPinia()

app.use(pinia)

// Add router after Pinia to ensure store is available
try {
  app.use(router)
} catch (error) {
  console.error('Error setting up router:', error);
}

// Initialize auth state before mounting the app
try {
  const authStore = useAuthStore()
  authStore.initAuth()
  app.mount('#app')
} catch (error) {
  console.error('Error during app initialization:', error);
  // Display a fallback error message to the user
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Sorry, an error occurred</h1>
      <p>Please try refreshing the page or clearing your browser cache.</p>
      <p>Error details: ${error.message}</p>
    </div>
  `;
}
