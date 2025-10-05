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
}

export interface TeacherDetails {
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
  acceptedByStudent: boolean;
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

interface successResponseWithData<T> {
  success: boolean;
  message: string;
  data: T;
}

interface successResponseWithoutData {
  success: boolean;
  message: string;
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
  async getStudentClasses() {
    try {
      const response = await apiClient.get<
        successResponseWithData<{
          classes: ClassDataForCards[];
          classRequests: number;
        }>
      >(`student/classes`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching classes data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch classes data"
      );
    }
  }
  async getStudentClassDetails(classId: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<ClassDataForDetailsPage>
      >(`student/classes/${classId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching class details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch class details"
      );
    }
  }
  async getStudentClassRequests() {
    try {
      const response = await apiClient.get<
        successResponseWithData<ClassDataForCards[]>
      >(`student/classrequests`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching classes data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch classes data"
      );
    }
  }
  async setStudentClassAcceptance(classId: string, accepted: boolean) {
    try {
      const response = await apiClient.post<successResponseWithoutData>(
        `student/classrequests/${classId}`,
        { accepted }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching classes data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch classes data"
      );
    }
  }

  async getAssignments() {
    try {
      const response = await apiClient.get<
        successResponseWithData<AssignmentDataForCards[]>
      >(`student/assignments`);
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
      >(`student/assignments/${assignmentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching assignment details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch assignment details"
      );
    }
  }

  async assignmentSubmission(
    formData: FormData,
    assignmentId: string
  ): Promise<UploadResponse> {
    try {
      const response = await apiClient.post<UploadResponse>(
        `student/assignments/${assignmentId}/submit`,
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

  async getQuizzes() {
    try {
      const response = await apiClient.get<
        successResponseWithData<QuizDataForCards[]>
      >(`student/quizzes`);
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
      >(`student/quizzes/${quizId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching quiz details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch quiz details"
      );
    }
  }

  async quizSubmission(
    formData: FormData,
    quizId: string
  ): Promise<UploadResponse> {
    try {
      const response = await apiClient.post<UploadResponse>(
        `student/quizzes/${quizId}/submit`,
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
}
export const studentService = new StudentService();
