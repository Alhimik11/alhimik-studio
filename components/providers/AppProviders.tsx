"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Preloader } from "@/components/ui/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransitionGlitch } from "@/components/ui/PageTransitionGlitch";
import { useUISound } from "@/lib/sound/useUISound";
import { useAppStore } from "@/lib/store/useAppStore";

type Props = {
  children: ReactNode;
};

function SoundBootstrap() {
  useUISound();
  return null;
}

function MagicLookController() {
  const magicLookEnabled = useAppStore((state) => state.magicLookEnabled);
  const [spacePressed, setSpacePressed] = useState(false);

  useEffect(() => {
    const isInputTarget = (target: EventTarget | null) => {
      const node = target as HTMLElement | null;
      if (!node) {
        return false;
      }

      return Boolean(node.closest("input, textarea, select, [contenteditable='true']"));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat || isInputTarget(event.target)) {
        return;
      }

      event.preventDefault();
      setSpacePressed(true);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }
      setSpacePressed(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const enabled = magicLookEnabled || spacePressed;
    document.documentElement.classList.toggle("magic-look", enabled);
  }, [magicLookEnabled, spacePressed]);

  return null;
}

export function AppProviders({ children }: Props) {
  return (
    <SmoothScrollProvider>
      <SoundBootstrap />
      <MagicLookController />
      <PageTransitionGlitch />
      <Preloader />
      <CustomCursor />
      {children}
    </SmoothScrollProvider>
  );
}
