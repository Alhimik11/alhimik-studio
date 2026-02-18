"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

export function CTA() {
  return (
    <section className="px-4 pb-24 pt-8 md:px-7">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="grain-overlay glass-panel relative overflow-hidden rounded-[34px] border-cyan-300/20 p-7 sm:p-10 md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-aurora opacity-45" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div className="space-y-4">
              <TextReveal
                text="Есть идея продукта, которому нужна иммерсивность?"
                className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl"
              />
              <p className="max-w-2xl text-sm text-slate-100/85 sm:text-base">
                Мы превратим концепт в интерактивный продукт со сценовой архитектурой, 3D в реальном времени, кинематографичной
                анимацией и измеримым бизнес-результатом.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-200/35 bg-cyan-400/20 px-6 py-4 text-sm uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-400/32"
              >
                Начать обсуждение
                <ArrowUpRight size={16} />
              </Link>
              <a
                href="mailto:info@alhimik-studio.ru"
                className="inline-flex items-center justify-center rounded-2xl border border-copper-300/35 bg-copper-400/15 px-6 py-4 text-sm uppercase tracking-[0.2em] text-copper-100 transition-colors hover:bg-copper-400/28"
              >
                info@alhimik-studio.ru
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
