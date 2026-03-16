import "./index.css";
import "./App";

import { setupSocketEvents } from "./services/socketService";
import { updateDroneStatusUI } from "./services/uiService";

setupSocketEvents(updateDroneStatusUI);

console.log('👋 Este mensaje proviene de "renderer.ts", cargado vía Webpack.');