import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Plane, 
  Smartphone, 
  Cpu, 
  Shield, 
  Bell, 
  Globe, 
  Moon, 
  Zap, 
  Navigation, 
  Gauge, 
  History, 
  RefreshCw,
  Info,
  HardDrive,
  Eye,
  Wind,
  Battery,
  Signal,
  Save
} from 'lucide-react';

const SettingItem = ({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: { 
  icon: any, 
  title: string, 
  description: string, 
  children: React.ReactNode 
}) => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-start gap-4">
      <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground font-medium max-w-[300px]">{description}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {children}
    </div>
  </div>
);

export const SistemaView = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 animate-in slide-in-from-right-4 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-foreground">Configuración del Sistema</h2>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Gestiona los parámetros de tu dron y la aplicación</p>
      </div>

      <Tabs defaultValue="dron" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/50 rounded-2xl">
          <TabsTrigger value="dron" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
            <Plane size={18} />
            <span className="font-bold uppercase tracking-tight text-xs">Configuración Dron</span>
          </TabsTrigger>
          <TabsTrigger value="aplicativo" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
            <Smartphone size={18} />
            <span className="font-bold uppercase tracking-tight text-xs">Preferencias App</span>
          </TabsTrigger>
          <TabsTrigger value="avanzadas" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
            <Cpu size={18} />
            <span className="font-bold uppercase tracking-tight text-xs">Opciones Avanzadas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dron" className="space-y-4 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black uppercase tracking-tight">Parámetros de Vuelo</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Límites y seguridad de la aeronave</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <SettingItem 
                  icon={Navigation} 
                  title="Altitud Máxima" 
                  description="Define el límite de altura permitido para el vuelo seguro."
                >
                  <input type="number" defaultValue={120} className="w-20 p-2 bg-muted/30 border-none rounded-xl text-center font-bold text-sm focus:ring-2 focus:ring-primary/20" />
                  <span className="text-xs font-bold text-muted-foreground w-4">m</span>
                </SettingItem>
                <Separator className="opacity-50" />
                <SettingItem 
                  icon={Gauge} 
                  title="Velocidad Máxima" 
                  description="Velocidad horizontal máxima permitida en modo normal."
                >
                  <input type="number" defaultValue={15} className="w-20 p-2 bg-muted/30 border-none rounded-xl text-center font-bold text-sm focus:ring-2 focus:ring-primary/20" />
                  <span className="text-xs font-bold text-muted-foreground w-4">m/s</span>
                </SettingItem>
                <Separator className="opacity-50" />
                <SettingItem 
                  icon={RefreshCw} 
                  title="Altitud de Retorno (RTH)" 
                  description="Altura a la que el dron regresará al punto de origen."
                >
                  <input type="number" defaultValue={50} className="w-20 p-2 bg-muted/30 border-none rounded-xl text-center font-bold text-sm focus:ring-2 focus:ring-primary/20" />
                  <span className="text-xs font-bold text-muted-foreground w-4">m</span>
                </SettingItem>
                <Separator className="opacity-50" />
                <SettingItem 
                  icon={Zap} 
                  title="Modo de Vuelo" 
                  description="Cambia entre perfiles de rendimiento del dron."
                >
                  <select className="w-32 p-2 bg-muted/30 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20">
                    <option>Normal</option>
                    <option>Cine</option>
                    <option>Sport</option>
                  </select>
                </SettingItem>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black uppercase tracking-tight">Seguridad</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Protección y redundancia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <Shield className="text-emerald-500" size={18} />
                    <span className="text-xs font-bold text-emerald-700">Evitación de Obstáculos</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <Battery className="text-amber-500" size={18} />
                    <span className="text-xs font-bold text-amber-700">Aterrizaje Batería Baja</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estado de Sensores</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold">GPS / GNSS</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600">ÓPTIMO</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold">IMU / Brújula</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600">CALIBRADO</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="aplicativo" className="space-y-4 animate-in fade-in duration-500">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black uppercase tracking-tight">Interfaz y Preferencias</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Personaliza tu experiencia de usuario</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <SettingItem 
                icon={Globe} 
                title="Idioma del Sistema" 
                description="Selecciona el idioma de la interfaz y alertas."
              >
                <select className="w-32 p-2 bg-muted/30 border-none rounded-xl text-xs font-bold">
                  <option>Español</option>
                  <option>English</option>
                  <option>Português</option>
                </select>
              </SettingItem>
              <SettingItem 
                icon={Gauge} 
                title="Sistema de Unidades" 
                description="Métrico (m, km/h) o Imperial (ft, mph)."
              >
                <select className="w-32 p-2 bg-muted/30 border-none rounded-xl text-xs font-bold">
                  <option>Métrico</option>
                  <option>Imperial</option>
                </select>
              </SettingItem>
              <Separator className="md:col-span-2 opacity-50" />
              <SettingItem 
                icon={Bell} 
                title="Notificaciones de Voz" 
                description="Alertas audibles durante la misión de vuelo."
              >
                <Switch defaultChecked />
              </SettingItem>
              <SettingItem 
                icon={Moon} 
                title="Modo Oscuro" 
                description="Cambia el tema visual de la aplicación."
              >
                <Switch />
              </SettingItem>
              <Separator className="md:col-span-2 opacity-50" />
              <SettingItem 
                icon={HardDrive} 
                title="Caché de Mapas" 
                description="Descarga mapas para uso sin conexión."
              >
                <Button size="sm" variant="outline" className="h-8 rounded-xl text-[10px] font-bold">GESTIONAR</Button>
              </SettingItem>
              <SettingItem 
                icon={Smartphone} 
                title="Transmisión HD" 
                description="Priorizar calidad de video sobre latencia."
              >
                <Switch defaultChecked />
              </SettingItem>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avanzadas" className="space-y-4 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black uppercase tracking-tight">Mantenimiento</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Herramientas de diagnóstico y calibración</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 group hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <RefreshCw size={18} className="text-primary" />
                    <div>
                      <p className="text-sm font-bold">Calibrar IMU</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Requiere superficie plana</p>
                    </div>
                  </div>
                  <Button size="sm" className="h-7 rounded-lg text-[10px] font-bold">INICIAR</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 group hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Navigation size={18} className="text-primary" />
                    <div>
                      <p className="text-sm font-bold">Calibrar Brújula</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Realizar en campo abierto</p>
                    </div>
                  </div>
                  <Button size="sm" className="h-7 rounded-lg text-[10px] font-bold">INICIAR</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 group hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <History size={18} className="text-primary" />
                    <div>
                      <p className="text-sm font-bold">Logs de Vuelo</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Exportar registros detallados</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 rounded-lg text-[10px] font-bold">EXPORTAR</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black uppercase tracking-tight">Información</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Detalles del hardware y software</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Modelo</span>
                    <span className="font-bold">AgroDrone X-Pro 4</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Firmware Dron</span>
                    <span className="font-bold">v2.4.12-stable</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Versión App</span>
                    <span className="font-bold">v1.0.5</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Número de Serie</span>
                    <span className="font-mono font-bold text-xs">AD-7742-X99-PRO</span>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-bold gap-2">
                    <Info size={16} />
                    SOPORTE
                  </Button>
                  <Button variant="destructive" className="flex-1 h-10 rounded-xl text-xs font-bold gap-2">
                    <RefreshCw size={16} />
                    RESET
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end gap-4">
        <Button variant="ghost" className="rounded-2xl font-bold text-sm px-8">CANCELAR</Button>
        <Button className="rounded-2xl font-bold text-sm px-10 shadow-lg shadow-primary/20 gap-2">
          <Save size={18} />
          GUARDAR CAMBIOS
        </Button>
      </div>
    </div>
  );
};

