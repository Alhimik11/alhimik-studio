import type { Metadata } from "next";
import { Portfolio } from "@/components/sections/Portfolio";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Interactive showcase of immersive cases and realtime experiments.",
};

export default function PortfolioPage() {
  return (
    <div className="pt-20">
      <Portfolio />
      <CTA />
    </div>
  );
}
