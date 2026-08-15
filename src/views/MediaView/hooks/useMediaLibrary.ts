import { useState, useEffect } from 'react';
import { FlightRecord, MediaItem } from '../types';

interface ManifestFile {
  filename: string;
  type: string;
  waypoint: number;
  timestamp: string;
  lat: number;
  lng: number;
  altitude: number;
  battery: number;
}

interface RawManifest {
  missionName: string;
  date: string;
  startTime: string;
  endTime: string | null;
  status: string;
  photosTaken: number;
  files: ManifestFile[];
}

interface RawMission {
  folder: string;
  folderPath: string;
  manifest: RawManifest | null;
  files: { filename: string; url: string; type: string }[];
}

function calcDuration(start: string, end: string | null): string {
  if (!end) return '--:--';
  const toSec = (t: string) => t.split(':').reduce((acc, v, i) => acc + Number(v) * [3600, 60, 1][i], 0);
  const diff = toSec(end) - toSec(start);
  if (diff <= 0) return '--:--';
  const m = Math.floor(diff / 60).toString().padStart(2, '0');
  const s = (diff % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function useMediaLibrary() {
  const [missions, setMissions] = useState<FlightRecord[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const raw: RawMission[] = await (globalThis as any).electronAPI.media.listMissions();

      const flightRecords: FlightRecord[] = [];
      const allMedia: MediaItem[] = [];

      for (const mission of raw) {
        const { folder, folderPath, manifest, files } = mission;
        const missionName = manifest?.missionName ?? folder;
        const date = manifest?.date ?? folder.substring(0, 10);
        const startTime = manifest?.startTime ?? '00:00:00';
        const thumbnail = files.find(f => f.type === 'image')?.url ?? files[0]?.url ?? '';
        const imageFiles = files.filter(f => f.type === 'image');
        const videoFiles = files.filter(f => f.type === 'video');

        flightRecords.push({
          id: folder,
          missionName,
          date,
          time: startTime.substring(0, 5),
          duration: calcDuration(startTime, manifest?.endTime ?? null),
          areaCovered: '--',
          imagesCaptured: imageFiles.length,
          videosCaptured: videoFiles.length,
          healthScore: 0,
          status: (manifest?.status as FlightRecord['status']) ?? 'completed',
          thumbnail,
          folderPath,
        });

        for (const file of files) {
          const entry = manifest?.files.find(f => f.filename === file.filename);
          const timeStr = entry?.timestamp
            ? new Date(entry.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
            : startTime.substring(0, 5);

          allMedia.push({
            id: `${folder}/${file.filename}`,
            name: file.filename,
            type: file.type as 'image' | 'video',
            url: file.url,
            thumbnail: file.url,
            date,
            time: timeStr,
            missionId: folder,
            missionName,
            isFavorite: false,
            metadata: {
              altitude: entry?.altitude ?? 0,
              speed: 0,
              battery: entry?.battery ?? 0,
              signal: 0,
              waypoint: entry?.waypoint,
              location: { lat: entry?.lat ?? 0, lng: entry?.lng ?? 0 },
            },
          });
        }
      }

      setMissions(flightRecords);
      setMediaItems(allMedia);
    } catch (e) {
      console.error('[MediaLibrary] Error al cargar archivos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { missions, mediaItems, loading, reload: load };
}
