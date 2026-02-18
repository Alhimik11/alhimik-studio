"use client";

import { useCallback, useEffect } from "react";
import { Howl, Howler } from "howler";
import { useAppStore } from "@/lib/store/useAppStore";

let hoverSound: Howl | null = null;
let clickSound: Howl | null = null;
let ambientSound: Howl | null = null;
let initialized = false;

const initSounds = () => {
  if (initialized) {
    return;
  }

  hoverSound = new Howl({
    src: ["/audio/ui-hover.mp3"],
    volume: 0.15,
    preload: false,
  });

  clickSound = new Howl({
    src: ["/audio/ui-click.mp3"],
    volume: 0.2,
    preload: false,
  });

  ambientSound = new Howl({
    src: ["/audio/cyber-ambient.mp3"],
    volume: 0.08,
    loop: true,
    preload: false,
  });

  initialized = true;
};

export function useUISound() {
  const soundEnabled = useAppStore((state) => state.soundEnabled);

  useEffect(() => {
    initSounds();
    Howler.mute(!soundEnabled);

    if (soundEnabled && ambientSound && !ambientSound.playing()) {
      ambientSound.play();
    }

    if (!soundEnabled && ambientSound && ambientSound.playing()) {
      ambientSound.stop();
    }
  }, [soundEnabled]);

  const playHover = useCallback(() => {
    if (!soundEnabled) {
      return;
    }

    initSounds();
    hoverSound?.play();
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    if (!soundEnabled) {
      return;
    }

    initSounds();
    clickSound?.play();
  }, [soundEnabled]);

  return {
    soundEnabled,
    playHover,
    playClick,
  };
}
