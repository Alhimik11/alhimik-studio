"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Glasses, Diamond, BrainCircuit, Building2 } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";

gsap.registerPlugin(ScrollTrigger);

const ServicePreviewCanvas = dynamic(
  () => import("@/components/services/ServicePreviewCanvas").then((module) => module.ServicePreviewCanvas),
  { ssr: false },
);

const SERVICES = [
  {
    id: "01",
    title: "VR-ТРЕНАЖЕРЫ",
    short: "Сценарные симуляции и обучение персонала в иммерсивной среде.",
    details:
      "Проектируем VR-среды, где обучение проходит через действия: аварийные сценарии, контроль прогресса и аналитику в реальном времени.",
    variant: "vr" as const,
    icon: Glasses,
  },
  {
    id: "02",
    title: "AR-ОПЫТ ПРОДУКТА",
    short: "Просмотр и примерка товара в пространстве пользователя.",
    details:
      "Создаем WebXR и мобильные AR-сцены, которые делают демонстрацию продукта понятной, наглядной и интерактивной.",
    variant: "ar" as const,
    icon: Diamond,
  },
  {
    id: "03",
    title: "AI-ПРОДАКШН",
    short: "Генеративные пайплайны для визуалов, роликов и контент-систем.",
    details:
      "Собираем production-flow от идеи до финального материала с контролем качества, стиля и бренд-идентичности.",
    variant: "ai" as const,
    icon: BrainCircuit,
  },
  {
    id: "04",
    title: "BIM-ИНЖЕНЕРИЯ",
    short: "Цифровые модели зданий, координация и управление данными.",
    details:
      "Настраиваем BIM-процессы: координацию команд, clash detection, визуализацию и сопровождение на этапе эксплуатации.",
    variant: "bim" as const,
    icon: Building2,
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeServiceId, setActiveServiceId] = useState(SERVICES[0].id);
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
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">CORE CAPABILITIES</p>
          <TextReveal
            text="НАШИ ВОЗМОЖНОСТИ"
            className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl"
            step={0.02}
          />
          <p className="max-w-md text-lg text-slate-200/90">
            Мы не просто используем технологии, мы создаем на их базе новые стандарты взаимодействия брендов с
            аудиторией.
          </p>
        </div>

        <div className="relative pb-8">
          {SERVICES.map((service, index) => {
            const isActive = activeServiceId === service.id;
            const Icon = service.icon;
            const topOffset = `calc(6rem + ${index * 0.9}rem)`;

            return (
              <article
                key={service.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className={`service-card-lux group sticky rounded-[30px] p-5 md:p-6 ${
                  index > 0 ? "mt-[-5.6rem] md:mt-[-7rem]" : "mt-0"
                }`}
                style={{ top: topOffset, zIndex: 20 + index }}
                onMouseEnter={() => {
                  setActiveServiceId(service.id);
                  setCursorType("view");
                  playHover();
                }}
                onMouseLeave={() => setCursorType("default")}
                onClick={playClick}
              >
                <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr] md:items-center">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/25 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100/90">
                      <Icon size={14} />
                      {service.id}
                    </div>
                    <h3 className="font-display text-3xl uppercase leading-none text-slate-50 md:text-4xl">
                      {service.title}
                    </h3>
                    <p className="text-base text-slate-100/88">{service.short}</p>
                    <p className="text-sm text-mutedext">{service.details}</p>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-all ${
                        isActive
                          ? "border-cyan-300/45 bg-cyan-500/18 text-cyan-100 shadow-[0_0_24px_rgba(179,121,255,0.32)]"
                          : "border-white/15 bg-white/5 text-slate-200/85"
                      }`}
                    >
                      Подробнее
                      <ArrowUpRight size={14} />
                    </button>
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
