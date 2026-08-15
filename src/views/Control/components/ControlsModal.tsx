import { Keyboard, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Info } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { ControllerDiagram } from '../assets/illustrations/control-base';

import { quickActionKeys, gamepadGuide, } from "../config/controlMappings";


type ControlsModalProps = {
  gamepadConnected: boolean;
  gamepadId: string | null;
};

const ControlKey = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`min-w-[40px] h-10 px-2 flex items-center justify-center rounded-lg border-2 border-border bg-muted/30 font-mono font-bold text-sm shadow-[0_4px_0_0_rgba(0,0,0,0.1)] ${className}`}>
        {children}
    </div>
);

export const ControlsModal = ({
  gamepadConnected,
  gamepadId,
}: ControlsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border hover:bg-muted font-bold gap-2 rounded-lg">
          <Info size={16} />
          Guía de Controles
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] rounded-3xl border-none shadow-2xl bg-white p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              Guía de Mandos
            </DialogTitle>
            <DialogDescription className="font-medium">
              Configuración de controles para pilotaje manual.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="keyboard" className="mt-4">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/50 p-1">
              <TabsTrigger
                value="keyboard"
                className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Keyboard size={16} className="mr-2" />
                Teclado
              </TabsTrigger>
              <TabsTrigger
                value="gamepad"
                className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Gamepad2 size={16} className="mr-2" />
                Mando
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="keyboard" className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Movimiento (WASD)
                </p>

                <div className="flex flex-col items-center gap-2">
                  <ControlKey>W</ControlKey>
                  <div className="flex gap-2">
                    <ControlKey>A</ControlKey>
                    <ControlKey>S</ControlKey>
                    <ControlKey>D</ControlKey>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-primary/10 text-primary">W</span>
                    Adelante
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-primary/10 text-primary">S</span>
                    Atrás
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-primary/10 text-primary">A</span>
                    Izquierda
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-primary/10 text-primary">D</span>
                    Derecha
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Altitud y Giro
                </p>

                <div className="flex flex-col items-center gap-2">
                  <ControlKey>
                    <ArrowUp size={16} />
                  </ControlKey>
                  <div className="flex gap-2">
                    <ControlKey>
                      <ArrowLeft size={16} />
                    </ControlKey>
                    <ControlKey>
                      <ArrowDown size={16} />
                    </ControlKey>
                    <ControlKey>
                      <ArrowRight size={16} />
                    </ControlKey>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2">
                    <ArrowUp size={12} className="text-primary" />
                    Subir
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown size={12} className="text-primary" />
                    Bajar
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowLeft size={12} className="text-primary" />
                    Rotar Izq.
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={12} className="text-primary" />
                    Rotar Der.
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Vuelo
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                    <ControlKey className="min-w-[32px] h-8 border-emerald-300 text-emerald-700">{quickActionKeys.takeoff.key}</ControlKey>
                    <span className="text-xs font-bold text-emerald-700">{quickActionKeys.takeoff.label}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-100 p-3">
                    <ControlKey className="min-w-[32px] h-8 border-orange-300 text-orange-700">{quickActionKeys.land.key}</ControlKey>
                    <span className="text-xs font-bold text-orange-700">{quickActionKeys.land.label}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Acciones Rápidas
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                    <ControlKey className="min-w-[32px] h-8">{quickActionKeys.photo.key}</ControlKey>
                    <span className="text-xs font-bold">{quickActionKeys.photo.label}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                    <ControlKey className="min-w-[32px] h-8">{quickActionKeys.recording.key}</ControlKey>
                    <span className="text-xs font-bold">{quickActionKeys.recording.label}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                    <ControlKey className="min-w-[32px] h-8">{quickActionKeys.precision.key}</ControlKey>
                    <span className="text-xs font-bold">{quickActionKeys.precision.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gamepad" className="space-y-6">
            {!gamepadConnected ? (
              <div className="p-6">
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/20 py-12">
                  <Gamepad2 size={64} className="mb-4 text-muted-foreground/30" />
                  <p className="max-w-[300px] px-4 text-center text-sm font-bold text-muted-foreground">
                    Conecta un mando y presiona cualquier botón para activar la configuración
                  </p>
                  <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    Esperando entrada de hardware...
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 space-y-0 duration-500">
                <div className="px-6 py-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <div className="rounded-lg bg-emerald-500 p-2 text-white">
                      <Gamepad2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-700">Mando Detectado</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {gamepadId ?? "Mapeo de hardware optimizado"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <ControllerDiagram />
                </div>

                <div className="px-6 pb-6 space-y-4">
                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Vuelo
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-bold">
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-emerald-700">
                        LT + RT: {gamepadGuide.ltRt}
                      </div>
                      <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 text-orange-700">
                        Botón B: {gamepadGuide.buttonB}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Movimiento y Acciones
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-bold">
                      <div className="rounded-xl bg-muted/30 p-3">Stick Izquierdo: {gamepadGuide.leftStick}</div>
                      <div className="rounded-xl bg-muted/30 p-3">Stick Derecho: {gamepadGuide.rightStick}</div>
                      <div className="rounded-xl bg-muted/30 p-3">Botón A: {gamepadGuide.buttonA}</div>
                      <div className="rounded-xl bg-muted/30 p-3">Botón Y: {gamepadGuide.buttonY}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};