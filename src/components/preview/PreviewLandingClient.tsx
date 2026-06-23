"use client";

import dynamic from "next/dynamic";

import { PreviewFooter } from "@/components/preview/PreviewFooter";
import { PreviewHeader } from "@/components/preview/PreviewHeader";
import { PreviewHero } from "@/components/preview/PreviewHero";
import { ParticleConstellation } from "@/components/preview/ParticleConstellation";
import { TechTicker } from "@/components/sections/TechTicker";
import { ServicesSection } from "@/components/sections/ServicesSection";

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

function PreviewSectionGap() {
  return <div className="h-[60px]" aria-hidden />;
}

export function PreviewLandingClient() {
  return (
    <div
      data-theme="preview"
      className="preview-root relative min-h-screen overflow-x-hidden bg-black text-white selection:bg-[#8052ff]/30 selection:text-white"
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <ParticleConstellation />
      </div>

      <PreviewHeader />

      <main className="relative z-10 w-full pt-20">
        <PreviewHero />
        <TechTicker variant="preview" />
        <PreviewSectionGap />
        <ServicesSection variant="preview" />
        <PreviewSectionGap />
        <WorkflowSection variant="preview" />
        <PreviewSectionGap />
        <KpiSection variant="preview" />
        <PreviewSectionGap />
        <ArchitectureStack variant="preview" />
        <PreviewSectionGap />
        <PortfolioSection variant="preview" />
        <PreviewSectionGap />
        <PricingSection variant="preview" />
        <PreviewSectionGap />
        <FaqSection variant="preview" />
        <PreviewSectionGap />
        <ContactSection variant="preview" />
      </main>

      <PreviewFooter />
    </div>
  );
}
