import api from './api';
import { useAuthStore } from '@/stores/auth';

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
        const authStore = useAuthStore();
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
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  logout() {
    const authStore = useAuthStore();
    authStore.clearAuth();
    return Promise.resolve();
  }

  /**
   * Get the current user
   * @returns {Object|null} - Current user or null
   */
  getCurrentUser() {
    const authStore = useAuthStore();
    return authStore.user;
  }

  /**
   * Check if user is authenticated
   * @returns {Boolean} - True if authenticated
   */
  isAuthenticated() {
    try {
      const authStore = useAuthStore();
      return !!authStore.isAuthenticated;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  /**
   * Check if user is admin
   * @returns {Boolean} - True if admin
   */
  isAdmin() {
    try {
      const authStore = useAuthStore();
      return !!authStore.isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
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
      if (response.data.user) {
        const authStore = useAuthStore();
        authStore.updateUser(response.data.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService(); 