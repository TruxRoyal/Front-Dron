import { useEffect, useRef, useState } from "react";
import { startVideoStream } from "@/services/imageService";
import { socket } from "@/services/socketService";

type VideoFramePayload = {
  image: string;
};

export function useDroneVideoStream() {
  const videoRef = useRef<HTMLImageElement>(null);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    startVideoStream();

    const handleVideoFrame = ({ image }: VideoFramePayload) => {
      setVideoSrc(`data:image/jpeg;base64,${image}`);
      setIsVideoLoaded(true);
    };

    const handleVideoStopped = () => {
      setVideoSrc(null);
      setIsVideoLoaded(false);
    };

    socket.on("video_frame", handleVideoFrame);
    socket.on("video_stopped", handleVideoStopped);

    return () => {
      socket.off("video_frame", handleVideoFrame);
      socket.off("video_stopped", handleVideoStopped);
    };
  }, []);

  return {
    videoRef,
    videoSrc,
    isVideoLoaded,
  };
}