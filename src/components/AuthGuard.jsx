import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthService from '../services/auth.service';

const AuthGuard = ({ children, requireAuth = true, requireOnboarding = false }) => {
    const { user } = useUser();
    const location = useLocation();
    
    // Add error handling for getCurrentUser
    let currentUser = null;
    try {
        currentUser = AuthService.getCurrentUser();
    } catch (error) {
        console.error('❌ [AuthGuard] Error getting current user from localStorage:', error);
        // Clear corrupted localStorage data
        localStorage.removeItem('user');
    }

    // Use UserContext state as primary source, fallback to localStorage
    const userData = user?.token ? user : currentUser;

    console.log("🔍 [AuthGuard] Current location:", location.pathname);
    console.log("🔍 [AuthGuard] UserContext user:", user);
    console.log("🔍 [AuthGuard] localStorage currentUser:", currentUser);
    console.log("🔍 [AuthGuard] Final userData being used:", userData);

    // If user is fully verified and onboarded, they should only be able to access dashboard
    if (userData?.token && userData?.onboarding && (userData?.verified === 'verified' || userData?.role?.toLowerCase() === 'student')) {
        console.log("✅ [AuthGuard] User is fully verified and onboarded (or student)");
        // If they try to access signin or signup, redirect to dashboard
        if (location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/onboarding' || location.pathname === '/verification-pending') {
            console.log('AuthGuard: Fully verified user trying to access auth pages, redirecting to dashboard');
            return <Navigate to="/dashboard" replace />;
        }
        // If they try to access any page other than dashboard, redirect to dashboard
        if (!location.pathname.startsWith('/dashboard')) {
            console.log('AuthGuard: Fully verified user trying to access non-dashboard page, redirecting to dashboard');
            return <Navigate to="/dashboard" replace />;
        }
        // Allow access to dashboard
        return children;
    }

    // If user is not authenticated and auth is required, redirect to signin
    if (requireAuth && (!userData || !userData.token)) {
        console.log('AuthGuard: No authenticated user, redirecting to signin');
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // If user is authenticated but not fully verified/onboarded, prevent access to auth pages
    if (userData?.token && (location.pathname === '/signin' || location.pathname === '/signup')) {
        // If they're not fully verified/onboarded, redirect to appropriate page
        if (!userData.onboarding) {
            console.log('AuthGuard: Authenticated user not onboarded, redirecting to onboarding');
            return <Navigate to="/onboarding" replace />;
        } else if (userData.onboarding && userData.verified !== 'verified') {
            console.log('AuthGuard: User onboarded but not verified, redirecting to verification pending');
            return <Navigate to="/verification-pending" replace />;
        }
    }

    // If user is onboarded but not verified, redirect to verification pending
    // unless they're already on the verification pending page (for all roles that need verification)
    if (userData?.token && userData?.onboarding && userData?.verified !== 'verified' && 
        location.pathname !== '/verification-pending') {
        console.log('AuthGuard: User onboarded but not verified, redirecting to verification pending');
        return <Navigate to="/verification-pending" replace />;
    }

    // If user is not onboarded and trying to access any protected route other than onboarding,
    // redirect to onboarding
    if (userData?.token && !userData?.onboarding && 
        location.pathname !== '/onboarding' && 
        location.pathname !== '/verification-pending') {
        console.log(userData.token, userData.onboarding, 'AuthGuard: User not onboarded, redirecting to onboarding');
        return <Navigate to="/onboarding" replace />;
    }

    return children;
};

export default AuthGuard; 