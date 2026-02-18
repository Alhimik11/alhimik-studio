"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";

const PHRASES = [
  "Загрузка реальности",
  "Инициализация нейросетей",
  "Калибровка пространственной матрицы",
  "Формирование жидкого хрома",
  "Синхронизация иммерсивной сцены",
  "Рендер алхимии",
];

export function Preloader() {
  const { active, progress, total } = useProgress();
  const [timeoutReady, setTimeoutReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const setLoaded = useAppStore((state) => state.setLoaded);
  const isLoaded = useAppStore((state) => state.isLoaded);
  const { playClick } = useUISound();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTimeoutReady(true);
    }, 2600);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if ((total > 0 && progress >= 100 && !active) || timeoutReady) {
      setLoaded(true);
    }
  }, [active, progress, setLoaded, timeoutReady, total]);

  useEffect(() => {
    if (!isLoaded || !overlayRef.current) {
      return;
    }

    playClick();

    const ctx = gsap.context(() => {
      gsap.to(overlayRef.current, {
        yPercent: -104,
        duration: 1.15,
        ease: "expo.inOut",
        onComplete: () => setHidden(true),
      });
    });

    return () => {
      ctx.revert();
    };
  }, [isLoaded, playClick]);

  const phrase = useMemo(() => {
    const normalized = Math.max(0, Math.min(progress, 100));
    const index = Math.min(
      PHRASES.length - 1,
      Math.floor((normalized / 100) * PHRASES.length),
    );
    return PHRASES[index];
  }, [progress]);

  if (hidden) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] grid place-items-center bg-[#06090f] text-white"
      aria-live="polite"
      aria-label="Прелоадер"
    >
      <div className="w-[min(92vw,680px)] space-y-8 px-4">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">
          Системная загрузка
        </p>

        <div className="space-y-2">
          <p className="text-3xl font-display uppercase tracking-tight text-balance sm:text-5xl">
            {phrase}
          </p>
          <p className="text-sm text-mutedext/90">Загружаются WebGL-ассеты и шейдеры.</p>
        </div>

        <div className="h-[2px] overflow-hidden bg-white/15">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-copper-400 transition-[width] duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs tracking-[0.24em] text-mutedext">
          <span>НЕЙРО-ЯДРО</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
