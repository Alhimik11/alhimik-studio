import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "О нас",
  description: "Команда Alhimik Studio, ценности и процесс разработки иммерсивных проектов.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <About />
      <CTA />
    </div>
  );
}
