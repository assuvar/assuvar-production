import Hero from "@/components/Hero";
import LogoTicker from "@/components/LogoTicker";
import ServicesTimeline from "@/components/ServicesTimeline";
import IndustriesScroll from "@/components/IndustriesScroll";
import Services from "@/components/Services";
import Methodology from "@/components/Methodology";
import Insights from "@/components/Insights";
import AmbientWave from "@/components/AmbientWave";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoTicker />
      <IndustriesScroll />
      <ServicesTimeline />
      <Services />
      <Methodology />
      <Insights />
    </>
  );
}
