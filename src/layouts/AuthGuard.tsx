/** @format */

import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { authService } from "../services/auth.service";
import { cookieUtils, COOKIE_NAMES } from "../utils/cookieUtils";
import {
  isTokenExpired,
  getVerificationStatusFromToken,
} from "../utils/jwtUtils";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireTeacher?: boolean;
  requireStudent?: boolean;
  requireParent?: boolean;
}

const AuthGuard = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireTeacher = false,
  requireStudent = false,
  requireParent = false,
}: AuthGuardProps) => {
  const { user } = useUser();
  const location = useLocation();

  // Get token from cookies
  const token = cookieUtils.get(COOKIE_NAMES.AUTH_TOKEN);

  // If no token exists or the user is not authenticated and the status is not pending as when the user logout the cookies takes time to reset but the user resets in real time so to fix this issue

  if (
    !token ||
    (user.isAuthenticated === false &&
      getVerificationStatusFromToken(token) !== "pending")
  ) {
    if (requireAuth) {
      return <Navigate to='/signin' replace />;
    }
    return <>{children}</>;
  }

  // If token is expired, clear it and redirect to signin
  if (isTokenExpired(token)) {
    cookieUtils.clearAuth();
    if (requireAuth) {
      return <Navigate to='/signin' replace />;
    }
    return <>{children}</>;
  }

  // Get verification status from token
  const verificationStatus = getVerificationStatusFromToken(token);

  // Check if user is unverified (has pending verification)
  const isUnverified = verificationStatus === "pending";

  // Current page check
  const isOnOTPPage = location.pathname === "/otp";
  const isOnSignupPage = location.pathname === "/register";
  const isOnSigninPage = location.pathname === "/signin";

  // If user is unverified
  if (isUnverified) {
    // the unverified user should only access otp page and signup page
    if (!isOnOTPPage && !isOnSignupPage) {
      return <Navigate to='/otp' replace />;
    }

    // Allow access to OTP page
    return <>{children}</>;
  }

  // If user is verified and trying to access signup/signin/otp/home, redirect to onboarding
  if (
    (verificationStatus === "verified" || verificationStatus === "completed") &&
    (isOnSignupPage ||
      isOnSigninPage ||
      isOnOTPPage ||
      location.pathname === "/")
  ) {
    if (
      user.onboarding &&
      user.isAuthenticated &&
      user.verified === "verified"
    ) {
      return <Navigate to='/success' replace />;
    } else if (
      user.onboarding &&
      user.isAuthenticated &&
      user.verified === "completed"
    ) {
      if (user.role === "student") {
        return <Navigate to='/student/dashboard' replace />;
      } else if (user.role === "teacher") {
        return <Navigate to='/teacher/dashboard' replace />;
      } else if (user.role === "parent") {
        return <Navigate to='/parent/dashboard' replace />;
      }
    }
    console.log("Redirecting to onboarding", user);

    return <Navigate to='/onboarding' replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to='/' replace />;
  }
  if (requireTeacher && user.role !== "teacher") {
    return <Navigate to='/' replace />;
  }
  if (requireStudent && user.role !== "student") {
    return <Navigate to='/' replace />;
  }
  if (requireParent && user.role !== "parent") {
    return <Navigate to='/' replace />;
  }

  // Allow access
  return <>{children}</>;
};

export default AuthGuard;
