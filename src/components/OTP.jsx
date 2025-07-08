import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import AuthService from '../services/auth.service';

const OTP = ({ email, signupData, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResponse, setVerificationResponse] = useState(null);
  const navigate = useNavigate();
  
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }

    // If all digits are filled, trigger verify
    if (value !== '' && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (otpString) => {
    setIsLoading(true);
    try {
      const response = await AuthService.verifyOTP(signupData, otpString);
      setIsSuccess(response.success);
      setShowModal(true);
      setVerificationResponse(response);
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
      onSuccess?.(verificationResponse);
    } else {
      // Reset OTP inputs
      setOtp(['', '', '', '', '', '']);
      inputRefs[0].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');
    
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
    inputRefs[lastIndex].current.focus();

    // If all digits are filled, verify OTP
    if (pastedOtp.length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await AuthService.resendOTP(signupData);
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
    inputRefs[0].current.focus();
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">OTP Code</h2>
          <p className="text-gray-600 text-sm">
            Please enter your OTP code we've sent to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
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
              className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-teal-600 hover:text-teal-700 font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Click here to resend
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
