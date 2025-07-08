import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthService from '../services/auth.service';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const storedUser = AuthService.getCurrentUser();
  
  // Use UserContext state as primary source, fallback to localStorage
  const currentUser = user?.token ? user : storedUser;
  
  if (!currentUser || !currentUser.token) {
    console.log('ProtectedRoute: No authenticated user, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  // Verify token expiration by checking JWT exp claim
  try {
    const payload = JSON.parse(atob(currentUser.token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      console.log('ProtectedRoute: Token expired, logging out');
      AuthService.logout();
      return <Navigate to="/signin" replace />;
    }
  } catch (error) {
    console.error('ProtectedRoute: Error parsing token:', error);
    AuthService.logout();
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;