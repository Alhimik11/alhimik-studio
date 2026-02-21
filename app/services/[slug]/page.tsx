import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getServiceBySlug, SERVICE_CATALOG } from "@/lib/content/serviceCatalog";
import { getCaseBySlug } from "@/lib/content/caseCatalog";
import { CTA } from "@/components/sections/CTA";
import { CasePortalCard } from "@/components/services/CasePortalCard";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return SERVICE_CATALOG.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Услуга не найдена" };
  }

  return {
    title: service.title,
    description: service.pageDescription,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const isGold = service.accent === "gold";

  // Обогащаем кейсы данными из каталога (для видео-превью)
  const enrichedCases = service.portfolioCases.map((item) => ({
    ...item,
    videoUrl: getCaseBySlug(item.slug)?.videoUrl,
  }));

  return (
    <div className="relative px-4 pb-20 pt-24 md:px-7">

      {/* === HERO SECTION === */}
      <section className="mx-auto w-full max-w-[1320px]">
        <div className="relative">

          {/* Bloom-свечение ЗА карточкой */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
          >
            <div
              className={`service-bloom absolute left-1/2 top-1/2 h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] ${
                isGold
                  ? "bg-[radial-gradient(circle,rgba(216,182,123,0.38),rgba(140,84,246,0.12),transparent)]"
                  : "bg-[radial-gradient(circle,rgba(140,84,246,0.42),rgba(216,182,123,0.1),transparent)]"
              }`}
            />
          </div>

          {/* Еле заметная точечная сетка позади */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] opacity-[0.035]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          {/* === ГЛАВНАЯ КАРТОЧКА УСЛУГИ === */}
          <div className="service-hero-panel relative overflow-hidden rounded-[34px] p-8 py-12 md:p-14 md:py-20">

            {/* Внутренние радиальные свечения */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background: isGold
                  ? "radial-gradient(circle at 72% 0%, rgba(216,182,123,0.16), transparent 44%), radial-gradient(circle at 0% 100%, rgba(140,84,246,0.1), transparent 40%)"
                  : "radial-gradient(circle at 72% 0%, rgba(140,84,246,0.18), transparent 44%), radial-gradient(circle at 0% 100%, rgba(216,182,123,0.08), transparent 40%)",
              }}
            />

            {/* Шумовой оверлей */}
            <div className="noise-overlay" />

            {/* Тонкая точечная сетка внутри карточки */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Контент карточки */}
            <div className="relative z-10">

              {/* Метка направления */}
              <div className="flex items-center gap-4">
                <div
                  className={`h-px w-10 bg-gradient-to-r ${
                    isGold ? "from-copper-400/80" : "from-cyan-400/80"
                  } to-transparent`}
                />
                <p
                  className={`text-sm font-semibold uppercase tracking-[0.3em] ${
                    isGold ? "text-copper-200/80" : "text-cyan-200/80"
                  }`}
                >
                  Направление
                </p>
              </div>

              {/* H1 — широкий акцидентный шрифт */}
              <h1 className="mt-6 max-w-[940px] font-accent font-black uppercase leading-[0.9] tracking-tight text-slate-50 [text-shadow:0_0_40px_rgba(255,255,255,0.06)]"
                style={{ fontSize: "clamp(2.4rem, 5.5vw + 0.5rem, 6.5rem)" }}
              >
                {service.title}
              </h1>

              {/* Лид */}
              <p className="mt-8 max-w-[800px] text-xl font-medium leading-relaxed text-slate-100/90 [text-wrap:balance]">
                {service.pageLead}
              </p>

              {/* Описание */}
              <p className="mt-5 max-w-[700px] text-base leading-relaxed text-mutedext">
                {service.pageDescription}
              </p>

              {/* CTA-кнопки */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/portfolio"
                  className={`inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-xs uppercase tracking-[0.22em] transition-all duration-300 ${
                    isGold
                      ? "border-copper-300/40 bg-copper-400/14 text-copper-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-copper-400/24 hover:border-copper-300/60"
                      : "border-cyan-300/40 bg-cyan-500/14 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-cyan-500/24 hover:border-cyan-300/60"
                  }`}
                >
                  Смотреть портфолио
                  <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/6 px-7 py-3.5 text-xs uppercase tracking-[0.22em] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:bg-white/10 hover:border-white/22"
                >
                  Обсудить проект
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === БЛОК "ПОДОБНЫЕ ПРОЕКТЫ" === */}
      <section className="mx-auto mt-24 w-full max-w-[1320px]">

        {/* Заголовок блока */}
        <div className="mb-12 lg:w-2/3">
          <div className={`flex items-center gap-3 ${isGold ? "text-copper-200/70" : "text-cyan-200/70"}`}>
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                isGold ? "bg-copper-400/70" : "bg-cyan-400/70"
              }`}
            />
            <p className="text-sm font-semibold uppercase tracking-[0.26em]">Портфель кейсов</p>
          </div>

          <h2
            className="mt-4 font-accent font-black uppercase leading-[0.92] tracking-tight text-slate-50"
            style={{ fontSize: "clamp(1.8rem, 3.5vw + 0.5rem, 3.8rem)" }}
          >
            Подобные проекты
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-mutedext">{service.portfolioIntro}</p>
        </div>

        {/* Сетка карточек */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrichedCases.map((item) => (
            <CasePortalCard
              key={item.slug}
              slug={item.slug}
              title={item.title}
              summary={item.summary}
              focus={item.focus}
              videoUrl={item.videoUrl}
              accent={service.accent}
            />
          ))}
        </div>
      </section>

      <div className="mt-16">
        <CTA />
      </div>
    </div>
  );
}
