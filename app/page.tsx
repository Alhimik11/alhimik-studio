import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Portfolio } from "@/components/sections/Portfolio";
import { CTA } from "@/components/sections/CTA";
import { SectionAlchemyDivider } from "@/components/ui/SectionAlchemyDivider";

export default function Home() {
  return (
    <>
      <Hero />
      <SectionAlchemyDivider />
      <Services />
      <SectionAlchemyDivider />
      <About />
      <SectionAlchemyDivider />
      <Portfolio />
      <CTA />
    </>
  );
}
