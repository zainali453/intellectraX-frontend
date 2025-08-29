import { useState, useRef, useEffect } from "react";
import BioQualifications from "../components/teacherOnboarding/BioQualification";
import ClassSubject from "../components/teacherOnboarding/ClassSubject";
import AvailabilitySchedule from "../components/teacherOnboarding/AvailabilitySchedule";
import PricingDetails from "../components/teacherOnboarding/PricingDetails";
import { getStepContent, isStepValid } from "../utils/utils";
import { onboardingService } from "../services/onboarding.service";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

// Define interfaces for better type safety

interface AvailabilitySlot {
  day: string;
  times: { startTime: string; endTime: string }[];
}

interface Subject {
  subject: string;
  price: number;
}

type TeacherClasses = {
  level: string;
  subjects: Subject[];
};
interface OnboardingData {
  profilePic: string;
  bio: string;
  governmentId: string;
  degreeLinks: string[];
  certificateLinks: string[];
  classes: TeacherClasses[];
  availability: AvailabilitySlot[];
  pricingFName: string;
  pricingLName: string;
  pricingSortCode: string;
  pricingAccountNumber: string;
}
interface PricingDetailsType {
  pricingFName: string;
  pricingLName: string;
  pricingSortCode: string;
  pricingAccountNumber: string;
}

interface AvailabilityScheduleRef {
  getData: () => AvailabilitySlot[];
}

const Onboarding = () => {
  const { updateUserFromCookies, user } = useUser();
  const navigate = useNavigate();
  if (user.onboarding) navigate("success");
  const prevStep = localStorage.getItem("onboardingStep") || "1";
  const [currentStep, setCurrentStep] = useState(parseInt(prevStep));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for all component data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profilePic: "",
    bio: "",
    governmentId: "",
    degreeLinks: [],
    certificateLinks: [],
    classes: [],
    availability: [
      { day: "Monday", times: [{ startTime: "09:00", endTime: "17:00" }] },
    ],
    pricingFName: "",
    pricingLName: "",
    pricingSortCode: "",
    pricingAccountNumber: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await onboardingService.getTeacherOnBoardingData();
        if (response.data) {
          const data = response.data;
          setOnboardingData((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (query?: string) => {
    try {
      setLoading(true);
      await onboardingService.saveTeacherOnBoardingData(onboardingData, query);
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setError("Error While Saving Data");
    } finally {
      setLoading(false);
    }
  };
  const handleNext = async () => {
    setError("");

    try {
      if (isStepValid(onboardingData, currentStep, "teacher")) {
        const tempStep = currentStep;
        if (currentStep === 4) {
          await handleSave("true");
          updateUserFromCookies();
          navigate("/success");
        } else {
          if (currentStep > 1) await handleSave();
          setCurrentStep((prev) => prev + 1);
        }
        localStorage.setItem(
          "onboardingStep",
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
    setCurrentStep((prev) => prev - 1);
  };

  const { title, description } = getStepContent(currentStep, "teacher");

  return (
    <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-3xl my-10">
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
              <BioQualifications
                data={onboardingData}
                onChange={setOnboardingData}
              />
            )}
            {currentStep === 2 && !loading && (
              <ClassSubject
                initialData={onboardingData.classes}
                onChange={(classes: TeacherClasses[]) =>
                  setOnboardingData((prev) => ({ ...prev, classes }))
                }
              />
            )}
            {currentStep === 3 && !loading && (
              <AvailabilitySchedule
                slots={onboardingData.availability}
                onChange={(availability: AvailabilitySlot[]) =>
                  setOnboardingData((prev) => ({ ...prev, availability }))
                }
              />
            )}
            {currentStep === 4 && !loading && (
              <PricingDetails
                data={{
                  pricingFName: onboardingData.pricingFName,
                  pricingLName: onboardingData.pricingLName,
                  pricingSortCode: onboardingData.pricingSortCode,
                  pricingAccountNumber: onboardingData.pricingAccountNumber,
                }}
                onChange={(pricingDetails: PricingDetailsType) =>
                  setOnboardingData((prev) => ({ ...prev, ...pricingDetails }))
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={handleNext}
          // disabled={
          //   loading || !isStepValid(onboardingData, currentStep, "teacher")
          // }
          className="w-full py-2 sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base bg-bgprimary text-white hover:bg-teal-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Processing..." : currentStep === 4 ? "Finish" : "Next"}
        </button>
        {currentStep > 1 && (
          <button
            onClick={handlePrevious}
            disabled={loading}
            className="w-full py-2 cursor-pointer sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back to Previous Step
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
