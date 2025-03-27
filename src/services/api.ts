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
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Create axios instance with configuration
const apiClient: AxiosInstance = axios.create(apiConfig);

// Request interceptor to attach auth token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authStore = useAuthStore();
    const token = authStore.token;
    
    // Only attach token if we have one
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, { 
        params: config.params, 
        data: config.data 
      });
    }
    
    return config;
  },
  (error: any) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`, { 
        data: response.data 
      });
    }
    
    return response;
  },
  (error: any) => {
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
          
          // Redirect to login if needed
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login?session=expired';
          }
        }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('API No Response:', {
        url: error.config.url,
        message: 'No response received from server'
      });
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