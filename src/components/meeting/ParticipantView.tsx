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

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div className='relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50'>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn ? (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          height={"100%"}
          width={"100%"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
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

      {/* Participant info overlay with glass effect */}
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

function ReactPlayer({
  playsinline,
  pip,
  light,
  controls,
  muted,
  playing,
  url,
  height,
  width,
  onError,
}: {
  playsinline: boolean;
  pip: boolean;
  light: boolean;
  controls: boolean;
  muted: boolean;
  playing: boolean;
  url: MediaStream | undefined;
  height: string;
  width: string;
  onError: (err: any) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && url) {
      videoRef.current.srcObject = url;
      if (playing) {
        videoRef.current.play().catch(onError);
      }
    }
  }, [url, playing]);

  return (
    <video
      ref={videoRef}
      autoPlay={playing}
      playsInline={playsinline}
      muted={muted}
      controls={controls}
      style={{
        height,
        width,
        objectFit: "cover",
        transform: "scaleX(-1)",
      }}
    />
  );
}

export default ParticipantView;
