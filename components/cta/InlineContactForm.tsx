"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useUISound } from "@/lib/sound/useUISound";
import { MagneticButton } from "@/components/ui/MagneticButton";

type FormState = "idle" | "submitting" | "success";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus-visible:border-cyan-300/55 focus-visible:ring-2 focus-visible:ring-cyan-400/20";

export function InlineContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const { playClick } = useUISound();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormState("submitting");
    playClick();

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setFormState("success");
    window.setTimeout(() => setFormState("idle"), 4000);
    formRef.current?.reset();
  };

  return (
    <AnimatePresence mode="wait">
      {formState === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-5 py-4"
        >
          <Check size={20} className="text-cyan-200" />
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">
            Заявка принята. Мы свяжемся в течение 24 ч.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input required name="name" placeholder="Имя" className={inputClass} aria-label="Ваше имя" />
            <input
              required
              type="email"
              name="email"
              placeholder="Почта"
              className={inputClass}
              aria-label="Электронная почта"
            />
          </div>
          <textarea
            required
            name="message"
            rows={3}
            placeholder="Расскажите о проекте..."
            className={`${inputClass} resize-none`}
            aria-label="Описание проекта"
          />

          <MagneticButton className="inline-block" strength={0.2}>
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-200/35 bg-cyan-400/20 px-6 py-3 text-sm uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:bg-cyan-400/32 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30"
            >
              {formState === "submitting" ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
              {formState === "submitting" ? "Отправка..." : "Отправить"}
            </button>
          </MagneticButton>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
