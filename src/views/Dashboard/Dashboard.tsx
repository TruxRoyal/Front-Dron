import {
  Battery,
  Wifi,
  MapPin,
  ChevronRight,
  Wind,
  Thermometer,
  Droplets,
  Satellite,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { cropHealthData, recentLogs } from "./types/DashboardTypes";
import { MetricCard } from "./components/MetricCard";
import { WifiSignalCard } from "./components/WifiSignalCard";

export default function Dashboard() {
  return (
    <div className="h-full overflow-hidden p-4">
      <div className="flex h-full min-h-0 flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-primary text-white border-none shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-white/20 p-3">
                <Battery size={24} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold uppercase tracking-widest">Batería</p>
                  <p className="text-sm font-bold">84%</p>
                </div>

                <Progress
                  value={84}
                  className="h-2 bg-white/20"
                  indicatorClassName="bg-white"
                />

                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider opacity-70">
                  ~ 18 min restantes
                </p>
              </div>
            </CardContent>
          </Card>

          <WifiSignalCard />
          <MetricCard
            icon={Clock}
            label="Tiempo Vuelo"
            value="12:45"
            subValue="Hoy"
            colorClass="bg-amber-500"
          />
        </div>

        <div className="grid flex-1 min-h-0 grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 flex min-h-0 flex-col gap-4">
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-border shadow-sm">
              <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-3 pb-2 bg-muted/20 px-4 py-3">
                <div className="min-w-0">
                  <CardTitle className="text-base font-bold">
                    Vista de Campo
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                    Finca "La Esperanza" - Lote A
                  </CardDescription>
                </div>

                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-200 bg-emerald-50 font-bold text-emerald-600"
                >
                  EN VIVO
                </Badge>
              </CardHeader>

              <CardContent className="relative flex-1 min-h-0 overflow-hidden bg-slate-100 p-0">
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #000 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="z-10 text-center">
                    <MapPin size={40} className="mx-auto mb-3 text-primary opacity-40" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Mapa Interactivo Cargando...
                    </p>
                  </div>
                </div>

                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                  <div className="space-y-2 rounded-xl border border-border bg-white/90 p-3 shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Activity size={14} className="text-primary" />
                      Telemetría
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-bold text-muted-foreground">
                      <span>ALT: 15.2m</span>
                      <span>VEL: 4.2m/s</span>
                      <span>DIST: 142m</span>
                      <span>HDG: 124°</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="shrink-0 rounded-lg bg-black font-bold text-white shadow-xl"
                  >
                    Maximizar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shrink-0 overflow-hidden rounded-2xl border-border shadow-sm">
              <CardHeader className="pb-2 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold">
                      Tendencia Salud Cultivo
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                      Índice NDVI Promedio
                    </CardDescription>
                  </div>

                  <TrendingUp className="text-emerald-500" size={22} />
                </div>
              </CardHeader>

              <CardContent className="h-44 pt-2 px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cropHealthData}>
                    <defs>
                      <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00a884" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00a884" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 600 }}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                      itemStyle={{ fontWeight: 700, fontSize: "12px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="health"
                      stroke="#00a884"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorHealth)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
              <CardHeader className="pb-2 px-4 py-3">
                <CardTitle className="text-base font-bold">Condiciones</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                  Sensores en Tiempo Real
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 px-4 pb-4 pt-2">
                <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                      <Wind size={16} />
                    </div>
                    <span className="text-sm font-bold">Viento</span>
                  </div>
                  <span className="text-sm font-mono font-bold">12.4 km/h</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
                      <Thermometer size={16} />
                    </div>
                    <span className="text-sm font-bold">Temp.</span>
                  </div>
                  <span className="text-sm font-mono font-bold">28.5 °C</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-500">
                      <Droplets size={16} />
                    </div>
                    <span className="text-sm font-bold">Hum.</span>
                  </div>
                  <span className="text-sm font-mono font-bold">64 %</span>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <AlertCircle className="shrink-0 text-amber-500" size={16} />
                  <p className="text-[10px] leading-tight font-bold uppercase tracking-wider text-amber-700">
                    Aviso: Viento moderado detectado. Mantenga precaución en maniobras de aterrizaje.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="min-h-0 flex-1 overflow-hidden rounded-2xl border-border shadow-sm">
              <CardHeader className="pb-2 px-4 py-3">
                <CardTitle className="text-base font-bold">
                  Actividad Reciente
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                  Últimas Misiones
                </CardDescription>
              </CardHeader>

              <CardContent className="flex h-full min-h-0 flex-col px-4 pb-4 pt-2">
                <div className="min-h-0 flex-1 space-y-3 overflow-auto pr-1">
                  {recentLogs.map((log, index) => (
                    <div
                      key={index}
                      className="group flex cursor-pointer items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            log.status === "Completado"
                              ? "bg-emerald-500"
                              : "bg-destructive"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-bold">
                            {log.type} - {log.id}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {log.time}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        size={14}
                        className="text-muted-foreground transition-colors group-hover:text-primary"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="mt-4 w-full shrink-0 rounded-lg text-xs font-bold text-primary hover:bg-primary/5"
                >
                  VER HISTORIAL COMPLETO
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}