import { useMeeting } from "@videosdk.live/react-sdk";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { videoSDKService } from "@/services/videosdk.service";
import ScreenShareIcon from "./ScreenShareIcon";

interface MeetingControlsProps {
  onLeave: () => void;
  classId: string;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({
  onLeave,
  classId,
}) => {
  const {
    toggleMic,
    toggleWebcam,
    leave,
    end,
    participants,
    toggleScreenShare,
    localScreenShareOn,
    presenterId,
    localParticipant,
  } = useMeeting();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isScreenShareBusy, setIsScreenShareBusy] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isMicLoading, setIsMicLoading] = useState(false);
  const [isWebcamLoading, setIsWebcamLoading] = useState(false);

  useEffect(() => {
    if (!shareMessage) return;

    const timeout = setTimeout(() => setShareMessage(null), 4000);
    return () => clearTimeout(timeout);
  }, [shareMessage]);

  useEffect(() => {
    if (localScreenShareOn) {
      setShareMessage(null);
    }
  }, [localScreenShareOn]);

  const presenterIsSomeoneElse =
    presenterId !== undefined &&
    presenterId !== null &&
    presenterId !== localParticipant?.id;

  const screenShareDisabled =
    isScreenShareBusy || (!localScreenShareOn && presenterIsSomeoneElse);

  const isMicOn = localParticipant?.micOn ?? true;
  const isWebcamOn = localParticipant?.webcamOn ?? true;

  const handleToggleMic = () => {
    setIsMicLoading(true);
    toggleMic();
  };

  const handleToggleWebcam = () => {
    setIsWebcamLoading(true);
    toggleWebcam();
  };

  useEffect(() => {
    setIsMicLoading(false);
  }, [isMicOn]);

  useEffect(() => {
    setIsWebcamLoading(false);
  }, [isWebcamOn]);

  const handleToggleScreenShare = async () => {
    if (!localScreenShareOn && presenterIsSomeoneElse) {
      setShareMessage("Another participant is already sharing their screen.");
      return;
    }

    if (isScreenShareBusy) return;

    try {
      setIsScreenShareBusy(true);
      await Promise.resolve(toggleScreenShare());
    } catch (error) {
      console.error("Error toggling screen share:", error);
      setShareMessage("Unable to toggle screen share. Please try again.");
    } finally {
      setIsScreenShareBusy(false);
    }
  };

  const handleLeave = async () => {
    if (isLeaving) return;

    setIsLeaving(true);

    try {
      // Turn off mic and camera before leaving
      if (isMicOn) toggleMic();
      if (isWebcamOn) toggleWebcam();

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
    <div className='flex flex-col items-center gap-3'>
      <div className='flex items-center justify-center gap-3 flex-wrap'>
        {/* Microphone Toggle */}
        <div className='flex flex-col items-center gap-2'>
          <button
            onClick={handleToggleMic}
            className={`p-5 rounded-2xl transition-all transform hover:scale-105 shadow-lg ${
              isMicOn
                ? "bg-gray-700/80 hover:bg-gray-600 border border-gray-600"
                : "bg-red-600 hover:bg-red-700 border border-red-500"
            }`}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
            disabled={isMicLoading}
          >
            {isMicLoading ? (
              <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            ) : isMicOn ? (
              <Mic className='w-6 h-6 text-white' />
            ) : (
              <MicOff className='w-6 h-6 text-white' />
            )}
          </button>
          <span className='text-xs text-gray-400 font-medium'>
            {isMicOn ? "Mute" : "Unmute"}
          </span>
        </div>

        {/* Camera Toggle */}
        <div className='flex flex-col items-center gap-2'>
          <button
            onClick={handleToggleWebcam}
            className={`p-5 rounded-2xl transition-all transform hover:scale-105 shadow-lg ${
              isWebcamOn
                ? "bg-gray-700/80 hover:bg-gray-600 border border-gray-600"
                : "bg-red-600 hover:bg-red-700 border border-red-500"
            }`}
            title={isWebcamOn ? "Turn Off Camera" : "Turn On Camera"}
            disabled={isWebcamLoading}
          >
            {isWebcamLoading ? (
              <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            ) : isWebcamOn ? (
              <Video className='w-6 h-6 text-white' />
            ) : (
              <VideoOff className='w-6 h-6 text-white' />
            )}
          </button>
          <span className='text-xs text-gray-400 font-medium'>
            {isWebcamOn ? "Stop Video" : "Start Video"}
          </span>
        </div>

        {/* Screen Share Toggle */}
        <div className='flex flex-col items-center gap-2'>
          <button
            onClick={handleToggleScreenShare}
            disabled={screenShareDisabled}
            className={`p-5 rounded-2xl transition-all transform hover:scale-105 shadow-lg border ${
              localScreenShareOn
                ? "bg-teal-600/90 hover:bg-teal-600 border-teal-400"
                : "bg-gray-700/80 hover:bg-gray-600 border-gray-600"
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            title={
              localScreenShareOn
                ? "Stop sharing your screen"
                : presenterIsSomeoneElse
                ? "Screen sharing is already in progress"
                : "Share your screen"
            }
          >
            {isScreenShareBusy ? (
              <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            ) : (
              <ScreenShareIcon className='w-6 h-6 text-white' />
            )}
          </button>
          <span className='text-xs text-gray-400 font-medium'>
            {localScreenShareOn ? "Stop Share" : "Share Screen"}
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

      {shareMessage && (
        <p className='text-xs text-gray-300 text-center max-w-sm px-4'>
          {shareMessage}
        </p>
      )}
    </div>
  );
};

export default MeetingControls;
