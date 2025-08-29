import Cookies from "js-cookie";

// Cookie configuration
const COOKIE_CONFIG = {
  httpOnly: false,
  // Secure cookies only in production with HTTPS
  secure: true,
  // SameSite policy for CSRF protection
  sameSite: "none" as const,
  // Cookie expiration (7 days for long-term, 10 minutes for verification)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  // Cookie path
  path: "/",
  // Domain (you can set this for cross-subdomain cookies)
  // domain: '.yourdomain.com'
};

// Cookie names
export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const;

// Cookie utility functions
export const cookieUtils = {
  // Set a cookie with default config
  set: (name: string, value: string, options?: Cookies.CookieAttributes) => {
    const config = { ...COOKIE_CONFIG, ...options };

    Cookies.set(name, value, config);
  },

  // Get a cookie value
  get: (name: string): string | undefined => {
    const value = Cookies.get(name);
    return value;
  },

  // Remove a cookie
  remove: (name: string, options?: Cookies.CookieAttributes) => {
    const config = { path: "/", ...options };
    Cookies.remove(name, config);
  },

  // Set JSON data as cookie
  setJSON: (name: string, value: any, options?: Cookies.CookieAttributes) => {
    const config = { ...COOKIE_CONFIG, ...options };
    Cookies.set(name, JSON.stringify(value), config);
  },

  // Get JSON data from cookie
  getJSON: (name: string): any => {
    const value = Cookies.get(name);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing JSON from cookie ${name}:`, error);
      return null;
    }
  },

  // Clear all authentication cookies
  clearAuth: () => {
    cookieUtils.remove(COOKIE_NAMES.AUTH_TOKEN);
    cookieUtils.remove(COOKIE_NAMES.REFRESH_TOKEN);
    cookieUtils.remove(COOKIE_NAMES.USER_DATA);
  },

  // Set authentication cookies
  setAuth: (token: string, userData: any, refreshToken?: string) => {
    // Set auth token with httpOnly simulation (client-side storage)
    cookieUtils.set(COOKIE_NAMES.AUTH_TOKEN, token);

    // Set refresh token if provided
    if (refreshToken) {
      cookieUtils.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken);
    }

    // Set user data
    cookieUtils.setJSON(COOKIE_NAMES.USER_DATA, userData);

    // Set individual user properties for easy access
  },

  // Get authentication data
  getAuth: () => {
    const token = cookieUtils.get(COOKIE_NAMES.AUTH_TOKEN);
    const refreshToken = cookieUtils.get(COOKIE_NAMES.REFRESH_TOKEN);
    const userData = cookieUtils.getJSON(COOKIE_NAMES.USER_DATA);

    const authData = {
      token,
      refreshToken,
      userData,
      isAuthenticated: !!token,
    };

    return authData;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!cookieUtils.get(COOKIE_NAMES.AUTH_TOKEN);
  },

  // Debug function to inspect all cookies
  debugCookies: () => {
    Object.values(COOKIE_NAMES).forEach((cookieName) => {
      const value = Cookies.get(cookieName);
    });
  },

  // Force set cookie without secure flag for debugging
  forceSet: (name: string, value: string) => {
    Cookies.set(name, value, {
      path: "/",
      expires: 7,
      sameSite: "Lax",
      secure: false,
    });
  },
};

export default cookieUtils;
