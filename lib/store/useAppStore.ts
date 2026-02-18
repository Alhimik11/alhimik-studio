import { create } from "zustand";

export type CursorType = "default" | "hover" | "drag" | "click" | "view";
export type DeviceTier = "low" | "mid" | "high";

type AppStore = {
  isLoaded: boolean;
  cursorType: CursorType;
  soundEnabled: boolean;
  magicLookEnabled: boolean;
  deviceTier: DeviceTier;
  setLoaded: (value: boolean) => void;
  setCursorType: (value: CursorType) => void;
  setSoundEnabled: (value: boolean) => void;
  setMagicLookEnabled: (value: boolean) => void;
  setDeviceTier: (value: DeviceTier) => void;
  toggleSound: () => void;
  toggleMagicLook: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isLoaded: false,
  cursorType: "default",
  soundEnabled: false,
  magicLookEnabled: false,
  deviceTier: "mid",
  setLoaded: (value) => set({ isLoaded: value }),
  setCursorType: (value) => set({ cursorType: value }),
  setSoundEnabled: (value) => set({ soundEnabled: value }),
  setMagicLookEnabled: (value) => set({ magicLookEnabled: value }),
  setDeviceTier: (value) => set({ deviceTier: value }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleMagicLook: () => set((state) => ({ magicLookEnabled: !state.magicLookEnabled })),
}));
