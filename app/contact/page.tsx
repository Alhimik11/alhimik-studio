"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="px-4 pb-24 pt-28 md:px-7">
      <div className="mx-auto grid w-full max-w-[1320px] gap-7 lg:grid-cols-[1fr_1.15fr]">
        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Контакты</p>
          <h1 className="font-display text-4xl uppercase leading-[0.95] md:text-5xl">
            Давайте соберем ваш иммерсивный продукт
          </h1>
          <p className="max-w-lg text-mutedext">
            Расскажите о целях и ограничениях проекта. Мы предложим реалистичный план от прототипа до продакшна.
          </p>
          <div className="space-y-3 text-sm text-slate-200/95">
            <p>Почта: info@alhimik-studio.ru</p>
            <p>Telegram: @alhimikstudio</p>
            <p>Время ответа: до 24 часов</p>
          </div>
        </section>

        <section className="glass-panel rounded-[30px] p-6 sm:p-8">
          {submitted ? (
            <div className="space-y-3">
              <h2 className="font-display text-2xl uppercase text-cyan-200">Заявка принята</h2>
              <p className="text-mutedext">
                Спасибо, сообщение зафиксировано в демо-форме. На следующем шаге подключим отправку в серверную часть или CMS.
              </p>
              <button
                type="button"
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm uppercase tracking-[0.2em]"
                onClick={() => setSubmitted(false)}
              >
                Отправить еще
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
                  Имя
                  <input
                    required
                    name="name"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/55"
                  />
                </label>
                <label className="space-y-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                  Почта
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/55"
                  />
                </label>
              </div>

              <label className="space-y-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                Тип проекта
                <select
                  name="projectType"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/55"
                  defaultValue="webgl"
                >
                  <option value="webgl" className="bg-[#170e2b] text-slate-200 py-2">Интерактивный WebGL-сайт</option>
                  <option value="vr" className="bg-[#170e2b] text-slate-200 py-2">VR-проект</option>
                  <option value="ar" className="bg-[#170e2b] text-slate-200 py-2">AR-просмотр продукта</option>
                  <option value="ai" className="bg-[#170e2b] text-slate-200 py-2">AI-контент пайплайн</option>
                  <option value="other" className="bg-[#170e2b] text-slate-200 py-2">Другое</option>
                </select>
              </label>

              <label className="space-y-2 text-xs uppercase tracking-[0.18em] text-slate-200">
                Описание
                <textarea
                  required
                  name="brief"
                  rows={6}
                  className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-cyan-300/55"
                  placeholder="Цели проекта, целевая аудитория, сроки и известные ограничения."
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-200/35 bg-cyan-400/20 px-5 py-3 text-sm uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-400/32 sm:w-auto"
              >
                Отправить заявку
                <ArrowUpRight size={16} />
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
