import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getCaseBySlug, CASE_CATALOG } from "@/lib/content/caseCatalog";
import { CTA } from "@/components/sections/CTA";

type Params = {
    slug: string;
};

export function generateStaticParams() {
    return CASE_CATALOG.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { slug } = await params;
    const project = getCaseBySlug(slug);

    if (!project) {
        return {
            title: "Кейс не найден",
        };
    }

    return {
        title: project.title,
        description: project.summary,
    };
}

export default async function CaseDetailPage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const project = getCaseBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="px-4 pb-20 pt-28 md:px-7">
            <div className="mx-auto w-full max-w-[1320px]">
                {/* Header / Back Link */}
                <div className="mb-10">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-slate-300 transition-colors hover:text-cyan-200"
                    >
                        <ArrowLeft size={16} />
                        Назад к услугам
                    </Link>
                </div>

                {/* Hero Section */}
                <section className="glass-panel relative overflow-hidden rounded-[34px] p-8 md:p-14">
                    <div className="noise-overlay" />

                    <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">

                        {/* Text Column */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                                    {project.category}
                                </p>
                            </div>

                            <h1 className="mt-6 font-display text-4xl uppercase leading-[0.95] text-slate-50 sm:text-5xl md:text-6xl lg:text-[4rem]">
                                {project.title}
                            </h1>

                            <p className="mt-6 text-xl text-slate-200/90 leading-relaxed [text-wrap:balance]">
                                {project.summary}
                            </p>

                            <div className="mt-8 border-t border-white/10 pt-6">
                                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-copper-200">
                                    ОСНОВНОЙ ФОКУС: {project.focus}
                                </p>
                            </div>

                            {project.fullDescription && (
                                <div className="mt-8">
                                    <p className="text-base text-mutedext leading-relaxed">
                                        {project.fullDescription}
                                    </p>
                                </div>
                            )}

                            {project.tags && project.tags.length > 0 && (
                                <div className="mt-10 flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-white/16 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-slate-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video Column */}
                        <div className="flex items-center justify-center">
                            <div className="relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#06030c] shadow-[0_20px_60px_rgba(6,3,13,0.6)]">
                                {/* 16:9 Aspect Ratio Wrapper */}
                                <div className="relative w-full pt-[56.25%]">
                                    {project.videoUrl ? (
                                        <video
                                            src={project.videoUrl}
                                            className="absolute left-0 top-0 h-full w-full object-cover"
                                            controls
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col justify-center items-center opacity-30">
                                            <p className="font-display text-xl uppercase tracking-widest text-white mb-2">Видео в разработке</p>
                                            <p className="text-sm">video placeholder</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>

            <div className="mt-16">
                <CTA />
            </div>
        </div>
    );
}
