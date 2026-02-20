"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Glasses, Diamond, BrainCircuit, Building2 } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";
import { SERVICE_CATALOG } from "@/lib/content/serviceCatalog";

gsap.registerPlugin(ScrollTrigger);

const ServicePreviewCanvas = dynamic(
  () => import("@/components/services/ServicePreviewCanvas").then((module) => module.ServicePreviewCanvas),
  { ssr: false },
);

const ICON_MAP = {
  vr: Glasses,
  ar: Diamond,
  ai: BrainCircuit,
  bim: Building2,
};

const SERVICE_PRIORITY: Record<string, number> = {
  ai: 0,
  vr: 1,
  ar: 2,
  bim: 3,
};

export function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const orderedServices = useMemo(
    () => [...SERVICE_CATALOG].sort((a, b) => SERVICE_PRIORITY[a.variant] - SERVICE_PRIORITY[b.variant]),
    [],
  );
  const [activeServiceId, setActiveServiceId] = useState(orderedServices[0]?.id ?? SERVICE_CATALOG[0].id);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(cardRefs.current, {
        y: 70,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative px-4 py-24 md:px-7">
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-gradient-to-r from-cyan-400/80 to-transparent" />
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200/80">CORE CAPABILITIES</p>
          </div>
          <TextReveal
            text="НАШИ ВОЗМОЖНОСТИ"
            className="font-display text-4xl uppercase leading-[0.95] text-slate-50 sm:text-5xl md:text-6xl lg:text-[4rem]"
            step={0.02}
          />
          <p className="max-w-md text-lg text-slate-200/95">
            Мы не просто используем технологии, мы создаем на их базе новые стандарты взаимодействия брендов с
            аудиторией.
          </p>
        </div>

        <div className="relative pb-[17rem] md:pb-[23rem]">
          {orderedServices.map((service, index) => {
            const isActive = activeServiceId === service.id;
            const Icon = ICON_MAP[service.variant];
            const topOffset = `calc(6rem + ${index * 0.9}rem)`;
            const cardNumber = String(index + 1).padStart(2, "0");
            const badgeClass =
              service.accent === "gold"
                ? "border-copper-300/45 bg-copper-400/18 text-copper-100 shadow-[0_0_18px_rgba(216,182,123,0.28)]"
                : "border-cyan-300/35 bg-cyan-500/14 text-cyan-100";

            return (
              <article
                key={service.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className={`service-card-lux group sticky rounded-[30px] p-5 transition-transform duration-300 md:p-6 ${index > 0 ? "mt-[-5.25rem] md:mt-[-6.5rem]" : "mt-0"
                  } ${isActive ? "translate-y-[-0.55rem] scale-[1.015] is-active" : ""}`}
                style={{ top: topOffset, zIndex: isActive ? 80 + index : 20 + index }}
                onMouseEnter={() => {
                  setActiveServiceId(service.id);
                  setCursorType("view");
                  playHover();
                }}
                onMouseLeave={() => setCursorType("default")}
              >
                <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr] md:items-center">
                  <div className="space-y-4">
                    <div
                      className={`inline-flex items-center gap-3 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] ${badgeClass}`}
                    >
                      <Icon size={14} />
                      {cardNumber}
                    </div>
                    <h3 className="font-display text-3xl uppercase leading-none text-slate-50 md:text-4xl">
                      {service.title}
                    </h3>
                    <p className="text-base text-slate-100/88">{service.short}</p>
                    <p className="text-sm text-mutedext">{service.details}</p>
                    <Link
                      href={`/services/${service.slug}`}
                      onClick={playClick}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-all ${isActive
                        ? "border-cyan-300/45 bg-cyan-500/18 text-cyan-100 shadow-[0_0_24px_rgba(179,121,255,0.32)]"
                        : "border-white/15 bg-white/5 text-slate-200/85"
                        }`}
                    >
                      Подробнее
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>

                  <div className="service-stage-lux relative h-[270px] overflow-hidden rounded-3xl md:h-[320px]">
                    <ServicePreviewCanvas variant={service.variant} interactive={isActive} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
