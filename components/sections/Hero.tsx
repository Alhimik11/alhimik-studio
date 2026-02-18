"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";

const HeroCanvas = dynamic(
  () => import("@/components/hero/HeroCanvas").then((module) => module.HeroCanvas),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gradient-to-br from-[#080413] to-[#170d2b]" />,
  },
);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [explodeProgress, setExplodeProgress] = useState(0);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const viewport = window.innerHeight || 1;
      const progress = clamp(window.scrollY / (viewport * 0.9), 0, 1);
      setExplodeProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden pb-20 pt-12 sm:pt-16">
      <div className="absolute inset-0">
        <HeroCanvas active={isVisible} explodeProgress={explodeProgress} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(176,118,255,0.23),transparent_40%),radial-gradient(circle_at_82%_72%,rgba(216,182,123,0.21),transparent_36%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1320px] items-end px-4 pb-28 sm:pb-32 md:px-7">
        <div className="max-w-[820px] space-y-7">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/35 bg-cyan-500/12 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">
            <Sparkles size={14} />
            DIGITAL ALCHEMISTS
          </div>

          <div className="space-y-4">
            <TextReveal
              as="h1"
              text="Мы превращаем цифровой свинец в VR, AR и AI-золото"
              className="text-balance font-display text-[2rem] font-semibold uppercase leading-[0.96] sm:text-[2.8rem] md:text-[3.9rem] lg:text-[4.8rem]"
              step={0.013}
            />
            <p className="max-w-[650px] text-base text-slate-200/92 sm:text-lg md:text-xl">
              Интерактивный логотип в центре сцены разбирается на детали при скролле и запускает визуальную систему
              сайта. Так мы показываем идею Alhimik: инженерия, превращенная в магию интерфейсов.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/portfolio"
              className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-cyan-300/35 bg-cyan-500/20 px-7 py-3 text-sm uppercase tracking-[0.2em] text-cyan-100 transition-all hover:bg-cyan-500/34"
              onMouseEnter={() => {
                setCursorType("view");
                playHover();
              }}
              onMouseLeave={() => setCursorType("default")}
              onClick={playClick}
            >
              Смотреть портфолио
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="pointer-events-auto rounded-full border border-copper-300/45 bg-copper-400/18 px-7 py-3 text-sm uppercase tracking-[0.2em] text-copper-100 transition-all hover:bg-copper-400/28"
              onMouseEnter={() => {
                setCursorType("hover");
                playHover();
              }}
              onMouseLeave={() => setCursorType("default")}
              onClick={playClick}
            >
              Начать проект
            </Link>
          </div>

          <div className="grid max-w-[660px] grid-cols-2 gap-4 pt-1 sm:grid-cols-4">
            {[
              { metric: "PBR", title: "Материалы в реальном времени" },
              { metric: "60 FPS", title: "Плавность на средних устройствах" },
              { metric: "WEBGL", title: "Сцены и шейдеры" },
              { metric: "PWA", title: "Устанавливаемый формат" },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-2xl p-4">
                <p className="font-display text-lg uppercase text-cyan-200">{item.metric}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-mutedext">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
