"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ServiceWorkerRegistrar } from "@/components/providers/ServiceWorkerRegistrar";
import { Preloader } from "@/components/ui/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransitionGlitch } from "@/components/ui/PageTransitionGlitch";
import { useUISound } from "@/lib/sound/useUISound";
import { useAppStore } from "@/lib/store/useAppStore";
import { useDeviceTier } from "@/lib/performance/useDeviceTier";

type Props = {
  children: ReactNode;
};

function SoundBootstrap() {
  useUISound();
  return null;
}

function DeviceTierInit() {
  const tier = useDeviceTier();
  const setDeviceTier = useAppStore((state) => state.setDeviceTier);

  useEffect(() => {
    setDeviceTier(tier);
  }, [setDeviceTier, tier]);

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

function AlchemyEasterEgg() {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    let buffer = "";
    let timeoutId: number | null = null;

    const isInputTarget = (target: EventTarget | null) => {
      const node = target as HTMLElement | null;
      if (!node) {
        return false;
      }
      return Boolean(node.closest("input, textarea, select, [contenteditable='true']"));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isInputTarget(event.target)) {
        return;
      }

      buffer = (buffer + event.key.toLowerCase()).slice(-7);

      if (buffer !== "alchemy" || sessionStorage.getItem("alchemy-found") === "1") {
        return;
      }

      setTriggered(true);
      sessionStorage.setItem("alchemy-found", "1");

      timeoutId = window.setTimeout(() => {
        setTriggered(false);
      }, 2500);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!triggered) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] grid place-items-center bg-black/35 backdrop-blur-sm">
      <span className="font-display text-[min(30vw,12rem)] text-copper-300/85 drop-shadow-[0_0_36px_rgba(216,182,123,0.45)]">
        {"\u03A6"}
      </span>
    </div>
  );
}

export function AppProviders({ children }: Props) {
  return (
    <SmoothScrollProvider>
      <SoundBootstrap />
      <DeviceTierInit />
      <MagicLookController />
      <AlchemyEasterEgg />
      <ServiceWorkerRegistrar />
      <PageTransitionGlitch />
      <Preloader />
      <CustomCursor />
      {children}
    </SmoothScrollProvider>
  );
}
