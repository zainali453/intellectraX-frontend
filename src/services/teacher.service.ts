import { apiClient } from "./axiosConfig";

export interface TeacherDashboardData {
  totalClasses: number;
  totalStudents: number;
  totalEarnings: number;
  totalHours: number;
}

export interface Student {
  fullName: string;
  subject: string;
  studentId: string;
  userId: string;
  gender: string;
}

interface successResponseWithData<T> {
  success: boolean;
  message: string;
  data: T;
}
// Teacher Service Class
class TeacherService {
  async getDashboardData() {
    try {
      const response = await apiClient.get<
        successResponseWithData<TeacherDashboardData>
      >(`teacher/dashboard`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching onboarding data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch onboarding data"
      );
    }
  }
  async getStudents() {
    try {
      const response = await apiClient.get<successResponseWithData<Student[]>>(
        `teacher/students`
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
export const teacherService = new TeacherService();
