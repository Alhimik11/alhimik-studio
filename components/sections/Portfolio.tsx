"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Smartphone, X, ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";

const ARModelViewer = dynamic(
  () => import("@/components/portfolio/ARModelViewer").then((module) => module.ARModelViewer),
  { ssr: false },
);

const CaseScene = dynamic(
  () => import("@/components/portfolio/CaseScene").then((module) => module.CaseScene),
  { ssr: false },
);

import { CASE_CATALOG } from "@/lib/content/caseCatalog";

const PROJECTS = CASE_CATALOG.filter((project) => project.imageUrl);

const clampIndex = (value: number) => {
  const total = PROJECTS.length;
  return (value + total) % total;
};

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showAR, setShowAR] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const magicLookEnabled = useAppStore((state) => state.magicLookEnabled);
  const toggleMagicLook = useAppStore((state) => state.toggleMagicLook);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobileDevice(isMobileUA);
  }, []);

  // Mouse wheel / trackpad flips cards; at the first or last card the page scrolls on.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    let accumulated = 0;
    let lockedUntil = 0;

    const onWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const current = activeIndexRef.current;
      const canMove = delta > 0 ? current < PROJECTS.length - 1 : current > 0;
      if (!canMove || delta === 0) {
        accumulated = 0;
        return;
      }

      // Keep the page (Lenis) still while the carousel is flipping
      event.preventDefault();
      event.stopPropagation();

      const now = performance.now();
      if (now < lockedUntil) {
        return;
      }

      accumulated += delta;
      if (Math.abs(accumulated) < 40) {
        return;
      }

      setActiveIndex(current + (accumulated > 0 ? 1 : -1));
      accumulated = 0;
      lockedUntil = now + 450;
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, []);

  const activeProject = PROJECTS[activeIndex];

  const tunnelCards = useMemo(() => {
    return PROJECTS.map((project, index) => {
      const offset = index - activeIndex;
      const abs = Math.abs(offset);
      const translateX = offset * 55;
      const translateZ = -abs * 240;
      const rotateY = -offset * 24;
      const scale = 1 - abs * 0.08;

      return {
        project,
        index,
        abs,
        style: {
          left: "50%",
          top: "50%",
          transform: `translate3d(-50%, -50%, ${translateZ}px) translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`,
          zIndex: 100 - abs,
          opacity: Math.max(0.18, 1 - abs * 0.28),
        },
      };
    });
  }, [activeIndex]);

  return (
    <section id="portfolio" aria-label="Портфолио проектов" className="px-4 py-24 md:px-7">
      <div className="mx-auto w-full max-w-[1320px] space-y-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="space-y-5">
            <TextReveal
              text="Проекты, которые мы показали до того, как их построили"
              className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl"
            />
            <p className="max-w-2xl text-mutedext">
              Инвестпроекты, курорты, логистика и коммерческая недвижимость Дальнего Востока: 3D-ролики,
              AI-видео и визуализация для инвесторов, партнёров и покупателей.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <button
              type="button"
              onClick={() => {
                toggleMagicLook();
                playClick();
              }}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${magicLookEnabled
                ? "border-copper-300/55 bg-copper-400/18 text-copper-100"
                : "border-cyan-300/45 bg-cyan-500/14 text-cyan-100 hover:bg-cyan-500/22"
                }`}
            >
              <Sparkles size={14} />
              {magicLookEnabled ? "Обычный режим" : "Magic Look"}
            </button>
          </div>
        </div>

        <div
          ref={stageRef}
          data-lenis-prevent-wheel
          className="relative h-[560px] overflow-hidden rounded-[34px] border border-copper-400/26 bg-[#120920]/70 p-4 sm:p-6 [perspective:2200px]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(164,97,255,0.22),transparent_35%),radial-gradient(circle_at_86%_78%,rgba(216,182,123,0.15),transparent_35%)]" />
          {/* Cards sit behind this plane in 3D; without pointer-events-none it swallows their hover and clicks */}
          <div className="pointer-events-none relative h-full w-full [transform-style:preserve-3d]">
            {tunnelCards.map(({ project, index, abs, style }) => {
              const isHovered = hoveredIndex === index;
              const isActive = activeIndex === index;
              const showScene = Boolean(project.sceneId) && (isHovered || isActive) && abs <= 2;

              return (
                <article
                  key={project.id}
                  className={`portfolio-card pointer-events-auto absolute h-[78%] w-[min(76vw,540px)] cursor-pointer overflow-hidden rounded-3xl border transition-all duration-300 ${isHovered || isActive
                    ? "border-copper-300/75 shadow-[0_0_40px_rgba(216,182,123,0.34)]"
                    : "border-white/12"
                    }`}
                  style={style}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setCursorType("view");
                    playHover();
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setCursorType("default");
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty("--glow-x", `${x}%`);
                    e.currentTarget.style.setProperty("--glow-y", `${y}%`);
                  }}
                  onClick={() => {
                    playClick();
                    // Side card comes to the front; the front card opens its case page
                    if (isActive && !project.sceneId) {
                      router.push(`/cases/${project.slug}`);
                      return;
                    }
                    setActiveIndex(index);
                  }}
                >
                  <div className="relative h-[68%] overflow-hidden">
                    <Image
                      src={project.imageUrl!}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 76vw, 540px"
                      className={`object-cover transition-all duration-500 ${showScene
                        ? "scale-[1.06] opacity-0"
                        : isHovered
                          ? "scale-[1.06] opacity-100 brightness-110"
                          : "opacity-100"
                        }`}
                    />
                    {showScene && (
                      <div className="absolute inset-0">
                        <CaseScene caseId={project.sceneId ?? 1} active={showScene} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090413] via-transparent to-transparent" />
                  </div>

                  <div className="glass-panel h-[32%] space-y-2 px-5 py-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">{project.category}</p>
                    <h3 className="gold-outline-hover font-display text-lg uppercase leading-snug">{project.title}</h3>
                    <p className="line-clamp-2 text-xs text-mutedext">{project.summary}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between sm:inset-x-6">
            <button
              type="button"
              onClick={() => {
                setActiveIndex((index) => clampIndex(index - 1));
                playClick();
              }}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md"
              aria-label="Предыдущий проект"
            >
              <ChevronLeft size={17} />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-100 backdrop-blur-md">
              {PROJECTS.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-copper-300" : "w-2 bg-white/35"
                    }`}
                  aria-label={`Перейти к проекту ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveIndex((index) => clampIndex(index + 1));
                playClick();
              }}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md"
              aria-label="Следующий проект"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-3xl border-copper-400/28 p-6 md:p-8">
          <div className="grid gap-7 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">{activeProject.category}</p>
              <h3 className="gold-outline-hover font-display text-3xl uppercase leading-tight">
                {activeProject.title}
              </h3>
              <p className="text-mutedext">{activeProject.summary}</p>
              <div className="flex flex-wrap gap-2">
                {activeProject.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/16 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.16em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Link
                  href={`/cases/${activeProject.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/15 px-6 py-3 text-xs uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-500/25"
                >
                  Читать подробнее
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {isMobileDevice && activeProject.modelUrl && (
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-copper-300/45 bg-copper-400/17 px-4 py-3 text-sm uppercase tracking-[0.19em] text-copper-100 transition-colors hover:bg-copper-400/28"
                  onClick={() => setShowAR(true)}
                >
                  <Smartphone size={16} />
                  Смотреть в AR
                </button>
              )}
              {isMobileDevice ? (
                <p className="text-xs uppercase tracking-[0.17em] text-mutedext">
                  На мобильных активна кнопка AR для кейсов с 3D-моделью.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAR && activeProject.modelUrl && isMobileDevice && (
          <motion.div
            className="fixed inset-0 z-[99] grid place-items-center bg-[#05080f]/92 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-[980px] space-y-3">
              <ARModelViewer src={activeProject.modelUrl} poster={activeProject.imageUrl} />
              <button
                type="button"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs uppercase tracking-[0.22em]"
                onClick={() => setShowAR(false)}
                aria-label="Закрыть AR"
              >
                <X size={15} className="mr-2 inline-block" />
                Закрыть AR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
