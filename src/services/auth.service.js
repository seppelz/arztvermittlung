import api from './api';

// Lokaler Cache für den Auth-Zustand, der vom Router und anderen Komponenten verwendet werden kann
// ohne direkt auf den Store zuzugreifen
let cachedAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  lastUpdated: 0
};

// Versuchen, Pinia nur bei Bedarf zu importieren
const getAuthStore = async () => {
  try {
    const { useAuthStore } = await import('@/stores/auth');
    return useAuthStore();
  } catch (error) {
    console.error('Error importing auth store:', error);
    // Fallback-Funktion ohne Store
    return null;
  }
};

// Initialen Zustand aus dem localStorage holen
const initFromLocalStorage = () => {
  try {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userJson && token) {
      const user = JSON.parse(userJson);
      cachedAuthState = {
        user,
        token,
        isAuthenticated: true,
        lastUpdated: Date.now()
      };
    }
  } catch (error) {
    console.error('Error initializing auth state from localStorage:', error);
  }
};

// Initialisierung beim Import des Service
initFromLocalStorage();

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
        // Update local cache
        cachedAuthState = {
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          lastUpdated: Date.now()
        };
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Try to update Pinia store if available
        try {
          const authStore = await getAuthStore();
          if (authStore) {
            authStore.setAuth(response.data);
          }
        } catch (storeError) {
          console.error('Error updating auth store after login:', storeError);
          // Continue anyway since we've updated localStorage and cache
        }
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
  async logout() {
    try {
      // Clear local cache
      cachedAuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        lastUpdated: Date.now()
      };
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Try to update Pinia store if available
      try {
        const authStore = await getAuthStore();
        if (authStore) {
          authStore.clearAuth();
        }
      } catch (storeError) {
        console.error('Error updating auth store after logout:', storeError);
        // Continue anyway since we've updated localStorage and cache
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Logout error:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Get the current user
   * @returns {Object|null} - Current user or null
   */
  getCurrentUser() {
    // Use cachedAuthState for faster access without store dependencies
    if (cachedAuthState.user) {
      return cachedAuthState.user;
    }
    
    // Fall back to localStorage
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Boolean} - True if authenticated
   */
  isAuthenticated() {
    // Use cachedAuthState for faster access without store dependencies
    if (cachedAuthState.isAuthenticated) {
      return true;
    }
    
    // Fall back to localStorage
    try {
      return !!localStorage.getItem('token');
    } catch (error) {
      console.error('Error checking auth status from localStorage:', error);
      return false;
    }
  }

  /**
   * Check if user is admin
   * @returns {Boolean} - True if admin
   */
  isAdmin() {
    // Use cachedAuthState for faster access without store dependencies
    if (cachedAuthState.user && cachedAuthState.user.role === 'admin') {
      return true;
    }
    
    // Fall back to localStorage
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) return false;
      
      const user = JSON.parse(userJson);
      return user && user.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status from localStorage:', error);
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
      const response = await api.patch('/users/profile', userData);
      if (response.data && response.data.user) {
        // Update cachedAuthState
        const currentUser = cachedAuthState.user || {};
        cachedAuthState.user = { ...currentUser, ...response.data.user };
        cachedAuthState.lastUpdated = Date.now();
        
        // Update localStorage
        const userJson = localStorage.getItem('user');
        const storedUser = userJson ? JSON.parse(userJson) : {};
        const updatedUser = { ...storedUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Try to update Pinia store if available
        try {
          const authStore = await getAuthStore();
          if (authStore) {
            authStore.updateUser(response.data.user);
          }
        } catch (storeError) {
          console.error('Error updating auth store after profile update:', storeError);
          // Continue anyway since we've updated localStorage and cache
        }
      }
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
}

// Singleton-Instanz exportieren
export default new AuthService(); 