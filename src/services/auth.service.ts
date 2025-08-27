import { apiClient } from "./axiosConfig";
import { cookieUtils, COOKIE_NAMES } from "../utils/cookieUtils";

// Types for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  role: "student" | "teacher" | "parent";
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isVerified: boolean;
      onboarding?: boolean;
      verified?: string;
      picture?: string;
      profile?: any;
    };
    token: string;
    refreshToken?: string;
  };
}

export interface AuthStatusResponse {
  success: boolean;
  data: {
    isAuthenticated: boolean;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      isVerified: boolean;
    };
  };
}

export interface VerifyOTPRequest {
  email: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface TeacherProfileResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    bio: string;
    profilePicture: string;
    verified: string;
    joiningDate: string;
    subjects: string[];
    availability: Array<{
      day: string;
      timeSlots: string[];
    }>;
  };
}

export interface CompleteOnboardingRequest {
  [key: string]: any; // Flexible interface for onboarding data
}

// Auth Service Class
class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "public/login",
        credentials
      );

      if (response.data.success && response.data.data) {
        // Store authentication data in cookies
        cookieUtils.setAuth(
          response.data.data.token,
          response.data.data.user,
          response.data.data.refreshToken
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  /**
   * Register new user
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "public/signup",
        userData
      );

      // If signup is successful and returns a token (for pending verification)
      if (response.data.success && response.data.data?.token) {
        // Store the temporary token for verification period
        cookieUtils.setAuth(
          response.data.data.token,
          response.data.data.user,
          response.data.data.refreshToken
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(
    data: ResendVerificationRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post("public/resend-verification", data);
      return response.data;
    } catch (error: any) {
      console.error("Resend verification error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to resend verification code"
      );
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      // Send logout request to server
      const response = await apiClient.post("public/logout");

      // Clear all authentication cookies
      cookieUtils.clearAuth();

      return response.data;
    } catch (error: any) {
      console.error("Logout error:", error);
      // Clear cookies even if server request fails
      cookieUtils.clearAuth();
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = cookieUtils.get(COOKIE_NAMES.REFRESH_TOKEN);

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post<AuthResponse>(
        "public/refresh-token",
        {
          refreshToken,
        }
      );

      if (response.data.success && response.data.data) {
        // Update authentication data in cookies
        cookieUtils.setAuth(
          response.data.data.token,
          response.data.data.user,
          response.data.data.refreshToken
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("Token refresh error:", error);
      // Clear auth on refresh failure
      cookieUtils.clearAuth();
      throw new Error(error.response?.data?.message || "Token refresh failed");
    }
  }

  /**
   * Get current authentication status
   */
  async getAuthStatus(): Promise<AuthStatusResponse> {
    try {
      const response = await apiClient.get<AuthStatusResponse>(
        "public/auth-status"
      );
      return response.data;
    } catch (error: any) {
      console.error("Auth status error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get auth status"
      );
    }
  }

  /**
   * Check if user is authenticated (client-side check)
   */
  isAuthenticated(): boolean {
    return cookieUtils.isAuthenticated();
  }

  /**
   * Get current user data from cookies
   */
  getCurrentUser() {
    const authData = cookieUtils.getAuth();
    return authData.userData;
  }

  /**
   * Clear authentication data (client-side logout)
   */
  clearAuth(): void {
    cookieUtils.clearAuth();
  }

  /**
   * Get authentication token
   */
  getToken(): string | undefined {
    return cookieUtils.get(COOKIE_NAMES.AUTH_TOKEN);
  }

  /**
   * Manual token refresh with error handling
   */
  async attemptTokenRefresh(): Promise<boolean> {
    try {
      await this.refreshToken();
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      this.clearAuth();
      return false;
    }
  }

  /**
   * Verify OTP for email verification
   */
  async verifyOTP(data: VerifyOTPRequest, otp: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "public/verify-email",
        {
          email: data.email,
          code: otp,
        }
      );

      if (response.data.success && response.data.data) {
        // Store authentication data in cookies after successful verification
        cookieUtils.setAuth(
          response.data.data.token,
          response.data.data.user,
          response.data.data.refreshToken
        );
      }

      return response.data;
    } catch (error: any) {
      console.error("OTP verification error:", error);
      throw new Error(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }

  /**
   * Resend OTP for email verification
   */
  async resendOTP(
    data: ResendOTPRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post("public/resend-verification", data);
      return response.data;
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      throw new Error(error.response?.data?.message || "Failed to resend OTP");
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

// Export the class for testing or custom instances
export default AuthService;
