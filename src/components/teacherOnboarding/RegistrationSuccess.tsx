import React, { use, useEffect } from "react";
import { Check } from "lucide-react";
import CustomIcon from "../CustomIcon";
import { useUser } from "@/context/UserContext";
import { onboardingService } from "@/services/onboarding.service";
import { useNavigate } from "react-router-dom";

interface RegistrationSuccessProps {
  className?: string;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  const { user, updateUserFromCookies } = useUser();
  useEffect(() => {
    const checkTeacherStatus = async () => {
      const response = await onboardingService.checkTeacherStatus();
      if (response?.data) {
        if (response.data.completed) {
          updateUserFromCookies();
          navigate("/teacher/dashboard");
        } else {
          navigate("/pricenegotiation");
        }
      }
    };
    if (user.role === "teacher") checkTeacherStatus();
  }, []);
  return (
    <div className="bg-white rounded-3xl shadow-lg w-full max-w-xl">
      <div
        className={`flex flex-col items-center justify-center min-h-[300px] p-8  gap-6 ${className}`}
      >
        <CustomIcon name="success" className="w-28 h-28" />
        {/* Success Message */}
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-[#383838] mb-6">
            Registration Successfully Completed!
          </h1>

          <p className="text-gray-600 text-base leading-relaxed">
            Thank you for registering on IntellectraX. Our team will shortly
            review your request for account verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
