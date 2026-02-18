"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="px-4 pb-24 pt-28 md:px-7">
      <div className="mx-auto grid w-full max-w-[1320px] gap-7 lg:grid-cols-[1fr_1.15fr]">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Contact</p>
          <h1 className="font-display text-4xl uppercase leading-[0.95] md:text-5xl">
            Let&apos;s Build an Immersive Product
          </h1>
          <p className="max-w-lg text-mutedext">
            Share your goals and constraints. We can suggest a roadmap from prototype to production-ready release.
          </p>
          <div className="space-y-3 text-sm text-slate-200/95">
            <p>Email: info@alhimik-studio.ru</p>
            <p>Telegram: @alhimikstudio</p>
            <p>Response time: within 24 hours</p>
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-6 sm:p-8">
          {submitted ? (
            <div className="space-y-3">
              <h2 className="font-display text-2xl uppercase text-cyan-200">Request received</h2>
              <p className="text-mutedext">
                Thanks, your message was captured in this demo flow. We can plug this form into your backend or CMS in
                the next sprint.
              </p>
              <button
                type="button"
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm uppercase tracking-[0.2em]"
                onClick={() => setSubmitted(false)}
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                  Name
                  <input
                    required
                    name="name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/55"
                  />
                </label>
                <label className="space-y-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                  Email
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/55"
                  />
                </label>
              </div>

              <label className="space-y-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                Project type
                <select
                  name="projectType"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/55"
                  defaultValue="webgl"
                >
                  <option value="webgl">Interactive WebGL Site</option>
                  <option value="vr">VR Experience</option>
                  <option value="ar">AR Product Viewer</option>
                  <option value="ai">AI Content Pipeline</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="space-y-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                Brief
                <textarea
                  required
                  name="brief"
                  rows={6}
                  className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/55"
                  placeholder="Goals, target users, deadlines, and known constraints."
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-200/35 bg-cyan-400/20 px-5 py-3 text-sm uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-400/32 sm:w-auto"
              >
                Submit brief
                <ArrowUpRight size={16} />
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
