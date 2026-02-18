"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  target: string;
  className?: string;
  durationMs?: number;
};

export function AnimatedCounter({ target, className, durationMs = 1200 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("0");
  const hasAnimated = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) {
          return;
        }

        hasAnimated.current = true;

        const numMatch = target.match(/(\d+)/);
        if (!numMatch) {
          setDisplayed(target);
          return;
        }

        const end = parseInt(numMatch[1], 10);
        const prefix = target.slice(0, target.indexOf(numMatch[1]));
        const suffix = target.slice(target.indexOf(numMatch[1]) + numMatch[1].length);
        const startedAt = performance.now();
        const tick = (time: number) => {
          const elapsed = Math.min(1, (time - startedAt) / durationMs);
          const eased = 1 - (1 - elapsed) ** 3;
          const value = Math.round(end * eased);

          setDisplayed(`${prefix}${value.toLocaleString("ru-RU")}${suffix}`);

          if (elapsed < 1) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [durationMs, target]);

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}
