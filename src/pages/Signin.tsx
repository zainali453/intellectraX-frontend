import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useUser } from "../context/UserContext";
import InputField from "../components/InputField";
import PasswordInput from "../components/PasswordInput";

export default function SignIn() {
  const navigate = useNavigate();
  const { updateUserFromCookies, user } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      updateUserFromCookies();

      navigate("/onboarding");
    } catch (error: any) {
      console.error("❌ [Signin] Login failed:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-3xl">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-textprimary mb-2">
          {"Sign In"}
        </h2>
        <p className="text-black text-sm">
          {"Please enter your details to log in to your account."}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          autoComplete="new-password"
        />
        <div className="flex justify-end my-5">
          <Link
            to="/forgot-password"
            className="text-bgprimary hover:text-teal-600 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-3xl font-medium transition-colors duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-bgprimary hover:bg-teal-600 cursor-pointer text-white"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-bgprimary hover:text-teal-600 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
