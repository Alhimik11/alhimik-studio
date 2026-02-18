"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Smartphone, X } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";
import { useAppStore } from "@/lib/store/useAppStore";
import { useUISound } from "@/lib/sound/useUISound";

const DistortionPreview = dynamic(
  () =>
    import("@/components/portfolio/DistortionPreview").then(
      (module) => module.DistortionPreview,
    ),
  { ssr: false },
);

const ARModelViewer = dynamic(
  () => import("@/components/portfolio/ARModelViewer").then((module) => module.ARModelViewer),
  { ssr: false },
);

type Project = {
  id: number;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  modelUrl?: string;
  tags: string[];
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "VR-тренажер промышленной безопасности",
    category: "VR / Обучение",
    summary: "Сценарное обучение персонала с системой оценки действий в реальном времени.",
    imageUrl: "/images/portfolio/case-1.svg",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    tags: ["Unity", "Физика", "LMS"],
  },
  {
    id: 2,
    title: "AR-конфигуратор для e-commerce",
    category: "AR / Ритейл",
    summary: "Размещение и примерка товаров в пространстве клиента с выбором вариантов.",
    imageUrl: "/images/portfolio/case-2.svg",
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    tags: ["WebXR", "USDZ", "iOS/Android"],
  },
  {
    id: 3,
    title: "AI-движок рекламных материалов",
    category: "AI / Видео",
    summary: "Генерация концептов, кадров и роликов, связанных с маркетинговой аналитикой.",
    imageUrl: "/images/portfolio/case-3.svg",
    tags: ["ComfyUI", "After Effects", "Промпт-пайплайн"],
  },
  {
    id: 4,
    title: "BIM-платформа цифрового двойника",
    category: "BIM / Данные",
    summary: "Единая BIM-экосистема для координации, проверок коллизий и отчетности.",
    imageUrl: "/images/portfolio/case-4.svg",
    tags: ["Revit", "IFC", "Navisworks"],
  },
  {
    id: 5,
    title: "Интерактивный цифровой шоурум",
    category: "WebGL / Витрина",
    summary: "Промо-сайт продукта с управляемыми материалами и кинематографичной камерой.",
    imageUrl: "/images/portfolio/case-5.svg",
    tags: ["Three.js", "GSAP", "R3F"],
  },
  {
    id: 6,
    title: "XR-инсталляция для музея",
    category: "XR / Культура",
    summary: "Иммерсивный сценарий выставки с AR-слоями, сенсорным интерактивом и звуком.",
    imageUrl: "/images/portfolio/case-6.svg",
    modelUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    tags: ["Пространственный звук", "WebGL", "Проекционный контент"],
  },
];

const getSpanClass = (index: number) => {
  const pattern = [
    "row-span-4 md:row-span-3",
    "row-span-4 md:row-span-2",
    "row-span-4 md:row-span-2",
    "row-span-4 md:row-span-3",
    "row-span-4 md:row-span-2",
    "row-span-4 md:row-span-2",
  ];
  return pattern[index % pattern.length];
};

export function Portfolio() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAR, setShowAR] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const setCursorType = useAppStore((state) => state.setCursorType);
  const { playHover, playClick } = useUISound();

  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobileDevice(isMobileUA);
  }, []);

  const selectedProject = useMemo(
    () => PROJECTS.find((project) => project.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <section id="portfolio" className="px-4 py-24 md:px-7">
      <div className="mx-auto w-full max-w-[1320px] space-y-10">
        <div className="space-y-5">
          <TextReveal
            text="Портфолио как интерактивный нарратив"
            className="font-display text-3xl uppercase leading-tight sm:text-4xl md:text-5xl"
          />
          <p className="max-w-2xl text-mutedext">
            Превью по наведению работает через шейдерное искажение. Нажмите на кейс, чтобы раскрыть его в полноэкранный
            переход без перезагрузки страницы.
          </p>
        </div>

        <div className="grid auto-rows-[125px] grid-cols-1 gap-5 md:auto-rows-[120px] md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => {
            const hovered = hoveredId === project.id;

            return (
              <motion.article
                key={project.id}
                layoutId={`card-${project.id}`}
                className={`group glass-panel relative overflow-hidden rounded-3xl border-white/10 ${getSpanClass(index)} cursor-pointer`}
                onMouseEnter={() => {
                  setHoveredId(project.id);
                  setCursorType("view");
                  playHover();
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setCursorType("default");
                }}
                onClick={() => {
                  setSelectedId(project.id);
                  playClick();
                }}
              >
                <motion.div layoutId={`media-${project.id}`} className="relative h-[56%] min-h-[180px]">
                  <DistortionPreview imageUrl={project.imageUrl} hovered={hovered || selectedId === project.id} />
                </motion.div>

                <div className="flex h-[44%] min-h-[170px] flex-col justify-between p-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200">{project.category}</p>
                    <h3 className="mt-2 font-display text-xl uppercase leading-snug">{project.title}</h3>
                    <p className="mt-2 text-sm text-mutedext">{project.summary}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pointer-events-none absolute right-5 top-5 rounded-full border border-cyan-200/30 bg-cyan-400/10 p-2 text-cyan-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowUpRight size={15} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[95] bg-[#05080f]/90 px-4 py-20 backdrop-blur-xl md:px-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mx-auto w-full max-w-[1120px]">
              <motion.div
                layoutId={`card-${selectedProject.id}`}
                className="glass-panel overflow-hidden rounded-[28px] border-white/20"
              >
                <motion.div layoutId={`media-${selectedProject.id}`} className="h-[44vh] min-h-[260px]">
                  <DistortionPreview imageUrl={selectedProject.imageUrl} hovered />
                </motion.div>

                <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">{selectedProject.category}</p>
                    <h3 className="font-display text-3xl uppercase leading-tight md:text-4xl">{selectedProject.title}</h3>
                    <p className="text-mutedext">{selectedProject.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      type="button"
                      className="w-full rounded-2xl border border-cyan-200/35 bg-cyan-400/15 px-4 py-3 text-sm uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-400/26"
                      onClick={() => {
                        setSelectedId(null);
                        setShowAR(false);
                      }}
                    >
                      Закрыть кейс
                    </button>

                    {isMobileDevice && selectedProject.modelUrl && (
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-copper-300/40 bg-copper-400/12 px-4 py-3 text-sm uppercase tracking-[0.19em] text-copper-100 transition-colors hover:bg-copper-400/25"
                        onClick={() => setShowAR(true)}
                      >
                        <Smartphone size={16} />
                        Смотреть в AR
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setShowAR(false);
              }}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/35 text-white md:right-7 md:top-7"
              aria-label="Закрыть проект"
            >
              <X size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAR && selectedProject?.modelUrl && isMobileDevice && (
          <motion.div
            className="fixed inset-0 z-[99] grid place-items-center bg-[#05080f]/92 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-[980px] space-y-3">
              <ARModelViewer src={selectedProject.modelUrl} poster={selectedProject.imageUrl} />
              <button
                type="button"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs uppercase tracking-[0.22em]"
                onClick={() => setShowAR(false)}
              >
                Закрыть AR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
