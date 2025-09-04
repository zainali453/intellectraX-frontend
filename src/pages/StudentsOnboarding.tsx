import { useState, useRef, useEffect } from "react";
import { getStepContent, isStepValid } from "../utils/utils";
import { onboardingService } from "../services/onboarding.service";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LevelOfStudy from "@/components/studentOnboarding/LevelOfStudy";
import ClassSubjects from "@/components/studentOnboarding/ClassSubjects";
import ParentAccount from "@/components/studentOnboarding/ParentAccount";
import PaymentDetails from "@/components/studentOnboarding/PaymentDetails";

// Define interfaces for better type safety

interface StudentOnboardingData {
  level: string;
  plan: string;
  subjects: string[];
  parentEmail: string;
  parentContactNumber: string;
}

const StudentOnboarding = () => {
  const { updateUserFromCookies, user } = useUser();
  const navigate = useNavigate();
  const prevStep = localStorage.getItem("studentonboardingStep") || "1";
  const [currentStep, setCurrentStep] = useState(parseInt(prevStep));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for all component data
  const [onboardingData, setOnboardingData] = useState<StudentOnboardingData>({
    level: "",
    plan: "",
    subjects: [],
    parentEmail: "",
    parentContactNumber: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await onboardingService.getStudentOnBoardingData();
        if (response.data) {
          const data = response.data;
          setOnboardingData((prev) => ({ ...prev, ...data }));
        }
      } catch (error: any) {
        console.error("Error fetching onboarding data:", error);
        if (error.message === "Teacher not found") {
          setCurrentStep(1);
        }
      } finally {
        setLoading(false);
      }
    };
    if (user.onboarding) navigate("success");
    if (!user.onboarding) fetchData();
  }, []);

  const handleSave = async (query?: string) => {
    try {
      setLoading(true);
      await onboardingService.saveStudentOnBoardingData(onboardingData, query);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setError("Error While Saving Data");
      setLoading(false);
      return false;
    }
  };
  const handleNext = async () => {
    setError("");
    try {
      if (isStepValid(onboardingData, currentStep, "student")) {
        const tempStep = currentStep;
        if (currentStep === 4) {
          const response = await handleSave("true");
          if (!response) return;

          updateUserFromCookies();
          navigate("/studentsuccess");
        } else {
          const response = await handleSave();
          if (!response) return;
          setCurrentStep((prev) => prev + 1);
        }
        localStorage.setItem(
          "studentonboardingStep",
          (tempStep + 1 > 4 ? 4 : tempStep + 1).toString()
        );
      } else {
        setError("Please fill in all required fields before proceeding.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error during step transition:", error);
      setError(
        "There was an error processing your information. Please try again."
      );
    }
  };

  const handlePrevious = () => {
    localStorage.setItem("studentonboardingStep", (currentStep - 1).toString());
    setCurrentStep((prev) => prev - 1);
  };

  const { title, description } = getStepContent(currentStep, "student");

  return (
    <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-4xl my-10">
      <div className="mb-1">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-textprimary mb-2">
            {title}
          </h2>
          <span className="text-xs sm:text-sm text-bgprimary font-semibold">
            Step {currentStep} of 4
          </span>
        </div>

        <p className="text-black text-sm">{description}</p>
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
            {loading && (
              <div className="flex items-center justify-center h-full min-h-120">
                <LoadingSpinner size={"lg"} />
              </div>
            )}
            {currentStep === 1 && !loading && (
              <LevelOfStudy
                initialData={onboardingData}
                onChange={setOnboardingData}
              />
            )}
            {currentStep === 2 && !loading && (
              <ClassSubjects
                initialData={onboardingData}
                onChange={setOnboardingData}
              />
            )}
            {currentStep === 3 && !loading && (
              <ParentAccount
                initialData={onboardingData}
                onChange={setOnboardingData}
              />
            )}
            {currentStep === 4 && !loading && (
              <PaymentDetails initialData={onboardingData} />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full py-2 sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base bg-bgprimary text-white hover:bg-teal-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Processing..."
            : currentStep === 4
            ? "Pay and Finish"
            : "Next"}
        </button>
        <div className="flex flex-row gap-4 mt-1">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              disabled={loading}
              className="w-full py-2 cursor-pointer sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Back to Previous Step
            </button>
          )}
          {currentStep === 3 && (
            <button
              onClick={() => {
                setCurrentStep(4);
                setError("");
              }}
              disabled={loading}
              className="w-full py-2 cursor-pointer sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base  text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Skip this step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentOnboarding;
