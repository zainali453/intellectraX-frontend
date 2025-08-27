import React, { useState } from "react";
import InputField from "../../components/InputField";
import DatePicker from "../../components/DatePicker";
import SelectField from "../../components/SelectField";
import PasswordInput from "../../components/PasswordInput";
import ModernLoading from "../../components/ModernLoading";
import { useNavigate } from "react-router-dom";
import { authService, SignupRequest } from "../../services/auth.service";
import { cookieUtils } from "../../utils/cookieUtils";
import { getEmailFromToken } from "../../utils/jwtUtils";
import { useUser } from "../../context/UserContext";

type UserRole = "student" | "teacher" | "parent";

type Details = {
  [key in UserRole]: {
    title: string;
    description: string;
  };
};
const details: Details = {
  student: {
    title: "Register",
    description:
      "Please provide the following information to set up your Student Portal account.",
  },
  teacher: {
    title: "Register",
    description:
      "Please provide the following information to set up your Teacher Portal account.",
  },
  parent: {
    title: "Register",
    description:
      "Please provide the following information to set up your Parent Portal account.",
  },
};

const RegistrationForm = () => {
  const navigate = useNavigate();

  const { updateUserFromCookies } = useUser();

  // get the query from the URL
  const query = new URLSearchParams(window.location.search);
  const role: UserRole =
    typeof query.get("role") === "string"
      ? (query.get("role") as UserRole)
      : (query.get("role")?.[0] as UserRole);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    mobileNumber: "",
    location: "",
    dateOfBirth: null as Date | null,
    role: "student",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      dateOfBirth: date,
    });
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    setSuccess(false);

    // // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Format the data for the API
      const submitData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? formData.dateOfBirth.toISOString().split("T")[0]
          : "",
        role: role,
      };

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...apiData } = submitData;
      setIsLoading(true);

      const response = await authService.signup(apiData as SignupRequest);

      if (response.message === "Email already exists") {
        setError("Email already exists. Please sign in instead.");
        setIsLoading(false);
        return;
      }
      updateUserFromCookies();
      setSuccess(true);
      setError("");
      navigate("/otp");
    } catch (error: any) {
      if (
        error.message ===
        "A verification is already pending for this email. Please check your email or wait for it to expire."
      ) {
        // Get email from token if available, otherwise use form email
        const token = cookieUtils.get("auth_token");
        const emailFromToken = token ? getEmailFromToken(token) : null;
        if (emailFromToken) navigate(`/otp`);
        else {
          setError(
            "Please continue the verification process on the machine where you initiated registration."
          );
        }
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    }
    setIsLoading(false);
  };
  if (details[role] === undefined) {
    return <div className=" text-5xl">Invalid user role</div>;
  }

  return (
    <>
      {isLoading && (
        <ModernLoading
          type="dots"
          size="xl"
          color="primary"
          text="Creating your account..."
          overlay={true}
        />
      )}

      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-3xl">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-textprimary mb-2">
            {details[role].title || "Register"}
          </h2>
          <p className="text-black text-sm">
            {details[role].description ||
              "Please provide the following information to set up your account."}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md">
              Registration successful! Please check your email for verification
              instructions.
            </div>
          )}

          {/* Email and Full Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
              autoComplete="email"
            />
            <InputField
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />
          </div>

          {/* Mobile Number and Date of Birth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField
              label="Mobile Number"
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              required
              autoComplete="tel"
            />
            <DatePicker
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleDateChange}
              placeholder="Select your date of birth"
              required
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dateFormat="MM/dd/yyyy"
            />
          </div>

          {/* Location and Gender Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField
              label={
                <>
                  Location <span className="text-gray-400">(Optional)</span>
                </>
              }
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter your location"
              endIconName="location"
            />
            <SelectField
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              placeholder="Select your gender"
              options={genderOptions}
              required
            />
          </div>

          {/* Password and Confirm Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
              showStrengthIndicator
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-3xl font-medium transition-colors duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-bgprimary hover:bg-teal-600 cursor-pointer text-white"
            }`}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          {/* Sign In Link */}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-bgprimary hover:text-teal-600 font-medium"
              >
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationForm;
