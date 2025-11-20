import { useState, useRef, useEffect } from "react";
import { getStepContent, isStepValid } from "../utils/utils";
import { onboardingService } from "../services/onboarding.service";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import PersonalInformation from "@/components/parentOnboarding/PersonalInformation";

// Define interfaces for better type safety

interface ParentOnboardingData {
  profilePic: string;
  bio: string;
  childs: {
    email: string;
    fullName: string;
  }[];
}

const ParentsOnboarding = () => {
  const { updateUserFromCookies, user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for all component data
  const [onboardingData, setOnboardingData] = useState<ParentOnboardingData>({
    profilePic: "",
    bio: "",
    childs: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await onboardingService.getParentOnBoardingData();
        if (response.data) {
          const data = response.data;
          setOnboardingData((prev) => ({ ...prev, ...data }));
        }
      } catch (error: any) {
        console.error("Error fetching onboarding data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user.onboarding) navigate("success");
    if (!user.onboarding) fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (onboardingData.profilePic === "") {
        setError("Please upload a profile picture to proceed.");
        return false;
      }
      if (onboardingData.bio.trim() === "") {
        setError("Please enter a bio to proceed.");
        return false;
      }
      if (onboardingData.childs.length === 0) {
        setError("Please add at least one child to proceed.");
        return false;
      }
      setError("");
      setLoading(true);
      await onboardingService.saveParentOnBoardingData(onboardingData);
      setLoading(false);
      updateUserFromCookies();
      navigate("/parent/dashboard");
      return true;
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setError("Error While Saving Data");
      setLoading(false);
      return false;
    }
  };

  return (
    <div className='bg-white rounded-3xl shadow-lg p-10 w-full max-w-4xl my-10'>
      <div className='mb-1'>
        <div className='flex justify-between items-center'>
          <h2 className='text-3xl font-semibold text-textprimary mb-2'>
            {"Personal Information"}
          </h2>
          <span className='text-xs sm:text-sm text-bgprimary font-semibold'>
            Step 1 of 1
          </span>
        </div>

        <p className='text-black text-sm'>
          {
            "Please provide the following information to set up your Parent Portal account."
          }
        </p>
      </div>

      {error && (
        <div className='mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 text-red-500 rounded-md text-xs sm:text-sm flex-shrink-0'>
          {error}
        </div>
      )}

      {/* Content */}
      <div className='flex-1 overflow-hidden flex flex-col min-h-0'>
        <div className='flex-1 overflow-y-auto'>
          <div className='h-full'>
            {loading ? (
              <div className='flex items-center justify-center h-full min-h-120'>
                <LoadingSpinner size={"lg"} />
              </div>
            ) : (
              <PersonalInformation
                data={onboardingData}
                onChange={setOnboardingData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='space-y-2 sm:space-y-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex-shrink-0'>
        <button
          onClick={handleSave}
          disabled={loading}
          className='w-full py-2 sm:py-3 px-4 rounded-3xl font-medium text-sm sm:text-base bg-bgprimary text-white hover:bg-teal-600 transition-colors disabled:opacity-50 cursor-pointer'
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ParentsOnboarding;
