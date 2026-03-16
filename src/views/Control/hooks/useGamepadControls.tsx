import { useEffect, useRef, useState } from "react";
import { socket } from "@/services/socketService";
import { RC_SCALE, RC_THRESHOLD } from "../config/controlMappings";

type GamepadControllerState = {
  isConnected: boolean;
  gamepadId: string | null;
};

const emitRcControlIfSignificant = (
  x: number,
  y: number,
  z: number,
  yaw: number,
  threshold: number,
) => {
  if (
    Math.abs(x) > threshold ||
    Math.abs(y) > threshold ||
    Math.abs(z) > threshold ||
    Math.abs(yaw) > threshold
  ) {
    socket.emit("rc_control", { x, y, z, yaw });
    return;
  }

  socket.emit("rc_control", { x: 0, y: 0, z: 0, yaw: 0 });
};

export function useGamepadControls() {
  const [gamepadState, setGamepadState] = useState<GamepadControllerState>({
    isConnected: false,
    gamepadId: null,
  });

  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const takeoffTriggeredRef = useRef(false);
  const photoTriggeredRef = useRef(false);
  const landTriggeredRef = useRef(false);
  const recordingTriggeredRef = useRef(false);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      socket.emit("rc_control", { x: 0, y: 0, z: 0, yaw: 0 });
    };

    const startPolling = () => {
      if (pollingIntervalRef.current) {
        return;
      }

      pollingIntervalRef.current = setInterval(() => {
        const gamepad = Array.from(navigator.getGamepads()).find(Boolean);
        if (!gamepad) {
          return;
        }

        const x = Math.round(gamepad.axes[0] * RC_SCALE);
        const y = Math.round(-gamepad.axes[1] * RC_SCALE);
        const z = Math.round(-gamepad.axes[3] * RC_SCALE);
        const yaw = Math.round(gamepad.axes[2] * RC_SCALE);

        emitRcControlIfSignificant(x, y, z, yaw, RC_THRESHOLD);

        const lt = gamepad.buttons[6]?.value || 0;
        const rt = gamepad.buttons[7]?.value || 0;

        if (lt > 0.8 && rt > 0.8 && !takeoffTriggeredRef.current) {
          socket.emit("takeoff");
          takeoffTriggeredRef.current = true;
        }

        if (lt < 0.5 || rt < 0.5) {
          takeoffTriggeredRef.current = false;
        }

        const buttonA = gamepad.buttons[0]?.pressed;
        const buttonB = gamepad.buttons[1]?.pressed;
        const buttonY = gamepad.buttons[3]?.pressed;

        if (buttonA && !photoTriggeredRef.current) {
          socket.emit("capture_photo");
          photoTriggeredRef.current = true;
        }

        if (!buttonA) {
          photoTriggeredRef.current = false;
        }

        if (buttonB && !landTriggeredRef.current) {
          socket.emit("land");
          landTriggeredRef.current = true;
        }

        if (!buttonB) {
          landTriggeredRef.current = false;
        }

        if (buttonY && !recordingTriggeredRef.current) {
          isRecordingRef.current = !isRecordingRef.current;
          socket.emit(isRecordingRef.current ? "start_recording" : "stop_recording");
          recordingTriggeredRef.current = true;
        }

        if (!buttonY) {
          recordingTriggeredRef.current = false;
        }
      }, 100);
    };

    const updateGamepadState = () => {
      const gamepads = navigator.getGamepads();
      const activeGamepad = Array.from(gamepads).find(Boolean);

      setGamepadState({
        isConnected: Boolean(activeGamepad),
        gamepadId: activeGamepad?.id ?? null,
      });

      if (activeGamepad) {
        startPolling();
      } else {
        stopPolling();
      }
    };

    window.addEventListener("gamepadconnected", updateGamepadState);
    window.addEventListener("gamepaddisconnected", updateGamepadState);

    updateGamepadState();

    const presenceInterval = setInterval(updateGamepadState, 1000);

    return () => {
      window.removeEventListener("gamepadconnected", updateGamepadState);
      window.removeEventListener("gamepaddisconnected", updateGamepadState);
      clearInterval(presenceInterval);
      stopPolling();
    };
  }, []);

  return gamepadState;
}