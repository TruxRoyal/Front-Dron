export type RCCommand = {
  type: "command";
  command: string;
};

export type RCAxis = {
  axis: "x" | "y" | "z" | "yaw";
  value: number;
};

export type KeyAction = RCCommand | RCAxis;

export type RCState = {
  x: number;
  y: number;
  z: number;
  yaw: number;
};

export const keyMap: Record<string, KeyAction> = {
  "t": { type: "command", command: "takeoff" },
  "l": { type: "command", command: "land" },
  "arrowup":    { axis: "y", value: 30 },
  "arrowdown":  { axis: "y", value: -30 },
  "arrowleft":  { axis: "x", value: -30 },
  "arrowright": { axis: "x", value: 30 },
  "w":          { axis: "z", value: 30 },
  "s":          { axis: "z", value: -30 },
  "a":          { axis: "yaw", value: -30 },
  "d":          { axis: "yaw", value: 30 }
};
