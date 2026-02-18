"use client";

import type { ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Preloader } from "@/components/ui/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useUISound } from "@/lib/sound/useUISound";

type Props = {
  children: ReactNode;
};

function SoundBootstrap() {
  useUISound();
  return null;
}

export function AppProviders({ children }: Props) {
  return (
    <SmoothScrollProvider>
      <SoundBootstrap />
      <Preloader />
      <CustomCursor />
      {children}
    </SmoothScrollProvider>
  );
}
