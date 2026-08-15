import { useState, useEffect, useRef } from "react";
import { Compass, AlertOctagon, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socket } from "@/services/socketService";
import { useDroneVideoStream } from "./hooks/useDroneVideoSteam";
import { useDualJoystick } from "./hooks/useDualJoystick";
import { useDroneTelemetry } from "./hooks/useDroneTelemetry";
import { useDroneInputControllers } from "./hooks/useDroneInputControllers";

import { ControlsModal } from "./components/ControlsModal";
import { FlightControlsCard } from "./components/FlightControlsCard";
import { VideoPanel } from "./components/VideoPanel";

type CalibrateResponse = {
  action: string;
  success: boolean;
  message: string;
  warnings?: string[];
  report?: {
    battery?: number;
    attitude?: { pitch: number; roll: number; yaw: number } | null;
    wifi_snr?: string | null;
  };
};

export default function Control() {
  const [recording, setRecording] = useState(false);
  const [droneConnected, setDroneConnected] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [calibrateResult, setCalibrateResult] = useState<CalibrateResponse | null>(null);
  const calibrateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onStatus = (data: { drone_connected: boolean }) => setDroneConnected(data.drone_connected);
    socket.on("drone_status", onStatus);
    return () => { socket.off("drone_status", onStatus); };
  }, []);

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

  const handleCalibrate = () => {
    setCalibrating(true);
    setCalibrateResult(null);
    socket.emit("calibrate");

    const onResponse = (data: CalibrateResponse) => {
      if (data.action !== "calibrate") return;
      if (calibrateTimeoutRef.current) clearTimeout(calibrateTimeoutRef.current);
      socket.off("drone_response", onResponse);
      setCalibrateResult(data);
      setCalibrating(false);
    };

    socket.on("drone_response", onResponse);

    calibrateTimeoutRef.current = setTimeout(() => {
      socket.off("drone_response", onResponse);
      setCalibrating(false);
    }, 15000);
  };

  const r = calibrateResult?.report;

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-2xl font-bold text-foreground">Vuelo en tiempo real</h3>

          <div className="flex gap-3 items-start">
            <ControlsModal
              gamepadConnected={gamepadConnected}
              gamepadId={gamepadId}
            />

            <div className="flex flex-col items-end gap-1.5">
              <Button
                variant="outline"
                disabled={calibrating || !droneConnected}
                onClick={handleCalibrate}
                className="border-primary text-primary hover:bg-primary/5 font-bold gap-2 rounded-lg"
              >
                {calibrating ? <Loader2 size={16} className="animate-spin" /> : <Compass size={16} />}
                {calibrating ? "Calibrando..." : "Calibrar"}
              </Button>

              {calibrateResult && (
                <div className="bg-popover border border-border rounded-lg p-3 text-[10px] space-y-1.5 min-w-[220px] shadow-lg">
                  <div className="flex items-center gap-1.5 font-black uppercase tracking-widest">
                    {calibrateResult.success
                      ? <CheckCircle2 size={12} className="text-green-500" />
                      : <XCircle size={12} className="text-destructive" />}
                    <span className={calibrateResult.success ? "text-green-600" : "text-destructive"}>
                      {calibrateResult.success ? "Calibración OK" : "Problemas detectados"}
                    </span>
                  </div>

                  {r && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground font-bold">
                      {r.battery !== undefined && (
                        <>
                          <span>Batería</span>
                          <span className={r.battery < 15 ? "text-destructive" : "text-foreground"}>{r.battery}%</span>
                        </>
                      )}
                      {r.attitude && (
                        <>
                          <span>Pitch / Roll</span>
                          <span className={Math.abs(r.attitude.pitch) > 5 || Math.abs(r.attitude.roll) > 5 ? "text-amber-500" : "text-foreground"}>
                            {r.attitude.pitch}° / {r.attitude.roll}°
                          </span>
                        </>
                      )}

                      {r.wifi_snr && (
                        <>
                          <span>WiFi SNR</span>
                          <span className="text-foreground">{r.wifi_snr}</span>
                        </>
                      )}
                    </div>
                  )}

                  {calibrateResult.warnings && calibrateResult.warnings.length > 0 && (
                    <div className="space-y-0.5 pt-1 border-t border-border">
                      {calibrateResult.warnings.map((w) => (
                        <div key={w} className="flex items-start gap-1 text-amber-600 font-bold">
                          <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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
