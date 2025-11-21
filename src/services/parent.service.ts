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
  studentName: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface ClassDataForCards {
  classId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  timeSlot: TimeSlot;
  studentName: string;
}

export interface TeacherDetails {
  userId: string;
  profilePic: string;
  fullName: string;
  bio: string;
  subjects: string[];
}

interface ClassDataForDetailsPage {
  classId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  timeSlot: TimeSlot;
  description: string;
  studentName: string;
}

export interface AssignmentDataForCards {
  assignmentId: string;
  teacherName: string;
  subject: string;
  title: string;
  dueDate: string;
  createdAt: string;
  isCompleted: boolean;
  isSubmitted: boolean;
  studentName: string;
}

export interface QuizDataForCards {
  quizId: string;
  teacherName: string;
  subject: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  isSubmitted: boolean;
  startTime: string;
  endTime: string;
  studentName: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileUrl: string;
    fileKey: string;
    fileName?: string;
  };
}

interface UpcomingClass {
  subject: string;
  time: string;
  date: string;
}

interface ImportantInfo {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface ChildDashboardCard {
  childName: string;
  grade: string;
  profilePic?: string;
  academicProgress: number; // 0-100
  upcomingClasses: UpcomingClass[];
}

interface successResponseWithData<T> {
  success: boolean;
  message: string;
  data: T;
}

interface successResponseWithoutData {
  success: boolean;
  message: string;
}
// Parent Service Class
class ParentService {
  async getParentDashboard() {
    try {
      const response = await apiClient.get<
        successResponseWithData<ChildDashboardCard[]>
      >(`parent/dashboard`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching classes data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch classes data"
      );
    }
  }
  async getParentStudentClasses() {
    try {
      const response = await apiClient.get<
        successResponseWithData<ClassDataForCards[]>
      >(`parent/classes`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching classes data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch classes data"
      );
    }
  }
  async getParentStudentClassDetails(classId: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<ClassDataForDetailsPage>
      >(`parent/classes/${classId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching class details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch class details"
      );
    }
  }
  async getTeachers() {
    try {
      const response = await apiClient.get<successResponseWithData<Teacher[]>>(
        `parent/teachers`
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
      >(`parent/teachers/${teacherId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching teacher details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch teacher details"
      );
    }
  }

  async getAssignments(query: "pending" | "completed") {
    try {
      const response = await apiClient.get<
        successResponseWithData<AssignmentDataForCards[]>
      >(`parent/assignments?status=${query}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching assignments data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch assignments data"
      );
    }
  }

  async getAssignmentDetails(assignmentId: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<{
          assignmentId: string;
          teacherName: string;
          subject: string;
          title: string;
          dueDate: string;
          createdAt: string;
          instructions: string;
          isCompleted: boolean;
          attachment: string;
          isMarked: boolean;
          marks: number;
          grade: string;
          teacherComments: string;
          submissionDate: string;
          submissionAttachment: string;
          studentName: string;
          isSubmitted: boolean;
        }>
      >(`parent/assignments/${assignmentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching assignment details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch assignment details"
      );
    }
  }

  async getQuizzes(query: "pending" | "completed") {
    try {
      const response = await apiClient.get<
        successResponseWithData<QuizDataForCards[]>
      >(`parent/quizzes?status=${query}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching quizzes data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch quizzes data"
      );
    }
  }

  async getQuizDetails(quizId: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<{
          quizId: string;
          teacherName: string;
          subject: string;
          title: string;
          dueDate: string;
          startTime: string;
          endTime: string;
          instructions: string;
          isCompleted: boolean;
          attachment: string;
          isMarked: boolean;
          marks: number;
          grade: string;
          teacherComments: string;
          submissionDate: string;
          submissionAttachment: string;
          studentName: string;
          isSubmitted: boolean;
        }>
      >(`parent/quizzes/${quizId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching quiz details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch quiz details"
      );
    }
  }
}
export const parentService = new ParentService();
