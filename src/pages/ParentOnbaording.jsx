import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ParentsInformation from "./onboarding components/ParentsInformation";
import AuthService from "../services/auth.service";
import { getStepContent, isStepValid } from "../utils/utils";
import { useUser } from "../context/UserContext";
import Signup from "./Signup";
import OTP from "./onboarding components/OTP";

const ParentOnboarding = () => {
  const navigate = useNavigate();
  const { setOnboardingStatus, updateUser } = useUser();

  // Get user data from localStorage
  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Redirect if no user or invalid role
  React.useEffect(() => {
    if (!user || !user.role || user.role?.toLowerCase() !== "parent") {
      navigate("/signup");
      return;
    }

    if (user.onboarding) {
      navigate("/verification-pending");
      return;
    }
  }, [user, navigate]);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [signupData, setSignupData] = useState(null);
  const [isAlreadyCreated, setIsAlreadyCreated] = useState(false);
  const [pendingStep3, setPendingStep3] = useState(false);

  // Refs to access component data
  // No refs needed for simplified flow

  // State for all component data
  const [onboardingData, setOnboardingData] = useState({
    profilePicture: "",
    about: "",
    children: [], // Array to store child profiles
    cardDetails: {}, // For final step
    tempStudentName: "", // For manual student entry
    tempStudentEmail: "", // For manual student entry
  });

  const updateUserOnboardingStatus = () => {
    const updatedUser = { ...user, onboarding: true };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");

    try {
      if (!user?.email) {
        throw new Error("User email is not set. Please sign up again.");
      }

      // Clean payload with only needed fields
      const formData = {
        userEmail: user.email,
        about: onboardingData.about,
        profilePicture: onboardingData.fileUrl,
        children: onboardingData.children, // Array of child profiles
        cardDetails: {
          ...onboardingData.cardDetails,
          cardNumber:
            onboardingData.cardDetails.cardNumber?.replace(/\s/g, "") || "",
        },
      };

      console.log(
        "🚀 [ParentOnboarding] Submitting onboarding data:",
        formData
      );
      const response = await AuthService.completeOnboarding(
        user.email,
        formData,
        user.role
      );
      console.log("📥 [ParentOnboarding] Backend response:", response);

      if (response.success) {
        // Always update user with backend response if available
        if (response.user) {
          console.log(
            "✅ [ParentOnboarding] Updating user with backend response:",
            response.user
          );
          const updatedUserData = {
            ...user,
            ...response.user,
            onboarding: true,
            verified: response.user.verified || "pending",
          };

          // Update both context and localStorage
          updateUser(updatedUserData);
          localStorage.setItem("user", JSON.stringify(updatedUserData));

          console.log(
            "💾 [ParentOnboarding] User data stored:",
            updatedUserData
          );

          // Verify the data was stored correctly
          const storedData = localStorage.getItem("user");
          console.log(
            "🔍 [ParentOnboarding] Verification - stored data:",
            storedData
          );
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log(
              "🔍 [ParentOnboarding] Verification - parsed data:",
              parsedData
            );
            console.log(
              "🔍 [ParentOnboarding] Verification - onboarding status:",
              parsedData.onboarding
            );
            console.log(
              "🔍 [ParentOnboarding] Verification - verified status:",
              parsedData.verified
            );
          }
        } else {
          // Fallback: just update onboarding status
          console.log(
            "⚠️ [ParentOnboarding] No user data in response, using fallback"
          );
          const updatedUser = {
            ...user,
            onboarding: true,
            verified: "pending",
          };
          updateUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Verify the fallback data was stored correctly
          const storedData = localStorage.getItem("user");
          console.log(
            "🔍 [ParentOnboarding] Fallback verification - stored data:",
            storedData
          );
        }

        console.log("🎯 [ParentOnboarding] Navigating to verification-pending");
        navigate("/verification-pending");
      } else {
        throw new Error(response.message || "Failed to complete onboarding");
      }
    } catch (error) {
      console.error(
        "❌ [ParentOnboarding] Error during onboarding completion:",
        error
      );
      setError(
        error.message ||
          "There was an error submitting your information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setError("");
    try {
      let currentData = {};

      // Handle step 1 validation and flow
      if (currentStep === 1) {
        if (onboardingData.created === "already_created") {
          // Require student email to proceed
          if (!onboardingData.extraField) {
            setError("Please enter your student email before proceeding.");
            return;
          }
          // Add student email from step 1 to children array, then set pendingStep3
          const newChild = {
            name: "Student",
            email: onboardingData.extraField,
          };
          setOnboardingData((prev) => ({ ...prev, children: [newChild] }));
          setPendingStep3(true);
          return;
        } else if (onboardingData.created === "not_created") {
          setIsAlreadyCreated(true);
          setCurrentStep(2);
          return;
        } else {
          setError(
            "Please select whether you have already created an account."
          );
          return;
        }
      }

      // Handle other steps
      switch (currentStep) {
        case 2:
          // Registration step - handled by Signup component
          break;
        case 3:
          // Child profile step - no additional data needed
          break;
      }

      // Custom validation for parent onboarding
      const isParentStepValid = (onboardingData, currentStep) => {
        switch (currentStep) {
          case 1: {
            // Profile picture, bio, and created field validation
            const hasProfilePicture = Boolean(onboardingData.fileUrl);
            const hasAbout = Boolean(onboardingData.about);
            const hasCreated = Boolean(onboardingData.created);
            const hasExtraField =
              onboardingData.created === "already_created"
                ? Boolean(onboardingData.extraField)
                : true;
            return hasProfilePicture && hasAbout && hasCreated && hasExtraField;
          }
          case 2: {
            // Registration step - handled by Signup component
            return true;
          }
          case 3: {
            // Child profile step - validate that at least one child is added
            return onboardingData.children.length > 0;
          }
          case 4: {
            // Card details step - validate card details
            const card = onboardingData.cardDetails || {};
            return (
              Boolean(card.cardHolder) &&
              card.cardNumber &&
              card.cardNumber.replace(/\s/g, "").length === 16 &&
              card.expiryDate &&
              card.expiryDate.length === 5 &&
              card.cvv &&
              card.cvv.length === 3
            );
          }
          default:
            return true;
        }
      };

      if (isParentStepValid(onboardingData, currentStep)) {
        // Determine the final step based on the flow
        const finalStep = onboardingData.created === "not_created" ? 4 : 4; // Both flows end at step 4

        if (currentStep === finalStep) {
          // Final step - finish onboarding
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
    if (currentStep === 2 && onboardingData.created === "not_created") {
      // Go back to step 1 if we're on register page for "not created"
      setCurrentStep(1);
      setIsAlreadyCreated(false);
    } else if (
      currentStep === 3 &&
      onboardingData.created === "already_created"
    ) {
      // Go back to step 1 if we're on child profile for "already created"
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handler for ParentsInformation changes
  const handleParentsInfoChange = (changes) => {
    setOnboardingData((prev) => ({ ...prev, ...changes }));
  };

  // Handler for signup success (when "not created" is selected)
  const handleSignupSuccess = (signupFormData) => {
    console.log(
      "[ParentOnboarding] handleSignupSuccess called",
      signupFormData
    );
    setSignupData(signupFormData);
    setShowOTP(true);
  };

  // Handler for OTP success
  const handleOTPSuccess = (response) => {
    setShowOTP(false);

    // If this is a parent signup (not student), update the user context
    if (response.user && response.user.role?.toLowerCase() === "parent") {
      const userData = {
        isAuthenticated: true,
        token: response.token,
        email: response.user.email,
        role: response.user.role,
        verified: response.user.verified,
        onboarding: response.user.onboarding,
        picture: response.user.picture,
      };

      // Update user context and localStorage
      updateUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Continue to step 3 (child profile) for parent onboarding
      setCurrentStep(3);
    } else {
      // This is a student being created by a parent
      if (signupData?.email) {
        const newChild = {
          name: signupData.name || "Student",
          email: signupData.email,
        };
        setOnboardingData((prev) => ({
          ...prev,
          children: [...prev.children, newChild],
        }));
      }
      // Continue to step 3 (child profile)
      setCurrentStep(3);
    }
  };

  // Custom validation for step 1 (all fields must be filled)
  const isStep1Valid =
    onboardingData.fileUrl &&
    onboardingData.about &&
    onboardingData.created &&
    (onboardingData.created === "not_created" ||
      (onboardingData.created === "already_created" &&
        onboardingData.extraField));

  // Get total steps based on user selection
  const getTotalSteps = () => {
    if (onboardingData.created === "not_created") {
      return 4; // Include registration step, child profile, and card details
    } else if (onboardingData.created === "already_created") {
      return 3; // Skip registration step, go directly to child profile
    }
    return 4; // Default
  };

  // Get current step display
  const getCurrentStepDisplay = () => {
    if (onboardingData.created === "already_created") {
      // For "already created" flow: step 1 -> 1, step 3 -> 2, step 4 -> 3
      if (currentStep === 1) return 1;
      if (currentStep === 3) return 2;
      if (currentStep === 4) return 3;
    }
    return currentStep;
  };

  // Get step title and description based on current step and flow
  const getStepTitle = () => {
    if (currentStep === 1) return "Parental Information";
    if (currentStep === 2 && onboardingData.created === "not_created")
      return "Parent Registration";
    if (currentStep === 3) return "Child Profile";
    if (currentStep === 4) return "Card Details";
    return "";
  };

  const getStepDescription = () => {
    if (currentStep === 1)
      return "Please provide your parental information and upload required documents.";
    if (currentStep === 2 && onboardingData.created === "not_created")
      return "Register your parent account to continue.";
    if (currentStep === 3)
      return onboardingData.created === "already_created"
        ? "Add your existing student details below."
        : "Child profiles that you have created are given below.";
    if (currentStep === 4)
      return "Enter your card details to complete the setup.";
    return "";
  };

  // Step titles and descriptions
  const stepTitles = [
    "Parental Information",
    "Parent Registration",
    "Child Profile",
    "Card Details",
  ];
  const stepDescriptions = [
    "Please provide your parental information and upload required documents.",
    "Register your parent account to continue.",
    "Child profiles that you have created are given below.",
    "Enter your card details to complete the setup.",
  ];

  console.log("[ParentOnboarding] Render", {
    showOTP,
    signupData,
    currentStep,
    onboardingData,
  });

  // Move to step 3 only after children is set and pendingStep3 is true
  React.useEffect(() => {
    if (pendingStep3 && onboardingData.children.length > 0) {
      setCurrentStep(3);
      setPendingStep3(false);
    }
    // eslint-disable-next-line
  }, [pendingStep3, onboardingData.children]);

  // Remove fallback UI at the end and use correct conditional rendering for Signup and OTP in step 2
  return (
    <div className="flex items-center justify-center bg-gray-100 py-2 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 min-h-screen">
      <div className="w-[800px] max-w-full mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[500px] max-h-[90vh] flex flex-col">
        {currentStep !== 2 && (
          <>
            {/* Header */}
            <div className="mb-3 sm:mb-4 md:mb-6 flex-shrink-0">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-600 mb-1 sm:mb-2">
                {getStepTitle()}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                {getStepDescription()}
              </p>
              <div className="text-right">
                <span className="text-xs sm:text-sm text-teal-600 font-medium">
                  Step {getCurrentStepDisplay()} of {getTotalSteps()}
                </span>
              </div>
            </div>
            {error && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 text-red-500 rounded-md text-xs sm:text-sm flex-shrink-0">
                {error}
              </div>
            )}
          </>
        )}
        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            <div className="h-full">
              {currentStep === 1 && (
                <ParentsInformation
                  fileUrl={onboardingData.fileUrl}
                  about={onboardingData.about}
                  created={onboardingData.created}
                  extraField={onboardingData.extraField}
                  onChange={handleParentsInfoChange}
                />
              )}
              {currentStep === 2 &&
                onboardingData.created === "not_created" &&
                !showOTP && (
                  <Signup
                    forceStudentInner={true}
                    onSuccess={handleSignupSuccess}
                    parentInfo={{
                      email: user.email,
                      phone: user.mobileNumber || user.phone,
                    }}
                  />
                )}
              {currentStep === 2 &&
                onboardingData.created === "not_created" &&
                showOTP &&
                signupData &&
                signupData.email && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30">
                    <div className="w-full max-w-md mx-auto">
                      <OTP
                        email={signupData.email}
                        signupData={signupData}
                        onSuccess={handleOTPSuccess}
                      />
                    </div>
                  </div>
                )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Child Profile
                    </h3>
                    <p className="text-sm text-gray-600">
                      Child profiles that you have created are given below
                    </p>
                  </div>
                  {/* Show existing children if any */}
                  {onboardingData.children.length > 0 ? (
                    onboardingData.children.map((child, index) => (
                      <div
                        key={index}
                        className="bg-teal-50 rounded-lg p-4 border border-teal-200"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-sm text-teal-800 font-medium">
                              {child.email}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              // Remove this child from children array
                              const updatedChildren =
                                onboardingData.children.filter(
                                  (_, i) => i !== index
                                );
                              setOnboardingData((prev) => ({
                                ...prev,
                                children: updatedChildren,
                              }));
                            }}
                            className="px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-yellow-800 text-center">
                        No child profiles found. Please go back and add your
                        student email.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Card Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enter your card details to complete the setup
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        value={onboardingData.cardDetails?.cardHolder || ""}
                        onChange={(e) =>
                          setOnboardingData((prev) => ({
                            ...prev,
                            cardDetails: {
                              ...prev.cardDetails,
                              cardHolder: e.target.value,
                            },
                          }))
                        }
                        placeholder="Enter card holder name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={onboardingData.cardDetails?.cardNumber || ""}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\s/g, "")
                            .replace(/(\d{4})/g, "$1 ")
                            .trim();
                          setOnboardingData((prev) => ({
                            ...prev,
                            cardDetails: {
                              ...prev.cardDetails,
                              cardNumber: value,
                            },
                          }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={onboardingData.cardDetails?.expiryDate || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .replace(/(\d{2})(\d)/, "$1/$2");
                            setOnboardingData((prev) => ({
                              ...prev,
                              cardDetails: {
                                ...prev.cardDetails,
                                expiryDate: value,
                              },
                            }));
                          }}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={onboardingData.cardDetails?.cvv || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 3);
                            setOnboardingData((prev) => ({
                              ...prev,
                              cardDetails: { ...prev.cardDetails, cvv: value },
                            }));
                          }}
                          placeholder="123"
                          maxLength="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Footer: Always show navigation buttons */}
        <div className="mt-4 flex flex-col items-center">
          {/* Show Previous button for all steps except the first */}
          {currentStep > 1 && (
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors mb-2 w-full"
              onClick={handlePrevious}
              disabled={loading}
            >
              Previous
            </button>
          )}
          {/* Show Next button for all steps except step 2 (handled by form submit in Signup/OTP) */}
          {currentStep !== 2 && (
            <button
              className="px-4 py-2 rounded bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 w-full"
              onClick={handleNext}
              disabled={loading || (currentStep === 1 && !isStep1Valid)}
            >
              {currentStep === 4
                ? loading
                  ? "Finishing..."
                  : "Finish"
                : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentOnboarding;
