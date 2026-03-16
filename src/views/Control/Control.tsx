import { useState } from "react";
import { Compass, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socket } from "@/services/socketService";
import { useDroneVideoStream } from "./hooks/useDroneVideoSteam";
import { useDualJoystick } from "./hooks/useDualJoystick";
import { useDroneTelemetry } from "./hooks/useDroneTelemetry";
import { useDroneInputControllers } from "./hooks/useDroneInputControllers";

import { ControlsModal } from "./components/ControlsModal";
import { FlightControlsCard } from "./components/FlightControlsCard";
import { VideoPanel } from "./components/VideoPanel";


export default function Control() {
  const [recording, setRecording] = useState(false);

  const { videoRef, videoSrc, isVideoLoaded } = useDroneVideoStream();
  const { leftJoystickRef, rightJoystickRef, leftJoystick, rightJoystick } = useDualJoystick();

  const { isConnected: gamepadConnected, gamepadId } = useDroneInputControllers();

  const { altitude, speed, zoom, setZoom, altitudeProgress, rotationProgress, velocityProgress, directionProgress } 
  = useDroneTelemetry({
    leftJoystick,
    rightJoystick,
  });

  const handleToggleRecording = () => {
    setRecording((currentValue) => !currentValue);
  };

  const handleTakeoff = () => {
    socket.emit("takeoff");
  };

  const handleLand = () => {
    socket.emit("land");
  };

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-2xl font-bold text-foreground">Vuelo en tiempo real</h3>

          <div className="flex gap-3">
             <ControlsModal
              gamepadConnected={gamepadConnected}
              gamepadId={gamepadId}
            />
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-bold gap-2 rounded-lg">
              <Compass size={16} />
              Calibrar
            </Button>

            <Button variant="destructive" className="bg-destructive text-white font-bold gap-2 rounded-lg">
              <AlertOctagon size={16} />
              Parada de Emergencia
            </Button>
          </div>
        </div>

        <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 min-h-0">
            <VideoPanel
              videoRef={videoRef}
              videoSrc={videoSrc}
              isVideoLoaded={isVideoLoaded}
              recording={recording}
              zoom={zoom}
              onToggleRecording={handleToggleRecording}
              onZoomChange={setZoom}
            />
          </div>
          <div className="min-h-0">
            <FlightControlsCard
              leftJoystickRef={leftJoystickRef}
              rightJoystickRef={rightJoystickRef}
              leftJoystick={leftJoystick}
              rightJoystick={rightJoystick}
              altitude={altitude}
              speed={speed}
              altitudeProgress={altitudeProgress}
              rotationProgress={rotationProgress}
              velocityProgress={velocityProgress}
              directionProgress={directionProgress}
              onTakeoff={handleTakeoff}
              onLand={handleLand}
            />
          </div>
        </div>
      </div>
    </div>
  );
}