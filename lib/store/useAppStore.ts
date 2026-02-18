import { create } from "zustand";

export type CursorType = "default" | "hover" | "drag" | "click" | "view";

type AppStore = {
  isLoaded: boolean;
  cursorType: CursorType;
  soundEnabled: boolean;
  magicLookEnabled: boolean;
  setLoaded: (value: boolean) => void;
  setCursorType: (value: CursorType) => void;
  setSoundEnabled: (value: boolean) => void;
  setMagicLookEnabled: (value: boolean) => void;
  toggleSound: () => void;
  toggleMagicLook: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isLoaded: false,
  cursorType: "default",
  soundEnabled: false,
  magicLookEnabled: false,
  setLoaded: (value) => set({ isLoaded: value }),
  setCursorType: (value) => set({ cursorType: value }),
  setSoundEnabled: (value) => set({ soundEnabled: value }),
  setMagicLookEnabled: (value) => set({ magicLookEnabled: value }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleMagicLook: () => set((state) => ({ magicLookEnabled: !state.magicLookEnabled })),
}));
