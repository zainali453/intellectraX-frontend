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

export interface TeacherData {
  _id: string;
  userId: {
    fullName: string;
    email: string;
    profilePic: string;
    mobileNumber: string;
    verified: "verified" | "completed" | "pending" | "rejected";
  };
  classes: {
    level: string;
    subjects: {
      subject: string;
      price: number;
    }[];
  }[];
  bio: string;
  availability: {
    day: string;
    times: {
      startTime: string;
      endTime: string;
    }[];
  }[];
  isVerified: Boolean;
  governmentId: string;
  degreeLinks: string[];
  certificateLinks: string[];
}

interface getTeacherByIdResponse {
  success: boolean;
  message: string;
  data?: TeacherData;
}

export interface PriceNegotiationData {
  level: string;
  subjects: {
    subject: string;
    price: number;
    adminPrice?: number;
    acceptedBy?: "admin" | "teacher" | null;
    accepted: boolean;
  }[];
}
interface getTeacherPricesResponse {
  success: boolean;
  message: string;
  data?: {
    classes: PriceNegotiationData[];
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

  async getTeacherById(teacherId: string) {
    try {
      const response = await apiClient.get<getTeacherByIdResponse>(
        `admin/teacher/${teacherId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching onboarding data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch onboarding data"
      );
    }
  }

  async getTeacherPrices(teacherId: string) {
    try {
      const response = await apiClient.get<getTeacherPricesResponse>(
        `admin/teacher/prices/${teacherId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching teacher prices:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch onboarding data"
      );
    }
  }

  async submitPriceNegotiation(
    teacherId: string,
    negotiationData: PriceNegotiationData[]
  ) {
    try {
      const response = await apiClient.post<VerificationResponse>(
        `admin/teacher/prices/${teacherId}`,
        { negotiationData }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error submitting price negotiation:", error);
      throw new Error(
        error.response?.data?.message || "Failed to submit price negotiation"
      );
    }
  }
}
export const adminService = new AdminService();
