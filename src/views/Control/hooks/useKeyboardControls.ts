import { useEffect, useRef } from "react";
import { socket } from "@/services/socketService";
import {
  keyboardControlMap,
  KEYBOARD_INTERVAL_MS,
  PRECISION_MULTIPLIER,
} from "../config/controlMappings";

type RCState = {
  x: number;
  y: number;
  z: number;
  yaw: number;
};

const initialRcState = (): RCState => ({
  x: 0,
  y: 0,
  z: 0,
  yaw: 0,
});

export function useKeyboardControls() {
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const rcStateRef = useRef<RCState>(initialRcState());
  const precisionModeRef = useRef(false);
  const isRecordingRef = useRef(false);
  const rcIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const emitZeroRcControl = () => {
      socket.emit("rc_control", { x: 0, y: 0, z: 0, yaw: 0 });
    };

    const updateRcState = () => {
      const nextState = initialRcState();
      const multiplier = precisionModeRef.current ? PRECISION_MULTIPLIER : 1;

      pressedKeysRef.current.forEach((pressedKey) => {
        const mapping = keyboardControlMap[pressedKey];
        if (!mapping || mapping.type !== "axis") {
          return;
        }

        nextState[mapping.axis] += Math.round(mapping.value * multiplier);
      });

      rcStateRef.current = nextState;
      socket.emit("rc_control", { ...nextState });
    };

    const startRcLoopIfNeeded = () => {
      if (rcIntervalRef.current) {
        return;
      }

      rcIntervalRef.current = setInterval(updateRcState, KEYBOARD_INTERVAL_MS);
    };

    const stopRcLoopIfNeeded = () => {
      if (pressedKeysRef.current.size > 0) {
        return;
      }

      if (rcIntervalRef.current) {
        clearInterval(rcIntervalRef.current);
        rcIntervalRef.current = null;
      }

      emitZeroRcControl();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.key === "Shift") {
        precisionModeRef.current = true;
        return;
      }

      if (key === "p" && !event.repeat) {
        event.preventDefault();
        socket.emit("capture_photo");
        return;
      }

      if (key === "r" && !event.repeat) {
        event.preventDefault();
        isRecordingRef.current = !isRecordingRef.current;
        socket.emit(isRecordingRef.current ? "start_recording" : "stop_recording");
        return;
      }

      const mapping = keyboardControlMap[key];
      if (!mapping) {
        return;
      }

      event.preventDefault();

      if (mapping.type === "command") {
        if (!event.repeat) {
          socket.emit(mapping.command);
        }
        return;
      }

      if (!pressedKeysRef.current.has(key)) {
        pressedKeysRef.current.add(key);
        updateRcState();
      }

      startRcLoopIfNeeded();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.key === "Shift") {
        precisionModeRef.current = false;
        updateRcState();
        return;
      }

      const mapping = keyboardControlMap[key];
      if (!mapping) {
        return;
      }

      event.preventDefault();

      if (mapping.type === "axis") {
        pressedKeysRef.current.delete(key);
        updateRcState();
        stopRcLoopIfNeeded();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);

      if (rcIntervalRef.current) {
        clearInterval(rcIntervalRef.current);
        rcIntervalRef.current = null;
      }

      pressedKeysRef.current.clear();
      precisionModeRef.current = false;
      emitZeroRcControl();
    };
  }, []);
}