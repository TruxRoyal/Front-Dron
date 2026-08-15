import { FlightRecord, MediaItem } from './types';

export const FLIGHT_HISTORY: FlightRecord[] = [
  { 
    id: 'M-001', 
    missionName: 'Reconocimiento Sector Norte',
    date: '2024-03-02', 
    time: '08:30',
    duration: '12:45', 
    areaCovered: '2.4 Ha', 
    imagesCaptured: 142, 
    videosCaptured: 3,
    healthScore: 88, 
    status: 'completed',
    thumbnail: 'https://picsum.photos/seed/strawberry1/400/300' 
  },
  { 
    id: 'M-002', 
    missionName: 'Monitoreo Plagas Lote B',
    date: '2024-03-01', 
    time: '10:15',
    duration: '10:20', 
    areaCovered: '1.8 Ha', 
    imagesCaptured: 98, 
    videosCaptured: 1,
    healthScore: 92, 
    status: 'completed',
    thumbnail: 'https://picsum.photos/seed/strawberry2/400/300' 
  },
  { 
    id: 'M-003', 
    missionName: 'Análisis Madurez Lote C',
    date: '2024-02-28', 
    time: '14:20',
    duration: '15:10', 
    areaCovered: '3.1 Ha', 
    imagesCaptured: 210, 
    videosCaptured: 5,
    healthScore: 75, 
    status: 'completed',
    thumbnail: 'https://picsum.photos/seed/strawberry3/400/300' 
  },
  { 
    id: 'M-004', 
    missionName: 'Inspección Riego Sector Sur',
    date: '2024-02-27', 
    time: '09:00',
    duration: '08:30', 
    areaCovered: '1.2 Ha', 
    imagesCaptured: 65, 
    videosCaptured: 0,
    healthScore: 95, 
    status: 'completed',
    thumbnail: 'https://picsum.photos/seed/strawberry4/400/300' 
  },
];

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'IMG-001',
    name: 'Captura_Foliar_01.jpg',
    type: 'image',
    url: 'https://picsum.photos/seed/crop1/1200/800',
    thumbnail: 'https://picsum.photos/seed/crop1/400/300',
    date: '2024-03-02',
    time: '08:35',
    missionId: 'M-001',
    missionName: 'Reconocimiento Sector Norte',
    isFavorite: true,
    metadata: {
      altitude: 25.4,
      speed: 4.2,
      battery: 88,
      signal: 92,
      waypoint: 3,
      location: { lat: -34.397, lng: 150.644 }
    },
    analysis: {
      foliarCoverage: 78,
      maturity: 45,
      spotSeverity: 12,
      generalHealth: 85,
      status: 'completed',
      llmSummary: 'El cultivo muestra una cobertura foliar saludable. Se detectan algunas manchas menores en el cuadrante inferior derecho, posiblemente estrés hídrico temprano.'
    }
  },
  {
    id: 'VID-001',
    name: 'Vuelo_Panoramico_B.mp4',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://picsum.photos/seed/vuelo1/400/300',
    date: '2024-03-02',
    time: '08:40',
    missionId: 'M-001',
    missionName: 'Reconocimiento Sector Norte',
    isFavorite: false,
    metadata: {
      altitude: 30.0,
      speed: 5.5,
      battery: 82,
      signal: 85,
      duration: '00:45',
      location: { lat: -34.398, lng: 150.645 }
    },
    analysis: {
      foliarCoverage: 75,
      maturity: 42,
      spotSeverity: 15,
      generalHealth: 82,
      status: 'completed',
      llmSummary: 'Video de alta calidad que muestra el estado general del lote. Se observa uniformidad en el crecimiento.'
    }
  },
  {
    id: 'IMG-002',
    name: 'Detalle_Fruto_04.jpg',
    type: 'image',
    url: 'https://picsum.photos/seed/fruit1/1200/800',
    thumbnail: 'https://picsum.photos/seed/fruit1/400/300',
    date: '2024-03-01',
    time: '10:20',
    missionId: 'M-002',
    missionName: 'Monitoreo Plagas Lote B',
    isFavorite: false,
    metadata: {
      altitude: 15.2,
      speed: 2.1,
      battery: 92,
      signal: 98,
      waypoint: 7,
      location: { lat: -34.400, lng: 150.650 }
    },
    analysis: {
      foliarCoverage: 82,
      maturity: 65,
      spotSeverity: 5,
      generalHealth: 92,
      status: 'completed',
      llmSummary: 'Excelente estado de madurez. No se observan signos de plagas en esta captura de alta resolución.'
    }
  },
  {
    id: 'IMG-003',
    name: 'Captura_Suelo_09.jpg',
    type: 'image',
    url: 'https://picsum.photos/seed/soil1/1200/800',
    thumbnail: 'https://picsum.photos/seed/soil1/400/300',
    date: '2024-02-28',
    time: '14:30',
    missionId: 'M-003',
    missionName: 'Análisis Madurez Lote C',
    isFavorite: false,
    metadata: {
      altitude: 40.0,
      speed: 6.0,
      battery: 75,
      signal: 80,
      location: { lat: -34.405, lng: 150.660 }
    },
    analysis: {
      foliarCoverage: 65,
      maturity: 30,
      spotSeverity: 25,
      generalHealth: 70,
      status: 'completed',
      llmSummary: 'Se detecta una severidad de manchas superior al promedio. Se recomienda inspección manual para descartar hongos.'
    }
  }
];
