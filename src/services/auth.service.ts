import api from './api';
import type { User } from '@/types/user';

// Define types for the auth service
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  lastUpdated: number;
}

interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

interface ProfileUpdateResponse {
  user: Partial<User>;
  message?: string;
}

// Local cache for auth state that can be used by router and other components
// without directly accessing the store
let cachedAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  lastUpdated: 0
};

// Try to import Pinia only when needed
const getAuthStore = async () => {
  try {
    const { useAuthStore } = await import('@/stores/auth');
    return useAuthStore();
  } catch (error) {
    console.error('Error importing auth store:', error);
    // Fallback function without store
    return null;
  }
};

// Get initial state from localStorage
function initFromLocalStorage(): void {
  try {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userJson && token) {
      const user = JSON.parse(userJson) as User;
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
}

// Initialize when importing the service
initFromLocalStorage();

/**
 * Login a user
 * @param credentials - User credentials
 * @returns Promise with the login response
 */
export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Since api.post already returns the data property from axios response
    if (response && response.token) {
      // Update local cache
      cachedAuthState = {
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        lastUpdated: Date.now()
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      // Try to update Pinia store if available
      try {
        const authStore = await getAuthStore();
        if (authStore) {
          authStore.setAuth(response);
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
 * @param userData - User registration data
 * @returns Promise with the registration response
 */
export async function register(userData: Partial<User>): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
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
 * @returns Current user or null
 */
export function getCurrentUser(): User | null {
  // Use cachedAuthState for faster access without store dependencies
  if (cachedAuthState.user) {
    return cachedAuthState.user;
  }
  
  // Fall back to localStorage
  try {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) as User : null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns True if authenticated
 */
export function isAuthenticated(): boolean {
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
 * @returns True if admin
 */
export function isAdmin(): boolean {
  // Use cachedAuthState for faster access without store dependencies
  if (cachedAuthState.user && cachedAuthState.user.role === 'admin') {
    return true;
  }
  
  // Fall back to localStorage
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return false;
    
    const user = JSON.parse(userJson) as User;
    return user && user.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status from localStorage:', error);
    return false;
  }
}

/**
 * Update user profile
 * @param userData - User profile data to update
 * @returns Promise with the profile update response
 */
export async function updateProfile(userData: Partial<User>): Promise<ProfileUpdateResponse> {
  try {
    const response = await api.put<ProfileUpdateResponse>('/auth/profile', userData);
    
    // Since api.put already returns the data property from axios response
    if (response && response.user) {
      // Update local cache
      const currentUser = cachedAuthState.user;
      if (currentUser) {
        // Merge updated user data with current user data
        cachedAuthState.user = { ...currentUser, ...response.user };
        cachedAuthState.lastUpdated = Date.now();
      }
      
      // Update localStorage
      const storedUserJson = localStorage.getItem('user');
      if (storedUserJson) {
        const storedUser = JSON.parse(storedUserJson) as User;
        const updatedUser = { ...storedUser, ...response.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Try to update Pinia store if available
      try {
        const authStore = await getAuthStore();
        if (authStore) {
          authStore.updateUser(response.user);
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

// Export all functions as a service object for backwards compatibility
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  updateProfile
};

export default authService; 