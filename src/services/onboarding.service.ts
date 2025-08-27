import { apiClient } from "./axiosConfig";
import { cookieUtils, COOKIE_NAMES } from "../utils/cookieUtils";

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileUrl: string;
    fileKey: string;
    fileName?: string;
  };
}

interface RemoveResponse {
  success: boolean;
  message: string;
}

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface OnboardingData {
  profilePic: string;
  bio: string;
  governmentIdFront: string;
  governmentIdBack: string;
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

interface OnboardingDataResponse {
  success: boolean;
  message: string;
  data?: OnboardingData;
}

interface OnboardingService {
  upload(formData: FormData, query: string): Promise<UploadResponse>;
  removeUpload(fileUrl: string, fileType: string): Promise<RemoveResponse>;
}

// Onboarding Service Class
class OnboardingService {
  async upload(formData: FormData, query: string): Promise<UploadResponse> {
    try {
      const response = await apiClient.post<UploadResponse>(
        `public/upload?add=${query}`,
        formData,
        {
          headers: {
            "Content-Type": undefined,
          },
        }
      );

      if (response.data.data?.fileUrl && query === "profilePic") {
        const currentCookies = cookieUtils.getJSON(COOKIE_NAMES.USER_DATA);
        currentCookies.profilePic = response.data.data.fileUrl;

        cookieUtils.set(COOKIE_NAMES.USER_DATA, JSON.stringify(currentCookies));
      }

      return response.data;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.response?.data?.message || "Upload failed");
    }
  }

  async removeUpload(
    fileUrl: string,
    fileType: string
  ): Promise<RemoveResponse> {
    try {
      const response = await apiClient.post<RemoveResponse>(
        `public/remove-document?remove=${fileType}`,
        {
          fileUrl: fileUrl,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Remove upload error:", error);
      throw new Error(error.response?.data?.message || "File removal failed");
    }
  }

  async getTeacherOnBoardingData() {
    try {
      const response = await apiClient.get<OnboardingDataResponse>(
        "teacher/onboarding"
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching onboarding data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch onboarding data"
      );
    }
  }
  async getServerHealth() {
    try {
      const response = await apiClient.get<OnboardingDataResponse>("health");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching onboarding data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch onboarding data"
      );
    }
  }
}

// Create and export a singleton instance
export const onboardingService = new OnboardingService();

// Export the class for testing or custom instances
export default OnboardingService;
