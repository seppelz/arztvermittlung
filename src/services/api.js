import axios from 'axios';

// Get API URL from global config, environment variable, or use a default
const apiUrl = window.MED_MATCH_CONFIG?.apiUrl || import.meta.env.VITE_API_URL || 'https://www.med-match.de/api';

// Log the API URL being used
console.log('API Service using URL:', apiUrl);

// Base API configuration
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api; 