import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthService from '../services/auth.service';

const VerificationPending = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        // Get current user data from different sources
        const contextUser = user;
        const localStorageUser = AuthService.getCurrentUser();
        
        setDebugInfo({
            contextUser,
            localStorageUser,
            contextToken: contextUser?.token ? 'Present' : 'Missing',
            localStorageToken: localStorageUser?.token ? 'Present' : 'Missing',
            contextOnboarding: contextUser?.onboarding,
            localStorageOnboarding: localStorageUser?.onboarding,
            contextVerified: contextUser?.verified,
            localStorageVerified: localStorageUser?.verified,
        });
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const handleRefreshData = () => {
        // Force refresh by reloading the page
        window.location.reload();
    };

    const handleClearStorage = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-[800px] mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <svg className="mx-auto h-16 w-16 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You for Onboarding!</h2>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Your profile has been successfully submitted and is pending admin verification.
                    </p>
                    <p className="text-gray-600">
                        We will review your information and get back to you shortly. This process typically takes 1-2 business days.
                    </p>
                    <p className="text-gray-600">
                        You will receive an email notification once your account has been verified.
                    </p>
                    
                    {/* Debug information */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h3>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Context Role:</strong> {debugInfo.contextUser?.role || 'Not set'}</p>
                            <p><strong>LocalStorage Role:</strong> {debugInfo.localStorageUser?.role || 'Not set'}</p>
                            <p><strong>Context Email:</strong> {debugInfo.contextUser?.email || 'Not set'}</p>
                            <p><strong>LocalStorage Email:</strong> {debugInfo.localStorageUser?.email || 'Not set'}</p>
                            <p><strong>Context Onboarding:</strong> {debugInfo.contextOnboarding ? 'Yes' : 'No'}</p>
                            <p><strong>LocalStorage Onboarding:</strong> {debugInfo.localStorageOnboarding ? 'Yes' : 'No'}</p>
                            <p><strong>Context Verified:</strong> {debugInfo.contextVerified || 'Not set'}</p>
                            <p><strong>LocalStorage Verified:</strong> {debugInfo.localStorageVerified || 'Not set'}</p>
                            <p><strong>Context Token:</strong> {debugInfo.contextToken}</p>
                            <p><strong>LocalStorage Token:</strong> {debugInfo.localStorageToken}</p>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={handleRefreshData}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Refresh Data
                            </button>
                            <button
                                onClick={handleClearStorage}
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Clear Storage
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationPending; 