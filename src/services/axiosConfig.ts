import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { cookieUtils, COOKIE_NAMES } from "../utils/cookieUtils";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_APP_BASE_API_URL || "http://localhost:3000/api/v1/";

const API_TIMEOUT = 30000; // 30 seconds

// Default axios configuration
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // This enables sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
};

export const apiClient: AxiosInstance = axios.create(defaultConfig);

apiClient.interceptors.request.use(
  (config) => {
    // Always log in both dev and production for debugging
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );
    console.log("📍 Full URL:", `${config.baseURL}${config.url}`);

    // Add authorization header from cookies
    const token = cookieUtils.get(COOKIE_NAMES.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("🚨 API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common response patterns
apiClient.interceptors.response.use(
  (response) => {
    // Always log successful responses for debugging
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);

    return response;
  },
  (error) => {
    console.error("🚨 API Response Error:", error);

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log("🔐 Authentication error - clearing cookies");
      cookieUtils.clearAuth();

      // Dispatch JWT expired event
      const jwtExpiredEvent = new CustomEvent("jwtExpired", {
        detail: {
          message: "Your session has expired. Please log in again.",
        },
      });
      window.dispatchEvent(jwtExpiredEvent);
    }

    return Promise.reject(error);
  }
);

// Factory function to create custom axios instances with different configurations
export const createApiClient = (
  customConfig?: AxiosRequestConfig
): AxiosInstance => {
  const config = { ...defaultConfig, ...customConfig };
  return axios.create(config);
};

// Export configuration constants for reuse
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: API_TIMEOUT,
};

export default apiClient;
