import { useEffect, useMemo, useState } from "react";
import type { JoystickPosition } from "./useDualJoystick";

const MAX_ALTITUDE = 120;
const MAX_SPEED = 30;

type UseDroneTelemetryParams = {
  leftJoystick: JoystickPosition;
  rightJoystick: JoystickPosition;
};

export function useDroneTelemetry({
  leftJoystick,
  rightJoystick,
}: UseDroneTelemetryParams) {
  const [altitude, setAltitude] = useState(0);
  const [velocity, setVelocity] = useState(65);
  const [rotation, setRotation] = useState(30);
  const [direction, setDirection] = useState(80);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setAltitude((previousAltitude) => {
      const nextAltitude = previousAltitude - leftJoystick.y * 0.5;
      return Math.max(0, Math.min(MAX_ALTITUDE, nextAltitude));
    });
  }, [leftJoystick.y]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVelocity(Math.floor(Math.random() * 101));
      setRotation(Math.floor(Math.random() * 101));
      setDirection(Math.floor(Math.random() * 101));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const speed = useMemo(() => {
    return Math.sqrt(rightJoystick.x ** 2 + rightJoystick.y ** 2) * MAX_SPEED;
  }, [rightJoystick.x, rightJoystick.y]);

  const altitudeProgress = useMemo(() => (altitude / MAX_ALTITUDE) * 100, [altitude]);
  const rotationProgress = useMemo(() => Math.abs(leftJoystick.x) * 100, [leftJoystick.x]);
  const velocityProgress = useMemo(() => Math.min((speed / MAX_SPEED) * 100, 100), [speed]);
  const directionProgress = useMemo(() => Math.abs(rightJoystick.x) * 100, [rightJoystick.x]);

  return {
    altitude,
    velocity,
    rotation,
    direction,
    speed,
    zoom,
    setZoom,
    altitudeProgress,
    rotationProgress,
    velocityProgress,
    directionProgress,
  };
}