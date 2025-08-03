// src/renderer.ts

// Estilos globales
import "./index.css";

// App principal (si React renderiza aquí)
import "./App";

// Servicios
import { setupSocketEvents, sendCommand } from "./services/socketService";
import { updateDroneStatusUI } from "./services/uiService";
import { startVideoStream } from "./services/imageService";

// Controles
import { setupKeyboardControls } from "./hooks/useKeyboardControl";
import { setupGamepadControls } from "./hooks/useGamepadController";

// 🚀 Socket conectado y escucha de eventos
setupSocketEvents(updateDroneStatusUI);

// 🛫 Botones de control
window.addEventListener("DOMContentLoaded", () => {
  const bindButton = (id: string, handler: () => void) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", handler);
    } else {
      console.warn(`⚠️ Botón con id "${id}" not found.`);
    }
  };

  bindButton("takeoff-btn", () => sendCommand("takeoff"));
  bindButton("land-btn", () => sendCommand("land"));
  bindButton("take-photo-btn", () => sendCommand("capture_photo"));
  bindButton("start-recording-btn", () => sendCommand("start_recording"));
  bindButton("stop-recording-btn", () => sendCommand("stop_recording"));
  bindButton("reset-drone", () => {
    sendCommand("reset");
    //showAlert("♻️ Reiniciando conexión con el dron...");
  });

  // Controles
  setupKeyboardControls();
  setupGamepadControls();

  // Video
  startVideoStream();
});

console.log('👋 Este mensaje proviene de "renderer.ts", cargado vía Webpack.');
