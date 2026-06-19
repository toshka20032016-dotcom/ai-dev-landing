import dynamic from "next/dynamic";
import PremiumCanvas from "@/components/canvas/PremiumCanvas";
import { AppSmoothContainer } from "@/components/ui/AppSmoothContainer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { TechTicker } from "@/components/sections/TechTicker";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Footer } from "@/components/sections/footer";

const ArchitectureStack = dynamic(
  () => import("@/components/sections/ArchitectureStack"),
);
const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection"),
);
const FaqSection = dynamic(() =>
  import("@/components/sections/FaqSection").then((m) => ({
    default: m.FaqSection,
  })),
);
const KpiSection = dynamic(() =>
  import("@/components/sections/KpiSection").then((m) => ({
    default: m.KpiSection,
  })),
);
const PortfolioSection = dynamic(
  () => import("@/components/sections/PortfolioSection"),
);
const PricingSection = dynamic(() =>
  import("@/components/sections/PricingSection").then((m) => ({
    default: m.PricingSection,
  })),
);
const WorkflowSection = dynamic(() =>
  import("@/components/sections/WorkflowSection").then((m) => ({
    default: m.WorkflowSection,
  })),
);

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
          <WorkflowSection />
          <SectionDivider />
          <KpiSection />
          <SectionDivider />
          <ArchitectureStack />
          <SectionDivider />
          <PortfolioSection />
          <SectionDivider />
          <PricingSection />
          <SectionDivider />
          <FaqSection />
          <SectionDivider />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
