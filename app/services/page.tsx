import type { Metadata } from "next";
import { Services } from "@/components/sections/Services";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Услуги",
  description: "Услуги Alhimik Studio: VR, AR, AI, BIM и 3D-разработка в реальном времени.",
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <Services />
      <CTA />
    </div>
  );
}
