import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';
import SocialLogin from '../components/SocialLogin';
import { useUser } from '../context/UserContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { updateUser, user } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🚀 [Signin] Starting login process...");
      const response = await AuthService.login(formData.email, formData.password);
      console.log("📥 [Signin] Login response:", response);

      if (!response.token) {
        throw new Error('No authentication token received');
      }

      console.log("🔄 [Signin] About to update user context with:", {
        email: response.user.email,
        role: response.role,
        token: response.token,
        isAuthenticated: true,
        onboarding: response.onboarding,
        verified: response.verified,
        picture: response.picture
      });

      // Update user context with all user data including token
      updateUser({ 
        email: response.user.email,
        role: response.role,
        token: response.token,
        isAuthenticated: true,
        onboarding: response.onboarding,
        verified: response.verified,
        picture: response.picture
      });
      
      console.log("✅ [Signin] User context updated, checking user state...");
      console.log("📊 [Signin] Current user state after update:", user);
      
      // Handle different user states after login
      if (!response.onboarding && response.role?.toLowerCase() === 'teacher') {
        console.log("🎯 [Signin] Teacher not onboarded, redirecting to onboarding");
        navigate('/onboarding');
      } else if (response.onboarding && response.verified !== 'verified' && response.role?.toLowerCase() === 'teacher') {
        console.log("🎯 [Signin] Teacher onboarded but not verified, redirecting to verification pending");
        navigate('/verification-pending');
      } else if (response.onboarding && (response.verified === 'verified' || response.role?.toLowerCase() === 'student')) {
        console.log("🎯 [Signin] User verified and onboarded (or student), redirecting to dashboard");
        navigate('/dashboard');
      } else {
        console.log("🎯 [Signin] Default case, redirecting to dashboard");
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error("❌ [Signin] Login failed:", error);
      if (error.message === 'User not found') {
        setError("No account found with this email. Please sign up first.");
      } else if (error.message === 'No authentication token received') {
        setError("Authentication failed. Please try again.");
      } else {
        setError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="flex justify-center w-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-12 rounded-3xl border border-gray-200">
        <h2 className="text-4xl font-bold text-gray-600 mb-6">Sign In</h2>
        <p className="text-lg mb-6">Please enter your details to log in to your Admin Portal account</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Email", type: "email", name: "email", placeholder: "you@example.com" },
            { label: "Password", type: "password", name: "password", placeholder: "••••••••" }
          ].map(({ label, type, name, placeholder }) => (
            <div key={name} className="p-2">
              <label className={labelClass}>{label}</label>
              <input
                type={type}
                name={name}
                required
                value={formData[name]}
                onChange={handleChange}
                className={inputClass}
                placeholder={placeholder}
                disabled={loading}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-teal-600 text-white font-bold rounded-3xl hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                Sign Up
              </Link>
            </p>
          </div>

          <SocialLogin />
        </form>
      </div>
    </div>
  );
}
