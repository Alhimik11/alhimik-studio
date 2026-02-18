import type { Metadata } from "next";
import { Services } from "@/components/sections/Services";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Services",
  description: "VR, AR, AI, BIM and realtime 3D services by Alhimik Studio.",
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <Services />
      <CTA />
    </div>
  );
}
