import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getServiceBySlug, SERVICE_CATALOG } from "@/lib/content/serviceCatalog";
import { CTA } from "@/components/sections/CTA";

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
    return {
      title: "Услуга не найдена",
    };
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

  return (
    <div className="px-4 pb-20 pt-24 md:px-7">
      <section className="mx-auto w-full max-w-[1320px]">
        <div className="glass-panel relative overflow-hidden rounded-[34px] p-8 py-12 md:p-14 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_has_70%_0%,rgba(179,121,255,0.12),transparent_40%),radial-gradient(circle_at_0%_100%,rgba(216,182,123,0.08),transparent_40%)] pointer-events-none" />
          <div className="noise-overlay" />

          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-gradient-to-r from-cyan-400/80 to-transparent" />
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/80">Направление</p>
            </div>

            <h1 className="mt-6 max-w-[920px] font-display text-5xl uppercase leading-[0.92] text-slate-50 sm:text-6xl md:text-7xl">
              {service.title}
            </h1>

            <p className="mt-8 max-w-[800px] text-xl font-medium leading-relaxed text-slate-100/90 [text-wrap:balance]">
              {service.pageLead}
            </p>

            <p className="mt-5 max-w-[700px] text-base leading-relaxed text-mutedext">
              {service.pageDescription}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/15 px-6 py-3 text-xs uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-500/25"
              >
                Смотреть портфолио
                <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-copper-300/45 bg-copper-400/16 px-6 py-3 text-xs uppercase tracking-[0.2em] text-copper-100 transition-colors hover:bg-copper-400/24"
              >
                Обсудить проект
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1320px]">
        <div className="mb-10 lg:w-2/3">
          <div className="flex items-center gap-4 text-cyan-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">Портфель кейсов</p>
          </div>
          <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-slate-50 sm:text-5xl">Подобные проекты</h2>
          <p className="mt-4 text-lg text-mutedext max-w-2xl">{service.portfolioIntro}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {service.portfolioCases.map((item) => (
            <Link key={item.slug} href={`/cases/${item.slug}`} className="group block h-full outline-none">
              <article className="service-card-lux flex min-h-[220px] h-full flex-col rounded-3xl p-7 transition-all duration-300 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-cyan-400">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl uppercase leading-tight text-slate-50 transition-colors group-hover:text-cyan-100">{item.title}</h3>
                  <div className="mt-1 flex-shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={20} className="text-cyan-300" />
                  </div>
                </div>
                <p className="mt-4 flex-grow text-sm leading-relaxed text-slate-200/80">{item.summary}</p>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-copper-200">
                    <span className="h-1 w-1 rounded-full bg-copper-400" />
                    {item.focus}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-14">
        <CTA />
      </div>
    </div>
  );
}
