"use client";

import "./Control.css";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CameraIcon,
  VideoIcon,
  Crosshair,
  Compass,
  AlertOctagon,
} from "lucide-react";

// 🧠 Importa los módulos lógicos
import { startVideoStream } from "@/services/imageService";
import { setupKeyboardControls } from "../../hooks/useKeyboardControl";
import { setupGamepadControls } from "../../hooks/useGamepadController";

import { socket } from "@/services/socketService"; // acceso directo al socket

export default function Control() {
  //const [altitude, setAltitude] = useState(40);
  const [velocity, setVelocity] = useState(65);
  const [rotation, setRotation] = useState(30);
  const [direction, setDirection] = useState(80);

  const [recording, setRecording] = useState(false)
  const [altitude, setAltitude] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [showTelemetry, setShowTelemetry] = useState(true)
  const [showGrid, setShowGrid] = useState(true)

  // References for the joysticks
  const leftJoystickRef = useRef<HTMLDivElement>(null)
  const rightJoystickRef = useRef<HTMLDivElement>(null)

  // State for joystick positions
  const [leftJoystick, setLeftJoystick] = useState({ x: 0, y: 0 })
  const [rightJoystick, setRightJoystick] = useState({ x: 0, y: 0 })

  // Handle joystick movement
  useEffect(() => {
    const handleJoystickMove = (
      e: MouseEvent | TouchEvent,
      joystickRef: React.RefObject<HTMLDivElement>,
      setJoystickPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    ) => {
      if (!joystickRef.current) return

      const rect = joystickRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Get position based on mouse or touch
      let clientX, clientY
      if (e instanceof MouseEvent) {
        clientX = e.clientX
        clientY = e.clientY
      } else {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      }

      // Calculate distance from center
      let x = (clientX - centerX) / (rect.width / 2)
      let y = (clientY - centerY) / (rect.height / 2)

      // Limit to circle
      const distance = Math.sqrt(x * x + y * y)
      if (distance > 1) {
        x = x / distance
        y = y / distance
      }

      setJoystickPos({ x, y })
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleLeftJoystickMove)
      document.removeEventListener("mousemove", handleRightJoystickMove)
      setLeftJoystick({ x: 0, y: 0 })
      setRightJoystick({ x: 0, y: 0 })
    }

    const handleLeftJoystickMove = (e: MouseEvent | TouchEvent) =>
      handleJoystickMove(e, leftJoystickRef, setLeftJoystick)

    const handleRightJoystickMove = (e: MouseEvent | TouchEvent) =>
      handleJoystickMove(e, rightJoystickRef, setRightJoystick)

    const leftJoystick = leftJoystickRef.current
    const rightJoystick = rightJoystickRef.current

    if (leftJoystick) {
      leftJoystick.addEventListener("mousedown", (e) => {
        document.addEventListener("mousemove", handleLeftJoystickMove)
        document.addEventListener("mouseup", handleMouseUp, { once: true })
      })

      leftJoystick.addEventListener("touchstart", (e) => {
        document.addEventListener("touchmove", handleLeftJoystickMove)
        document.addEventListener("touchend", handleMouseUp, { once: true })
      })
    }

    if (rightJoystick) {
      rightJoystick.addEventListener("mousedown", (e) => {
        document.addEventListener("mousemove", handleRightJoystickMove)
        document.addEventListener("mouseup", handleMouseUp, { once: true })
      })

      rightJoystick.addEventListener("touchstart", (e) => {
        document.addEventListener("touchmove", handleRightJoystickMove)
        document.addEventListener("touchend", handleMouseUp, { once: true })
      })
    }

    return () => {
      document.removeEventListener("mousemove", handleLeftJoystickMove)
      document.removeEventListener("mousemove", handleRightJoystickMove)
      document.removeEventListener("touchmove", handleLeftJoystickMove)
      document.removeEventListener("touchmove", handleRightJoystickMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [])

  // Simulate altitude changes based on left joystick y position
  useEffect(() => {
    setAltitude((prev) => {
      const newAltitude = prev - leftJoystick.y * 0.5
      return Math.max(0, Math.min(120, newAltitude))
    })

    setSpeed(Math.sqrt(rightJoystick.x ** 2 + rightJoystick.y ** 2) * 30)
  }, [leftJoystick, rightJoystick])



  useEffect(() => {
    startVideoStream();
    setupKeyboardControls();
    setupGamepadControls();

    socket.on("video_frame", ({ image }) => {
      if (videoRef.current) {
        const base64 = `data:image/jpeg;base64,${image}`;
        videoRef.current.src = base64;
      }
    });


    socket.on("video_stopped", () => {
      if (videoRef.current) {
        videoRef.current.src = "";
      }
    });

    // 🧪 Simulación de valores de telemetría
    const interval = setInterval(() => {
      setAltitude(Math.floor(Math.random() * 101));
      setVelocity(Math.floor(Math.random() * 101));
      setRotation(Math.floor(Math.random() * 101));
      setDirection(Math.floor(Math.random() * 101));
    }, 2000);

    return () => {
      clearInterval(interval);
      socket.off("video_frame");
      socket.off("video_stopped");
    };
  }, []);

  const videoRef = useRef<HTMLImageElement>(null);


  return (
    <div className="p-6 space-y-6">
      <header className="button-header">
        <Button variant="outline" className="button-outline">
          <Compass className="icon" />
          Calibrar
        </Button>
        <Button className="button-emergency">
          <AlertOctagon className="icon" />
          Parada de Emergencia
        </Button>
      </header>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="video-container">
            <h2 className="video-title">Vuelo en tiempo real</h2>
            <div className="video-display w-full h-[300px] bg-black rounded-lg overflow-hidden">
              <img
                ref={videoRef}
                alt="Transmisión del dron"
                className="w-full h-full object-cover"
              />
            </div>


            <div className="actions-container">
              <div className="actions-buttons">
                <Button variant="outline" className="capture-button">
                  <CameraIcon className="icon" />
                  Capturar Foto
                </Button>
                <Button variant="outline" className="capture-button video">
                  <VideoIcon className="icon" />
                  Capturar Video
                </Button>
              </div>

              <div className="indicators">
                <div className="indicator">
                  <Progress value={altitude} className="w-[100px]" />
                  <span>Altitud</span>
                </div>
                <div className="indicator">
                  <Progress value={rotation} className="w-[100px]" />
                  <span>Rotación</span>
                </div>
                <div className="indicator">
                  <Progress value={velocity} className="w-[100px]" />
                  <span>Velocidad</span>
                </div>
                <div className="indicator">
                  <Progress value={direction} className="w-[100px]" />
                  <span>Dirección</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col">
          <div className="controls-container">
            <h2 className="controls-title">Controles de Vuelo</h2>

            <div className="controls-row">
              <div className="control-group">
                <Button variant="secondary" size="icon" className="control-button">
                  <ChevronUpIcon />
                </Button>
                <span>Despegar</span>
              </div>
              <div className="control-group">
                <Button variant="secondary" size="icon" className="control-button">
                  <ChevronDownIcon />
                </Button>
                <span>Aterrizar</span>
              </div>
            </div>

            <div className="control-section">
              <span className="control-label">Altitud y Rotación</span>
              <div className="joystick">
                <Button variant="secondary" size="icon" className="control-button">
                  <ChevronUpIcon />
                </Button>
                <div className="joystick-horizontal">
                  <Button variant="secondary" size="icon" className="control-button">
                    <ChevronLeftIcon />
                  </Button>
                  <Button variant="secondary" size="icon" className="control-button">
                    <ChevronRightIcon />
                  </Button>
                </div>
                <Button variant="secondary" size="icon" className="control-button">
                  <ChevronDownIcon />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400 mb-2">Altitud & Rotación</span>
              <div
                ref={leftJoystickRef}
                className="relative w-32 h-32 rounded-full border border-accent-dark cursor-pointer"
                style={{
                  backgroundColor: "#00504a", // primary-dark
                  borderColor: "#009688",     // accent-dark
                }}
              >
                <div
                  className="absolute bg-accent-light rounded-full w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{
                    backgroundColor: "#8be9d9",      // accent-light
                    borderColor: "#00504a",          // primary-dark
                    left: `${50 + leftJoystick.x * 50}%`,
                    top: `${50 + leftJoystick.y * 50}%`,
                    transition: leftJoystick.x === 0 && leftJoystick.y === 0 ? "all 0.3s ease-out" : "none",
                  }}
                >
                  <Crosshair className="h-5 w-5 text-primary-dark" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-px h-full" style={{ backgroundColor: "rgba(0, 150, 136, 0.3)" }}></div>
                  <div className="h-px w-full" style={{ backgroundColor: "rgba(0, 150, 136, 0.3)" }}></div>
                </div>
              </div>
              <div className="mt-4 w-full space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Altitud</span>
                    <span>{altitude.toFixed(1)}m</span>
                  </div>
                  <div className="h-1.5 w-full bg-primary-dark/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-light rounded-full"
                      style={{ width: `${(altitude / 120) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Rotación</span>
                    <span>{(leftJoystick.x * 180).toFixed(0)}°</span>
                  </div>
                  <div className="h-1.5 w-full bg-primary-dark/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-light rounded-full"
                      style={{
                        width: `${Math.abs(leftJoystick.x) * 100}%`,
                        marginLeft: leftJoystick.x < 0 ? 0 : `${50 - Math.abs(leftJoystick.x) * 50}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="control-section">
              <span className="control-label">Dirección</span>
              <div className="joystick">
                <Button variant="secondary" size="icon" className="control-button">
                  <ChevronUpIcon />
                </Button>
                <div className="joystick-horizontal">
                  <Button variant="secondary" size="icon" className="control-button">
                    <ChevronLeftIcon />
                  </Button>
                  <Button variant="secondary" size="icon" className="control-button">
                    <ChevronRightIcon />
                  </Button>
                </div>
                <Button variant="secondary" size="icon" className="control-button">
                  <ChevronDownIcon />
                </Button>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}
