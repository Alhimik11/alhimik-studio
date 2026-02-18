"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";

const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Услуги" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/about", label: "О нас" },
  { href: "/contact", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const soundEnabled = useAppStore((state) => state.soundEnabled);
  const toggleSound = useAppStore((state) => state.toggleSound);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleInteractiveEnter = () => {
    setCursorType("hover");
    playHover();
  };

  const handleInteractiveLeave = () => {
    setCursorType("default");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "border-b border-cyan-300/20 bg-[#07101b]/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-4 py-4 md:px-7">
        <Link
          href="/"
          className="flex items-center gap-3"
          onMouseEnter={handleInteractiveEnter}
          onMouseLeave={handleInteractiveLeave}
        >
          <div className="relative h-11 w-11 rounded-full border border-cyan-200/35 bg-white/5">
            <Image src="/logo.png" alt="Alhimik Studio" fill className="object-contain p-1.5" priority />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan-200">Alhimik</p>
            <p className="text-xs uppercase tracking-[0.3em] text-mutedext">Цифровая студия</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={handleInteractiveEnter}
              onMouseLeave={handleInteractiveLeave}
              className={`relative text-sm uppercase tracking-[0.2em] transition-colors ${
                pathname === item.href ? "text-cyan-300" : "text-mutedext hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              toggleSound();
              playClick();
            }}
            onMouseEnter={handleInteractiveEnter}
            onMouseLeave={handleInteractiveLeave}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-cyan-300/45 hover:bg-cyan-400/10"
            aria-label={soundEnabled ? "Отключить звук" : "Включить звук"}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((state) => !state)}
            onMouseEnter={handleInteractiveEnter}
            onMouseLeave={handleInteractiveLeave}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#060b12]/95 px-4 pb-6 pt-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-[1320px] gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm uppercase tracking-[0.17em] ${
                  pathname === item.href
                    ? "bg-cyan-400/15 text-cyan-200"
                    : "bg-white/5 text-white/85"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
