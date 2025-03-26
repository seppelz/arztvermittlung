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
const rawApiUrl = window.MED_MATCH_CONFIG?.apiUrl || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiUrl = normalizeApiUrl(rawApiUrl);

// Log the API URL being used for debugging
console.log('API Service original URL:', rawApiUrl);
console.log('API Service normalized URL:', apiUrl);

// Base API configuration
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a timeout to prevent hanging requests
  timeout: 15000,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    // Log outgoing requests for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, 
      config.params ? `with params: ${JSON.stringify(config.params)}` : '');
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    console.log(`API Response from ${response.config.url}:`, 
      response.status, 
      response.data ? 'Data received' : 'No data');
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Check if the request was for an admin route to determine which login page to redirect to
      const isAdminRoute = error.config.url.includes('/admin');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = isAdminRoute ? '/admin/login' : '/login';
      }
    } else if (error.response && error.response.status === 500) {
      // For 500 errors, provide more detailed logging
      console.error('Server error (500):', error.response.data);
      console.error('Request that caused 500:', {
        url: error.config.url,
        method: error.config.method,
        params: error.config.params,
        data: error.config.data
      });
    }
    return Promise.reject(error);
  }
);

export default api; 