import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://www.crisiscircle.org/api/", // Set your API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle logout/redirect to login
const handleLogout = () => {
  // Clear any stored tokens
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  
  // Reload the page to reset the app state
  window.location.reload();
  
  // Alternative: If you're using React Router, you can use:
  // window.location.href = '/login';
};

// Request interceptor to add token to requests
axiosInstance.interceptors.request.use(
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

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle token expiration/session ended
    if (response && (response.status === 401 || response.status === 403)) {
      // Check if it's specifically a token expiration error
      const errorMessage = response.data?.message?.toLowerCase() || '';
      
      if (
        errorMessage.includes('token expired') ||
        errorMessage.includes('token invalid') ||
        errorMessage.includes('session expired') ||
        errorMessage.includes('unauthorized') ||
        response.status === 401
      ) {
        console.log('Session expired, redirecting to login...');
        handleLogout();
      }
    }
    
    return Promise.reject(error);
  }
);

// API methods
const AxiosComponent = {
  // GET request
  get: (url, config = {}) => {
    return axiosInstance.get(url, config);
  },

  // POST request
  post: (url, data = {}, config = {}) => {
    return axiosInstance.post(url, data, config);
  },

  // PUT request
  put: (url, data = {}, config = {}) => {
    return axiosInstance.put(url, data, config);
  },

  // DELETE request
  delete: (url, config = {}) => {
    return axiosInstance.delete(url, config);
  },

  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return axiosInstance.patch(url, data, config);
  },

  // Set token (call this after successful login)
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Remove token (call this on logout)
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Manual logout function
  logout: () => {
    handleLogout();
  }
};

export default AxiosComponent;