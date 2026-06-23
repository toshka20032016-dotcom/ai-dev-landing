"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Layers } from "lucide-react";

import { content, type PortfolioItem } from "@/content/ru";
import { SectionParallax } from "@/components/ui/section-parallax";
import { useEasterEgg } from "@/context/EasterEggContext";
import { usePerformanceController } from "@/hooks/usePerformanceController";
import { GPU_LAYER, scaleMotionTransition, type PerformanceMotionTransition } from "@/lib/performance";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function ProjectPreview({
  project,
  previewLabel,
}: {
  project: PortfolioItem;
  previewLabel: string;
}) {
  return (
    <div
      className={`relative flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${project.previewBg} transition-colors group-hover:border-white/10 md:h-44 md:w-56`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px]" />
      <span className="absolute select-none font-mono text-7xl font-black text-white/[0.02] transition-all duration-500 group-hover:scale-105 group-hover:text-white/[0.03]">
        {project.patternText}
      </span>
      <div className="relative z-10 flex flex-col items-center gap-2">
        <Layers className="h-7 w-7 text-white/20 transition-all duration-300 group-hover:scale-110 group-hover:text-white/40" />
        <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase transition-colors group-hover:text-white/50">
          {previewLabel}
        </span>
      </div>
    </div>
  );
}

function ProjectLinks({
  project,
  githubLabel,
  demoLabel,
  isEasterEggActive,
}: {
  project: PortfolioItem;
  githubLabel: string;
  demoLabel: string;
  isEasterEggActive: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
      >
        <GithubMark className="h-4 w-4" />
        <span>{githubLabel}</span>
      </a>
      <a
        href={project.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group/btn inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-950 transition-all duration-300 hover:opacity-90 ${
          isEasterEggActive
            ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-[0_0_20px_rgba(236,72,153,0.25)] hover:shadow-[0_0_25px_rgba(236,72,153,0.45)]"
            : "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        }`}
      >
        <ExternalLink className="h-4 w-4" />
        <span>{demoLabel}</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      </a>
    </div>
  );
}

function getCarouselPosition(index: number, activeIndex: number, length: number) {
  let position = index - activeIndex;
  if (position < -1) position += length;
  if (position > 1) position -= length;
  return position;
}

function CarouselCard({
  project,
  position,
  isMobile,
  previewLabel,
  githubLabel,
  demoLabel,
  isEasterEggActive,
  carouselTransition,
}: {
  project: PortfolioItem;
  position: number;
  isMobile: boolean;
  previewLabel: string;
  githubLabel: string;
  demoLabel: string;
  isEasterEggActive: boolean;
  carouselTransition: PerformanceMotionTransition;
}) {
  const isActive = position === 0;
  const isLeft = position === -1;
  const isRight = position === 1;

  if (!isMobile && !isActive && !isLeft && !isRight) return null;
  if (isMobile && !isActive) return null;

  const sideX = isMobile ? 0 : isLeft ? -300 : isRight ? 300 : 0;

  return (
    <motion.div
      layout
      style={{ zIndex: isActive ? 30 : 10 }}
      animate={{
        x: sideX,
        scale: isActive ? 1 : isMobile ? 1 : 0.88,
        rotate: isActive ? 0 : isLeft ? -6 : isRight ? 6 : 0,
        opacity: isActive ? 0.98 : isMobile ? 0 : 0.3,
        filter: isActive || isMobile ? "blur(0px)" : "blur(3px)",
      }}
      transition={carouselTransition}
      className={`absolute top-1/2 left-1/2 w-[92%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 ${GPU_LAYER} ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <article
        className={`group glass-card rounded-[24px] p-4 transition-shadow duration-300 sm:p-5 ${
          isActive
            ? "border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)]"
            : "shadow-2xl"
        } ${
          isEasterEggActive && isActive
            ? "shadow-[0_0_40px_rgba(236,72,153,0.15)]"
            : ""
        }`}
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <ProjectPreview project={project} previewLabel={previewLabel} />
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <h3
                className={`mb-2 text-lg font-bold text-white transition-colors md:text-xl ${
                  isEasterEggActive ? "group-hover:text-pink-300" : "group-hover:text-cyan-300"
                }`}
              >
                {project.title}
              </h3>
              <p className="mb-4 line-clamp-4 text-sm leading-relaxed font-light text-gray-400 md:line-clamp-3">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.techs.slice(0, isMobile ? undefined : 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-gray-400 md:text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <ProjectLinks
              project={project}
              githubLabel={githubLabel}
              demoLabel={demoLabel}
              isEasterEggActive={isEasterEggActive}
            />
          </div>
        </div>
      </article>
    </motion.div>
  );
}

function PortfolioCarousel({
  items,
  previewLabel,
  prevLabel,
  nextLabel,
  githubLabel,
  demoLabel,
  isEasterEggActive,
  animationMultiplier,
  motionTransition,
}: {
  items: readonly PortfolioItem[];
  previewLabel: string;
  prevLabel: string;
  nextLabel: string;
  githubLabel: string;
  demoLabel: string;
  isEasterEggActive: boolean;
  animationMultiplier: number;
  motionTransition: PerformanceMotionTransition;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const carouselTransition = scaleMotionTransition(
    motionTransition.type === "spring"
      ? { ...motionTransition, stiffness: 260, damping: 28 }
      : motionTransition,
    animationMultiplier,
  );

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div
        className={`relative mx-auto w-full ${isMobile ? "h-[520px]" : "h-[400px] md:h-[420px]"}`}
      >
        {items.map((project, index) => (
          <CarouselCard
            key={project.title}
            project={project}
            position={getCarouselPosition(index, activeIndex, items.length)}
            isMobile={isMobile}
            previewLabel={previewLabel}
            githubLabel={githubLabel}
            demoLabel={demoLabel}
            isEasterEggActive={isEasterEggActive}
            carouselTransition={carouselTransition}
          />
        ))}
      </div>

      <div className="relative z-40 mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label={prevLabel}
          className="rounded-full border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 text-gray-300" aria-hidden />
        </button>
        <div className="flex gap-2" role="tablist" aria-label={previewLabel}>
          {items.map((project, index) => (
            <button
              key={project.title}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${project.title}, ${index + 1} из ${items.length}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "w-6 bg-cyan-400"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          aria-label={nextLabel}
          className="rounded-full border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10 active:scale-95"
        >
          <ChevronRight className="h-5 w-5 text-gray-300" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const { portfolio } = content;
  const { isEasterEggActive, animationMultiplier } = useEasterEgg();
  const { motionTransition } = usePerformanceController();

  return (
    <section
      id="portfolio"
      className="relative z-10 mx-auto max-w-6xl px-4 py-24"
    >
      <SectionParallax className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-pink-400 backdrop-blur-sm"
        >
          {portfolio.badge}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl"
        >
          {portfolio.title}{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {portfolio.titleHighlight}
          </span>
        </motion.h2>
        <p className="mx-auto max-w-2xl text-base font-light text-gray-400">
          {portfolio.subtitle}
        </p>
      </SectionParallax>

      <PortfolioCarousel
        items={portfolio.items}
        previewLabel={portfolio.previewLabel}
        prevLabel={portfolio.prevLabel}
        nextLabel={portfolio.nextLabel}
        githubLabel={portfolio.githubLabel}
        demoLabel={portfolio.demoLabel}
        isEasterEggActive={isEasterEggActive}
        animationMultiplier={animationMultiplier}
        motionTransition={motionTransition}
      />
    </section>
  );
}
