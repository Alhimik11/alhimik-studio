"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useAppStore } from "@/lib/store/useAppStore";

const labelByCursorType = {
  default: "",
  hover: "",
  drag: "DRAG",
  click: "",
  view: "VIEW",
};

export function CustomCursor() {
  const cursorType = useAppStore((state) => state.cursorType);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchLike, setIsTouchLike] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    setIsTouchLike(media.matches);
    const onChange = (event: MediaQueryListEvent) => setIsTouchLike(event.matches);
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!cursorRef.current || isTouchLike) {
      return;
    }

    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.22,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.22,
      ease: "power3.out",
    });

    const onMove = (event: MouseEvent) => {
      setIsVisible(true);
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const onLeave = () => setIsVisible(false);
    const onMouseDown = () => setCursorType("click");
    const onMouseUp = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button")) {
        setCursorType("hover");
        return;
      }
      setCursorType("default");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTouchLike, setCursorType]);

  const sizeClass = useMemo(() => {
    switch (cursorType) {
      case "view":
        return "h-20 w-20 border-copper-300/80 bg-copper-400/20";
      case "drag":
        return "h-16 w-16 border-cyan-300/80 bg-cyan-400/20";
      case "hover":
        return "h-12 w-12 border-cyan-300/70 bg-cyan-400/10";
      case "click":
        return "h-8 w-8 border-copper-300/80 bg-copper-400/30";
      default:
        return "h-6 w-6 border-white/75 bg-white/10";
    }
  }, [cursorType]);

  if (isTouchLike) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-250 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`grid place-items-center rounded-full border text-[11px] font-mono tracking-[0.2em] text-white transition-all duration-300 ${sizeClass}`}
      >
        {labelByCursorType[cursorType]}
      </div>
    </div>
  );
}
