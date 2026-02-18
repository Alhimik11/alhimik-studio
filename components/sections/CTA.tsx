"use client";

import { TextReveal } from "@/components/ui/TextReveal";
import { InlineContactForm } from "@/components/cta/InlineContactForm";

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

            <div className="flex flex-col gap-4">
              <InlineContactForm />
              <a
                href="mailto:info@alhimik-studio.ru"
                className="text-center text-xs uppercase tracking-[0.18em] text-mutedext transition-colors hover:text-copper-200"
              >
                Или напишите: info@alhimik-studio.ru
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
