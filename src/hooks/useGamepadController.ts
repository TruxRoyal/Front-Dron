import { socketInstance } from "../services/socketService";

let intervalId: NodeJS.Timeout | null = null;
let isRecording = false;

export const setupGamepadControls = () => {
    window.addEventListener("gamepadconnected", (e) => {
        console.log("🎮 Gamepad conectado:", e.gamepad);
        startPollingGamepad();
    });

    window.addEventListener("gamepaddisconnected", () => {
        console.log("❌ Gamepad desconectado");
        stopPollingGamepad();
    });
};

const emitRCControlIfSignificant = (
    x: number,
    y: number,
    z: number,
    yaw: number,
    threshold: number
) => {
    if (
        Math.abs(x) > threshold ||
        Math.abs(y) > threshold ||
        Math.abs(z) > threshold ||
        Math.abs(yaw) > threshold
    ) {
        socketInstance.emit("rc_control", { x, y, z, yaw });
    }
};

const startPollingGamepad = () => {
    if (intervalId) return;

    let takeoffTriggered = false;

    intervalId = setInterval(() => {
        const gamepad = navigator.getGamepads()[0];
        if (!gamepad) return;

        const scale = 30;
        const x = Math.round(gamepad.axes[0] * scale);    // Left / Right
        const y = Math.round(-gamepad.axes[1] * scale);   // Forward / Backward
        const z = Math.round(-gamepad.axes[3] * scale);   // Up / Down
        const yaw = Math.round(gamepad.axes[2] * scale);  // Rotation

        emitRCControlIfSignificant(x, y, z, yaw, 10);

        // Detect takeoff with LT + RT
        const lt = gamepad.buttons[6]?.value || 0;
        const rt = gamepad.buttons[7]?.value || 0;

        if (lt > 0.8 && rt > 0.8 && !takeoffTriggered) {
            console.log("🚁 LT + RT detectado → Enviando takeoff");
            socketInstance.emit("takeoff");
            takeoffTriggered = true;
        }
        
        // Reload takeoff trigger if LT or RT is released
        if (lt < 0.5 || rt < 0.5) {
            takeoffTriggered = false;
        }

        // Button A for capture photo
        if (gamepad.buttons[0].pressed) {
            socketInstance.emit("capture_photo");
        }

        // Button B
        if (gamepad.buttons[1]?.pressed) {
            socketInstance.emit("land");
        }

        // Button Y recording toggle
        if (gamepad.buttons[3]?.pressed) {
            isRecording = !isRecording;
            socketInstance.emit(isRecording ? "start_recording" : "stop_recording");
        }

    }, 100);
};


const stopPollingGamepad = () => {
    clearInterval(intervalId);
    intervalId = null;
    socketInstance.emit("rc_control", { x: 0, y: 0, z: 0, yaw: 0 });
};