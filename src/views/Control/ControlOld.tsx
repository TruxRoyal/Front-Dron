import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  AlertOctagon,
  CameraOff,
  Camera,
  Video,
  Settings2,
  RefreshCw,
  Pause,
  RotateCw,
  ChevronUp,
  ChevronDown,
  Crosshair,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Control() {
  // Joystick States
  const leftJoystickRef = useRef<HTMLDivElement>(null);
  const rightJoystickRef = useRef<HTMLDivElement>(null);
  const [leftJoystick, setLeftJoystick] = useState({ x: 0, y: 0 });
  const [rightJoystick, setRightJoystick] = useState({ x: 0, y: 0 });
  const [altitude, setAltitude] = useState(4.0);
  const [recording, setRecording] = useState(false);

  // Joystick Logic
  useEffect(() => {
    const handleJoystickMove = (
      e: MouseEvent | TouchEvent,
      joystickRef: React.RefObject<HTMLDivElement | null>,
      setJoystickPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    ) => {
      if (!joystickRef.current) return;

      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let clientX, clientY;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      let x = (clientX - centerX) / (rect.width / 2);
      let y = (clientY - centerY) / (rect.height / 2);

      const distance = Math.sqrt(x * x + y * y);
      if (distance > 1) {
        x = x / distance;
        y = y / distance;
      }

      setJoystickPos({ x, y });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleLeftJoystickMove);
      document.removeEventListener("mousemove", handleRightJoystickMove);
      setLeftJoystick({ x: 0, y: 0 });
      setRightJoystick({ x: 0, y: 0 });
    };

    const handleLeftJoystickMove = (e: MouseEvent | TouchEvent) =>
      handleJoystickMove(e, leftJoystickRef, setLeftJoystick);

    const handleRightJoystickMove = (e: MouseEvent | TouchEvent) =>
      handleJoystickMove(e, rightJoystickRef, setRightJoystick);

    const leftJoystickEl = leftJoystickRef.current;
    const rightJoystickEl = rightJoystickRef.current;

    const onLeftMouseDown = () => {
      document.addEventListener("mousemove", handleLeftJoystickMove);
      document.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    const onRightMouseDown = () => {
      document.addEventListener("mousemove", handleRightJoystickMove);
      document.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    if (leftJoystickEl) {
      leftJoystickEl.addEventListener("mousedown", onLeftMouseDown);
    }

    if (rightJoystickEl) {
      rightJoystickEl.addEventListener("mousedown", onRightMouseDown);
    }

    return () => {
      if (leftJoystickEl) leftJoystickEl.removeEventListener("mousedown", onLeftMouseDown);
      if (rightJoystickEl) rightJoystickEl.removeEventListener("mousedown", onRightMouseDown);
      document.removeEventListener("mousemove", handleLeftJoystickMove);
      document.removeEventListener("mousemove", handleRightJoystickMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude((prev) => {
        const newAltitude = prev - leftJoystick.y * 0.1;
        return Math.max(0, Math.min(120, newAltitude));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [leftJoystick.y]);

  return (
    <div className="justify-between p-6 gap-8">
      <div className="space-y-6 animate-in zoom-in-95 duration-700">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-foreground">Vuelo en tiempo real</h3>
          <div className="flex gap-3">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-bold gap-2 rounded-lg">
              <Compass size={16} /> Calibrar
            </Button>
            <Button variant="destructive" className="bg-destructive text-white font-bold gap-2 rounded-lg">
              <AlertOctagon size={16} /> Parada de Emergencia
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden border-border shadow-sm rounded-2xl flex flex-col">
            <div className="flex-1 relative bg-slate-50 flex items-center justify-center min-h-[400px]">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="z-10 flex flex-col items-center text-muted-foreground">
                <CameraOff size={48} className="mb-4 opacity-40" />
                <p className="text-sm font-bold uppercase tracking-widest">Sin señal</p>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-border">
              <Tabs defaultValue="photo">
                <TabsList className="bg-muted/50 border border-border p-1 rounded-xl mb-6">
                  <TabsTrigger value="photo" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6 rounded-lg"><Camera size={14} className="mr-2" /> Foto</TabsTrigger>
                  <TabsTrigger value="video" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6 rounded-lg"><Video size={14} className="mr-2" /> Video</TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6 rounded-lg"><Settings2 size={14} className="mr-2" /> Ajustes</TabsTrigger>
                </TabsList>

                <TabsContent value="photo" className="mt-0">
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-primary text-white hover:bg-primary/90 font-bold gap-2 h-12 rounded-xl shadow-lg shadow-primary/20"><Camera size={18} /> Capturar Foto</Button>
                    <Button variant="outline" size="icon" className="border-border h-12 w-12 rounded-xl"><RefreshCw size={18} /></Button>
                  </div>
                </TabsContent>

                <TabsContent value="video" className="mt-0">
                  <div className="flex gap-3">
                    <Button
                      className={`flex-1 font-bold gap-2 h-12 rounded-xl shadow-lg ${recording ? 'bg-destructive text-white' : 'bg-primary text-white'}`}
                      onClick={() => setRecording(!recording)}
                    >
                      {recording ? <Pause size={18} /> : <Video size={18} />}
                      {recording ? "Detener Grabación" : "Iniciar Grabación"}
                    </Button>
                    <Button variant="outline" size="icon" className="border-border h-12 w-12 rounded-xl"><RotateCw size={18} /></Button>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <div className="grid grid-cols-3 gap-3">
                    {['720p', '1080p', '4K'].map((res) => (
                      <Button key={res} variant={res === '1080p' ? 'default' : 'outline'} className="font-bold h-12 rounded-xl">{res}</Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          <Card className="lg:col-span-1 bg-muted/30 border-border shadow-sm rounded-2xl overflow-hidden flex flex-col p-6">
            <h2 className="text-lg font-bold text-center mb-8">Controles de Vuelo</h2>

            <div className="flex-1 flex flex-col justify-between gap-8">
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <Button size="icon" className="bg-black text-white rounded-xl mb-2 w-14 h-14 shadow-xl"><ChevronUp size={28} /></Button>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Despegar</p>
                </div>
                <div className="text-center">
                  <Button size="icon" className="bg-black text-white rounded-xl mb-2 w-14 h-14 shadow-xl"><ChevronDown size={28} /></Button>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Aterrizar</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-center text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Altitud y Rotación</p>
                <div
                  ref={leftJoystickRef}
                  className="relative w-40 h-40 mx-auto rounded-full border-4 border-primary/20 bg-[#004d40] shadow-inner cursor-pointer"
                >
                  <div
                    className="absolute w-16 h-16 bg-[#8be9d9] rounded-full flex items-center justify-center text-[#004d40] shadow-2xl border-4 border-[#004d40] transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${50 + leftJoystick.x * 40}%`,
                      top: `${50 + leftJoystick.y * 40}%`,
                      transition: leftJoystick.x === 0 && leftJoystick.y === 0 ? "all 0.3s ease-out" : "none"
                    }}
                  >
                    <Crosshair size={24} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-px h-full bg-white" />
                    <div className="h-px w-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-center text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Dirección</p>
                <div
                  ref={rightJoystickRef}
                  className="relative w-40 h-40 mx-auto rounded-full border-4 border-primary/20 bg-[#004d40] shadow-inner cursor-pointer"
                >
                  <div
                    className="absolute w-16 h-16 bg-[#8be9d9] rounded-full flex items-center justify-center text-[#004d40] shadow-2xl border-4 border-[#004d40] transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${50 + rightJoystick.x * 40}%`,
                      top: `${50 + rightJoystick.y * 40}%`,
                      transition: rightJoystick.x === 0 && rightJoystick.y === 0 ? "all 0.3s ease-out" : "none"
                    }}
                  >
                    <Navigation size={24} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-px h-full bg-white" />
                    <div className="h-px w-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase"><span>Altitud</span><span>{altitude.toFixed(1)}m</span></div>
                  <Progress value={(altitude / 120) * 100} className="h-2 rounded-full" indicatorClassName="bg-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase"><span>Rotación</span><span>{(leftJoystick.x * 180).toFixed(0)}°</span></div>
                  <Progress value={Math.abs(leftJoystick.x) * 100} className="h-2 rounded-full" indicatorClassName="bg-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase"><span>Velocidad</span><span>{(Math.sqrt(rightJoystick.x ** 2 + rightJoystick.y ** 2) * 30).toFixed(1)}m/s</span></div>
                  <Progress value={Math.sqrt(rightJoystick.x ** 2 + rightJoystick.y ** 2) * 100} className="h-2 rounded-full" indicatorClassName="bg-primary" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase"><span>Dirección</span><span>{(rightJoystick.x * 180).toFixed(0)}°</span></div>
                  <Progress value={Math.abs(rightJoystick.x) * 100} className="h-2 rounded-full" indicatorClassName="bg-primary" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
