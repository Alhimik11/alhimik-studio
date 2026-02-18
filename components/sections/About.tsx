"use client";

import { FlaskConical, Orbit, Radar, Sparkles } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

const VALUES = [
  {
    icon: FlaskConical,
    title: "Scene-first Engineering",
    description: "We build every page as a directed scene with behavior, lighting, and interaction logic.",
  },
  {
    icon: Radar,
    title: "Realtime Performance",
    description: "Design direction is paired with strict performance budgets for smooth 60 FPS interactions.",
  },
  {
    icon: Orbit,
    title: "Spatial Thinking",
    description: "Products are modeled in space first, then translated into browser and mobile experiences.",
  },
  {
    icon: Sparkles,
    title: "AI Production Pipelines",
    description: "Generative tooling accelerates concepting and content generation without losing authorship.",
  },
];

export function About() {
  return (
    <section className="px-4 py-24 md:px-7">
      <div className="mx-auto grid w-full max-w-[1320px] gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <TextReveal
            text="Built by a Team that Ships Immersive Products"
            className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl"
          />
          <p className="max-w-xl text-mutedext">
            Alhimik Studio merges creative direction with deep engineering. We ship products where WebGL, animation
            systems, and content architecture work as one pipeline.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "50+", label: "Delivered cases" },
              { value: "5y", label: "Production practice" },
              { value: "R3F", label: "Core rendering stack" },
              { value: "PWA", label: "Installable products" },
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
