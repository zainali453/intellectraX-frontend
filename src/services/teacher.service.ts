import { apiClient } from "./axiosConfig";

export const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};

export const formatDisplayTime = (value: string, format24: boolean = false) => {
  if (!value) return "";
  const [hour, minute] = value.split(":").map(Number);

  if (format24) {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  } else {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? "PM" : "AM";
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  }
};

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

export interface StudentForClass {
  fullName: string;
  studentId: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySession {
  date: Date | null;
  timeSlots: TimeSlot[];
  recursive: boolean;
}

export interface ClassData {
  subject: string;
  student: string;
  days: DaySession[];
  description: string;
}

export interface ClassDataForCards {
  classId: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  timeSlot: TimeSlot;
}

interface ClassDataForDetailsPage {
  classId: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  timeSlot: TimeSlot;
  description: string;
  recursive: boolean;
  schedulerId: string;
}

export interface StudentDetailsType {
  fullName: string;
  gender: string;
  subject: string;
  attendenceRate: string;
  averageScore: string;
  assignmentCompletion: string;
  missedClasses: number;
}

interface successResponseWithoutData {
  success: boolean;
  message: string;
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
      console.error("Error fetching students data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch students data"
      );
    }
  }

  async getStudentsForClass() {
    try {
      const response = await apiClient.get<
        successResponseWithData<StudentForClass[]>
      >(`teacher/students/for-class`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching students for class data:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch students for class data"
      );
    }
  }
  async getStudentCommonSubjects(studentId: string) {
    try {
      const response = await apiClient.get<successResponseWithData<string[]>>(
        `teacher/students/common-subjects/${studentId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching common subjects data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch common subjects data"
      );
    }
  }

  async createClass(classData: ClassData) {
    try {
      const response = await apiClient.post<successResponseWithoutData>(
        `teacher/classes`,
        classData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating class:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create class"
      );
    }
  }

  async getTeacherClasses() {
    try {
      const response = await apiClient.get<
        successResponseWithData<ClassDataForCards[]>
      >(`teacher/classes`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching classes data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch classes data"
      );
    }
  }

  async getClassDetails(classId: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<ClassDataForDetailsPage>
      >(`teacher/classes/${classId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching class details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch class details"
      );
    }
  }

  async getStudentDetails(studentId: string, subject: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<StudentDetailsType>
      >(`teacher/students/${studentId}?subject=${subject}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching student details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch student details"
      );
    }
  }
  async getSchedulerDetails(schedulerId: string) {
    try {
      const response = await apiClient.get<successResponseWithData<ClassData>>(
        `teacher/schedulers/${schedulerId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching scheduler details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch scheduler details"
      );
    }
  }

  async updateClass(schedulerId: string, classData: ClassData) {
    try {
      const response = await apiClient.put<successResponseWithoutData>(
        `teacher/schedulers/${schedulerId}`,
        classData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating class:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update class"
      );
    }
  }
  async deleteClass(schedulerId: string) {
    try {
      const response = await apiClient.delete<successResponseWithoutData>(
        `teacher/schedulers/${schedulerId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting class:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete class"
      );
    }
  }
}
export const teacherService = new TeacherService();
