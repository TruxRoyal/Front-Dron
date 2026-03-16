import { ChevronUp, ChevronDown, Crosshair, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { JoystickPosition } from "../hooks/useDualJoystick";
import React from "react";

type FlightControlsCardProps = {
  leftJoystickRef: React.RefObject<HTMLDivElement | null>;
  rightJoystickRef: React.RefObject<HTMLDivElement | null>;
  leftJoystick: JoystickPosition;
  rightJoystick: JoystickPosition;
  altitude: number;
  speed: number;
  altitudeProgress: number;
  rotationProgress: number;
  velocityProgress: number;
  directionProgress: number;
  onTakeoff: () => void;
  onLand: () => void;
};

export function FlightControlsCard({
  leftJoystickRef,
  rightJoystickRef,
  leftJoystick,
  rightJoystick,
  altitude,
  speed,
  altitudeProgress,
  rotationProgress,
  velocityProgress,
  directionProgress,
  onTakeoff,
  onLand,
}: FlightControlsCardProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-border bg-muted/30 p-4 shadow-sm">
      <div className="shrink-0">
        <h2 className="mb-3 text-center text-base font-bold">Controles de Vuelo</h2>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
        <div className="shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Altitud</span>
                <span>{altitude.toFixed(1)}m</span>
              </div>
              <Progress
                value={altitudeProgress}
                className="h-2 rounded-full bg-primary/10"
                indicatorClassName="bg-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Rotación</span>
                <span>{(leftJoystick.x * 180).toFixed(0)}°</span>
              </div>
              <Progress
                value={rotationProgress}
                className="h-2 rounded-full bg-primary/10"
                indicatorClassName="bg-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Velocidad</span>
                <span>{speed.toFixed(1)}m/s</span>
              </div>
              <Progress
                value={velocityProgress}
                className="h-2 rounded-full bg-primary/10"
                indicatorClassName="bg-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Dirección</span>
                <span>{(rightJoystick.x * 180).toFixed(0)}°</span>
              </div>
              <Progress
                value={directionProgress}
                className="h-2 rounded-full bg-primary/10"
                indicatorClassName="bg-primary"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 grid grid-cols-2 gap-4 items-start justify-items-center">
          <div className="flex w-full max-w-[150px] flex-col items-center gap-2">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Altitud y Rotación
            </p>

            <div
              ref={leftJoystickRef}
              className="relative h-28 w-28 rounded-full border-4 border-primary/20 bg-[#004d40] shadow-inner cursor-pointer touch-none md:h-32 md:w-32"
            >
              <div
                className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#004d40] bg-[#8be9d9] text-[#004d40] shadow-xl md:h-14 md:w-14"
                style={{
                  left: `${50 + leftJoystick.x * 40}%`,
                  top: `${50 + leftJoystick.y * 40}%`,
                  transition:
                    leftJoystick.x === 0 && leftJoystick.y === 0
                      ? "all 0.3s ease-out"
                      : "none",
                }}
              >
                <Crosshair size={20} />
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
                <div className="h-full w-px bg-white" />
                <div className="h-px w-full bg-white" />
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-[150px] flex-col items-center gap-2">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Dirección
            </p>

            <div
              ref={rightJoystickRef}
              className="relative h-28 w-28 rounded-full border-4 border-primary/20 bg-[#004d40] shadow-inner cursor-pointer touch-none md:h-32 md:w-32"
            >
              <div
                className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#004d40] bg-[#8be9d9] text-[#004d40] shadow-xl md:h-14 md:w-14"
                style={{
                  left: `${50 + rightJoystick.x * 40}%`,
                  top: `${50 + rightJoystick.y * 40}%`,
                  transition:
                    rightJoystick.x === 0 && rightJoystick.y === 0
                      ? "all 0.3s ease-out"
                      : "none",
                }}
              >
                <Navigation size={20} />
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
                <div className="h-full w-px bg-white" />
                <div className="h-px w-full bg-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 grid grid-cols-2 gap-3 pt-1">
          <Button
            size="lg"
            className="h-12 w-full rounded-xl border-b-4 border-emerald-800 bg-emerald-600 text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-emerald-700 active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={onTakeoff}
          >
            <ChevronUp size={22} />
            <span className="text-[11px] font-black uppercase tracking-wider">Despegar</span>
          </Button>

          <Button
            size="lg"
            className="h-12 w-full rounded-xl border-b-4 border-orange-800 bg-orange-600 text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-orange-700 active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={onLand}
          >
            <ChevronDown size={22} />
            <span className="text-[11px] font-black uppercase tracking-wider">Aterrizar</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}