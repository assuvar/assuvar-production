import Hero from "@/components/Hero";
import LogoTicker from "@/components/LogoTicker";
import ServicesTimeline from "@/components/ServicesTimeline";

import IndustriesScroll from "@/components/IndustriesScroll";
import Services from "@/components/Services";
import Methodology from "@/components/Methodology";
import Insights from "@/components/Insights";
import AmbientWave from "@/components/AmbientWave";
import ScrollSection from "@/components/ui/ScrollSection";

export default function Home() {
  return (
    <>
      <Hero />

      <ScrollSection>
        <LogoTicker />
      </ScrollSection>

      <ScrollSection>
        <IndustriesScroll />
      </ScrollSection>

      <ScrollSection>
        <ServicesTimeline />
      </ScrollSection>

      <ScrollSection>
        <Services />
      </ScrollSection>

      <ScrollSection>
        <Methodology />
      </ScrollSection>

      <ScrollSection>
        <Insights />
      </ScrollSection>
    </>
  );
}
