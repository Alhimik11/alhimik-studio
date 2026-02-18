import { create } from "zustand";

export type CursorType = "default" | "hover" | "drag" | "click" | "view";

type AppStore = {
  isLoaded: boolean;
  cursorType: CursorType;
  soundEnabled: boolean;
  setLoaded: (value: boolean) => void;
  setCursorType: (value: CursorType) => void;
  setSoundEnabled: (value: boolean) => void;
  toggleSound: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isLoaded: false,
  cursorType: "default",
  soundEnabled: false,
  setLoaded: (value) => set({ isLoaded: value }),
  setCursorType: (value) => set({ cursorType: value }),
  setSoundEnabled: (value) => set({ soundEnabled: value }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));
