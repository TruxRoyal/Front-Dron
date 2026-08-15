import { useEffect } from "react";
import { missionSocket } from "@/services/missionSocket";
import { useMissionStore, Waypoint } from "@/store/useMissionStore";


interface BackendDroneState {
  x: number;
  y: number;
  z: number;
  yaw: number;
  lat: number;
  lon: number;
}

interface BackendMissionState {
  status: string;
  currentWaypoint: number;
  totalWaypoints: number;
  photosTaken: number;
}

interface MissionUpdate {
  drone: BackendDroneState;
  path: { lat: number; lng: number }[];
  mission: BackendMissionState;
}

export const useMissionSocket = () => {
  const syncFromBackend = useMissionStore((s) => s.syncFromBackend);
  const addLog = useMissionStore((s) => s.addLog);
  const missionName = useMissionStore((s) => s.missionName);

  useEffect(() => {
    missionSocket.connect();

    missionSocket.on("mission_update", (data: MissionUpdate) => {
      syncFromBackend(data);
    });

    missionSocket.on("mission_error", (data: { message: string }) => {
      console.error("[Mission]", data.message);
      addLog(`Error: ${data.message}`, 'error');
    });

    return () => {
      missionSocket.off("mission_update");
      missionSocket.off("mission_error");
      missionSocket.disconnect();
    };
  }, [syncFromBackend]);

  const emitOrigin = (lat: number, lng: number) => {
    missionSocket.emit("mission_set_origin", { lat, lng });
  };

  const emitWaypoints = (waypoints: Waypoint[]) => {
    missionSocket.emit("mission_load_waypoints", { waypoints });
  };

  const emitStart = (waypoints: Waypoint[]) => {
    missionSocket.emit("mission_load_waypoints", { waypoints });
    missionSocket.emit("mission_start", { mission_name: missionName });
  };

  const emitTakeoffStart = (waypoints: Waypoint[]) => {
    missionSocket.emit("mission_load_waypoints", { waypoints });
    missionSocket.emit("mission_takeoff_start", { mission_name: missionName });
  };

  const emitPause = () => {
    missionSocket.emit("mission_pause");
  };

  const emitStop = () => {
    missionSocket.emit("mission_stop");
  };

  const emitReset = () => {
    missionSocket.emit("mission_reset");
  };

  return { emitOrigin, emitWaypoints, emitStart, emitTakeoffStart, emitPause, emitStop, emitReset };
};
