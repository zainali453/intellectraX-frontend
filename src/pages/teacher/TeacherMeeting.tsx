import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import MeetingView from "@/components/meeting/MeetingView";
import { videoSDKService } from "@/services/videosdk.service";
import {
  formatDate,
  formatDisplayTime,
  getOriginalDateUTC,
  getOriginalTimeUTC,
  teacherService,
} from "@/services/teacher.service";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useUser } from "@/context/UserContext";

const TeacherMeeting = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { user } = useUser();
  const [classDetails, setClassDetails] = useState<{
    subject: string;
    date: string;
    time: string;
    maxDuration: number;
  } | null>(null);

  useEffect(() => {
    const initializeMeeting = async () => {
      if (!classId) {
        setError("Class ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get class details
        const classResponse = await teacherService.getClassDetails(classId);
        if (classResponse && classResponse.data) {
          const classData = classResponse.data;
          const utcStartTime = getOriginalDateUTC(
            classData.date,
            classData.timeSlot.startTime
          );
          const utcEndTime = getOriginalDateUTC(
            classData.date,
            classData.timeSlot.endTime
          );

          setClassDetails({
            subject: classData.subject.replace(/^\w/, (c) => c.toUpperCase()),
            date: formatDate(utcStartTime),
            time: `${formatDisplayTime(
              getOriginalTimeUTC(utcStartTime)
            )} - ${formatDisplayTime(getOriginalTimeUTC(utcEndTime))}`,
            maxDuration:
              Math.floor(
                (utcEndTime.getTime() - new Date().getTime()) / 60000
              ) + 1,
          });
        }

        // Get or create meeting
        const response = await videoSDKService.getOrCreateMeeting(classId);
        if (response.success && response.data) {
          setMeetingId(response.data.meetingId);
          setToken(response.data.token);
        } else {
          setError("Failed to initialize meeting");
        }
      } catch (err: any) {
        console.error("Error initializing meeting:", err);
        setError(err.message || "Failed to initialize meeting");
      } finally {
        setLoading(false);
      }
    };

    initializeMeeting();
  }, [classId]);

  const handleMeetingLeft = () => {
    window.close();
    navigate("/teacher/classes");
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900'>
        <div className='text-center'>
          <LoadingSpinner size='lg' />
          <p className='text-white mt-4'>Initializing meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900'>
        <div className='text-center'>
          <p className='text-red-500 text-lg mb-4'>{error}</p>
          <button
            onClick={() => navigate("/teacher/classes")}
            className='px-6 py-2 bg-bgprimary text-white rounded-full hover:bg-teal-600'
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  if (!meetingId || !token) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900'>
        <div className='text-center'>
          <p className='text-white text-lg mb-4'>Unable to join meeting</p>
          <button
            onClick={() => navigate("/teacher/classes")}
            className='px-6 py-2 bg-bgprimary text-white rounded-full hover:bg-teal-600'
          >
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <MeetingProvider
      key={meetingId}
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: user?.fullName || "Teacher",
        debugMode: false,
      }}
      token={token}
    >
      <MeetingView
        onMeetingLeft={handleMeetingLeft}
        classSubject={classDetails?.subject}
        classDate={classDetails?.date}
        classTime={classDetails?.time}
        maxDuration={classDetails?.maxDuration}
        classId={classId!}
      />
    </MeetingProvider>
  );
};

export default TeacherMeeting;
