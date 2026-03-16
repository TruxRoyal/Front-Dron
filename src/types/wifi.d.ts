export {};

type WifiNetwork = {
  ssid: string;
  signal_level?: number;
  quality?: number;
  security?: string;
};

declare global {
  interface Window {
    electronAPI: {
      window: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
      };
      wifi: {
        scanNetworks: () => Promise<WifiNetwork[]>;
        connect: (ssid: string, password?: string) => Promise<void>;
        getCurrentConnection: () => Promise<WifiNetwork | null>;
      };
    };
  }
}