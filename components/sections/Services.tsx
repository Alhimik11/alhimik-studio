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
    title: "VR-тренажеры и среды",
    short: "Операционные симуляции и практические лаборатории для команд.",
    details:
      "Сцены цифрового двойника в реальном времени для обучения сотрудников с аналитикой и адаптивными траекториями.",
    variant: "vr" as const,
  },
  {
    id: "02",
    title: "AR-опыт продукта",
    short: "Просмотр и примерка товара в реальном пространстве пользователя.",
    details:
      "WebXR и нативные AR-сцены, которые помогают клиентам оценить продукт еще до покупки.",
    variant: "ar" as const,
  },
  {
    id: "03",
    title: "AI-продакшн кампаний",
    short: "Генеративные пайплайны для визуалов, роликов и контент-серий.",
    details:
      "AI-ассистированная разработка сценариев, концептов и финальных материалов с быстрым циклом релиза.",
    variant: "ai" as const,
  },
  {
    id: "04",
    title: "BIM и пространственные данные",
    short: "Точные цифровые модели зданий и процессы координации.",
    details:
      "Координация моделей, поиск коллизий и визуализация, связанная с задачами эксплуатации и стройки.",
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
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
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
            text="Услуги как интерактивные сцены"
            className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl"
            step={0.02}
          />
          <p className="max-w-xl text-mutedext">
            Каждая услуга подается как игровая сцена, а не статичный текст. Наведите курсор на пункт, чтобы увидеть
            3D-превью и ключевые результаты.
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
                  className={`group w-full rounded-3xl border px-6 py-6 text-left transition-all duration-300 ${
                    isActive
                      ? "border-cyan-200/45 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:border-cyan-300/40 hover:bg-cyan-400/5"
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
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.25em] text-mutedext">{service.id}</p>
                      <p className="mt-2 font-display text-2xl uppercase leading-tight sm:text-3xl">
                        {service.title}
                      </p>
                    </div>
                    <ArrowUpRight
                      className={`mt-1 transition-transform duration-300 ${
                        isActive ? "translate-x-0 text-cyan-300" : "group-hover:translate-x-1"
                      }`}
                      size={18}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-200/90">{service.short}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel sticky top-24 h-fit overflow-hidden rounded-[28px] border-white/15">
          <div className="relative h-[280px] sm:h-[360px]">
            <ServicePreviewCanvas variant={activeService.variant} />
          </div>
          <div className="space-y-3 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-200">ЖИВОЕ ПРЕВЬЮ</p>
            <h3 className="font-display text-2xl uppercase">{activeService.title}</h3>
            <p className="text-sm text-mutedext">{activeService.details}</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-copper-300">
              Можно заменить превью на alpha WebM или GLB-модель, когда будут готовы ассеты.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
