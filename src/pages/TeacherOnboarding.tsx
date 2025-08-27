import { useState, useRef, useEffect } from "react";
import BioQualifications from "../components/teacherOnboarding/BioQualification";
import ClassSubject from "../components/teacherOnboarding/ClassSubject";
import AvailabilitySchedule from "../components/teacherOnboarding/AvailabilitySchedule";
import PricingDetails from "../components/teacherOnboarding/PricingDetails";
import { getStepContent, isStepValid } from "../utils/utils";
import { onboardingService } from "../services/onboarding.service";
import LoadingSpinner from "../components/LoadingSpinner";

// Define interfaces for better type safety
interface BioData {
  profilePic: string;
  governmentId: string;
  degreeLinks: string[];
  certificateLinks: string[];
  bio: string;
}

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface Subject {
  subject: string;
  price: number;
}

interface StudyLevel {
  level: string;
  subjects: Subject[];
}

interface PricingData {
  pricingDetails: Array<{ subject?: string; price: number; id?: number }>;
  cardDetails: {
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

interface OnboardingData {
  profilePic: string;
  bio: string;
  governmentId: string;
  degreeLinks: string[];
  certificateLinks: string[];
  subjects: string[];
  availability: AvailabilitySlot[];
  pricingDetails: Array<{ subject?: string; price: number }>;
  cardDetails: {
    cardHolder: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

// Component ref interfaces
interface BioQualificationsRef {
  getData: () => Promise<BioData>;
}

interface SubjectsRef {
  getData: () => Promise<string[]>;
}

interface AvailabilityScheduleRef {
  getData: () => AvailabilitySlot[];
}

interface PricingDetailsRef {
  getData: () => PricingData;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs to access component data
  const bioRef = useRef<BioQualificationsRef>(null);
  const subjectsRef = useRef<SubjectsRef>(null);
  const availabilityRef = useRef<AvailabilityScheduleRef>(null);
  const pricingRef = useRef<PricingDetailsRef>(null);

  // State for all component data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profilePic: "",
    bio: "",
    governmentId: "",
    degreeLinks: [],
    certificateLinks: [],
    subjects: [],
    availability: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
    pricingDetails: [{ subject: "", price: 0 }],
    cardDetails: { cardHolder: "", cardNumber: "", expiryDate: "", cvv: "" },
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

  const handleFinish = async () => {
    setLoading(true);
    setError("");
  };

  const handleNext = async () => {
    setError("");

    try {
      switch (currentStep) {
        case 1:
          if (bioRef.current?.getData) {
            const currentData = await bioRef.current.getData();
            setOnboardingData((prev) => ({
              ...prev,
              profilePicture: currentData.profilePic,
              governmentId: currentData.governmentId,
              degreeLinks: currentData.degreeLinks || [],
              certificateLinks: currentData.certificateLinks || [],
              bio: currentData.bio,
            }));
          }
          break;
        case 2:
          if (subjectsRef.current?.getData) {
            const currentData = await subjectsRef.current.getData();
            setOnboardingData((prev) => ({ ...prev, subjects: currentData }));
          }
          break;
        case 3:
          if (availabilityRef.current?.getData) {
            const currentData = availabilityRef.current.getData();
            setOnboardingData((prev) => ({
              ...prev,
              availability: currentData,
            }));
          }
          break;
        case 4:
          if (pricingRef.current?.getData) {
            const currentData = pricingRef.current.getData();
            setOnboardingData((prev) => ({
              ...prev,
              pricingDetails: currentData.pricingDetails,
              cardDetails: currentData.cardDetails,
            }));
          }
          break;
      }
      if (isStepValid(onboardingData, currentStep, "teacher")) {
        if (currentStep === 4) {
          await handleFinish();
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      } else {
        setError("Please fill in all required fields before proceeding.");
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                ref={subjectsRef}
                onChange={(subjects: StudyLevel[]) =>
                  setOnboardingData((prev) => ({
                    ...prev,
                    subjects: subjects.map((s) => s.level),
                  }))
                }
              />
            )}
            {currentStep === 3 && !loading && (
              <AvailabilitySchedule
                ref={availabilityRef}
                slots={onboardingData.availability}
                onChange={(availability: AvailabilitySlot[]) =>
                  setOnboardingData((prev) => ({ ...prev, availability }))
                }
              />
            )}
            {currentStep === 4 && !loading && (
              <PricingDetails
                onDataChange={(pricingDetails: any) =>
                  setOnboardingData((prev) => ({ ...prev, pricingDetails }))
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
          {loading ? "Processing..." : currentStep === 4 ? "Submit" : "Next"}
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
