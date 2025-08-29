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

interface SuccessResponse {
  success: boolean;
  message: string;
}

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

interface OnboardingDataResponse {
  success: boolean;
  message: string;
  data?: OnboardingData;
}

interface OnboardingService {
  upload(formData: FormData, query: string): Promise<UploadResponse>;
  removeUpload(fileUrl: string, fileType: string): Promise<SuccessResponse>;
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

      return response.data;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.response?.data?.message || "Upload failed");
    }
  }

  async removeUpload(
    fileUrl: string,
    fileType: string
  ): Promise<SuccessResponse> {
    try {
      const response = await apiClient.post<SuccessResponse>(
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
  async saveTeacherOnBoardingData(data: OnboardingData, query?: string) {
    try {
      const response = await apiClient.post<SuccessResponse>(
        "teacher/onboarding" + (query ? `?completed=${query}` : ""),
        data
      );
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
