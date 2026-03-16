import { useKeyboardControls } from "./useKeyboardControls";
import { useGamepadControls } from "./useGamepadControls";

export function useDroneInputControllers() {
  useKeyboardControls();
  return useGamepadControls();
}