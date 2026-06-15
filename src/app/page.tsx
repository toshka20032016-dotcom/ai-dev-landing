import PremiumCanvas from "@/components/canvas/PremiumCanvas";
import { AppSmoothContainer } from "@/components/ui/AppSmoothContainer";
import { SystemStatus } from "@/components/ui/SystemStatus";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { TechTicker } from "@/components/sections/TechTicker";
import { ServicesSection } from "@/components/sections/ServicesSection";
import ArchitectureStack from "@/components/sections/ArchitectureStack";
import { KpiSection } from "@/components/sections/KpiSection";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import { FaqSection } from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/footer";

function SectionDivider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-x-hidden bg-[#030408] pt-20 text-white selection:bg-cyan-500/30">
        <PremiumCanvas />
        <AppSmoothContainer />

        <div className="relative z-10 w-full">
          <Hero />
          <TechTicker />
          <SectionDivider />
          <ServicesSection />
          <SectionDivider />
          <KpiSection />
          <SectionDivider />
          <ArchitectureStack />
          <SectionDivider />
          <WorkflowSection />
          <SectionDivider />
          <PortfolioSection />
          <SectionDivider />
          <FaqSection />
          <SectionDivider />
          <ContactSection />
        </div>
      </main>
      <SystemStatus />
      <Footer />
    </>
  );
}
