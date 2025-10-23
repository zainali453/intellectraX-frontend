import { useMeeting } from "@videosdk.live/react-sdk";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useState } from "react";
import { videoSDKService } from "@/services/videosdk.service";

interface MeetingControlsProps {
  onLeave: () => void;
  classId: string;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({
  onLeave,
  classId,
}) => {
  const { toggleMic, toggleWebcam, leave, end, participants } = useMeeting();
  const [micOn, setMicOn] = useState(true);
  const [webcamOn, setWebcamOn] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleToggleMic = () => {
    toggleMic();
    setMicOn((prev) => !prev);
  };

  const handleToggleWebcam = () => {
    toggleWebcam();
    setWebcamOn((prev) => !prev);
  };

  const handleLeave = async () => {
    if (isLeaving) return;

    setIsLeaving(true);

    try {
      // Turn off mic and camera before leaving
      if (micOn) toggleMic();
      if (webcamOn) toggleWebcam();

      // Small delay to ensure media streams are stopped
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Check if we're the last participant
      const participantCount = [...participants.keys()].length;

      if (participantCount <= 1) {
        // Last participant - end the meeting completely
        end();

        // Notify backend to end meeting and stop billing
        try {
          await videoSDKService.endMeeting(classId);
        } catch (error) {
          console.error("Error ending meeting on backend:", error);
          // Continue anyway - meeting is ended on VideoSDK
        }
      } else {
        // Other participants still in meeting - just leave
        leave();
      }

      // Call the parent onLeave callback
      onLeave();
    } catch (error) {
      console.error("Error leaving meeting:", error);
      // Still navigate away even if there's an error
      onLeave();
    }
  };

  return (
    <div className='flex items-center justify-center gap-3'>
      {/* Microphone Toggle */}
      <div className='flex flex-col items-center gap-2'>
        <button
          onClick={handleToggleMic}
          className={`p-5 rounded-2xl transition-all transform hover:scale-105 shadow-lg ${
            micOn
              ? "bg-gray-700/80 hover:bg-gray-600 border border-gray-600"
              : "bg-red-600 hover:bg-red-700 border border-red-500"
          }`}
          title={micOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {micOn ? (
            <Mic className='w-6 h-6 text-white' />
          ) : (
            <MicOff className='w-6 h-6 text-white' />
          )}
        </button>
        <span className='text-xs text-gray-400 font-medium'>
          {micOn ? "Mute" : "Unmute"}
        </span>
      </div>

      {/* Camera Toggle */}
      <div className='flex flex-col items-center gap-2'>
        <button
          onClick={handleToggleWebcam}
          className={`p-5 rounded-2xl transition-all transform hover:scale-105 shadow-lg ${
            webcamOn
              ? "bg-gray-700/80 hover:bg-gray-600 border border-gray-600"
              : "bg-red-600 hover:bg-red-700 border border-red-500"
          }`}
          title={webcamOn ? "Turn Off Camera" : "Turn On Camera"}
        >
          {webcamOn ? (
            <Video className='w-6 h-6 text-white' />
          ) : (
            <VideoOff className='w-6 h-6 text-white' />
          )}
        </button>
        <span className='text-xs text-gray-400 font-medium'>
          {webcamOn ? "Stop Video" : "Start Video"}
        </span>
      </div>

      {/* Divider */}
      <div className='h-12 w-px bg-gray-700 mx-2'></div>

      {/* Leave Meeting */}
      <div className='flex flex-col items-center gap-2'>
        <button
          onClick={handleLeave}
          disabled={isLeaving}
          className='p-5 rounded-2xl bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg border border-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
          title='Leave Meeting'
        >
          {isLeaving ? (
            <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
          ) : (
            <PhoneOff className='w-6 h-6 text-white' />
          )}
        </button>
        <span className='text-xs text-red-400 font-medium'>
          {isLeaving ? "Leaving..." : "Leave"}
        </span>
      </div>
    </div>
  );
};

export default MeetingControls;
