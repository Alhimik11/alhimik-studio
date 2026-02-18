"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function SectionAlchemyDivider() {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!svgRef.current || reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(svgRef.current, {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 1.5,
        },
      });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="flex justify-center py-8" aria-hidden="true">
      <svg ref={svgRef} width="74" height="74" viewBox="0 0 64 64" className="text-copper-400/40">
        <defs>
          <linearGradient id="divider-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b379ff" />
            <stop offset="100%" stopColor="#d8b67b" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle
          cx="32"
          cy="32"
          r="20"
          fill="none"
          stroke="url(#divider-gradient)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
        />
        <polygon points="32,6 56,47 8,47" fill="none" stroke="url(#divider-gradient)" strokeWidth="0.8" />
        <circle cx="32" cy="32" r="4" fill="url(#divider-gradient)" opacity="0.35" />
      </svg>
    </div>
  );
}
