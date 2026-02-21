"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

type Props = {
  slug: string;
  title: string;
  summary: string;
  focus: string;
  videoUrl?: string;
  accent: "gold" | "violet";
};

export function CasePortalCard({ slug, title, summary, focus, videoUrl, accent }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isGold = accent === "gold";

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      href={`/cases/${slug}`}
      className="group block h-full outline-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <article
        className="case-portal-card flex min-h-[260px] h-full flex-col rounded-3xl p-7 transition-all duration-500 group-hover:-translate-y-2 group-focus-visible:ring-2 group-focus-visible:ring-cyan-400"
        data-accent={accent}
      >
        {/* Видео-превью на hover */}
        {videoUrl && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            />
            {/* Оверлей для читаемости текста поверх видео */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
          </div>
        )}

        <div className="relative z-10 flex flex-1 flex-col">
          {/* Заголовок + стрелка */}
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`font-accent text-lg font-bold uppercase leading-tight text-slate-50 transition-colors duration-300 ${
                isGold ? "group-hover:text-copper-300" : "group-hover:text-cyan-300"
              }`}
            >
              {title}
            </h3>
            <div
              className={`mt-1 flex-shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-100 ${
                isGold ? "text-copper-300" : "text-cyan-300"
              }`}
            >
              <ArrowUpRight size={18} />
            </div>
          </div>

          {/* Описание */}
          <p className="mt-4 flex-grow text-sm leading-relaxed text-slate-300/75">{summary}</p>

          {/* Линия фокуса — золотой/фиолетовый градиент */}
          <div className="mt-6 border-t border-white/10 pt-4">
            <p
              className={`inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] ${
                isGold ? "text-copper-300" : "text-cyan-300"
              }`}
            >
              <span
                className={`h-px w-6 rounded-full ${
                  isGold
                    ? "bg-gradient-to-r from-copper-400 to-copper-200/40"
                    : "bg-gradient-to-r from-cyan-400 to-cyan-200/40"
                }`}
              />
              {focus}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
