import { socketInstance as socket } from "../services/socketService";
import { RCState, KeyAction, keyMap } from "../types/keymap";

const rcState: RCState = { x: 0, y: 0, z: 0, yaw: 0 };
const pressedKeys = new Set<string>();
let precisionMode = false;
let isRecording = false;
let rcInterval: ReturnType<typeof setInterval> | null = null;

const intervalMs = 150;

const isAxisAction = (action: KeyAction): action is Extract<KeyAction, { axis: string }> => {
  return "axis" in action && "value" in action;
};

const highlightKey = (key: string, active: boolean) => {
  const btn = document.getElementById(`btn-${key}`);
  if (btn) {
    btn.classList.toggle("control-active", active);
  }
};

const updateRCState = () => {
  rcState.x = 0;
  rcState.y = 0;
  rcState.z = 0;
  rcState.yaw = 0;

  const multiplier = precisionMode ? 0.3 : 1.0;

  pressedKeys.forEach((key) => {
    const mapping = keyMap[key];
    if (mapping && isAxisAction(mapping)) {
      rcState[mapping.axis] += Math.round(mapping.value * multiplier);
    }
  });

  socket.emit("rc_control", { ...rcState });
};

export const setupKeyboardControls = () => {
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (event.key === "Shift") {
      precisionMode = true;
      return;
    }

    if (key === "p") {
      socket.emit("capture_photo");
      return;
    }

    if (key === "r") {
      isRecording = !isRecording;
      socket.emit(isRecording ? "start_recording" : "stop_recording");
      return;
    }

    const mapping = keyMap[key];
    if (!mapping) return;

    event.preventDefault();
    highlightKey(key, true);

    if ("type" in mapping && mapping.type === "command") {
      socket.emit(mapping.command);
      return;
    }

    if (!pressedKeys.has(key)) {
      pressedKeys.add(key);
      updateRCState();
    }

    if (!rcInterval) {
      rcInterval = setInterval(updateRCState, intervalMs);
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (event.key === "Shift") {
      precisionMode = false;
      return;
    }

    const mapping = keyMap[key];
    if (!mapping) return;

    event.preventDefault();
    highlightKey(key, false);
    pressedKeys.delete(key);
    updateRCState();

    if (pressedKeys.size === 0 && rcInterval) {
      clearInterval(rcInterval);
      rcInterval = null;
      socket.emit("rc_control", { x: 0, y: 0, z: 0, yaw: 0 });
    }
  });
};
