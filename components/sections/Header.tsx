"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Layers,
  FolderOpen,
  Info,
  Mail,
  Menu,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";
import { MagneticButton } from "@/components/ui/MagneticButton";

const NAV_ITEMS = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/services", label: "Услуги", icon: Layers },
  { href: "/portfolio", label: "Портфолио", icon: FolderOpen },
  { href: "/about", label: "О нас", icon: Info },
  { href: "/contact", label: "Контакты", icon: Mail },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mixChannel = (start: number, end: number, ratio: number) => Math.round(start + (end - start) * ratio);

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const toggleSound = useAppStore((state) => state.toggleSound);
  const magicLookEnabled = useAppStore((state) => state.magicLookEnabled);
  const toggleMagicLook = useAppStore((state) => state.toggleMagicLook);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();

  useEffect(() => {
    let rafId: number | null = null;

    const updateScrollRatio = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = documentHeight <= 0 ? 0 : clamp(window.scrollY / documentHeight, 0, 1);
      setScrollRatio(ratio);
    };

    const onScroll = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        updateScrollRatio();
        rafId = null;
      });
    };

    updateScrollRatio();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollRatio);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollRatio);
    };
  }, []);

  const navBorderColor = useMemo(() => {
    const red = mixChannel(216, 122, scrollRatio);
    const green = mixChannel(182, 230, scrollRatio);
    const blue = mixChannel(123, 255, scrollRatio);
    return `rgba(${red}, ${green}, ${blue}, 0.46)`;
  }, [scrollRatio]);

  const navGlowColor = useMemo(() => {
    const red = mixChannel(216, 122, scrollRatio);
    const green = mixChannel(182, 230, scrollRatio);
    const blue = mixChannel(123, 255, scrollRatio);
    return `rgba(${red}, ${green}, ${blue}, 0.28)`;
  }, [scrollRatio]);

  const onEnter = () => {
    setCursorType("hover");
    playHover();
  };

  const onLeave = () => {
    setCursorType("default");
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 bottom-3 z-50 px-3 sm:bottom-5 sm:px-4">
        <nav
          className="dock-glass pointer-events-auto mx-auto flex w-full max-w-[1120px] items-center justify-between gap-2 rounded-full border border-transparent bg-[#0d0720]/55 px-3 py-2 transition-colors sm:px-4"
          style={{
            boxShadow: `0 0 36px ${navGlowColor}, inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 30px rgba(140,84,246,0.06)`,
          }}
        >
          <MagneticButton className="hidden sm:block" strength={0.2}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-copper-300/24 bg-white/5 px-3 py-2"
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            >
              <span className="relative h-7 w-7">
                <Image src="/logo.png" alt="Alhimik logo" fill className="object-contain" />
              </span>
              <span className="font-display text-xs uppercase tracking-[0.26em] text-copper-200">Alhimik</span>
            </Link>
          </MagneticButton>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <MagneticButton key={item.href} className="shrink-0" strength={0.18}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all ${
                      active
                        ? "bg-cyan-400/25 text-cyan-100 shadow-[0_0_22px_rgba(179,121,255,0.35)]"
                        : "text-mutedext hover:bg-cyan-500/12 hover:text-cyan-200"
                    }`}
                    onMouseEnter={onEnter}
                    onMouseLeave={onLeave}
                  >
                    <Icon size={14} />
                    {item.label}
                  </Link>
                </MagneticButton>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <MagneticButton strength={0.15}>
              <button
                type="button"
                className={`grid h-10 w-10 place-items-center rounded-full border backdrop-blur-sm transition-colors ${
                  magicLookEnabled
                    ? "border-copper-300/50 bg-copper-400/20 text-copper-200 shadow-[inset_0_0_12px_rgba(216,182,123,0.1)]"
                    : "border-white/15 bg-white/7 text-white shadow-[inset_0_0_12px_rgba(140,84,246,0.06)] hover:border-cyan-400/50 hover:text-cyan-200"
                }`}
                onClick={() => {
                  toggleMagicLook();
                  playClick();
                }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                aria-label={magicLookEnabled ? "Отключить режим Magic Look" : "Включить режим Magic Look"}
              >
                <Sparkles size={16} />
              </button>
            </MagneticButton>

            <MagneticButton strength={0.15}>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/7 text-white shadow-[inset_0_0_12px_rgba(140,84,246,0.06)] backdrop-blur-sm transition-colors hover:border-cyan-400/50 hover:text-cyan-200"
                onClick={() => {
                  toggleSound();
                  playClick();
                }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                aria-label={soundEnabled ? "Отключить звук" : "Включить звук"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </MagneticButton>

            <MagneticButton className="md:hidden" strength={0.15}>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/7 text-white shadow-[inset_0_0_12px_rgba(140,84,246,0.06)] backdrop-blur-sm transition-colors hover:border-cyan-400/50 hover:text-cyan-200"
                onClick={() => setIsMenuOpen((value) => !value)}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              >
                {isMenuOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </MagneticButton>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed bottom-16 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[420px] -translate-x-1/2 rounded-3xl border border-copper-400/30 bg-[#0d0720]/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_40px_rgba(140,84,246,0.06),0_16px_48px_rgba(6,3,13,0.5)] backdrop-blur-[32px] md:hidden">
          <div className="grid gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-3 py-3 text-xs uppercase tracking-[0.2em] ${
                    active ? "bg-cyan-400/22 text-cyan-100" : "bg-white/5 text-slate-100"
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
