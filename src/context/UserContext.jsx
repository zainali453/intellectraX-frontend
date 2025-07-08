import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize from localStorage if available
        const storedUser = AuthService.getCurrentUser();
        const initialUser = {
            role: storedUser?.role || null,
            email: storedUser?.email || null,
            isAuthenticated: Boolean(storedUser?.token),
            token: storedUser?.token || null,
            onboarding: storedUser?.onboarding || false,
            verified: storedUser?.verified || 'pending',
            picture: storedUser?.picture || null,
            profile: storedUser?.profile || null
        };
        console.log('🔵 [Context] Initial user state:', initialUser);
        return initialUser;
    });

    // Update localStorage when user state changes
    useEffect(() => {
        console.log('🟢 [Context] User state changed:', user);
        if (user.token) {
            const userToStore = {
                token: user.token,
                email: user.email,
                role: user.role,
                picture: user.picture,
                onboarding: user.onboarding,
                verified: user.verified,
                profile: user.profile
            };
            console.log('💾 [Context] Storing user in localStorage:', userToStore);
            localStorage.setItem('user', JSON.stringify(userToStore));
            
            // Verify the data was stored correctly
            const storedData = localStorage.getItem('user');
            console.log('🔍 [Context] Verification - stored data:', storedData);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                console.log('🔍 [Context] Verification - parsed data:', parsedData);
            }
        } else {
            console.log('⚠️ [Context] No token in user state, not storing in localStorage');
        }
    }, [user]);

    // Listen for JWT expiration events
    useEffect(() => {
        const handleJWTExpired = () => {
            console.log('🔴 [Context] JWT expired event received, logging out user');
            logout();
        };

        window.addEventListener('jwtExpired', handleJWTExpired);

        return () => {
            window.removeEventListener('jwtExpired', handleJWTExpired);
        };
    }, []);
            
    const updateUser = (userData) => {
        const updatedUser = {
            isAuthenticated: userData.isAuthenticated,
            token: userData.token,
            email: userData.email,
            role: userData.role,
            picture: userData.picture,
            onboarding: userData.onboarding,
            verified: userData.verified,
            profile: userData.profile
        };
        console.log('🔄 [Context] Updating user with data:', updatedUser);
        setUser(prev => {
            const newUser = {
                ...prev,
                ...updatedUser
            };
            console.log('📝 [Context] New user state after update:', newUser);
            return newUser;
        });
    };

    const setRole = (role) => {
        console.log('👤 [Context] Setting role:', role);
        setUser(prev => {
            const newUser = {
                ...prev,
                role
            };
            console.log('📝 [Context] New user state after role update:', newUser);
            return newUser;
        });
    };

    const setOnboardingStatus = (status) => {
        console.log('📋 [Context] Setting onboarding status:', status);
        setUser(prev => {
            const newUser = {
                ...prev,
                onboarding: status
            };
            console.log('📝 [Context] New user state after onboarding update:', newUser);
            return newUser;
        });
    };

    const updateUserStatus = (status) => {
        setUser(prevUser => ({
            ...prevUser,
            verified: status
        }));
    };

    const logout = () => {
        console.log('🚪 [Context] Logging out user');
        AuthService.logout();
        const clearedUser = {
            role: null,
            email: null,
            isAuthenticated: false,
            token: null,
            onboarding: false,
            verified: 'pending',
            picture: null,
            profile: null
        };
        console.log('🧹 [Context] User state after logout:', clearedUser);
        setUser(clearedUser);
    };

    // Log whenever the context value changes
    const contextValue = { 
        user, 
        updateUser, 
        setRole, 
        setOnboardingStatus,
        updateUserStatus,
        logout 
    };

    useEffect(() => {
        console.log('🎯 [Context] Context value updated:', contextValue);
    }, [contextValue]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        console.error('❌ [Context] useUser must be used within a UserProvider');
        throw new Error('useUser must be used within a UserProvider');
    }
    console.log('🔍 [Context] useUser hook called, current context:', context);
    return context;
};

export default UserContext; 