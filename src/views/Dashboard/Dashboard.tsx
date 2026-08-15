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
  Lightbulb,
  Sprout,
  CloudRain,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Sun,
  Cloud,
  Loader2,
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
import { cropHealthData } from "./types/DashboardTypes";
import { MetricCard } from "./components/MetricCard";
import { WifiSignalCard } from "./components/WifiSignalCard";
import { useDashboard } from "./hooks/useDashboard";

const CONDITION_ICONS: Record<string, React.ElementType> = {
  CLOUDY: Cloud,
  MOSTLY_CLOUDY: Cloud,
  PARTLY_CLOUDY: Cloud,
  CLEAR: Sun,
  MOSTLY_CLEAR: Sun,
  RAIN: CloudRain,
  DRIZZLE: CloudRain,
  THUNDERSTORM: CloudRain,
};

export default function Dashboard() {
  const {
    battery,
    weather,
    weatherLoading,
    weatherError,
    recentMissions,
    missionsLoading,
    lastFlightTime,
    flyingNow,
  } = useDashboard();

  const ConditionIcon = weather
    ? (CONDITION_ICONS[weather.weatherCondition.type] ?? Cloud)
    : Cloud;

  const windSpeed = weather?.wind.speed.value ?? 0;
  const windWarning = windSpeed > 20;
  const rainWarning = (weather?.precipitation.probability.percent ?? 0) > 50;

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="flex h-full min-h-0 flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* BATERÍA */}
          <Card className="bg-primary text-white border-none shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-xl bg-white/20 p-3">
                <Battery size={24} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold uppercase tracking-widest">Batería</p>
                  <p className="text-sm font-bold">{battery != null ? `${battery}%` : '--'}</p>
                </div>

                <Progress
                  value={battery ?? 0}
                  className="h-2 bg-white/20"
                  indicatorClassName="bg-white"
                />

                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider opacity-70">
                  {battery != null
                    ? `~ ${Math.round(battery * 13 / 100)} min restantes`
                    : 'Dron no conectado'}
                </p>
              </div>
            </CardContent>
          </Card>

          <WifiSignalCard />

          {/* TIEMPO DE VUELO */}
          <MetricCard
            icon={Clock}
            label="Último Tiempo Vuelo"
            value={lastFlightTime}
            subValue={flyingNow ? 'Volando ahora' : 'Sesión actual'}
            colorClass={flyingNow ? 'bg-emerald-500' : 'bg-amber-500'}
          />
        </div>

        <div className="grid flex-1 min-h-0 grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 flex min-h-0 flex-col gap-4">
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-border shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-4 bg-muted/20 border-b border-border/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl">
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Tips y Recomendaciones</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sugerencias inteligentes para tu cultivo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="min-h-0 flex-1 overflow-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white text-emerald-500 rounded-2xl shadow-sm"><Sprout size={24} /></div>
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Salud del Cultivo</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    El sector Norte muestra un vigor excepcional. Se recomienda mantener el régimen actual de fertilización por 10 días más.
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white text-blue-500 rounded-2xl shadow-sm"><CloudRain size={24} /></div>
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Ventana de Vuelo</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {weather && !rainWarning && !windWarning
                      ? `Condiciones ${weather.weatherCondition.description.text.toLowerCase()} con ${weather.wind.speed.value} km/h de viento. Apto para vuelo.`
                      : 'Revisa las condiciones meteorológicas antes de iniciar la misión.'}
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-amber-50 border border-amber-100 group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white text-amber-500 rounded-2xl shadow-sm"><AlertTriangle size={24} /></div>
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Alerta de Estrés</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Se detectaron ligeras variaciones en la humedad del Lote B. Considera una inspección manual o ajuste de riego.
                  </p>
                </div>

                <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white text-slate-500 rounded-2xl shadow-sm"><ShieldCheck size={24} /></div>
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Mantenimiento</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Tus hélices han completado 25 horas de vuelo. Se recomienda una inspección visual antes de la próxima misión.
                  </p>
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
            {/* CONDICIONES CLIMATICAS */}
            <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
              <CardHeader className="pb-2 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Condiciones</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                      Clima en Tiempo Real
                    </CardDescription>
                  </div>
                  {weather && (
                    <div className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2 py-1">
                      <ConditionIcon size={14} className="text-muted-foreground" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                        {weather.weatherCondition.description.text}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 px-4 pb-4 pt-2">
                {weatherLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 size={20} className="animate-spin text-muted-foreground" />
                  </div>
                ) : weatherError || !weather ? (
                  <p className="text-center text-xs text-muted-foreground py-4">{weatherError ?? 'Sin datos'}</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                          <Wind size={16} />
                        </div>
                        <span className="text-sm font-bold">Viento</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold">{weather.wind.speed.value} km/h</span>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">{weather.wind.direction.cardinal} · ráfaga {weather.wind.gust.value} km/h</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
                          <Thermometer size={16} />
                        </div>
                        <span className="text-sm font-bold">Temp.</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold">{weather.temperature.degrees.toFixed(1)} °C</span>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">Sens. {weather.feelsLikeTemperature.degrees.toFixed(1)} °C</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-500">
                          <Droplets size={16} />
                        </div>
                        <span className="text-sm font-bold">Hum. / Lluvia</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold">{weather.relativeHumidity}%</span>
                        <p className="text-[9px] font-bold uppercase text-muted-foreground">{weather.precipitation.probability.percent}% prob. lluvia</p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start gap-3 rounded-xl border p-3 ${
                        windWarning || rainWarning
                          ? 'border-amber-100 bg-amber-50'
                          : 'border-emerald-100 bg-emerald-50'
                      }`}
                    >
                      <AlertCircle
                        className={`shrink-0 ${windWarning || rainWarning ? 'text-amber-500' : 'text-emerald-500'}`}
                        size={16}
                      />
                      <p className={`text-[10px] leading-tight font-bold uppercase tracking-wider ${windWarning || rainWarning ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {windWarning
                          ? `Viento fuerte (${weather.wind.speed.value} km/h). Precaución en maniobras.`
                          : rainWarning
                          ? `${weather.precipitation.probability.percent}% probabilidad de lluvia. Considera posponer.`
                          : 'Condiciones óptimas para vuelo.'}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* ÚLTIMAS MISIONES */}
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
                  {missionsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 size={20} className="animate-spin text-muted-foreground" />
                    </div>
                  ) : recentMissions.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground py-4">Sin misiones registradas</p>
                  ) : (
                    recentMissions.map((mission) => (
                      <div
                        key={mission.id}
                        className="group flex cursor-pointer items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              mission.status === 'completed'
                                ? 'bg-emerald-500'
                                : mission.status === 'error'
                                ? 'bg-destructive'
                                : 'bg-amber-400'
                            }`}
                          />
                          <div>
                            <p className="text-xs font-bold truncate max-w-[160px]">
                              {mission.missionName}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {mission.date} · {mission.imagesCaptured} fotos
                            </p>
                          </div>
                        </div>

                        <ChevronRight
                          size={14}
                          className="text-muted-foreground transition-colors group-hover:text-primary"
                        />
                      </div>
                    ))
                  )}
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
