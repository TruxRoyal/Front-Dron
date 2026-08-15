import { socket } from "./socketService";
/*
socket.on("video_frame", ({ image }) => {
  const updateVideo = () => {
    const video = document.getElementById("drone-video") as HTMLImageElement | null;
    if (video) {
      video.src = "data:image/jpeg;base64," + image;
    } else {
      console.warn("⚠️ #drone-video no está listo aún");
    }
  };

  if (document.readyState === "complete") {
    updateVideo();
  } else {
    window.addEventListener("DOMContentLoaded", updateVideo);
  }
});
*/

socket.on("video_stopped", () => {
  const video = document.getElementById("drone-video") as HTMLImageElement | null;
  if (video) {
    video.src = "";
  }
});


console.log("📡 imageService loaded");

export function startVideoStream() {
  socket.emit("start_video");
}

export function stopVideoStream() {
  socket.emit("stop_video");
}
