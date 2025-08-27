/**
 * JWT utility functions for token decoding and validation
 */

// JWT payload interface
export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  verified: string; // 'pending', 'verified', etc.
  onboarding?: boolean;
  iat: number; // Issued at
  exp: number; // Expiration time
  [key: string]: any; // Allow additional fields
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This is for extracting payload data, not for security validation
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");

    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed (JWT base64 encoding may not have padding)
    const paddedPayload =
      payload + "===".slice(0, (4 - (payload.length % 4)) % 4);

    // Decode from base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    const parsedPayload: JWTPayload = JSON.parse(decodedPayload);

    return parsedPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);

    if (!payload || !payload.exp) {
      return true;
    }

    // Convert exp (seconds) to milliseconds and compare with current time
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Get user email from JWT token
 */
export const getEmailFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  return payload?.email || null;
};

/**
 * Get user role from JWT token
 */
export const getRoleFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  return payload?.role || null;
};

/**
 * Get user verification status from JWT token
 */
export const getVerificationStatusFromToken = (
  token: string
): string | null => {
  const payload = decodeJWT(token);
  return payload?.verified || null;
};

/**
 * Get user ID from JWT token
 */
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  return payload?.id || null;
};

/**
 * Check if user is verified based on JWT token
 */
export const isUserVerified = (token: string): boolean => {
  const verificationStatus = getVerificationStatusFromToken(token);
  return verificationStatus === "verified";
};

/**
 * Check if user needs to complete onboarding
 */
export const needsOnboarding = (token: string): boolean => {
  const payload = decodeJWT(token);
  return payload?.onboarding === false || payload?.onboarding === undefined;
};

/**
 * Get time until token expires (in minutes)
 */
export const getTimeUntilExpiry = (token: string): number => {
  try {
    const payload = decodeJWT(token);

    if (!payload || !payload.exp) {
      return 0;
    }

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;

    // Return time in minutes, minimum 0
    return Math.max(0, Math.floor(timeLeft / (1000 * 60)));
  } catch (error) {
    console.error("Error calculating time until expiry:", error);
    return 0;
  }
};

export default {
  decodeJWT,
  isTokenExpired,
  getEmailFromToken,
  getRoleFromToken,
  getVerificationStatusFromToken,
  getUserIdFromToken,
  isUserVerified,
  needsOnboarding,
  getTimeUntilExpiry,
};
