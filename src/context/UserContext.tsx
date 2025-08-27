import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "../services/auth.service";
import { cookieUtils, COOKIE_NAMES } from "../utils/cookieUtils";

// User interface
export interface User {
  role: string | null;
  fullName: string | null;
  email: string | null;
  isAuthenticated: boolean;
  onboarding: boolean;
  verified: string | null;
  profilePic: string | null;
}

// Context interface
export interface UserContextType {
  user: User;
  updateUser: (userData: Partial<User>) => void;
  setRole: (role: string) => void;
  setOnboardingStatus: (status: boolean) => void;
  updateUserStatus: (status: string) => void;
  logout: () => void;
  updateUserFromCookies: () => void;
}

// Provider props interface
interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>(() => {
    // Initialize from cookies
    const userData = cookieUtils.getJSON(COOKIE_NAMES.USER_DATA);

    const initialUser: User = {
      role: userData?.role || null,
      email: userData?.email || null,
      isAuthenticated: userData?.isAuthenticated || false,
      onboarding: userData?.onboarding || false,
      verified: userData?.verified || null,
      profilePic: userData?.profilePic || null,
      fullName: userData?.fullName || null,
    };
    return initialUser;
  });

  // Listen for JWT expiration events
  useEffect(() => {
    const handleJWTExpired = () => {
      logout();
    };

    window.addEventListener("jwtExpired", handleJWTExpired);

    return () => {
      window.removeEventListener("jwtExpired", handleJWTExpired);
    };
  }, []);

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      const newUser: User = {
        ...prev,
        ...userData,
      };
      return newUser;
    });
  };

  const setRole = (role: string) => {
    setUser((prev) => {
      const newUser = {
        ...prev,
        role,
      };
      return newUser;
    });
  };

  const setOnboardingStatus = (status: boolean) => {
    setUser((prev) => {
      const newUser = {
        ...prev,
        onboarding: status,
      };
      return newUser;
    });
  };

  const updateUserStatus = (status: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      verified: status,
    }));
  };

  const updateUserFromCookies = () => {
    const userData = cookieUtils.getJSON(COOKIE_NAMES.USER_DATA);
    if (userData) {
      setUser((prev) => ({
        ...prev,
        ...userData,
      }));
    }
  };

  const logout = () => {
    authService.logout();
    const clearedUser: User = {
      role: null,
      email: null,
      isAuthenticated: false,
      onboarding: false,
      verified: null,
      profilePic: null,
      fullName: null,
    };
    setUser(clearedUser);
  };

  // Log whenever the context value changes
  const contextValue = {
    user,
    updateUser,
    updateUserFromCookies,
    setRole,
    setOnboardingStatus,
    updateUserStatus,
    logout,
  };

  useEffect(() => {}, [contextValue]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
