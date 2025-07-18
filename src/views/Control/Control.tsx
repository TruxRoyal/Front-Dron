"use client";

import "./Control.css";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CameraIcon,
  VideoIcon,
} from "lucide-react";

export default function Control() {
  
  const [altitude, setAltitude] = useState(40);
  const [velocity, setVelocity] = useState(65);
  const [rotation, setRotation] = useState(30);
  const [direction, setDirection] = useState(80);

  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude(Math.floor(Math.random() * 101));
      setVelocity(Math.floor(Math.random() * 101));
      setRotation(Math.floor(Math.random() * 101));
      setDirection(Math.floor(Math.random() * 101));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-emerald-50 flex p-4">
      <div className="control-container">
        {/* VIDEO */}
        <div className="video-container">
          <h2 className="video-title">Vuelo en tiempo real</h2>
          <div className="video-display">
            <span className="video-text">Transmisión del dron</span>
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
      </div>
    </div>
  );
}
