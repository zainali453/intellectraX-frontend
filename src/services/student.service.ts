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
  subject: string;
  teacherId: string;
  userId: string;
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
}
export const studentService = new StudentService();
