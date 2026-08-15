# Frontend Dron

Aplicación de escritorio (Electron + React + TypeScript) para el control, monitoreo y análisis de misiones de un dron agrícola. Se conecta al backend vía WebSockets/REST para telemetría en tiempo real, streaming de video y reportes de análisis de cultivos.

## Stack

- **Electron Forge** + **Webpack** como shell de escritorio y bundler
- **React 19** + **TypeScript**
- **Tailwind CSS 4** + **Radix UI** (componentes shadcn-style en `src/components/ui`)
- **Zustand** para estado global
- **Socket.IO client** para telemetría/video en tiempo real
- **@react-google-maps/api** para mapas y geolocalización

## Estructura principal

```
src/
├── app-components/     # Layout, sidebar, theme provider
├── components/ui/      # Componentes base reutilizables
├── services/           # Clientes de sockets, dron, wifi, imágenes
├── store/               # Estado global (Zustand)
└── views/
    ├── Dashboard/       # Métricas y estado general
    ├── Control/         # Control manual (joystick, gamepad, teclado, video)
    ├── Autopilot/       # Misiones autónomas
    ├── FlightMissions/  # Listado y gestión de misiones
    ├── FlightReport/    # Reportes de vuelo
    ├── MediaView/       # Galería de imágenes capturadas
    └── Settings/        # Configuración de app, dron y sistema
```

## Requisitos

- Node.js 18+
- npm

## Configuración

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar `.env.example` a `.env` y completar las claves:
   ```bash
   cp .env.example .env
   ```

   | Variable | Descripción |
   |---|---|
   | `VITE_GOOGLE_MAPS_API_KEY` | API key de Google Maps para el mapa de misiones |
   | `GOOGLE_GEOLOCATION_API_KEY` | API key de Google Geolocation |

   > `.env` está en `.gitignore`: nunca se debe commitear con claves reales.

## Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Levanta la app en modo desarrollo (Electron Forge) |
| `npm run package` | Empaqueta la app sin generar instaladores |
| `npm run make` | Genera los instaladores (Squirrel, deb, rpm, zip) |
| `npm run publish` | Publica los artefactos generados |
| `npm run lint` | Linting con ESLint sobre `.ts`/`.tsx` |

## Backend

Este frontend consume la API/WebSockets de [BackEnd_Dron](../../Back%20dron/BackEnd_Dron), que debe estar corriendo (por defecto en `http://localhost:5000`) para tener funcionalidad completa (control de dron, streaming y análisis).
