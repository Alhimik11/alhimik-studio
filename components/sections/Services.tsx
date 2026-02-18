"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";

gsap.registerPlugin(ScrollTrigger);

const ServicePreviewCanvas = dynamic(
  () =>
    import("@/components/services/ServicePreviewCanvas").then(
      (module) => module.ServicePreviewCanvas,
    ),
  { ssr: false },
);

const SERVICES = [
  {
    id: "01",
    title: "VR-тренажеры",
    short: "Сценарные симуляции и обучение персонала в иммерсивной среде.",
    details:
      "Разрабатываем интерактивные тренажеры с логикой аварийных сценариев, контролем прогресса и аналитикой.",
    variant: "vr" as const,
  },
  {
    id: "02",
    title: "AR-опыт продукта",
    short: "Просмотр и примерка товара в реальном пространстве пользователя.",
    details:
      "Создаем WebXR и мобильные AR-сцены, которые делают демонстрацию продукта понятной и наглядной.",
    variant: "ar" as const,
  },
  {
    id: "03",
    title: "AI-продакшн",
    short: "Генеративные пайплайны для визуалов, роликов и контент-систем.",
    details:
      "Собираем production-flow от концепции до финального контента с контролем качества и брендинга.",
    variant: "ai" as const,
  },
  {
    id: "04",
    title: "BIM-инженерия",
    short: "Цифровые модели зданий, координация и управление данными.",
    details:
      "Проектируем BIM-процессы: координация, clash detection, визуализация и поддержка эксплуатации.",
    variant: "bim" as const,
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeServiceId, setActiveServiceId] = useState(SERVICES[0].id);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(itemRefs.current, {
        y: 52,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 76%",
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const activeService = SERVICES.find((service) => service.id === activeServiceId) ?? SERVICES[0];

  return (
    <section ref={sectionRef} id="services" className="relative px-4 py-24 md:px-7">
      <div className="mx-auto grid w-full max-w-[1320px] gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <TextReveal
            text="Услуги визуализированы как 3D-объекты"
            className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl"
            step={0.02}
          />
          <p className="max-w-xl text-mutedext">
            Иконки заменены физическими объектами: VR-шлем, кристалл AR, нейросеть AI и само-собираемая BIM-структура.
            Каждый блок реагирует на курсор и подсвечивается неоном.
          </p>

          <div className="grid gap-3">
            {SERVICES.map((service, index) => {
              const isActive = activeServiceId === service.id;
              return (
                <button
                  key={service.id}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  type="button"
                  className={`group w-full rounded-3xl border px-5 py-5 text-left transition-all duration-300 ${
                    isActive
                      ? "glass-panel border-copper-300/45"
                      : "glass-panel border-white/10 hover:border-cyan-300/40"
                  }`}
                  onMouseEnter={() => {
                    setActiveServiceId(service.id);
                    setCursorType("view");
                    playHover();
                  }}
                  onMouseLeave={() => setCursorType("default")}
                  onClick={() => {
                    setActiveServiceId(service.id);
                    playClick();
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-copper-300/25">
                      <ServicePreviewCanvas variant={service.variant} compact />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs uppercase tracking-[0.25em] text-mutedext">{service.id}</p>
                          <p className="gold-outline-hover mt-2 font-display text-2xl uppercase leading-tight sm:text-3xl">
                            {service.title}
                          </p>
                        </div>
                        <ArrowUpRight
                          className={`mt-1 transition-transform duration-300 ${
                            isActive ? "translate-x-0 text-copper-200" : "group-hover:translate-x-1"
                          }`}
                          size={18}
                        />
                      </div>
                      <p className="mt-2 text-sm text-slate-200/90">{service.short}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel sticky top-24 h-fit overflow-hidden rounded-[28px] border-copper-300/28">
          <div className="relative h-[290px] sm:h-[370px]">
            <ServicePreviewCanvas variant={activeService.variant} />
          </div>
          <div className="space-y-3 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-200">СЦЕНА УСЛУГИ</p>
            <h3 className="gold-outline-hover font-display text-2xl uppercase">{activeService.title}</h3>
            <p className="text-sm text-mutedext">{activeService.details}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
