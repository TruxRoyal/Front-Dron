import {
  CameraOff,
  Camera,
  Video,
  Settings2,
  RefreshCw,
  Pause,
  RotateCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

type VideoPanelProps = {
  videoRef: React.RefObject<HTMLImageElement | null>;
  videoSrc: string | null;
  isVideoLoaded: boolean;
  recording: boolean;
  zoom: number;
  onToggleRecording: () => void;
  onZoomChange: (zoom: number) => void;
};

export function VideoPanel({
  videoRef,
  videoSrc,
  isVideoLoaded,
  recording,
  zoom,
  onToggleRecording,
  onZoomChange,
}: VideoPanelProps) {
  return (
    <Card className="h-full min-h-0 overflow-hidden border-border shadow-sm rounded-2xl flex flex-col">
      <div className="relative flex-1 min-h-0 overflow-hidden bg-slate-50 flex items-center justify-center">
        {isVideoLoaded && videoSrc ? (
          <img
            ref={videoRef}
            src={videoSrc}
            alt="Transmisión del dron"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="z-10 flex flex-col items-center text-muted-foreground">
              <CameraOff size={40} className="mb-3 opacity-40" />
              <p className="text-xs font-bold uppercase tracking-widest">Sin señal</p>
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-white p-4">
        <Tabs defaultValue="photo" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3 bg-muted/50 border border-border p-1 rounded-xl">
            <TabsTrigger
              value="photo"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-3 rounded-lg"
            >
              <Camera size={14} className="mr-2" />
              Foto
            </TabsTrigger>

            <TabsTrigger
              value="video"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-3 rounded-lg"
            >
              <Video size={14} className="mr-2" />
              Video
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-3 rounded-lg"
            >
              <Settings2 size={14} className="mr-2" />
              Ajustes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photo" className="mt-0">
            <div className="flex gap-3">
              <Button className="flex-1 h-10 rounded-xl bg-primary text-white font-bold gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90">
                <Camera size={16} />
                Capturar Foto
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl border-border"
              >
                <RefreshCw size={16} />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="video" className="mt-0">
            <div className="flex gap-3">
              <Button
                className={`flex-1 h-10 rounded-xl font-bold gap-2 shadow-lg ${
                  recording ? "bg-destructive text-white" : "bg-primary text-white"
                }`}
                onClick={onToggleRecording}
              >
                {recording ? <Pause size={16} /> : <Video size={16} />}
                {recording ? "Detener Grabación" : "Iniciar Grabación"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl border-border"
              >
                <RotateCw size={16} />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "720p", zoomValue: 1 },
                { label: "1080p", zoomValue: 1.5 },
                { label: "4K", zoomValue: 2 },
              ].map(({ label, zoomValue }) => (
                <Button
                  key={label}
                  variant={zoom === zoomValue ? "default" : "outline"}
                  className="h-10 rounded-xl font-bold"
                  onClick={() => onZoomChange(zoomValue)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}