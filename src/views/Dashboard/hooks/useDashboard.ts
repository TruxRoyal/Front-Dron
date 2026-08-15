import { useState, useEffect, useRef } from 'react';
import { socket } from '@/services/socketService';
import { useMediaLibrary } from '../../MediaView/hooks/useMediaLibrary';

export interface WeatherData {
  temperature: { degrees: number; unit: string };
  feelsLikeTemperature: { degrees: number; unit: string };
  relativeHumidity: number;
  wind: {
    speed: { value: number; unit: string };
    direction: { cardinal: string; degrees: number };
    gust: { value: number; unit: string };
  };
  weatherCondition: {
    description: { text: string };
    type: string;
    iconBaseUri: string;
  };
  precipitation: {
    probability: { percent: number; type: string };
  };
  uvIndex: number;
  visibility: { distance: number; unit: string };
  cloudCover: number;
  isDaytime: boolean;
}

// drone_status payload shape from the backend
interface DroneStatus {
  connected: boolean;
  is_flying: boolean;
  is_landing: boolean;
  battery: number | null;
  height: number | null;
  time: number | null; // tello flight time in seconds
}

function formatSecs(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function useDashboard() {
  const { missions, loading: missionsLoading } = useMediaLibrary();

  // --- Battery & flight state from drone_status ---
  const [battery, setBattery] = useState<number | null>(null);
  const [flyingNow, setFlyingNow] = useState(false);

  // Flight time: track manually since tello's `time` resets each flight
  const [lastFlightSecs, setLastFlightSecs] = useState(0);
  const takeoffAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flyingRef = useRef(false);

  useEffect(() => {
    const onStatus = (data: DroneStatus) => {
      if (data.battery != null) setBattery(data.battery);

      const isFlying = Boolean(data.is_flying);
      const wasFlying = flyingRef.current;
      flyingRef.current = isFlying;
      setFlyingNow(isFlying);

      if (isFlying && !wasFlying) {
        // Just took off — start timer
        takeoffAtRef.current = Date.now();
        timerRef.current = setInterval(() => {
          if (takeoffAtRef.current) {
            setLastFlightSecs(Math.floor((Date.now() - takeoffAtRef.current) / 1000));
          }
        }, 1000);
      } else if (!isFlying && wasFlying) {
        // Just landed — stop timer, freeze value
        if (timerRef.current) clearInterval(timerRef.current);
        if (takeoffAtRef.current) {
          setLastFlightSecs(Math.floor((Date.now() - takeoffAtRef.current) / 1000));
        }
        takeoffAtRef.current = null;
      }
    };

    socket.on('drone_status', onStatus);
    return () => {
      socket.off('drone_status', onStatus);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // --- Weather ---
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const api = (globalThis as any).electronAPI;
      try {
        const geo = await api.geolocation.get();
        const { lat, lng } = geo.location;
        const data = await api.weather.get(lat, lng);
        setWeather(data);
      } catch (e) {
        console.error('[Dashboard] Weather fetch error:', e);
        setWeatherError('No disponible');
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return {
    battery,
    weather,
    weatherLoading,
    weatherError,
    recentMissions: missions.slice(0, 5),
    missionsLoading,
    lastFlightTime: formatSecs(lastFlightSecs),
    flyingNow,
  };
}
