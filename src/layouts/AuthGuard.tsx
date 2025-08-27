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
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
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
      return <Navigate to="/signin" replace />;
    }
    return <>{children}</>;
  }

  // If token is expired, clear it and redirect to signin
  if (isTokenExpired(token)) {
    cookieUtils.clearAuth();
    if (requireAuth) {
      return <Navigate to="/signin" replace />;
    }
    return <>{children}</>;
  }

  // Get verification status from token
  const verificationStatus = getVerificationStatusFromToken(token);

  // Check if user is unverified (has pending verification)
  const isUnverified = verificationStatus === "pending";

  // Current page check
  const isOnOTPPage = location.pathname === "/otp";
  const isOnSignupPage =
    location.pathname === "/signup" || location.pathname === "/register";
  const isOnSigninPage = location.pathname === "/signin";

  // If user is unverified
  if (isUnverified) {
    // If user is on signup/signin pages, redirect to OTP
    if (isOnSignupPage || isOnSigninPage) {
      return <Navigate to={`/otp`} replace />;
    }

    // If not on OTP page, redirect to OTP
    if (!isOnOTPPage) {
      return <Navigate to={`/otp`} replace />;
    }

    // Allow access to OTP page
    return <>{children}</>;
  }

  // If user is verified but trying to access OTP page, redirect to onboarding
  if (verificationStatus === "verified" && isOnOTPPage) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user is verified and trying to access signup/signin, redirect to onboarding
  if (verificationStatus === "verified" && (isOnSignupPage || isOnSigninPage)) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user is verified and trying to access main page, redirect to onboarding
  if (verificationStatus === "verified" && location.pathname === "/") {
    return <Navigate to="/onboarding" replace />;
  }

  // Allow access
  return <>{children}</>;
};

export default AuthGuard;
