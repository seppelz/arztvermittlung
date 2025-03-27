import axios from 'axios';

// Normalize the API URL to ensure it has the correct format
const normalizeApiUrl = (url) => {
  if (!url) return 'http://localhost:5000/api';
  
  // Development mode should use localhost
  if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
    console.log('Development mode detected, using localhost:5000/api');
    return 'http://localhost:5000/api';
  }
  
  // Try to normalize URL by removing common problems
  let normalizedUrl = url.trim();
  
  // Always use https://www. prefix for production
  if (!normalizedUrl.startsWith('https://www.') && normalizedUrl.includes('med-match.de')) {
    normalizedUrl = 'https://www.' + normalizedUrl.replace(/^https?:\/\/(www\.)?/, '');
  }
  
  // Remove trailing slash if present
  normalizedUrl = normalizedUrl.endsWith('/') ? normalizedUrl.slice(0, -1) : normalizedUrl;
  
  // Handle URLs with or without /api suffix
  if (!normalizedUrl.includes('/api')) {
    // No /api in URL at all, add it
    normalizedUrl = normalizedUrl + '/api';
  } else if (!normalizedUrl.endsWith('/api')) {
    // Has /api/ somewhere in the middle, ensure it ends with /api
    const apiIndex = normalizedUrl.lastIndexOf('/api');
    normalizedUrl = normalizedUrl.substring(0, apiIndex + 4); // 4 is length of '/api'
  }
  
  // Check if the URL is valid before returning
  try {
    new URL(normalizedUrl);
    console.log('Using API URL:', normalizedUrl);
    return normalizedUrl;
  } catch (e) {
    console.error('Invalid API URL provided:', url);
    console.error('Normalized to:', normalizedUrl);
    console.error('Error:', e);
    
    // Return a default as fallback
    return 'http://localhost:5000/api';
  }
};

// Get API URL from global config, environment variable, or use a default
const rawApiUrl = window.MED_MATCH_CONFIG?.apiUrl || import.meta.env.VITE_API_URL || 'https://www.med-match.de/api';
const apiUrl = normalizeApiUrl(rawApiUrl);

// Log the API URL being used for debugging
console.log('API Service original URL:', rawApiUrl);
console.log('API Service normalized URL:', apiUrl);

// Base API configuration
const api = axios.create({
  baseURL: apiUrl,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Get session ID for guest operations
    const sessionId = localStorage.getItem('sessionId');
    
    // Set auth header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Include session ID for guest operations if exists
    if (sessionId && !token) {
      config.headers['X-Session-Id'] = sessionId;
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      
      // Check for timeout
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
        error.isTimeout = true;
      }
      
      return Promise.reject(error);
    }
    
    // Log detailed error information
    console.error(`API Error: ${error.response.status}`, {
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      headers: error.config?.headers
    });
    
    return Promise.reject(error);
  }
);

export default api; 