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
    loading: () => <div className="absolute inset-0 bg-gradient-to-br from-[#04070f] to-[#0e1926]" />,
  },
);

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
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
      { threshold: 0.16 },
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden pt-24 sm:pt-28">
      <div className="absolute inset-0">
        <HeroCanvas active={isVisible} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,198,255,0.17),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(242,134,45,0.19),transparent_38%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-[1320px] items-center px-4 pb-16 md:px-7">
        <div className="max-w-[780px] space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-200/30 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.26em] text-cyan-200">
            <Sparkles size={14} />
            AI · VR · AR · WEBGL
          </div>

          <div className="space-y-4">
            <TextReveal
              as="h1"
              text="Immersive Products for Future-ready Brands"
              className="text-balance font-display text-[2.1rem] font-semibold uppercase leading-[0.98] sm:text-[2.8rem] md:text-[3.8rem] lg:text-[4.65rem]"
              step={0.015}
            />
            <p className="max-w-[620px] text-base text-slate-200/90 sm:text-lg md:text-xl">
              We design cinematic digital scenes with realtime shaders, AR-ready product showcases, and interactive
              AI storytelling that performs at production scale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/portfolio"
              className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-cyan-200/30 bg-cyan-400/15 px-7 py-3 text-sm uppercase tracking-[0.2em] text-cyan-100 transition-all hover:bg-cyan-400/30"
              onMouseEnter={() => {
                setCursorType("view");
                playHover();
              }}
              onMouseLeave={() => setCursorType("default")}
              onClick={playClick}
            >
              Explore Showcase
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="pointer-events-auto rounded-full border border-copper-300/45 bg-copper-400/10 px-7 py-3 text-sm uppercase tracking-[0.2em] text-copper-100 transition-all hover:bg-copper-400/22"
              onMouseEnter={() => {
                setCursorType("hover");
                playHover();
              }}
              onMouseLeave={() => setCursorType("default")}
              onClick={playClick}
            >
              Start a Project
            </Link>
          </div>

          <div className="grid max-w-[620px] grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
            {[
              { metric: "90+", title: "Lighthouse target" },
              { metric: "60FPS", title: "Realtime baseline" },
              { metric: "3D + AR", title: "Production ready" },
              { metric: "PWA", title: "Installable shell" },
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
