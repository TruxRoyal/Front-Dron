import { RefObject, useEffect, useRef, useState } from "react";
import { socket } from "@/services/socketService";
import { RC_SCALE } from "../config/controlMappings";

export type JoystickPosition = {
  x: number;
  y: number;
};

const DEFAULT_POSITION: JoystickPosition = { x: 0, y: 0 };

function getPointerPosition(event: MouseEvent | TouchEvent) {
  if (event instanceof MouseEvent) {
    return {
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }

  const touch = event.touches[0];
  return {
    clientX: touch.clientX,
    clientY: touch.clientY,
  };
}

function calculateNormalizedPosition(
  event: MouseEvent | TouchEvent,
  joystickRef: RefObject<HTMLDivElement | null>,
): JoystickPosition {
  const element = joystickRef.current;

  if (!element) {
    return DEFAULT_POSITION;
  }

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const { clientX, clientY } = getPointerPosition(event);

  let x = (clientX - centerX) / (rect.width / 2);
  let y = (clientY - centerY) / (rect.height / 2);

  const distance = Math.sqrt(x * x + y * y);

  if (distance > 1) {
    x /= distance;
    y /= distance;
  }

  return { x, y };
}

export function useDualJoystick() {
  const leftJoystickRef = useRef<HTMLDivElement>(null);
  const rightJoystickRef = useRef<HTMLDivElement>(null);

  const [leftJoystick, setLeftJoystick] = useState<JoystickPosition>(DEFAULT_POSITION);
  const [rightJoystick, setRightJoystick] = useState<JoystickPosition>(DEFAULT_POSITION);

  const leftPosRef = useRef<JoystickPosition>(DEFAULT_POSITION);
  const rightPosRef = useRef<JoystickPosition>(DEFAULT_POSITION);

  const emitRcControl = (left: JoystickPosition, right: JoystickPosition) => {
    socket.emit("rc_control", {
      x: Math.round(right.x * RC_SCALE),
      y: Math.round(-right.y * RC_SCALE),
      z: Math.round(-left.y * RC_SCALE),
      yaw: Math.round(left.x * RC_SCALE),
    });
  };

  useEffect(() => {
    const handleLeftMove = (event: MouseEvent | TouchEvent) => {
      const pos = calculateNormalizedPosition(event, leftJoystickRef);
      leftPosRef.current = pos;
      setLeftJoystick(pos);
      emitRcControl(pos, rightPosRef.current);
    };

    const handleRightMove = (event: MouseEvent | TouchEvent) => {
      const pos = calculateNormalizedPosition(event, rightJoystickRef);
      rightPosRef.current = pos;
      setRightJoystick(pos);
      emitRcControl(leftPosRef.current, pos);
    };

    const stopLeftTracking = () => {
      document.removeEventListener("mousemove", handleLeftMove);
      document.removeEventListener("touchmove", handleLeftMove);
      leftPosRef.current = DEFAULT_POSITION;
      setLeftJoystick(DEFAULT_POSITION);
      emitRcControl(DEFAULT_POSITION, rightPosRef.current);
    };

    const stopRightTracking = () => {
      document.removeEventListener("mousemove", handleRightMove);
      document.removeEventListener("touchmove", handleRightMove);
      rightPosRef.current = DEFAULT_POSITION;
      setRightJoystick(DEFAULT_POSITION);
      emitRcControl(leftPosRef.current, DEFAULT_POSITION);
    };

    const startLeftMouseTracking = () => {
      document.addEventListener("mousemove", handleLeftMove);
      document.addEventListener("mouseup", stopLeftTracking, { once: true });
    };

    const startRightMouseTracking = () => {
      document.addEventListener("mousemove", handleRightMove);
      document.addEventListener("mouseup", stopRightTracking, { once: true });
    };

    const startLeftTouchTracking = () => {
      document.addEventListener("touchmove", handleLeftMove, { passive: false });
      document.addEventListener("touchend", stopLeftTracking, { once: true });
    };

    const startRightTouchTracking = () => {
      document.addEventListener("touchmove", handleRightMove, { passive: false });
      document.addEventListener("touchend", stopRightTracking, { once: true });
    };

    const leftElement = leftJoystickRef.current;
    const rightElement = rightJoystickRef.current;

    leftElement?.addEventListener("mousedown", startLeftMouseTracking);
    leftElement?.addEventListener("touchstart", startLeftTouchTracking, { passive: true });

    rightElement?.addEventListener("mousedown", startRightMouseTracking);
    rightElement?.addEventListener("touchstart", startRightTouchTracking, { passive: true });

    return () => {
      leftElement?.removeEventListener("mousedown", startLeftMouseTracking);
      leftElement?.removeEventListener("touchstart", startLeftTouchTracking);

      rightElement?.removeEventListener("mousedown", startRightMouseTracking);
      rightElement?.removeEventListener("touchstart", startRightTouchTracking);

      document.removeEventListener("mousemove", handleLeftMove);
      document.removeEventListener("mousemove", handleRightMove);
      document.removeEventListener("touchmove", handleLeftMove);
      document.removeEventListener("touchmove", handleRightMove);
      document.removeEventListener("mouseup", stopLeftTracking);
      document.removeEventListener("mouseup", stopRightTracking);
      document.removeEventListener("touchend", stopLeftTracking);
      document.removeEventListener("touchend", stopRightTracking);
    };
  }, []);

  return {
    leftJoystickRef,
    rightJoystickRef,
    leftJoystick,
    rightJoystick,
  };
}