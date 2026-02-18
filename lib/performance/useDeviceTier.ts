"use client";

import { useState, useEffect } from "react";

export type DeviceTier = "low" | "mid" | "high";

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("mid");

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      setTier("low");
      return;
    }

    const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : "";

    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const isLowGPU = /Mali|Adreno\s[0-4]/i.test(renderer);

    if (isMobile && (cores <= 4 || memory <= 3 || isLowGPU)) {
      setTier("low");
    } else if (isMobile || cores <= 4) {
      setTier("mid");
    } else {
      setTier("high");
    }

    canvas.remove();
  }, []);

  return tier;
}
