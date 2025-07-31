import { DroneResponse } from "@/types/socket";

export const updateDroneStatusUI = (status: DroneResponse) => {
    const { battery, connected, is_flying, is_landing } = status;

    const batteryLevel = battery ?? "--";
    const connectionStatus = connected ? "Conectado" : "Desconectado";
    let flightStatus = "🟡 En tierra";
    if (is_flying) {
        flightStatus = "🛫 En el aire";
    } else if (is_landing) {
        flightStatus = "🛬 Aterrizando";
    }

    const batteryEl = document.getElementById("battery-level");
    const connectionEl = document.getElementById("connection-status");
    const flightEl = document.getElementById("flight-status");

    if (batteryEl) batteryEl.textContent = batteryLevel;
    if (connectionEl) connectionEl.textContent = connectionStatus;
    if (flightEl) flightEl.textContent = flightStatus;
};

/*export const showAlert = (message: string) => {
    alert(message);
};*/

export const logAction = (message: string) => {
    console.log(`[UI] ${message}`);
};
