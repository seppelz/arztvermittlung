import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth';

/**
 * Configuration for the API client
 */
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Create base API configuration
const apiConfig: ApiConfig = {
  // Use local development proxy that forwards to production
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Log the configured API URL
console.log('Configured API URL:', apiConfig.baseURL);

// Create axios instance with configuration and withCredentials
const apiClient: AxiosInstance = axios.create({
  ...apiConfig,
  withCredentials: true // Critical: ensure cookies are sent with every request
});

// Request interceptor to attach auth token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get token directly from localStorage to avoid any store-related issues
    const token = localStorage.getItem('token');
    
    // Always attach token if it exists, regardless of auth store state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Log first 10 chars of token for debugging (safe to log)
      console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url} with auth token: ${token.substring(0, 10)}...`);
      
      // Add withCredentials flag to ensure cookies are sent
      config.withCredentials = true;
    } else {
      console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url} WITHOUT auth token`);
    }
    
    return config;
  },
  (error: any) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log successful responses in development
    if (import.meta.env.DEV && response.config.url) {
      console.log(`API Response: ${response.status} ${response.config.url}`, { 
        data: response.data 
      });
    }
    
    return response;
  },
  async (error: any) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.warn('API: Received 401 Unauthorized response', {
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Get the auth store to check authentication status
      try {
        const authStore = useAuthStore();
        
        // Dispatch an auth error event that components can listen for
        const authErrorEvent = new CustomEvent('auth:error', { 
          detail: { 
            status: 401,
            message: 'Authentication failed',
            timestamp: new Date().toISOString()
          } 
        });
        window.dispatchEvent(authErrorEvent);
        
        // If we think we're authenticated but get a 401, something is wrong with the token
        if (authStore.isAuthenticated) {
          console.warn('API: 401 error while authenticated - possible token issue');
          
          // Try to refresh auth state before logging out
          await authStore.initAuth();
          
          // If re-initialization doesn't help, clear auth
          if (!authStore.validateToken()) {
            console.warn('API: Token validation failed after 401 - logging out');
            authStore.clearAuth();
          }
        }
      } catch (authError) {
        console.error('API: Failed to handle 401 error:', authError);
      }
    }
    
    // Log all API errors in development
    if (import.meta.env.DEV) {
      console.error('API Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data
      });
    }
    
    // Handle common error scenarios
    if (error.response) {
      // Server responded with an error
      console.error('API Error Response:', {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data
      });
      
      // Handle authentication errors
      if (error.response.status === 401) {
        const authStore = useAuthStore();
        
        // Clear auth if token is invalid/expired
        if (authStore.isAuthenticated) {
          console.warn('API: Token expired or invalid, logging out');
          authStore.clearAuth();
          
          // Dispatch a global event for authentication errors
          window.dispatchEvent(new CustomEvent('auth:error', { 
            detail: { 
              status: error.response.status,
              message: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
            } 
          }));
          
          // Redirect to login if needed
          if (!window.location.pathname.includes('/login')) {
            // Use a more user-friendly approach by storing the current path
            // so we can redirect back after login
            const currentPath = window.location.pathname;
            if (currentPath !== '/' && !currentPath.includes('/admin')) {
              sessionStorage.setItem('redirectAfterLogin', currentPath);
            }
            
            window.location.href = '/login?session=expired';
          }
        }
      } else if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.error('API: Permission denied', error.config.url);
        
        // Dispatch a global event for permission errors
        window.dispatchEvent(new CustomEvent('auth:forbidden', { 
          detail: { 
            status: error.response.status,
            message: 'Sie haben keine Berechtigung für diese Aktion.'
          } 
        }));
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('API No Response:', {
        url: error.config.url,
        message: 'No response received from server'
      });
      
      // Dispatch a global event for network errors
      window.dispatchEvent(new CustomEvent('api:networkError', { 
        detail: { 
          url: error.config.url,
          message: 'Der Server antwortet nicht. Bitte überprüfen Sie Ihre Internetverbindung.'
        } 
      }));
    } else {
      // Error in setting up request
      console.error('API Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * API service for making HTTP requests
 */
const api = {
  /**
   * Make a GET request
   * @param {string} url - URL to request
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>} Promise with response
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.get(url, config).then(response => response.data);
  },
  
  /**
   * Make a POST request
   * @param {string} url - URL to request
   * @param {any} data - Data to send
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>} Promise with response
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.post(url, data, config).then(response => response.data);
  },
  
  /**
   * Make a PUT request
   * @param {string} url - URL to request
   * @param {any} data - Data to send
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>} Promise with response
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.put(url, data, config).then(response => response.data);
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - URL to request
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>} Promise with response
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.delete(url, config).then(response => response.data);
  },
  
  /**
   * Make a PATCH request
   * @param {string} url - URL to request
   * @param {any} data - Data to send
   * @param {AxiosRequestConfig} config - Request configuration
   * @returns {Promise<AxiosResponse>} Promise with response
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.patch(url, data, config).then(response => response.data);
  }
};

export default api;