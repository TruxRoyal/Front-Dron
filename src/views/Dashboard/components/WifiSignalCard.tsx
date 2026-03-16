import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Wifi, Loader2, AlertTriangle, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useWifiStore } from "@/store/useWifiStore";


const getSignalLabel = (strength: number) => {
    if (strength >= 75) return "Fuerte";
    if (strength >= 45) return "Media";
    return "Débil";
};

const getBars = (strength: number) => {
    if (strength >= 75) return 4;
    if (strength >= 55) return 3;
    if (strength >= 30) return 2;
    return 1;
};

export const WifiSignalCard = () => {
    const {
        networks,
        selectedSsid,
        currentSsid,
        isScanning,
        isConnecting,
        setSelectedSsid,
        scanNetworks,
        connectToNetwork,
    } = useWifiStore();

    const [showAlert, setShowAlert] = React.useState(false);

    const selectedNetwork =
        networks.find((network) => network.ssid === selectedSsid) ?? networks[0];

    const connectedNetwork = networks.find(
        (network) => network.ssid === currentSsid
    );

    const isConnected = Boolean(connectedNetwork);
    const isSelectedNetworkConnected =
        Boolean(selectedNetwork && currentSsid === selectedNetwork.ssid);

    const displayNetwork = connectedNetwork ?? selectedNetwork;

    const isDroneConnected = Boolean(currentSsid && /^TELLO/i.test(currentSsid));

    useEffect(() => {
        if (isDroneConnected) {
            return;
        }

        scanNetworks();

        const intervalId = window.setInterval(() => {
            scanNetworks();
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, [scanNetworks, isDroneConnected]);

    const handleConnect = async () => {
        if (!selectedNetwork) return;

        if (!selectedNetwork.isDroneNetwork) {
            setShowAlert(true);
            return;
        }


        await connectToNetwork(selectedNetwork.ssid);
    };

    return (
        <>
            <Card className="h-full overflow-hidden border-none shadow-sm transition-all duration-300 group hover:shadow-md">
                <CardContent className="flex h-full items-center gap-5 p-5">
                    <div className="rounded-xl bg-emerald-500 p-3 text-white shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                        <Wifi size={28} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Conectividad
                            </p>
                            <span
                                className={`text-[10px] font-black uppercase tracking-tighter ${isConnected ? "text-emerald-600" : "text-muted-foreground"
                                    }`}
                            >
                                {isSelectedNetworkConnected ? "Conectado" : isConnected ? "Conectado a otra red" : "Sin conexión"}
                            </span>
                        </div>

                        <Select
                            value={selectedSsid ?? ""}
                            onValueChange={setSelectedSsid}
                        >
                            <SelectTrigger className="mb-2 flex h-7 w-full items-center justify-start gap-2 border-none bg-transparent p-0 text-base font-bold shadow-none transition-colors hover:text-emerald-600 focus:ring-0">
                                <SelectValue placeholder="Seleccionar red" />
                            </SelectTrigger>

                            <SelectContent className="rounded-2xl border-border bg-white/95 p-1 shadow-2xl backdrop-blur-sm">
                                {networks.map((network) => {
                                    const bars = getBars(network.signalLevel);
                                    const signal = getSignalLabel(network.signalLevel);

                                    return (
                                        <SelectItem
                                            key={network.ssid}
                                            value={network.ssid}
                                            className="cursor-pointer rounded-xl px-3 py-3 focus:bg-emerald-50 focus:text-emerald-700"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold">
                                                        {network.ssid}
                                                        {network.isDroneNetwork ? " • Drone" : ""}
                                                    </span>

                                                    <div className="flex h-2.5 items-end gap-0.5">
                                                        {[1, 2, 3, 4].map((bar) => (
                                                            <div
                                                                key={bar}
                                                                className={`w-0.5 rounded-full ${bar <= bars ? "bg-emerald-500" : "bg-muted"
                                                                    } ${bar === 1
                                                                        ? "h-1"
                                                                        : bar === 2
                                                                            ? "h-1.5"
                                                                            : bar === 3
                                                                                ? "h-2"
                                                                                : "h-2.5"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <span className="text-[9px] font-black uppercase tracking-wider opacity-60">
                                                    {signal} • {network.signalLevel}%
                                                </span>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        <Progress
                            value={displayNetwork?.signalLevel ?? 0}
                            className="h-2 bg-emerald-100"
                            indicatorClassName="bg-emerald-500"
                        />

                        <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {displayNetwork
                                    ? `Señal: ${getSignalLabel(displayNetwork.signalLevel)} • ${getBars(
                                        displayNetwork.signalLevel
                                    )}/4 barras`
                                    : "Sin redes detectadas"}
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-[10px]"
                                    onClick={scanNetworks}
                                    disabled={isScanning}
                                >
                                    {isScanning ? <Loader2 className="animate-spin" size={12} /> : "Buscar"}
                                </Button>

                                <Button
                                    size="sm"
                                    className="h-7 px-2 text-[10px]"
                                    onClick={handleConnect}
                                    disabled={!selectedNetwork || isConnecting}
                                >
                                    {isConnecting ? <Loader2 className="animate-spin" size={12} /> : "Conectar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showAlert} onOpenChange={setShowAlert}>
                <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl">
                    <DialogHeader className="flex flex-col items-center gap-4 pt-4">
                        <div className="rounded-full bg-amber-100 p-4 text-amber-600">
                            <AlertTriangle size={40} />
                        </div>
                        <div className="text-center">
                            <DialogTitle className="text-xl font-bold">Red Protegida</DialogTitle>
                            <DialogDescription className="mt-2 text-sm font-medium text-muted-foreground">
                                Esta red requiere contraseña manual. Solo las redes oficiales del dron se conectan automáticamente por seguridad.
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4 mt-2">
                        <Lock size={18} className="text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-xs font-bold">{selectedNetwork?.ssid}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Seguridad WPA2/WPA3</p>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full rounded-xl font-bold"
                            onClick={() => setShowAlert(false)}
                        >
                            ENTENDIDO
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    );
};