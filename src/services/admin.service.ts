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
  finalizedClasses: {
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

export interface StudentDetailsData {
  fullName: string;
  gender: string;
  subjects: string[];
  assignedTeachers: {
    fullName: string;
    profilePic: string;
    subjects: string[];
  }[];
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
    updatedBy: "admin" | "teacher" | "none";
  };
}

interface VerificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface AssignmentData {
  _id: string;
  title: string;
  subject: string;
  teacherName: string;
  studentName: string;
  dueDate: string;
  isCompleted: boolean;
  isSubmitted: boolean;
  createdAt: string;
}
export interface QuizDataForCards {
  _id: string;
  teacherName: string;
  studentName: string;
  subject: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  isSubmitted: boolean;
  startTime: string;
  endTime: string;
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
  async getTeacherAndStudentsForPairing() {
    try {
      const response = await apiClient.get<{
        data: {
          teachers: {
            id: string;
            email: string;
            fullName: string;
            profilePic: string;
            customId: string;
          }[];
          students: {
            id: string;
            email: string;
            fullName: string;
            level: string;
            customId: string;
          }[];
        };
      }>(`admin/pairing/teacherandstudentsforpairing`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching students:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch students"
      );
    }
  }

  async getSubjectsByTeacherAndStudent(teacherId: string, studentId: string) {
    try {
      const response = await apiClient.get(
        `admin/pairing/subjects/${teacherId}/${studentId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching subjects:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch subjects"
      );
    }
  }

  async assignTeacherToStudent(
    teacherId: string,
    studentId: string,
    subjects: string[]
  ) {
    try {
      const response = await apiClient.post(`admin/pairing`, {
        teacherId,
        studentId,
        subjects,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error assigning teacher to student:", error);
      throw new Error(
        error.response?.data?.message || "Failed to assign teacher to student"
      );
    }
  }
  async getAllTeachers(currentPage: number) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {}[];
        meta: { pagination: { totalPages: number } };
      }>(`admin/teachers/all?page=${currentPage}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching teachers:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch teachers"
      );
    }
  }

  async getAllStudents(currentPage: number) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {}[];
        meta: { pagination: { totalPages: number } };
      }>(`admin/students/all?page=${currentPage}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching students:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch students"
      );
    }
  }
  async getStudentById(studentId: string) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: StudentDetailsData;
      }>(`admin/students/${studentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching student:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch student"
      );
    }
  }
  async getAllClasses(currentPage: number) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {}[];
        meta: { pagination: { totalPages: number } };
      }>(`admin/classes?page=${currentPage}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching classes:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch classes"
      );
    }
  }
  async getClassById(classId: string) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          _id: string;
          teacherName: string;
          subject: string;
          date: string;
          timeSlot: { startTime: string; endTime: string };
          description: string;
          acceptedByStudent: boolean | null;
          studentName: string;
          mobileNumber: string;
        };
      }>(`admin/classes/${classId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching class:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch class");
    }
  }

  async getAssignments() {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: AssignmentData[];
      }>("admin/assignments");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching assignments:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch assignments"
      );
    }
  }

  async getAssignmentById(assignmentId: string) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          _id: string;
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
        };
      }>(`admin/assignments/${assignmentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching assignment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch assignment"
      );
    }
  }

  async getQuizzes() {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: QuizDataForCards[];
      }>("admin/quizzes");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching quizzes:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch quizzes"
      );
    }
  }
  async getQuizById(quizId: string) {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          _id: string;
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
        };
      }>(`admin/quizzes/${quizId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching quiz:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch quiz");
    }
  }
}
export const adminService = new AdminService();
