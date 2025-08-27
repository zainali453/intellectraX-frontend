import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ClassSubjects from "./onboarding components/ClassSubjects";
import AvailabilitySchedule from "../components/teacherOnboarding/AvailabilitySchedule";
import PricingDetails from "../components/teacherOnboarding/PricingDetails";
import AuthService from "../services/auth.service";
import { getStepContent, isStepValid } from "../utils/utils";
import { useUser } from "../context/UserContext";

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser, setOnboardingStatus } = useUser();

  // Get user data from localStorage
  const [User] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Redirect if no user or invalid role
  // React.useEffect(() => {
  //   if (!User || !User.role || User.role?.toLowerCase() !== "student") {
  //     navigate("/signup");
  //     return;
  //   }

  //   if (User.onboarding) {
  //     navigate("/dashboard");
  //     return;
  //   }
  // }, [User, navigate]);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  1;
  // Refs to access component data
  const classSubjectsRef = useRef();
  const availabilityRef = useRef();
  const pricingRef = useRef();

  // State for all component data
  const [onboardingData, setOnboardingData] = useState({
    profilePicture: "",
    className: "",
    subjects: [],
    learningGoals: "",
    availability: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
    parentEmail: "",
    parentContact: "",
  });

  const updateUserOnboardingStatus = () => {
    alert("supo dawg");
    const updatedUser = { ...user, onboarding: true };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    // Also update the UserContext
    setOnboardingStatus(true);
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");

    try {
      if (!user?.email) {
        throw new Error("User email is not set. Please sign up again.");
      }

      // Create student-specific payload structure
      const studentPayload = {
        studentId: onboardingData.userId,
        email: user.email,
        profilePicture: onboardingData.profilePicture,
        academicInfo: {
          className: onboardingData.className,
          subjects: onboardingData.subjects,
        },
        learningGoals: onboardingData.learningGoals,
        availability: onboardingData.availability,
        parentInfo: {
          email: onboardingData.parentEmail,
          number: onboardingData.parentContact,
        },
        role: "student",
        createdAt: new Date().toISOString(),
      };

      const response = await AuthService.completeOnboarding(
        user.email,
        studentPayload,
        user.role
      );
      console.log(response);
      if (response && response.success) {
        if (response.user) {
          // Update localStorage and context with new user data
          const updatedUser = {
            ...user,
            onboarding: response.user.onboarding,
            verified: response.user.verified,
            profilePic: response.user.profilePic,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          updateUser(updatedUser); // update context
          setOnboardingStatus(true); // update onboarding status in context
        }
        navigate("/dashboard");
      } else if (
        response &&
        response.message !== "Student profile already exists"
      ) {
        throw new Error(response.message || "Failed to complete onboarding");
      } else {
        setError("No response from server. Please try again.");
      }
    } catch (error) {
      if (error.message !== "Teacher profile already exists") {
        setError(
          error.message ||
            "There was an error submitting your information. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setError("");

    try {
      let currentData = {};

      switch (currentStep) {
        case 1:
          if (classSubjectsRef.current?.getData) {
            currentData = await classSubjectsRef.current.getData();
            setOnboardingData((prev) => ({
              ...prev,
              profilePicture: currentData.profileImage,
              className: currentData.className,
              subjects: currentData.subjects,
            }));
          }
          break;
        case 2:
          // Learning goals are handled directly in the component
          break;
        case 3:
          if (availabilityRef.current?.getData) {
            currentData = await availabilityRef.current.getData();
            setOnboardingData((prev) => ({
              ...prev,
              availability: currentData,
            }));
          }
          break;
        case 4:
          // Parents account details are handled directly in the component
          break;
      }

      if (isStepValid(onboardingData, currentStep, "student")) {
        if (currentStep === 4) {
          await handleFinish();
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      } else {
        setError("Please fill in all required fields before proceeding.");
      }
    } catch (error) {
      setError(
        "There was an error processing your information. Please try again."
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const { title, description } = getStepContent(currentStep, "student");

  return (
    <div className="flex items-center justify-center bg-gray-100 py-2 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 min-h-screen">
      <div className="w-[800px] max-w-full mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[500px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-600 mb-1 sm:mb-2">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
            {description}
          </p>
          <div className="text-right">
            <span className="text-xs sm:text-sm text-teal-600 font-medium">
              Step {currentStep} of 4
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 text-red-500 rounded-md text-xs sm:text-sm flex-shrink-0">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            <div className="h-full">
              {currentStep === 1 && (
                <ClassSubjects
                  ref={classSubjectsRef}
                  data={onboardingData}
                  onChange={setOnboardingData}
                />
              )}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please tell us about your learning goals
                    </label>
                    <textarea
                      value={onboardingData.learningGoals}
                      onChange={(e) =>
                        setOnboardingData((prev) => ({
                          ...prev,
                          learningGoals: e.target.value,
                        }))
                      }
                      placeholder="Describe your learning goals, what you want to achieve, and any specific areas you want to focus on..."
                      className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                      rows={6}
                      style={{ minHeight: "150px" }}
                    />
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <AvailabilitySchedule
                  ref={availabilityRef}
                  slots={onboardingData.availability}
                  onChange={(availability) =>
                    setOnboardingData((prev) => ({ ...prev, availability }))
                  }
                />
              )}
              {currentStep === 4 && user.role === "Student" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Email
                    </label>
                    <input
                      type="email"
                      value={onboardingData.parentEmail}
                      onChange={(e) =>
                        setOnboardingData((prev) => ({
                          ...prev,
                          parentEmail: e.target.value,
                        }))
                      }
                      placeholder="Enter parent's email address"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Contact Number
                    </label>
                    <input
                      type="tel"
                      value={onboardingData.parentContact}
                      onChange={(e) =>
                        setOnboardingData((prev) => ({
                          ...prev,
                          parentContact: e.target.value,
                        }))
                      }
                      placeholder="Enter parent's contact number"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              disabled={loading}
              className="w-full py-2 sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              loading || !isStepValid(onboardingData, currentStep, "student")
            }
            className="w-full py-2 sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base bg-teal-600 text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : currentStep === 4 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentOnboarding;
