import { io, Socket } from "socket.io-client";

interface DroneResponse {
  action: string;
  status?: boolean;
  [key: string]: any;
}

type StatusUpdateCallback = (status: any) => void;

const SOCKET_URL = process.env.SOCKET_URL || "https://localhost::5000";

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

export const setupSocketEvents = (onStatusUpdate: StatusUpdateCallback): void => {
  socket.on("connect", () => {
    console.log("✅ Conectado al WebSocket", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Desconectado del WebSocket");
  });

  socket.on("drone_status", onStatusUpdate);

  socket.on("drone_response", (data: DroneResponse) => {
    console.log("📡 Respuesta del backend:", data);

    if (data.action === "reset") {
      const status = data.status ? "✅ Reiniciado" : "❌ Falló el reinicio";
      alert(`Estado del dron: ${status}`);
    }
  });
};

// Enviar comandos al backend
export const sendCommand = (command: string, data: Record<string, any> = {}): void => {
  socket.emit(command, data);
};

// Exportación para uso directo si se necesita
export const socketInstance = socket;
