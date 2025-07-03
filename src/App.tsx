import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Page from "./views/page";
import DashboardView from "./views/Dashboard/Dashboard";
import ControlView from "./views/Control/Control";
import AutopilotView from "./views/Autopilot/Autopilot";
import MediaView from "./views/Media/Media";
import SistemaView from "./views/Sistema/Sistema";

const root = createRoot(document.body);

root.render(
  <HashRouter>
      <Routes>
        
        <Route path="/" element={<Page />}>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="control" element={<ControlView />} />
            <Route path="autopilot" element={<AutopilotView />} />
            <Route path="media" element={<MediaView />} />
            <Route path="sistema" element={<SistemaView />} />
            <Route index element={<DashboardView />} />
        </Route>
      </Routes>
  </HashRouter>
);