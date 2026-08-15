import { contextBridge, ipcRenderer } from 'electron';

const api = {
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
  },
  wifi: {
    scanNetworks: () => ipcRenderer.invoke('wifi:scan'),
    connect: (ssid: string, password?: string) =>
      ipcRenderer.invoke('wifi:connect', { ssid, password }),
    getCurrentConnection: () => ipcRenderer.invoke('wifi:current'),
  },
  geolocation: {
    get: (): Promise<{ location: { lat: number; lng: number }; accuracy: number }> =>
      ipcRenderer.invoke('geolocation:get'),
  },
  weather: {
    get: (lat: number, lng: number) => ipcRenderer.invoke('weather:get', { lat, lng }),
  },
  media: {
    listMissions: () => ipcRenderer.invoke('media:list-missions'),
    openFolder: (folderPath: string) => ipcRenderer.invoke('media:open-folder', folderPath),
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);