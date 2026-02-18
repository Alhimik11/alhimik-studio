"use client";
import { useRef, useCallback, useEffect, type ReactNode } from "react";
import gsap from "gsap";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticButton({ children, className, strength = 0.35 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!childRef.current) {
      return;
    }

    xToRef.current = gsap.quickTo(childRef.current, "x", {
      duration: 0.3,
      ease: "power3.out",
    });
    yToRef.current = gsap.quickTo(childRef.current, "y", {
      duration: 0.3,
      ease: "power3.out",
    });

    return () => {
      xToRef.current = null;
      yToRef.current = null;
    };
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !xToRef.current || !yToRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      xToRef.current(x);
      yToRef.current(y);
    },
    [strength],
  );

  const onLeave = useCallback(() => {
    if (!childRef.current) {
      return;
    }

    gsap.to(childRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
  }, []);

  return (
    <div ref={containerRef} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={childRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
