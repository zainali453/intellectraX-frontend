import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { authService } from "../../services/auth.service";
import { cookieUtils } from "../../utils/cookieUtils";
import {
  getEmailFromToken,
  getVerificationStatusFromToken,
} from "../../utils/jwtUtils";
import { useUser } from "../../context/UserContext";

// Define AuthResponse type if not imported from elsewhere
type AuthResponse = {
  success: boolean;
  // Add other fields as needed
};

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserFromCookies } = useUser();
  const navigate = useNavigate();

  // Get email from token first, then fall back to URL parameter
  const token = cookieUtils.get("auth_token");

  let email = "";

  // Check token and redirect if necessary
  useEffect(() => {
    if (token) {
      const verificationStatus = getVerificationStatusFromToken(token);
      if (verificationStatus === "verified") {
        navigate("/dashboard");
        return;
      }
    }

    if (!email) {
      const query = new URLSearchParams(window.location.search);
      const emailFromUrl = query.get("email");
      if (!emailFromUrl) {
        navigate("/signup");
        return;
      }
    }
  }, [token, email, navigate]);

  if (token) {
    const emailFromToken = getEmailFromToken(token);
    email = emailFromToken || "";
  }

  // If no email from token, try URL parameter as fallback
  if (!email) {
    const query = new URLSearchParams(window.location.search);
    email = query.get("email") || "";
  }

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // If all digits are filled, trigger verify
    if (value !== "" && index === 5) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleVerify = async (otpString: string) => {
    setIsLoading(true);
    try {
      // Use email from token for verification
      const response = await authService.verifyOTP({ email }, otpString);

      if (response.success) updateUserFromCookies();

      setIsSuccess(response.success);
      setShowModal(true);
    } catch (error) {
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (isSuccess) {
      // Navigate to dashboard or appropriate page after successful verification
      navigate("/dashboard");
    } else {
      // Reset OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedOtp = pastedData.slice(0, 6).split("");

    if (!/^\d*$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or first empty input
    const lastIndex = Math.min(pastedOtp.length - 1, 5);
    inputRefs[lastIndex].current?.focus();

    // If all digits are filled, verify OTP
    if (pastedOtp.length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      // Use email from token first, then URL params for resending OTP
      await authService.resendOTP({ email });
      // Show success message
      setShowModal(true);
      setIsSuccess(true);
    } catch (error) {
      setShowModal(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-xl">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-textprimary mb-2">
            OTP Code
          </h2>
          <p className="text-black text-sm">
            Please enter your OTP code we've sent to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={inputRefs[index]}
              disabled={isLoading}
              className="w-16 h-16 flex-1 text-center text-2xl font-bold border-1 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            If you didn’t get the code{" "}
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-teal-600 hover:text-bgprimary font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Click Here
            </button>
          </p>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={isSuccess ? "Success!" : "Invalid OTP"}
        description={
          isSuccess
            ? "Your account has been verified successfully."
            : "The OTP you entered is incorrect. Please try again."
        }
        buttonText="OK"
        status={isSuccess ? "success" : "error"}
      />
    </>
  );
};

export default OTP;
