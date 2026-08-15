import { app, BrowserWindow, session, screen, nativeImage, ipcMain, shell, protocol, net } from "electron";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";

import {
  scanWifiNetworks,
  connectToWifi,
  getCurrentWifiConnection,
} from "./services/wifi.service";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

dotenv.config();

if (process.env.GOOGLE_GEOLOCATION_API_KEY) {
  app.commandLine.appendSwitch('google-api-key', process.env.GOOGLE_GEOLOCATION_API_KEY);
}

if (require("electron-squirrel-startup")) {
  app.quit();
}

ipcMain.handle("wifi:scan", async () => {
  return scanWifiNetworks();
});

ipcMain.handle(
  "wifi:connect",
  async (_event, payload: { ssid: string; password?: string }) => {
    return connectToWifi(payload.ssid, payload.password);
  }
);

ipcMain.handle("wifi:current", async () => {
  return getCurrentWifiConnection();
});

ipcMain.handle("media:list-missions", async () => {
  const baseDir = path.join(os.homedir(), "Pictures", "Misiones de Vuelo");

  try {
    await fs.access(baseDir);
  } catch {
    return [];
  }

  const buildMediaUrl = (absolutePath: string) =>
    `media-local://file?path=${encodeURIComponent(absolutePath)}`;

  const entries = await fs.readdir(baseDir, { withFileTypes: true });

  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((leftFolder, rightFolder) => rightFolder.localeCompare(leftFolder));

  const missions = await Promise.all(
    folders.map(async (folder) => {
      const folderPath = path.join(baseDir, folder);

      let manifest: Record<string, unknown> | null = null;
      try {
        const rawManifest = await fs.readFile(path.join(folderPath, "manifest.json"), "utf-8");
        manifest = JSON.parse(rawManifest);
      } catch {
        manifest = null;
      }

      const allFiles = await fs.readdir(folderPath);

      const mediaFiles = allFiles
        .filter((fileName) => /\.(jpg|jpeg|png|mp4|mov)$/i.test(fileName))
        .sort((leftFile, rightFile) => leftFile.localeCompare(rightFile))
        .map((fileName) => {
          const absoluteFilePath = path.join(folderPath, fileName);

          return {
            filename: fileName,
            url: buildMediaUrl(absoluteFilePath),
            type: /\.(mp4|mov)$/i.test(fileName) ? "video" : "image",
            extension: path.extname(fileName).toLowerCase(),
          };
        });

      return {
        folder,
        folderPath,
        manifest,
        files: mediaFiles,
      };
    })
  );

  return missions.filter((mission) => mission.files.length > 0);
});

ipcMain.handle("media:open-folder", async (_event, folderPath: string) => {
  await shell.openPath(folderPath);
});

ipcMain.handle("weather:get", async (_event, { lat, lng }: { lat: number; lng: number }) => {
  const apiKey = process.env.GOOGLE_GEOLOCATION_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEOLOCATION_API_KEY not set");
  const res = await fetch(
    `https://weather.googleapis.com/v1/currentConditions:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}`
  );
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
});

ipcMain.handle("geolocation:get", async () => {
  const apiKey = process.env.GOOGLE_GEOLOCATION_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEOLOCATION_API_KEY not set");
  const res = await fetch(
    `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) }
  );
  if (!res.ok) throw new Error(`Geolocation API error: ${res.status}`);
  return res.json() as Promise<{ location: { lat: number; lng: number }; accuracy: number }>;
});

const configureCSP = (): void => {
  const isDevelopment = process.env.NODE_ENV === "development";

  const googleMapsScripts =
    "https://maps.googleapis.com https://maps.gstatic.com";
  const googleMapsImages =
    "https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com https://*.google.com blob:";
  const googleMapsConnect =
    "https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com";

  const cspDirectives = [
    "default-src 'self'",
    `img-src 'self' file: media-local: data: blob: ${googleMapsImages}`,
    "media-src 'self' file: media-local: blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "frame-src 'self'",
    "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
  ];

  const connectSrc = [
    "'self'",
    "ws://127.0.0.1:5000",
    "ws://localhost:3000",
    "ws://localhost:5000",
    "http://localhost:*",
    "http://127.0.0.1:*",
    googleMapsConnect,
  ];

  if (isDevelopment) {
    cspDirectives.push(
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${googleMapsScripts}`
    );
  } else {
    cspDirectives.push(`script-src 'self' ${googleMapsScripts}`);
    cspDirectives.push("object-src 'none'");
    cspDirectives.push("base-uri 'none'");
  }

  cspDirectives.push(`connect-src ${connectSrc.join(" ")}`);

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [cspDirectives.join("; ")],
      },
    });
  });
};

const getIconPath = (): string => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "assets", "agroDron.ico");
  }

  return path.join(process.cwd(), "assets", "agroDron.ico");
};

const createWindow = (): BrowserWindow => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.7),
    height: Math.floor(height * 0.8),
    center: true,
    autoHideMenuBar: true,
    icon: nativeImage.createFromPath(getIconPath()),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: true,
      contextIsolation: true,
      sandbox: true,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  return mainWindow;
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'media-local',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
]);

app.whenReady().then(() => {
  protocol.handle("media-local", async (request) => {
    try {
      const requestUrl = new URL(request.url);
      const encodedFilePath = requestUrl.searchParams.get("path");

      if (!encodedFilePath) {
        return new Response("Missing path", { status: 400 });
      }

      const filePath = decodeURIComponent(encodedFilePath);
      const extension = path.extname(filePath).toLowerCase();

      const mimeTypes: Record<string, string> = {
        ".mp4": "video/mp4",
        ".mov": "video/quicktime",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
      };

      const contentType = mimeTypes[extension] ?? "application/octet-stream";
      const fileStats = await fs.stat(filePath);
      const fileSize = fileStats.size;
      const rangeHeader = request.headers.get("range");

      if (rangeHeader) {
        const [startValue, endValue] = rangeHeader.replace(/bytes=/, "").split("-");
        const start = Number.parseInt(startValue, 10);
        const end = endValue ? Number.parseInt(endValue, 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const fileHandle = await fs.open(filePath, "r");
        const chunkBuffer = Buffer.alloc(chunkSize);

        await fileHandle.read(chunkBuffer, 0, chunkSize, start);
        await fileHandle.close();

        return new Response(chunkBuffer, {
          status: 206,
          headers: {
            "Content-Type": contentType,
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(chunkSize),
          },
        });
      }

      const fileBuffer = await fs.readFile(filePath);

      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
          "Content-Length": String(fileSize),
        },
      });
    } catch (error) {
      return new Response("Not found", { status: 404 });
    }
  });

  configureCSP();

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === "geolocation");
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});