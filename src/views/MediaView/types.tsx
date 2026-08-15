export type Tab = 'dashboard' | 'control' | 'autopilot' | 'media' | 'sistema';

export interface FlightRecord {
  id: string;
  date: string;
  time: string;
  duration: string;
  areaCovered: string;
  imagesCaptured: number;
  videosCaptured: number;
  healthScore: number;
  thumbnail: string;
  status: 'completed' | 'processing' | 'error';
  missionName: string;
  folderPath?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  date: string;
  time: string;
  missionId: string;
  missionName: string;
  metadata: {
    altitude: number;
    speed: number;
    battery: number;
    signal: number;
    waypoint?: number;
    location: {
      lat: number;
      lng: number;
    };
    duration?: string; // for video
  };
  analysis?: {
    foliarCoverage: number;
    maturity: number;
    spotSeverity: number;
    generalHealth: number;
    llmSummary?: string;
    status: 'pending' | 'processing' | 'completed';
  };
  isFavorite: boolean;
}

export interface JoystickPosition {
  x: number;
  y: number;
}

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  distance?: number;
}
