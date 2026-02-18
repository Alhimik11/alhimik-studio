"use client";

import Link from "next/link";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#05080f]">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-40" />
      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-4 py-12 md:px-7">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.16em] text-cyan-200">Alhimik Studio</p>
            <p className="mt-2 max-w-xl text-sm text-mutedext">
              Immersive interfaces, realtime 3D storytelling, VR/AR experiences, and AI-powered product showcases.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs uppercase tracking-[0.25em] text-mutedext">
            {LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-cyan-300">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.18em] text-mutedext sm:flex-row sm:items-center">
          <p>© {year} Alhimik Studio</p>
          <p>Built for VR · AR · AI</p>
        </div>
      </div>
    </footer>
  );
}
