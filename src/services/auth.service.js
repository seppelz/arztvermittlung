import api from './api';
import { useAuthStore } from '@/stores/auth';

// Create a memoization cache to prevent redundant Pinia store access
let memoizedStoreInstance = null;

/**
 * Gets the auth store instance with memoization to prevent redundant calls
 * @returns {Object} The auth store instance
 */
const getAuthStore = () => {
  if (!memoizedStoreInstance) {
    try {
      memoizedStoreInstance = useAuthStore();
    } catch (error) {
      console.error('Error getting auth store:', error);
      // Return a fallback minimal store to prevent crashes
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        setAuth: () => {},
        clearAuth: () => {},
        updateUser: () => {}
      };
    }
  }
  return memoizedStoreInstance;
};

/**
 * Service for authentication related API calls
 */
class AuthService {
  /**
   * Login a user
   * @param {Object} credentials - User credentials
   * @returns {Promise} - Promise with the login response
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data && response.data.token) {
        // Update Pinia store instead of directly manipulating localStorage
        const authStore = getAuthStore();
        authStore.setAuth(response.data);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with the registration response
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  logout() {
    try {
      const authStore = getAuthStore();
      authStore.clearAuth();
      // Reset the memoized store after logout
      memoizedStoreInstance = null;
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      // Still need to clear localStorage in case store access failed
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return Promise.reject(error);
    }
  }

  /**
   * Get the current user
   * @returns {Object|null} - Current user or null
   */
  getCurrentUser() {
    try {
      const authStore = getAuthStore();
      return authStore.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      // Fallback to localStorage if Pinia store access fails
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Boolean} - True if authenticated
   */
  isAuthenticated() {
    try {
      const authStore = getAuthStore();
      return !!authStore.isAuthenticated;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      // Fallback to localStorage if Pinia store access fails
      return !!localStorage.getItem('token');
    }
  }

  /**
   * Check if user is admin
   * @returns {Boolean} - True if admin
   */
  isAdmin() {
    try {
      const authStore = getAuthStore();
      if (authStore.isAdmin !== undefined) {
        return !!authStore.isAdmin;
      }
      // If isAdmin getter is not available, check user role directly
      return !!(authStore.user && authStore.user.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      // Fallback to localStorage if Pinia store access fails
      try {
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;
        return !!(user && user.role === 'admin');
      } catch (localStorageError) {
        console.error('Error reading from localStorage:', localStorageError);
        return false;
      }
    }
  }
  
  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise with the update response
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/users/profile', userData);
      if (response.data && response.data.user) {
        try {
          const authStore = getAuthStore();
          authStore.updateUser(response.data.user);
        } catch (storeError) {
          console.error('Error updating store with user data:', storeError);
          // Fallback to localStorage if Pinia store access fails
          const currentUserJson = localStorage.getItem('user');
          const currentUser = currentUserJson ? JSON.parse(currentUserJson) : {};
          const updatedUser = { ...currentUser, ...response.data.user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
}

export default new AuthService(); 