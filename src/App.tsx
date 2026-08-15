import "./styles/globals.css";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";

import Page from "./views/page";
import DashboardView from "./views/Dashboard/Dashboard";
import ControlView from "./views/Control/Control";
import { AutopilotView } from "./views/Autopilot/Autopilot";
import { MediaView } from "./views/MediaView/MediaView";
import FlightMissionsView from "./views/FlightMissions/FlightMissions";
import FlightreportView from "./views/FlightReport/FlightReport";
import { SistemaView }  from "./views/Settings/SistemaView";

import { ThemeProvider } from "@/app-components/theme-provider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <ThemeProvider storageKey="electron-ui-theme">
    <HashRouter>
      <Routes>
        <Route path="/" element={<Page />}>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="control" element={<ControlView />} />
          <Route path="autopilot" element={<AutopilotView />} />
          <Route path="flightmissions" element={<MediaView />} />
          <Route path="sistema" element={<SistemaView />} />
          <Route path="flightreport" element={<FlightreportView />} />
          <Route index element={<DashboardView />} />
        </Route>
      </Routes>
    </HashRouter>
  </ThemeProvider>
);