import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";
import Page from "./views/page";
import DashboardView from "./views/Dashboard/Dashboard";
import ControlView from "./views/Control/Control";
import AutopilotView from "./views/Autopilot/Autopilot";
import FlightMissionsView from "./views/FlightMissions/FlightMissions";
import FlightreportView from "./views/FlightReport/FlightReport";
import DroneSettingsView from "./views/Settings/DroneSettings";
import AppSettingsView from "./views/Settings/AppSettings";
import AdvancedSettingsView from "./views/Settings/AdvancedSettings";

const root = createRoot(document.body);

root.render(
  <HashRouter>
      <Routes>
        <Route path="/" element={<Page />}>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="control" element={<ControlView />} />
            <Route path="autopilot" element={<AutopilotView />} />
            <Route path="flightmissions" element={<FlightMissionsView />} />
            <Route path="sistema" element={<DroneSettingsView />} />
            <Route path="flightreport" element={<FlightreportView />} />
            <Route path="aplicativo" element={<AppSettingsView />} />
            <Route path="avanzadas" element={<AdvancedSettingsView />} />
            <Route index element={<DashboardView />} />
        </Route>
      </Routes>
  </HashRouter>
);