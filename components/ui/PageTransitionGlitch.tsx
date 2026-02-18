"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransitionGlitch() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = window.setTimeout(() => {
      setActive(false);
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[92]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(transparent_15%,rgba(182,128,255,0.16)_50%,transparent_85%)]"
            animate={{ x: [0, -14, 7, -4, 0], opacity: [0.25, 0.35, 0.2] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,146,255,0.24),transparent_55%)] mix-blend-screen"
            animate={{ x: [0, 6, -8, 0], y: [0, -2, 2, 0] }}
            transition={{ duration: 0.45 }}
          />
          <motion.div
            className="absolute inset-0 border-y border-cyan-300/30"
            animate={{ opacity: [0.3, 0.8, 0.18], scaleY: [0.98, 1.01, 1] }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
