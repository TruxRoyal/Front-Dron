import { app, BrowserWindow, session, screen, nativeImage } from 'electron';
import path from 'node:path';
import { ipcMain } from "electron";
import {
  scanWifiNetworks,
  connectToWifi,
  getCurrentWifiConnection,
} from "./services/wifi.service";


declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

ipcMain.handle("wifi:scan", async () => {
  return scanWifiNetworks();
});

ipcMain.handle("wifi:connect", async (_, payload: { ssid: string; password?: string }) => {
  return connectToWifi(payload.ssid, payload.password);
});

ipcMain.handle("wifi:current", async () => {
  return getCurrentWifiConnection();
});

if (require('electron-squirrel-startup')) {
  app.quit();
}

const configureCSP = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "frame-src 'self'"
  ];
  
  const connectSrc = [
    "'self'",
    "ws://127.0.0.1:5000",
    "ws://localhost:3000",
    "ws://localhost:5000"
  ];

  if (isDevelopment) {
    csp.push("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    connectSrc.push("http://localhost:*");
  } else {
    csp.push("script-src 'self'");
    csp.push("object-src 'none'");
    csp.push("base-uri 'none'");
  }

  csp.push(`connect-src ${connectSrc.join(' ')}`);

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp.join('; ')]
      }
    });
  });
};

const getIconPath = () => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'assets', 'agroDron.ico');
  }
  return path.join(process.cwd(), 'assets', 'agroDron.ico');
};

const createWindow = (): void => {
  // Configurar CSP antes de crear la ventana
  configureCSP();

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const iconPath = getIconPath();

  const mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.6),
    height: Math.floor(height * 0.6),
    center: true,
    autoHideMenuBar: false,
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      webSecurity: true
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// Mover toda la configuración de sesión después de app.ready
app.whenReady().then(() => {
    configureCSP();
  createWindow();
  
  // Opcional: Configurar CSP para todas las ventanas nuevas
  app.on('browser-window-created', (event, window) => {
    configureCSP();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
