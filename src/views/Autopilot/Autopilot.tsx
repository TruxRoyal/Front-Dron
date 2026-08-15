import React, { useState, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Polyline
} from '@react-google-maps/api';
import {
  Navigation,
  Play,
  Pause,
  Square,
  RotateCcw,
  Trash2,
  Settings2,
  Activity,
  Battery,
  Wifi,
  Map as MapIcon,
  ChevronRight,
  History,
  AlertCircle,
  CheckCircle2,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useMissionStore, Waypoint } from '@/store/useMissionStore';
import { useMissionSocket } from './hooks/useMissionSocket';
import { cn } from '@/lib/utils';

const containerStyle = {
  width: '100%',
  height: '100%'
};


const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeId: 'satellite',
  styles: [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#242f3e" }]
    }
  ]
};

declare const __GOOGLE_MAPS_API_KEY__: string;

export const AutopilotView = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: __GOOGLE_MAPS_API_KEY__
  });

  const {
    missionName,
    status,
    waypoints,
    currentWaypointIndex,
    origin,
    defaultAltitude,
    defaultSpeed,
    dronePos,
    battery,
    signal,
    flightPath,
    logs,
    setMissionName,
    setDefaultAltitude,
    setDefaultSpeed,
    setOrigin,
    addWaypoint,
    removeWaypoint,
    startMission,
    pauseMission,
    stopMission,
    resetMission,
    photosTaken,
  } = useMissionStore();

  const { emitTakeoffStart, emitPause, emitStop, emitReset, emitOrigin } = useMissionSocket();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [locating, setLocating] = useState(false);
  const [myPosition, setMyPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [initialCenter] = useState(() => ({ lat: dronePos.lat, lng: dronePos.lng }));

  const onLoad = useCallback(function callback(m: google.maps.Map) {
    setMap(m);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleLocate = async () => {
    setLocating(true);
    try {
      const result = await (globalThis as any).electronAPI.geolocation.get();
      const pos = { lat: result.location.lat, lng: result.location.lng };
      map?.panTo(pos);
      setMyPosition(pos);
    } catch {
      map?.panTo({ lat: dronePos.lat, lng: dronePos.lng });
    } finally {
      setLocating(false);
    }
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newWaypoint: Waypoint = {
      id: Math.random().toString(36).substring(2, 11),
      lat,
      lng,
      altitude: defaultAltitude,
      speed: defaultSpeed
    };
    addWaypoint(newWaypoint);
  };

  const onMapRightClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setOrigin({ lat, lng });
    emitOrigin(lat, lng);
  };

  return (
    <div className="h-full overflow-hidden p-4 animate-in fade-in duration-700">
      <div className="flex h-full min-h-0 gap-4">
        {/* Left Sidebar: Mission Config & Waypoints */}
        <aside className="w-80 bg-[#f8fafc] text-slate-900 rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-2xl ring-1 ring-black/5">
          {/* Header Section - Dark Agro Green for a professional look */}
          <div className="p-6 bg-[#004d3b] text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 rounded-2xl bg-agro-green shadow-xl shadow-black/20">
                <Settings2 size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-[12px] uppercase tracking-[0.2em]">Autopiloto</h3>
                <p className="text-[9px] text-agro-green-light/60 font-bold uppercase tracking-widest">Configuración de Vuelo</p>
              </div>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black text-white/40 tracking-[0.15em] ml-1">Nombre de Misión</label>
                <Input
                  value={missionName}
                  onChange={(e) => setMissionName(e.target.value)}
                  className="bg-white/10 border-white/10 h-11 text-xs font-bold focus:ring-agro-green/40 rounded-xl text-white placeholder:text-white/20 backdrop-blur-sm"
                  placeholder="Ej: Fumigación Sector A..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-white/40 tracking-[0.15em] ml-1">Altitud (m)</label>
                  <Input type="number" value={defaultAltitude} onChange={(e) => setDefaultAltitude(Number(e.target.value))} className="bg-white/10 border-white/10 h-11 text-xs font-bold rounded-xl text-white backdrop-blur-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-white/40 tracking-[0.15em] ml-1">Velocidad (m/s)</label>
                  <Input type="number" value={defaultSpeed} onChange={(e) => setDefaultSpeed(Number(e.target.value))} className="bg-white/10 border-white/10 h-11 text-xs font-bold rounded-xl text-white backdrop-blur-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Waypoints List Section - Constrained height to prevent overlap */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MapIcon size={14} className="text-agro-green" />
                <h3 className="font-black text-[10px] uppercase tracking-[0.15em] text-slate-600">Ruta de Navegación</h3>
              </div>
              <Badge className="bg-slate-100 text-slate-600 border-slate-200 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                {waypoints.length} Puntos
              </Badge>
            </div>

            <div className="flex-1 overflow-hidden bg-slate-50/50">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {waypoints.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-20 h-20 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto rotate-6 transition-transform hover:rotate-0 duration-500">
                        <MapIcon size={32} className="text-slate-200" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Sin Waypoints</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-10 leading-relaxed">Marca puntos en el mapa para iniciar la misión</p>
                      </div>
                    </div>
                  )}
                  {waypoints.map((wp, index) => (
                    <div
                      key={wp.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                        currentWaypointIndex === index
                          ? "bg-white border-agro-green shadow-xl ring-1 ring-agro-green/20 scale-[1.02] z-10"
                          : "bg-white border-slate-200 hover:border-agro-green/30 hover:shadow-md"
                      )}
                    >
                      {currentWaypointIndex === index && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-agro-green animate-pulse" />
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center text-[12px] font-black transition-all shadow-sm",
                            currentWaypointIndex === index ? "bg-agro-green text-white rotate-3" : "bg-slate-100 text-slate-500"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest block">Waypoint</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Punto de Control</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-300 hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-all rounded-xl"
                          onClick={(e) => { e.stopPropagation(); removeWaypoint(wp.id); }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest block">Latitud</span>
                          <p className="text-slate-700 font-mono tracking-tight">{wp.lat.toFixed(6)}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest block">Longitud</span>
                          <p className="text-slate-700 font-mono tracking-tight">{wp.lng.toFixed(6)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Controls Section - High Z-index and explicit background to prevent overlap */}
          <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-12px_30px_rgba(0,0,0,0.06)] space-y-3 z-30 relative">
            <Button
              disabled={status === 'running' || waypoints.length === 0}
              onClick={() => emitTakeoffStart(waypoints)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              <Play size={16} className="mr-2 fill-current" /> Despegar e Iniciar
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={status === 'running' || waypoints.length === 0}
                onClick={() => { startMission(); emitTakeoffStart(waypoints); }}
                className="bg-agro-green hover:bg-agro-dark text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl shadow-lg shadow-agro-green/20 transition-all active:scale-95 group"
              >
                <Play size={16} className="mr-2 fill-current group-hover:scale-110 transition-transform" /> Iniciar
              </Button>
              <Button
                disabled={status !== 'running'}
                onClick={() => { pauseMission(); emitPause(); }}
                variant="outline"
                className="border-slate-200 hover:bg-slate-50 text-slate-600 font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl transition-all active:scale-95"
              >
                <Pause size={16} className="mr-2 fill-current" /> Pausar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={status === 'idle'}
                onClick={() => { stopMission(); emitStop(); }}
                variant="destructive"
                className="font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl shadow-lg shadow-destructive/20 transition-all active:scale-95"
              >
                <Square size={16} className="mr-2 fill-current" /> Detener
              </Button>
              <Button
                onClick={() => { resetMission(); emitReset(); }}
                variant="ghost"
                className="text-slate-400 hover:text-slate-600 font-black uppercase tracking-widest text-[10px] h-12 rounded-2xl transition-all"
              >
                <RotateCcw size={16} className="mr-2" /> Reset
              </Button>
            </div>
          </div>
        </aside>

        {/* Center: Map */}
        <main className="flex-1 bg-slate-200 rounded-[2.5rem] overflow-hidden border border-slate-300/50 shadow-2xl relative ring-1 ring-black/5">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={initialCenter}
              zoom={15}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={onMapClick}
              onRightClick={onMapRightClick}
              options={mapOptions}
            >
              {myPosition && (
                <Marker
                  position={myPosition}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#3b82f6',
                    fillOpacity: 1,
                    strokeWeight: 3,
                    strokeColor: '#ffffff',
                    scale: 8
                  }}
                />
              )}
              
              {origin && (
                <Marker
                  position={origin}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#ef4444',
                    fillOpacity: 1,
                    strokeWeight: 3,
                    strokeColor: '#ffffff',
                    scale: 9
                  }}
                  label={{
                    text: 'H',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '900'
                  }}
                />
              )}

              {waypoints.map((wp, index) => (
                <Marker
                  key={wp.id}
                  position={{ lat: wp.lat, lng: wp.lng }}
                  label={{
                    text: (index + 1).toString(),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '900'
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#008966',
                    fillOpacity: 1,
                    strokeWeight: 3,
                    strokeColor: '#ffffff',
                    scale: 11
                  }}
                />
              ))}

              {waypoints.length > 1 && (
                <Polyline
                  path={waypoints.map(w => ({ lat: w.lat, lng: w.lng }))}
                  options={{
                    strokeColor: '#008966',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    geodesic: true,
                    icons: [{
                      icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: '#ffffff', strokeWeight: 2 },
                      offset: '50%',
                      repeat: '100px'
                    }]
                  }}
                />
              )}

              {flightPath.length > 1 && (
                <Polyline
                  path={flightPath}
                  options={{
                    strokeColor: '#10b981',
                    strokeOpacity: 0.9,
                    strokeWeight: 2,
                    geodesic: true
                  }}
                />
              )}

              <Marker
                position={{ lat: dronePos.lat, lng: dronePos.lng }}
                icon={{
                  path: "M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z",
                  fillColor: '#008966',
                  fillOpacity: 1,
                  strokeWeight: 3,
                  strokeColor: '#ffffff',
                  scale: 1.8,
                  rotation: dronePos.yaw,
                  anchor: new google.maps.Point(12, 12)
                }}
              />
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-agro-green/10 border-t-agro-green rounded-full animate-spin mx-auto shadow-xl" />
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Sincronizando Satélites</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">Iniciando Protocolos de Navegación...</p>
                </div>
              </div>
            </div>
          )}

          {/* Map Overlay Controls */}
          <div className="absolute top-8 right-8 flex flex-col gap-3">
            <Button size="icon" className="w-12 h-12 bg-white/95 backdrop-blur shadow-xl border border-slate-200 hover:bg-white text-slate-700 rounded-2xl transition-all active:scale-90 group">
              <MapIcon size={20} className="group-hover:text-agro-green transition-colors" />
            </Button>
            <Button
              size="icon"
              onClick={handleLocate}
              disabled={locating}
              title="Ir a mi ubicación"
              className="w-12 h-12 bg-white/95 backdrop-blur shadow-xl border border-slate-200 hover:bg-white text-slate-700 rounded-2xl transition-all active:scale-90 group"
            >
              {locating
                ? <div className="w-4 h-4 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin" />
                : <Navigation size={20} className="group-hover:text-agro-green transition-colors" />
              }
            </Button>
          </div>
        </main>

        {/* Right Sidebar: Telemetry & Progress */}
        <aside className="w-80 bg-[#f8fafc] text-slate-900 rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-2xl ring-1 ring-black/5">
          {/* Telemetry Header - Dark Agro Green */}
          <div className="p-6 bg-[#004d3b] text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16 blur-3xl" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 rounded-2xl bg-agro-green shadow-xl shadow-black/20">
                <Activity size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-[12px] uppercase tracking-[0.2em]">Telemetría</h3>
                <p className="text-[9px] text-agro-green-light/60 font-bold uppercase tracking-widest">Estado en Tiempo Real</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Altitud</p>
                <p className="text-xl font-black text-white tabular-nums">{dronePos.alt.toFixed(1)}<span className="text-[10px] ml-1 text-white/40">m</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Yaw</p>
                <p className="text-xl font-black text-white tabular-nums">{dronePos.yaw.toFixed(0)}<span className="text-[10px] ml-1 text-white/40">°</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Batería</p>
                  <Battery size={10} className={cn(battery < 20 ? "text-destructive animate-pulse" : "text-agro-green")} />
                </div>
                <p className={cn("text-xl font-black tabular-nums", battery < 20 ? "text-destructive" : "text-white")}>
                  {battery.toFixed(0)}<span className="text-[10px] ml-1 text-white/40">%</span>
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Señal</p>
                  <Wifi size={10} className="text-blue-400" />
                </div>
                <p className="text-xl font-black text-blue-400 tabular-nums">{signal.toFixed(0)}<span className="text-[10px] ml-1 text-white/40">%</span></p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm space-y-2 relative z-10">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <span className="text-white/30">Coordenadas GPS</span>
                <div className="w-1.5 h-1.5 rounded-full bg-agro-green animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold font-mono">
                  <span className="text-white/20">LAT</span>
                  <span className="text-agro-green-light">{dronePos.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold font-mono">
                  <span className="text-white/20">LNG</span>
                  <span className="text-agro-green-light">{dronePos.lng.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col min-h-0 bg-white">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="p-2 rounded-xl bg-agro-green/10">
                <ChevronRight size={16} className="text-agro-green" />
              </div>
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-800">Progreso de Misión</h3>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado del Sistema</p>
                  <Badge className={cn(
                    "font-black uppercase tracking-widest text-[9px] px-4 py-1.5 border-none shadow-sm rounded-full",
                    status === 'running' ? "bg-agro-green text-white" :
                      status === 'paused' ? "bg-amber-500 text-white" :
                        status === 'completed' ? "bg-blue-500 text-white" :
                          "bg-slate-200 text-slate-500"
                  )}>
                    {status === 'running' ? 'En Vuelo' :
                      status === 'paused' ? 'Pausado' :
                        status === 'completed' ? 'Completado' : 'En Espera'}
                  </Badge>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner p-1">
                  <div
                    className="h-full bg-agro-green rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(0,137,102,0.4)] relative"
                    style={{ width: `${waypoints.length > 0 ? ((currentWaypointIndex + 1) / waypoints.length) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Waypoint Actual</p>
                  <p className="text-3xl font-black text-slate-800 tabular-nums">
                    {waypoints.length > 0 ? currentWaypointIndex + 1 : 0}
                    <span className="text-lg text-slate-300 mx-1.5">/</span>
                    {waypoints.length}
                  </p>
                </div>
                <div className="text-center p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Fotos</p>
                  <div className="flex items-center justify-center gap-2">
                    <Wind size={16} className="text-agro-green/40" />
                    <p className="text-3xl font-black text-slate-800 tabular-nums">{photosTaken}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
