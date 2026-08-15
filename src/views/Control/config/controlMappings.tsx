export type RCAxis = "x" | "y" | "z" | "yaw";

export type KeyboardAxisMapping = {
  type: "axis";
  axis: RCAxis;
  value: number;
  label: string;
};

export type KeyboardCommandMapping = {
  type: "command";
  command: "takeoff" | "land" | "capture_photo" | "start_recording" | "stop_recording";
  label: string;
};

export type KeyboardMapping = KeyboardAxisMapping | KeyboardCommandMapping;

export const KEYBOARD_INTERVAL_MS = 120;
export const RC_SCALE = 30;
export const PRECISION_MULTIPLIER = 0.3;
export const RC_THRESHOLD = 10;

export const keyboardControlMap: Record<string, KeyboardMapping> = {
  w: { type: "axis", axis: "y", value: RC_SCALE, label: "Adelante" },
  s: { type: "axis", axis: "y", value: -RC_SCALE, label: "Atrás" },
  a: { type: "axis", axis: "x", value: -RC_SCALE, label: "Izquierda" },
  d: { type: "axis", axis: "x", value: RC_SCALE, label: "Derecha" },

  arrowup: { type: "axis", axis: "z", value: RC_SCALE, label: "Subir" },
  arrowdown: { type: "axis", axis: "z", value: -RC_SCALE, label: "Bajar" },
  arrowleft: { type: "axis", axis: "yaw", value: -RC_SCALE, label: "Rotar izquierda" },
  arrowright: { type: "axis", axis: "yaw", value: RC_SCALE, label: "Rotar derecha" },

  t: { type: "command", command: "takeoff", label: "Despegar" },
  l: { type: "command", command: "land", label: "Aterrizar" },
};

export const quickActionKeys = {
  takeoff: { key: "T", label: "Despegar" },
  land: { key: "L", label: "Aterrizar" },
  photo: { key: "P", label: "Capturar Foto" },
  recording: { key: "R", label: "Grabar / Detener Video" },
  precision: { key: "Shift", label: "Modo Precisión" },
};

export const gamepadGuide = {
  leftStick: "Movimiento lateral / avance",
  rightStick: "Altitud / rotación",
  ltRt: "Despegar",
  buttonA: "Capturar foto",
  buttonB: "Aterrizar",
  buttonY: "Grabar / detener video",
};