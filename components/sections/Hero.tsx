"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { TextReveal } from "@/components/ui/TextReveal";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";
import { MagneticButton } from "@/components/ui/MagneticButton";

const HeroWebGPUCanvas = dynamic(
  () => import("@/components/hero/HeroWebGPUCanvas").then((module) => module.HeroWebGPUCanvas),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 hero-stage" />,
  },
);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const transmutationRef = useRef<HTMLParagraphElement | null>(null);
  const transmutationShownRef = useRef(false);
  const [isVisible, setIsVisible] = useState(true);
  const [explodeProgress, setExplodeProgress] = useState(0);
  const [showTransmutationText, setShowTransmutationText] = useState(false);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    });

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    transmutationShownRef.current = sessionStorage.getItem("transmutation-text-shown") === "1";
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const viewport = window.innerHeight || 1;
      const progress = clamp(window.scrollY / (viewport * 0.9), 0, 1);
      setExplodeProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (explodeProgress <= 0.95 || transmutationShownRef.current) {
      return;
    }

    transmutationShownRef.current = true;
    sessionStorage.setItem("transmutation-text-shown", "1");
    setShowTransmutationText(true);
  }, [explodeProgress]);

  useEffect(() => {
    if (!showTransmutationText || !transmutationRef.current) {
      return;
    }

    const element = transmutationRef.current;
    const revealTween = gsap.fromTo(
      element,
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
    );

    const hideTimer = window.setTimeout(() => {
      gsap.to(element, {
        autoAlpha: 0,
        y: -18,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => setShowTransmutationText(false),
      });
    }, 1700);

    return () => {
      revealTween.kill();
      window.clearTimeout(hideTimer);
    };
  }, [showTransmutationText]);

  return (
    <section ref={sectionRef} className="hero-stage relative min-h-screen overflow-hidden pb-20 pt-12 sm:pt-16">
      <div className="absolute inset-0">
        <span className="sr-only">Интерактивная 3D-сцена на WebGPU: процедурный логотип Alhimik</span>
        <HeroWebGPUCanvas active={isVisible} explodeProgress={explodeProgress} />
      </div>

      <div className="noise-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(159,98,255,0.32),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(179,121,255,0.22),transparent_42%),radial-gradient(circle_at_82%_76%,rgba(216,182,123,0.15),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,2,8,0.72)_100%)]" />

      {showTransmutationText && (
        <p
          ref={transmutationRef}
          className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 rounded-full border border-copper-300/55 bg-black/40 px-5 py-2 text-xs uppercase tracking-[0.24em] text-copper-100 opacity-0 backdrop-blur-md"
        >
          Трансмутация начинается
        </p>
      )}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1320px] items-end px-4 pb-28 sm:pb-32 md:px-7">
        <div className="max-w-[820px] space-y-7">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/35 bg-cyan-500/12 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">
            <Sparkles size={14} />
            DIGITAL ALCHEMISTS
          </div>

          <TextReveal
            as="h1"
            text="Мы проектируем реальность"
            className="font-display font-bold uppercase leading-[0.92]"
            style={{ fontSize: "clamp(2.6rem, 7.5vw + 0.5rem, 7.2rem)" }}
            step={0.025}
          />
          <p className="max-w-[680px] text-balance text-base text-mutedext sm:text-lg md:text-xl">
            Превращаем цифровой свинец в&nbsp;VR,&nbsp;AR и&nbsp;AI&#8209;золото
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton className="pointer-events-auto" strength={0.22}>
              <Link
                href="/portfolio"
                className="hero-primary-cta inline-flex items-center gap-3 rounded-full border border-cyan-300/35 bg-cyan-500/20 px-7 py-3 text-sm uppercase tracking-[0.2em] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_0_16px_rgba(140,84,246,0.08)] backdrop-blur-sm transition-all hover:bg-cyan-500/34"
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
            </MagneticButton>

            <MagneticButton className="pointer-events-auto" strength={0.22}>
              <Link
                href="/contact"
                className="rounded-full border border-copper-300/45 bg-copper-400/18 px-7 py-3 text-sm uppercase tracking-[0.2em] text-copper-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_16px_rgba(216,182,123,0.06)] backdrop-blur-sm transition-all hover:bg-copper-400/28"
                onMouseEnter={() => {
                  setCursorType("hover");
                  playHover();
                }}
                onMouseLeave={() => setCursorType("default")}
                onClick={playClick}
              >
                Начать проект
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
