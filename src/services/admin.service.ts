import { apiClient } from "./axiosConfig";

export interface VerificationData {
  _id: string;
  dateTime: string;
  name: string;
  email: string;
  experienceBio: string;
  governmentId: string;
  degree: string;
}

interface getTeacherOnBoardingDataResponse {
  success: boolean;
  message: string;
  data?: VerificationData[];
  meta?: {
    pagination: {
      totalPages: number;
    };
  };
}

interface VerificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Admin Service Class
class AdminService {
  async getTeachers(
    currentPage: number,
    param: "pending" | "accepted" | "rejected"
  ) {
    try {
      const response = await apiClient.get<getTeacherOnBoardingDataResponse>(
        `admin/teachers/${param}?page=${currentPage}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching onboarding data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch onboarding data"
      );
    }
  }

  async verifyTeacher(teacherId: string, action: "accept" | "reject") {
    try {
      const response = await apiClient.post<VerificationResponse>(
        `admin/teachers/${teacherId}/verify`,
        { action }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error verifying teacher:", error);
      throw new Error(
        error.response?.data?.message || "Failed to verify teacher"
      );
    }
  }
}
export const adminService = new AdminService();
