import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001", // Should be just the domain without /api
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh token
const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    if (!refreshTokenValue) {
      throw new Error("No refresh token available");
    }

    console.log("Attempting to refresh token...");

    // Use axiosInstance for consistency, but create a new instance without interceptors to avoid infinite loops
    const refreshInstance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await refreshInstance.post("/api/auth/refresh-token", {
      refreshToken: refreshTokenValue,
    });

    console.log("Refresh token response:", response.data);

    if (response.data && response.data.success) {
      const { accessToken, refreshToken: newRefreshToken } =
        response.data.data.tokens;

      // Store new tokens
      localStorage.setItem("token", accessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      console.log("Tokens refreshed successfully");
      return accessToken;
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    // Clear tokens and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

// Function to handle logout/redirect to login
const handleLogout = () => {
  console.log("Handling logout...");
  // Clear any stored tokens
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  // Reload the page to reset the app state
  window.location.reload();
};

// Request interceptor to add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making request to:", config.baseURL + config.url);
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
  async (error) => {
    const { response, config } = error;

    console.log("Response interceptor - Error:", error);
    console.log("Response status:", response?.status);
    console.log("Response data:", response?.data);

    // Handle token expiration/session ended
    if (response && response.status === 401) {
      // Check if it's specifically a token expiration error
      const errorMessage = response.data?.message?.toLowerCase() || "";

      console.log("401 error with message:", errorMessage);

      if (
        errorMessage.includes("token") &&
        (errorMessage.includes("expired") ||
          errorMessage.includes("invalid") ||
          errorMessage.includes("unauthorized"))
      ) {
        // Don't try to refresh if this is already a refresh token request
        if (config.url && config.url.includes("/auth/refresh-token")) {
          console.log("Refresh token also expired, redirecting to login...");
          handleLogout();
          return Promise.reject(error);
        }

        // Don't retry if we've already tried to refresh for this request
        if (config._retry) {
          console.log("Already retried this request, giving up...");
          handleLogout();
          return Promise.reject(error);
        }

        // Mark this request as being retried
        config._retry = true;

        // Try to refresh token
        try {
          console.log("Access token expired, attempting to refresh...");
          const newAccessToken = await refreshToken();

          // Retry the original request with new token
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("Retrying original request with new token...");
          return axiosInstance(config);
        } catch (refreshError) {
          console.log("Token refresh failed, redirecting to login...");
          handleLogout();
          return Promise.reject(refreshError);
        }
      } else {
        // Other 401 errors (like wrong credentials)
        console.log("Authentication failed - not a token expiration issue");
        return Promise.reject(error);
      }
    }

    // Handle other 403 errors
    if (response && response.status === 403) {
      const errorMessage = response.data?.message?.toLowerCase() || "";

      if (
        errorMessage.includes("token") &&
        (errorMessage.includes("expired") ||
          errorMessage.includes("invalid") ||
          errorMessage.includes("session"))
      ) {
        console.log("Session expired (403), redirecting to login...");
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

  // Set tokens (call this after successful login)
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  // Set token (backward compatibility)
  setToken: (token) => {
    localStorage.setItem("token", token);
  },

  // Get token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Remove token (call this on logout)
  removeToken: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Manual logout function
  logout: () => {
    handleLogout();
  },

  // Manual token refresh function
  refreshToken: async () => {
    try {
      return await refreshToken();
    } catch (error) {
      throw error;
    }
  },
};

export default AxiosComponent;
