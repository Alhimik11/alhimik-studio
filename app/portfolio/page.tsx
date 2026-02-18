import type { Metadata } from "next";
import { Portfolio } from "@/components/sections/Portfolio";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Портфолио",
  description: "Интерактивный шоукейс иммерсивных кейсов и экспериментов в реальном времени от Alhimik Studio.",
};

export default function PortfolioPage() {
  return (
    <div className="pt-20">
      <Portfolio />
      <CTA />
    </div>
  );
}
