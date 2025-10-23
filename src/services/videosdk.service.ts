import { apiClient } from "./axiosConfig";

interface MeetingResponse {
  success: boolean;
  message: string;
  data: {
    meetingId: string;
    token: string;
  };
}

interface GetMeetingResponse {
  success: boolean;
  message: string;
  data: {
    meetingId: string | null;
    token: string;
  };
}

class VideoSDKService {
  /**
   * Get or create a meeting for a specific class
   * If meeting doesn't exist, it will be created
   * @param classId - The ID of the class
   * @returns Meeting ID and VideoSDK token
   */
  async getOrCreateMeeting(classId: string): Promise<MeetingResponse> {
    try {
      const response = await apiClient.post<MeetingResponse>(
        `/meeting/get-or-create/${classId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error getting/creating meeting:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get or create meeting"
      );
    }
  }

  /**
   * Get meeting details for a class
   * @param classId - The ID of the class
   * @returns Meeting ID and VideoSDK token (meetingId will be null if not created yet)
   */
  async getMeeting(classId: string): Promise<GetMeetingResponse> {
    try {
      const response = await apiClient.get<GetMeetingResponse>(
        `/meeting/${classId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error getting meeting:", error);
      throw new Error(error.response?.data?.message || "Failed to get meeting");
    }
  }

  /**
   * Validate if a meeting is still active
   * @param meetingId - The VideoSDK meeting ID
   * @param token - The VideoSDK token
   * @returns Boolean indicating if meeting is valid
   */
  async validateMeeting(meetingId: string, token: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/meeting/validate`,
        { meetingId, token }
      );
      return response.data.success;
    } catch (error: any) {
      console.error("Error validating meeting:", error);
      return false;
    }
  }

  /**
   * End a meeting (called when last participant leaves)
   * @param classId - The ID of the class
   * @returns Success response
   */
  async endMeeting(classId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `/meeting/end/${classId}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error ending meeting:", error);
      throw new Error(error.response?.data?.message || "Failed to end meeting");
    }
  }
}

export const videoSDKService = new VideoSDKService();
