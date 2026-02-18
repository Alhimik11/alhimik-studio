import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "About",
  description: "Alhimik Studio team, values, and immersive engineering process.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <About />
      <CTA />
    </div>
  );
}
