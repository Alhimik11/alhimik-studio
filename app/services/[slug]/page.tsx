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
        <div className="glass-panel rounded-[34px] p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Направление</p>
          <h1 className="mt-4 max-w-[920px] font-display text-4xl uppercase leading-[0.92] text-slate-50 sm:text-5xl md:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-[860px] text-lg text-slate-100/90">{service.pageLead}</p>
          <p className="mt-4 max-w-[760px] text-base text-mutedext">{service.pageDescription}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/15 px-5 py-2 text-xs uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-500/25"
            >
              Смотреть портфолио
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-copper-300/45 bg-copper-400/16 px-5 py-2 text-xs uppercase tracking-[0.2em] text-copper-100 transition-colors hover:bg-copper-400/24"
            >
              Обсудить проект
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-[1320px]">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Портфель кейсов</p>
          <h2 className="mt-2 font-display text-3xl uppercase text-slate-50 sm:text-4xl">Портфолио по направлению</h2>
          <p className="mt-3 max-w-[880px] text-mutedext">{service.portfolioIntro}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {service.portfolioCases.map((item) => (
            <article key={item.title} className="service-card-lux rounded-3xl p-5">
              <h3 className="font-display text-2xl uppercase leading-tight text-slate-50">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-200/90">{item.summary}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-copper-200">{item.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-14">
        <CTA />
      </div>
    </div>
  );
}
