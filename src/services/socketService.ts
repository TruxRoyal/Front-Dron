// src/services/socketService.ts
import { io, Socket } from "socket.io-client";

// Define los tipos que usarás
interface DroneResponse {
  action: string;
  status?: boolean;
  [key: string]: any;
}

// Puedes tipar también el callback que recibirás
type StatusUpdateCallback = (status: any) => void;

// Instancia única del socket
export const socket: Socket = io("http://127.0.0.1:5000", {
  transports: ["websocket"], // Asegura conexión estable
});

// Setup de eventos del socket
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
