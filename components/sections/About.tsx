"use client";

import { FlaskConical, Orbit, Radar, Sparkles } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

const VALUES = [
  {
    icon: FlaskConical,
    title: "Сценарная инженерия",
    description: "Каждую страницу мы строим как сцену с логикой поведения, светом и интерактивностью.",
  },
  {
    icon: Radar,
    title: "Производительность в реальном времени",
    description: "Дизайн сразу проектируется под строгие бюджеты производительности и стабильные 60 FPS.",
  },
  {
    icon: Orbit,
    title: "Пространственное мышление",
    description: "Продукт моделируется в пространстве, а затем переносится в веб и мобильные интерфейсы.",
  },
  {
    icon: Sparkles,
    title: "AI-пайплайны продакшна",
    description: "Генеративные инструменты ускоряют разработку контента без потери авторского контроля.",
  },
];

export function About() {
  return (
    <section className="px-4 py-24 md:px-7">
      <div className="mx-auto grid w-full max-w-[1320px] gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <TextReveal
            text="Команда, которая выпускает иммерсивные продукты"
            className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl"
          />
          <p className="max-w-xl text-mutedext">
            Alhimik Studio объединяет креативное направление и инженерную глубину. Мы выпускаем продукты, где WebGL,
            анимация и архитектура контента работают как единая система.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "50+", label: "Реализованных кейсов" },
              { value: "5 лет", label: "Практики в продакшне" },
              { value: "R3F", label: "Базовый рендер-стек" },
              { value: "PWA", label: "Устанавливаемые продукты" },
            ].map((item) => (
              <div key={item.label} className="glass-panel rounded-2xl p-4">
                <p className="font-display text-2xl uppercase text-cyan-200">{item.value}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-mutedext">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className="glass-panel rounded-3xl p-6">
                <div className="mb-4 inline-flex rounded-2xl border border-cyan-200/30 bg-cyan-400/12 p-3 text-cyan-200">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-xl uppercase">{value.title}</h3>
                <p className="mt-2 text-sm text-mutedext">{value.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
