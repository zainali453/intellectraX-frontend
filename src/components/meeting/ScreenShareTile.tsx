import { useEffect, useMemo, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import ScreenShareIcon from "./ScreenShareIcon";

interface ScreenShareTileProps {
  participantId: string;
}

const ScreenShareTile: React.FC<ScreenShareTileProps> = ({ participantId }) => {
  const { screenShareStream, screenShareOn, displayName, isLocal } =
    useParticipant(participantId);

  const shareMedia = useMemo(() => {
    if (screenShareOn && screenShareStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(screenShareStream.track);
      return mediaStream;
    }
    return undefined;
  }, [screenShareOn, screenShareStream]);

  if (!shareMedia) return null;

  return (
    <div className='relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/60 min-h-[320px]'>
      <ScreenShareVideo stream={shareMedia} />
      <div className='absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 text-sm text-white border border-white/10'>
        <ScreenShareIcon className='w-4 h-4 text-teal-300' strokeWidth={1.5} />
        <span className='font-medium tracking-wide'>
          {isLocal
            ? "You're presenting"
            : `${displayName || "Participant"} is presenting`}
        </span>
      </div>
    </div>
  );
};

const ScreenShareVideo = ({ stream }: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current
      .play()
      .catch((error) => console.error("screen share playback failed", error));
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className='w-full h-full'
      style={{ objectFit: "contain" }}
    />
  );
};

export default ScreenShareTile;
