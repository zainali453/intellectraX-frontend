import { useEffect, useMemo, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface ParticipantViewProps {
  participantId: string;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({ participantId }) => {
  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const webcamMedia = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return undefined;
  }, [webcamOn, webcamStream]);

  useEffect(() => {
    if (!micRef.current) return;

    if (micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      micRef.current.srcObject = mediaStream;
      micRef.current
        .play()
        .catch((error) => console.error("mic playback failed", error));
    } else {
      micRef.current.srcObject = null;
    }
  }, [micOn, micStream]);

  return (
    <div className='relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50'>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamMedia ? (
        <MediaStreamVideo stream={webcamMedia} mirror />
      ) : (
        <div className='flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900'>
          <div className='text-center'>
            <div className='w-24 h-24 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl border-4 border-teal-500/30'>
              <span className='text-4xl text-white font-bold'>
                {displayName?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <p className='text-white text-base font-medium'>
              {displayName || "Participant"}
            </p>
            {isLocal && <span className='text-teal-400 text-sm'>(You)</span>}
          </div>
        </div>
      )}

      <div className='absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10'>
        <div className='flex items-center gap-2'>
          <div
            className={`w-2 h-2 rounded-full ${
              micOn ? "bg-green-500 animate-pulse" : "bg-gray-500"
            }`}
          ></div>
          <span className='text-white text-sm font-medium truncate max-w-[200px]'>
            {displayName || "Participant"}
            {isLocal && <span className='text-teal-400 ml-1'>(You)</span>}
          </span>
        </div>
        <div className='flex gap-2'>
          <div
            className={`p-1.5 rounded-lg ${
              micOn ? "bg-gray-700/50" : "bg-red-500/80"
            }`}
          >
            {micOn ? (
              <Mic className='w-3.5 h-3.5 text-white' />
            ) : (
              <MicOff className='w-3.5 h-3.5 text-white' />
            )}
          </div>
          <div
            className={`p-1.5 rounded-lg ${
              webcamOn ? "bg-gray-700/50" : "bg-red-500/80"
            }`}
          >
            {webcamOn ? (
              <Video className='w-3.5 h-3.5 text-white' />
            ) : (
              <VideoOff className='w-3.5 h-3.5 text-white' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaStreamVideo = ({
  stream,
  mirror = false,
  objectFit = "cover",
}: {
  stream: MediaStream;
  mirror?: boolean;
  objectFit?: "cover" | "contain";
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current
      .play()
      .catch((error) => console.error("video playback failed", error));
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className='w-full h-full'
      style={{
        objectFit,
        transform: mirror ? "scaleX(-1)" : "none",
      }}
    />
  );
};

export default ParticipantView;
