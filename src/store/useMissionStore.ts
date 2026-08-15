import { create } from 'zustand';

export type MissionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  distance?: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  event: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface MissionState {
  missionName: string;
  status: MissionStatus;
  waypoints: Waypoint[];
  currentWaypointIndex: number;
  origin: { lat: number; lng: number } | null;
  defaultAltitude: number;
  defaultSpeed: number;
  tolerance: number;
  
  photosTaken: number;

  // Telemetry
  dronePos: { lat: number; lng: number; alt: number; yaw: number };
  battery: number;
  signal: number;
  flightPath: { lat: number; lng: number }[];
  
  logs: LogEntry[];

  // Actions
  setMissionName: (name: string) => void;
  setDefaultAltitude: (v: number) => void;
  setDefaultSpeed: (v: number) => void;
  setOrigin: (origin: { lat: number; lng: number }) => void;
  addWaypoint: (waypoint: Waypoint) => void;
  removeWaypoint: (id: string) => void;
  updateWaypoint: (id: string, updates: Partial<Waypoint>) => void;
  startMission: () => void;
  pauseMission: () => void;
  stopMission: () => void;
  resetMission: () => void;
  addLog: (event: string, type?: LogEntry['type']) => void;
  updateTelemetry: (telemetry: Partial<MissionState['dronePos'] & { battery: number; signal: number }>) => void;
  syncFromBackend: (update: {
    drone: { lat: number; lon: number; z: number; yaw: number };
    path: { lat: number; lng: number }[];
    mission: { status: string; currentWaypoint: number; totalWaypoints: number; photosTaken: number };
  }) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  missionName: 'Misión de Reconocimiento',
  status: 'idle',
  waypoints: [],
  currentWaypointIndex: -1,
  origin: null,
  defaultAltitude: 30,
  defaultSpeed: 5,
  tolerance: 2,
  
  dronePos: { lat: 4.6097, lng: -74.0818, alt: 0, yaw: 0 },
  photosTaken: 0,
  battery: 100,
  signal: 100,
  flightPath: [],
  
  logs: [],

  setMissionName: (name) => set({ missionName: name }),
  setDefaultAltitude: (v) => set({ defaultAltitude: v }),
  setDefaultSpeed: (v) => set({ defaultSpeed: v }),
  setOrigin: (origin) => set((state) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      event: `Punto de origen establecido: ${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}`,
      type: 'info'
    };
    return { origin, dronePos: { ...state.dronePos, lat: origin.lat, lng: origin.lng }, logs: [newLog, ...state.logs] };
  }),
  addWaypoint: (wp) => set((state) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      event: `Waypoint #${state.waypoints.length + 1} añadido`,
      type: 'info'
    };
    return { waypoints: [...state.waypoints, wp], logs: [newLog, ...state.logs] };
  }),
  removeWaypoint: (id) => set((state) => ({
    waypoints: state.waypoints.filter(w => w.id !== id)
  })),
  updateWaypoint: (id, updates) => set((state) => ({
    waypoints: state.waypoints.map(w => w.id === id ? { ...w, ...updates } : w)
  })),
  startMission: () => set((state) => {
    if (state.waypoints.length === 0) return state;
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      event: 'Misión iniciada',
      type: 'success'
    };
    return { status: 'running', currentWaypointIndex: 0, logs: [newLog, ...state.logs] };
  }),
  pauseMission: () => set((state) => ({
    status: 'paused',
    logs: [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      event: 'Misión pausada',
      type: 'warning'
    }, ...state.logs]
  })),
  stopMission: () => set((state) => ({
    status: 'idle',
    currentWaypointIndex: -1,
    logs: [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      event: 'Misión detenida',
      type: 'error'
    }, ...state.logs]
  })),
  resetMission: () => set({
    status: 'idle',
    waypoints: [],
    currentWaypointIndex: -1,
    origin: null,
    flightPath: [],
    logs: [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      event: 'Misión reseteada',
      type: 'info'
    }]
  }),
  addLog: (event, type = 'info') => set((state) => ({
    logs: [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      event,
      type
    }, ...state.logs]
  })),
  updateTelemetry: (telemetry) => set((state) => ({
    ...telemetry,
    dronePos: { ...state.dronePos, ...telemetry },
    flightPath: telemetry.lat && telemetry.lng
      ? [...state.flightPath, { lat: telemetry.lat, lng: telemetry.lng }]
      : state.flightPath
  })),
  syncFromBackend: (update) => set({
    dronePos: {
      lat: update.drone.lat,
      lng: update.drone.lon,
      alt: update.drone.z,
      yaw: update.drone.yaw,
    },
    flightPath: update.path,
    status: update.mission.status.toLowerCase() as MissionStatus,
    currentWaypointIndex: update.mission.currentWaypoint,
    photosTaken: update.mission.photosTaken,
  }),
}));
