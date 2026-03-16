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
};

contextBridge.exposeInMainWorld('electronAPI', api);