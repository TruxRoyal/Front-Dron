import { app, BrowserWindow, session, screen } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const configureCSP = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let csp = [
    "default-src 'self'",
    "connect-src 'self' ws://127.0.0.1:5000 ws://localhost:3000 wss://*",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "frame-src 'self'"
  ];

  if (isDevelopment) {
    // Permisos adicionales para desarrollo
    csp.push("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    csp.push("connect-src 'self' ws://127.0.0.1:5000 ws://localhost:3000 wss://* http://localhost:*");
  } else {
    // Configuración más estricta para producción
    csp.push("script-src 'self'");
    csp.push("object-src 'none'");
    csp.push("base-uri 'none'");
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp.join('; ')]
      }
    });
  });
};

const createWindow = (): void => {
  // Configurar CSP antes de crear la ventana
  configureCSP();

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.6),
    height: Math.floor(height * 0.6),
    center: true,
    autoHideMenuBar: false,
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
