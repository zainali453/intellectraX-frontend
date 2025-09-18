import { apiClient } from "./axiosConfig";

export interface StudentDashboardData {
  totalClasses: number;
  totalTeachers: number;
  averageMarks: string;
  remainingCredits: number;
}

export interface Teacher {
  profilePic: string;
  fullName: string;
  subjects: string[];
  teacherId: string;
  userId: string;
  rating: number;
}

export interface TeacherDetails {
  profilePic: string;
  fullName: string;
  bio: string;
  subjects: string[];
}

interface successResponseWithData<T> {
  success: boolean;
  message: string;
  data: T;
}
// Teacher Service Class
class StudentService {
  async getDashboardData() {
    try {
      const response = await apiClient.get<
        successResponseWithData<StudentDashboardData>
      >(`student/dashboard`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching onboarding data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch onboarding data"
      );
    }
  }
  async getTeachers() {
    try {
      const response = await apiClient.get<successResponseWithData<Teacher[]>>(
        `student/teachers`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching onboarding data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch onboarding data"
      );
    }
  }
  async getTeacherDetails(teacherId: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<TeacherDetails>
      >(`student/teachers/${teacherId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching teacher details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch teacher details"
      );
    }
  }
}
export const studentService = new StudentService();
