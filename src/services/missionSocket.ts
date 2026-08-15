import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000/mission";

export const missionSocket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
