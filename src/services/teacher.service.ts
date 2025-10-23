import { apiClient } from "./axiosConfig";

interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    fileUrl: string;
    fileKey: string;
    fileName?: string;
  };
}

export const formatDateWithTime = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    // I want to show the date in this format: 02:30 PM Jun 15, 2023
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};

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

export const getOriginalDateUTC = (date: string, time: string) => {
  const newDate = new Date(date).setHours(
    new Date(date).getHours() + parseInt(time.split(":")[0]),
    new Date(date).getMinutes() + parseInt(time.split(":")[1])
  );
  return new Date(newDate);
};

export const getOriginalTimeUTC = (date: Date) => {
  return `${date.getHours()}:${date.getMinutes()}`;
};

export const getTimeString = (date: Date | null): string => {
  if (!date) return "";
  if (typeof date === "string") date = new Date(date);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const calculateTimeLimit = (start: string, end: string) => {
  // I want to show the only the one hour if the value is 1 hour 0 m and 30 mint if the value is 0 hour 30 m
  if (!start || !end) return "";
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  let totalStartMinutes = startHours * 60 + startMinutes;
  let totalEndMinutes = endHours * 60 + endMinutes;
  if (totalEndMinutes < totalStartMinutes) {
    totalEndMinutes += 24 * 60; // handle next day case
  }
  const diffMinutes = totalEndMinutes - totalStartMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  let result = "";
  if (hours > 0) {
    result += `${hours} Hour${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    if (hours > 0) result += " ";
    result += `${minutes} Minute${minutes > 1 ? "s" : ""}`;
  }
  return result;
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

export interface AssignmentData {
  student: string;
  subject: string;
  title: string;
  dueDate: string;
  instructions: string;
  attachment: string;
}

export interface AssignmentDataForCards {
  assignmentId: string;
  studentName: string;
  subject: string;
  title: string;
  dueDate: string;
  createdAt: string;
  isCompleted: boolean;
  isSubmitted: boolean;
}
export interface QuizData {
  student: string;
  subject: string;
  title: string;
  dueDate: string;
  instructions: string;
  attachment: string;
  startTime: Date | null;
  endTime: Date | null;
}

export interface QuizDataForCards {
  quizId: string;
  studentName: string;
  subject: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  isSubmitted: boolean;
  startTime: string;
  endTime: string;
}

export interface ClassDataForCards {
  classId: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  timeSlot: TimeSlot;
  acceptedByStudent: boolean;
  rejectedByStudent: boolean;
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
  userId: string;
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
  async upload(formData: FormData): Promise<UploadResponse> {
    try {
      const response = await apiClient.post<UploadResponse>(
        `teacher/upload`,
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

  async createAssignment(assignmentData: AssignmentData) {
    try {
      const response = await apiClient.post<successResponseWithoutData>(
        `teacher/assignments`,
        assignmentData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating assignment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create assignment"
      );
    }
  }

  async updateAssignment(assignmentId: string, assignmentData: AssignmentData) {
    try {
      const response = await apiClient.put<successResponseWithoutData>(
        `teacher/assignments/${assignmentId}`,
        assignmentData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating assignment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update assignment"
      );
    }
  }

  async deleteAssignment(assignmentId: string) {
    try {
      const response = await apiClient.delete<successResponseWithoutData>(
        `teacher/assignments/${assignmentId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting assignment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete assignment"
      );
    }
  }

  async getAssignments(query: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<AssignmentDataForCards[]>
      >(`teacher/assignments?status=${query}`);
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
          studentName: string;
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
          isSubmitted: boolean;
        }>
      >(`teacher/assignments/${assignmentId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching assignment details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch assignment details"
      );
    }
  }

  async submitAssignmentGrade(
    assignmentId: string,
    { marks, teacherComments }: { marks: number; teacherComments: string }
  ) {
    try {
      const response = await apiClient.post<successResponseWithoutData>(
        `teacher/assignments/${assignmentId}/marking`,
        { marks, teacherComments }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error submitting assignment grade:", error);
      throw new Error(
        error.response?.data?.message || "Failed to submit assignment grade"
      );
    }
  }

  async createQuiz(quizData: QuizData) {
    try {
      const response = await apiClient.post<successResponseWithoutData>(
        `teacher/quizzes`,
        quizData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      throw new Error(error.response?.data?.message || "Failed to create quiz");
    }
  }

  async updateQuiz(quizId: string, quizData: QuizData) {
    try {
      const response = await apiClient.put<successResponseWithoutData>(
        `teacher/quizzes/${quizId}`,
        quizData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating quiz:", error);
      throw new Error(error.response?.data?.message || "Failed to update quiz");
    }
  }

  async deleteQuiz(quizId: string) {
    try {
      const response = await apiClient.delete<successResponseWithoutData>(
        `teacher/quizzes/${quizId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting quiz:", error);
      throw new Error(error.response?.data?.message || "Failed to delete quiz");
    }
  }

  async getQuizzes(query: string) {
    try {
      const response = await apiClient.get<
        successResponseWithData<QuizDataForCards[]>
      >(`teacher/quizzes?status=${query}`);
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
          studentName: string;
          subject: string;
          title: string;
          dueDate: string;
          instructions: string;
          isCompleted: boolean;
          attachment: string;
          isMarked: boolean;
          marks: number;
          grade: string;
          teacherComments: string;
          submissionDate: string;
          submissionAttachment: string;
          isSubmitted: boolean;
          startTime: string;
          endTime: string;
        }>
      >(`teacher/quizzes/${quizId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching quiz details:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch quiz details"
      );
    }
  }

  async submitQuizGrade(
    quizId: string,
    { marks, teacherComments }: { marks: number; teacherComments: string }
  ) {
    try {
      const response = await apiClient.post<successResponseWithoutData>(
        `teacher/quizzes/${quizId}/marking`,
        { marks, teacherComments }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error submitting quiz grade:", error);
      throw new Error(
        error.response?.data?.message || "Failed to submit quiz grade"
      );
    }
  }

  async getChats() {
    try {
      const response = await apiClient.get(`teacher/chats`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching chats data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch chats data"
      );
    }
  }

  async getStudentForChat(userId: string) {
    try {
      const response = await apiClient.get(`teacher/chats/student/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching student for chat data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch student for chat data"
      );
    }
  }
  async getMessages(userId: string) {
    try {
      const response = await apiClient.get(`teacher/chats/${userId}/messages`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching messages data:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch messages data"
      );
    }
  }
  async sendMessage(userId: string, message: string) {
    try {
      const response = await apiClient.post(
        `teacher/chats/${userId}/messages`,
        {
          message,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error sending message:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
}
export const teacherService = new TeacherService();
