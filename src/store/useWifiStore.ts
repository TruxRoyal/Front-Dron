// src/store/useWifiStore.ts
import { create } from "zustand";

export type WifiNetwork = {
    ssid: string;
    signalLevel: number;
    security?: string;
    isDroneNetwork?: boolean;
};

type WifiState = {
    networks: WifiNetwork[];
    selectedSsid: string | null;
    currentSsid: string | null;
    isScanning: boolean;
    isConnecting: boolean;
    setSelectedSsid: (ssid: string) => void;
    scanNetworks: () => Promise<void>;
    connectToNetwork: (ssid: string, password?: string) => Promise<void>;
    loadCurrentConnection: () => Promise<void>;
};

const DRONE_SSID_PATTERNS = [/^TELLO/i, /^AgroDron/i, /^Drone/i];

const isDroneNetwork = (ssid: string) =>
    DRONE_SSID_PATTERNS.some((pattern) => pattern.test(ssid));

const normalizeSignal = (network: any): number => {
    const rawSignal = Number(network.quality ?? network.signal_level ?? 0);
    if (Number.isNaN(rawSignal)) return 0;
    return Math.max(0, Math.min(100, rawSignal));
};



export const useWifiStore = create<WifiState>((set) => ({
    networks: [],
    selectedSsid: null,
    currentSsid: null,
    isScanning: false,
    isConnecting: false,

    setSelectedSsid: (ssid) => set({ selectedSsid: ssid }),

    scanNetworks: async () => {
        const state = useWifiStore.getState();

        if (state.isConnecting) {
            return;
        }

        if (state.currentSsid && /^TELLO/i.test(state.currentSsid)) {
            return;
        }

        set({ isScanning: true });

        try {
            const scanned = await window.electronAPI.wifi.scanNetworks();

            const networks = scanned
                .filter((network) => network.ssid)
                .map((network) => ({
                    ssid: network.ssid,
                    signalLevel: Number(network.quality ?? network.signal_level ?? 0),
                    security: network.security,
                    isDroneNetwork: /^TELLO/i.test(network.ssid),
                }))
                .sort((left, right) => right.signalLevel - left.signalLevel);

            set({ networks });

            const droneNetwork = networks.find(
                (network) => network.isDroneNetwork && network.signalLevel >= 70
            );

            if (droneNetwork) {
                await useWifiStore.getState().connectToNetwork(droneNetwork.ssid);
            }
        } finally {
            set({ isScanning: false });
        }
    },


    connectToNetwork: async (ssid, password) => {
        set({ isConnecting: true });

        try {
            if (!password && !/^TELLO/i.test(ssid)) {
                throw new Error("Se requiere contraseña para esta red");
            }

            await window.electronAPI.wifi.connect(ssid, password);

            set({
                currentSsid: ssid,
                selectedSsid: ssid,
            });
        } finally {
            set({ isConnecting: false });
        }
    },

    loadCurrentConnection: async () => {
        const currentConnection = await window.electronAPI.wifi.getCurrentConnection()
        set({ currentSsid: currentConnection?.ssid ?? null });
    },
}));