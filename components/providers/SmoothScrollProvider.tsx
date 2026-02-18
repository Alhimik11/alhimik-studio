"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: Props) {
  const lenisRef = useRef<LenisRef | null>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) {
      return;
    }

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(onTick);
      ScrollTrigger.killAll(false);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
