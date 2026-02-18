"use client";

import { useState } from "react";
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

const NAV_ITEMS = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/services", label: "Услуги", icon: Layers },
  { href: "/portfolio", label: "Портфолио", icon: FolderOpen },
  { href: "/about", label: "О нас", icon: Info },
  { href: "/contact", label: "Контакты", icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const toggleSound = useAppStore((state) => state.toggleSound);
  const magicLookEnabled = useAppStore((state) => state.magicLookEnabled);
  const toggleMagicLook = useAppStore((state) => state.toggleMagicLook);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();

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
        <nav className="pointer-events-auto mx-auto flex w-full max-w-[1120px] items-center justify-between gap-2 rounded-full border border-copper-400/28 bg-[#130a24]/70 px-3 py-2 backdrop-blur-xl sm:px-4">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-full border border-copper-300/24 bg-white/5 px-3 py-2 sm:flex"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <span className="relative h-7 w-7">
              <Image src="/logo.png" alt="Alhimik logo" fill className="object-contain" />
            </span>
            <span className="font-display text-xs uppercase tracking-[0.26em] text-copper-200">Alhimik</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
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
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                magicLookEnabled
                  ? "border-copper-300/50 bg-copper-400/20 text-copper-200"
                  : "border-white/15 bg-white/5 text-white hover:border-cyan-400/50 hover:text-cyan-200"
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
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-cyan-400/50 hover:text-cyan-200"
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
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-cyan-400/50 hover:text-cyan-200 md:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {isMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed bottom-16 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[420px] -translate-x-1/2 rounded-3xl border border-copper-400/30 bg-[#120a22]/92 p-3 backdrop-blur-xl md:hidden">
          <div className="grid gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
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
