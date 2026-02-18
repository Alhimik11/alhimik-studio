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

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Preloader() {
  const { active, progress, total } = useProgress();
  const [timeoutReady, setTimeoutReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const setLoaded = useAppStore((state) => state.setLoaded);
  const isLoaded = useAppStore((state) => state.isLoaded);
  const { playClick } = useUISound();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimeoutReady(true), 2600);
    return () => window.clearTimeout(timer);
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

    return () => ctx.revert();
  }, [isLoaded, playClick]);

  const normalized = Math.max(0, Math.min(progress, 100));

  const phrase = useMemo(() => {
    const index = Math.min(PHRASES.length - 1, Math.floor((normalized / 100) * PHRASES.length));
    return PHRASES[index];
  }, [normalized]);

  const dashOffset = CIRCUMFERENCE - (CIRCUMFERENCE * normalized) / 100;

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
      <div className="flex w-[min(92vw,740px)] flex-col items-center gap-8 px-4">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">Системная загрузка</p>

        <div className="relative grid h-[240px] w-[240px] place-items-center">
          <svg width="240" height="240" viewBox="0 0 240 240" aria-hidden="true">
            <defs>
              <linearGradient id="preloader-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b379ff" />
                <stop offset="100%" stopColor="#d8b67b" />
              </linearGradient>
            </defs>

            <circle cx="120" cy="120" r={RADIUS} stroke="rgba(255,255,255,0.14)" strokeWidth="5" fill="none" />
            <circle
              cx="120"
              cy="120"
              r={RADIUS}
              stroke="url(#preloader-stroke-gradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 120 120)"
            />
            <polygon points="120,64 166,146 74,146" fill="none" stroke="url(#preloader-stroke-gradient)" strokeWidth="3" />
            <circle cx="120" cy="120" r="6" fill="url(#preloader-stroke-gradient)" />
          </svg>

          <div className="absolute inset-0 grid place-items-center text-center">
            <p className="font-display text-3xl uppercase text-copper-100">{Math.round(normalized)}%</p>
            <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-mutedext">нейро-ядро</p>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-2xl font-display uppercase tracking-tight text-balance sm:text-4xl">{phrase}</p>
          <p className="text-sm text-mutedext/90">Загружаются WebGL-ассеты и шейдеры.</p>
        </div>
      </div>
    </div>
  );
}
