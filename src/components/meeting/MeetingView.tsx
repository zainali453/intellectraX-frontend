import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import ParticipantView from "./ParticipantView";
import MeetingControls from "./MeetingControls";
import { Clock, Users } from "lucide-react";

interface MeetingViewProps {
  onMeetingLeft: () => void;
  classSubject?: string;
  classDate?: string;
  classTime?: string;
  maxDuration?: number; // in minutes, default 60
  classId: string; // Required to end meeting on backend
}

const MeetingView: React.FC<MeetingViewProps> = ({
  onMeetingLeft,
  classSubject,
  classDate,
  classTime,
  maxDuration = 60,
  classId,
}) => {
  const [joined, setJoined] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { join, participants, leave, end } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      onMeetingLeft();
    },
    onParticipantLeft: () => {
      // Check if we're the last participant
      const remainingParticipants = [...participants.keys()].length;
      if (remainingParticipants == 0) {
        // We're the last one, end the meeting completely
        // end();
      }
    },
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    // Auto join when component mounts
    timeoutId = setTimeout(() => {
      if (joined !== "JOINED") {
        join();
      }
    }, 500);

    // Cleanup: leave meeting when component unmounts
    return () => {
      clearTimeout(timeoutId);
      if (joined === "JOINED") {
        leave();
      }
    };
  }, []);

  useEffect(() => {
    if (joined !== "JOINED") return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        // Auto leave if max duration reached
        if (newTime > maxDuration * 60) {
          onMeetingLeft();
          window.close();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [joined, maxDuration, onMeetingLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getRemainingTime = () => {
    const remaining = maxDuration * 60 - elapsedTime;
    return formatTime(remaining > 0 ? remaining : 0);
  };

  const participantIds = [...participants.keys()];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col'>
      {/* Modern Header with Glass Effect */}
      <div className='bg-gray-900/50 backdrop-blur-md border-b border-gray-700/50 shadow-xl'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Left: Class Info */}
            <div className='flex items-center gap-4'>
              <div className='bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-xl shadow-lg'>
                <svg
                  className='w-6 h-6 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <div>
                <h1 className='text-white text-xl font-bold tracking-tight'>
                  {classSubject || "Class Meeting"}
                </h1>
                {classDate && classTime && (
                  <p className='text-gray-400 text-sm flex items-center gap-2 mt-0.5'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    {classDate} • {classTime}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Stats */}
            <div className='flex items-center gap-6'>
              {/* Timer */}
              <div className='flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-700/50'>
                <Clock className='w-5 h-5 text-teal-400' />
                <div className='text-right'>
                  <div className='text-sm font-medium text-white'>
                    {joined === "JOINED" ? getRemainingTime() : "--:--"}
                  </div>
                  <div className='text-xs text-gray-400'>Time Left</div>
                </div>
              </div>

              {/* Participants */}
              <div className='flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-700/50'>
                <Users className='w-5 h-5 text-teal-400' />
                <div className='text-right'>
                  <div className='text-sm font-medium text-white'>
                    {participantIds.length}
                  </div>
                  <div className='text-xs text-gray-400'>
                    {participantIds.length === 1
                      ? "Participant"
                      : "Participants"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Content */}
      <div className='flex-1 p-6 overflow-hidden'>
        <div className='max-w-7xl mx-auto h-full'>
          {joined === "JOINED" ? (
            <div
              className={`grid gap-4 h-full ${
                participantIds.length === 1
                  ? "grid-cols-1"
                  : participantIds.length === 2
                  ? "grid-cols-2"
                  : participantIds.length <= 4
                  ? "grid-cols-2 grid-rows-2"
                  : "grid-cols-3"
              }`}
            >
              {participantIds.map((participantId) => (
                <ParticipantView
                  key={participantId}
                  participantId={participantId}
                />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center h-[85vh]'>
              <div className='text-center'>
                <div className='relative w-20 h-20 mx-auto mb-6'>
                  <div className='absolute inset-0 rounded-full border-4 border-teal-500/30'></div>
                  <div className='absolute inset-0 rounded-full border-4 border-t-teal-500 animate-spin'></div>
                </div>
                <h3 className='text-white text-xl font-semibold mb-2'>
                  Joining Meeting
                </h3>
                <p className='text-gray-400'>
                  Please wait while we connect you...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Controls Footer */}
      {joined === "JOINED" && (
        <div className='bg-gray-900/50 backdrop-blur-md border-t border-gray-700/50'>
          <div className='max-w-7xl mx-auto px-6 py-6'>
            <MeetingControls onLeave={onMeetingLeft} classId={classId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingView;
