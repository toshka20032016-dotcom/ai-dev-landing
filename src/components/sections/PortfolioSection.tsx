"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Layers } from "lucide-react";

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

function MobileProjectCard({
  project,
  previewLabel,
  githubLabel,
  demoLabel,
  isEasterEggActive,
}: {
  project: PortfolioItem;
  previewLabel: string;
  githubLabel: string;
  demoLabel: string;
  isEasterEggActive: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`group glass-card flex flex-col gap-6 rounded-3xl p-4 md:hidden ${GPU_LAYER}`}
    >
      <ProjectPreview project={project} previewLabel={previewLabel} />
      <div>
        <h3
          className={`mb-3 text-xl font-bold text-white transition-colors duration-300 ${
            isEasterEggActive ? "group-hover:text-pink-300" : "group-hover:text-cyan-300"
          }`}
        >
          {project.title}
        </h3>
        <p className="mb-5 text-sm leading-relaxed font-light text-gray-400">
          {project.description}
        </p>
        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.techs.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1 font-mono text-xs text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
        <ProjectLinks
          project={project}
          githubLabel={githubLabel}
          demoLabel={demoLabel}
          isEasterEggActive={isEasterEggActive}
        />
      </div>
    </motion.article>
  );
}

function DesktopFanCard({
  project,
  index,
  isHoveredContainer,
  previewLabel,
  githubLabel,
  demoLabel,
  isEasterEggActive,
  animationMultiplier,
  motionTransition,
}: {
  project: PortfolioItem;
  index: number;
  isHoveredContainer: boolean;
  previewLabel: string;
  githubLabel: string;
  demoLabel: string;
  isEasterEggActive: boolean;
  animationMultiplier: number;
  motionTransition: PerformanceMotionTransition;
}) {
  const isFirst = index === 0;
  const isCenter = index === 1;

  const fanTransition = scaleMotionTransition(
    motionTransition.type === "spring"
      ? { ...motionTransition, stiffness: 110, damping: 22 }
      : motionTransition,
    animationMultiplier,
  );

  // ponytail: keep fan stack readable — each card peeks ~64px below the previous
  const idleX = isFirst ? "-14%" : isCenter ? "0%" : "14%";
  const idleY = index * 64;
  const idleRotate = isFirst ? -3.5 : isCenter ? 0 : 3.5;

  return (
    <motion.div
      className={`absolute top-0 left-1/2 h-[360px] w-[760px] max-w-[90vw] origin-center -translate-x-1/2 transform-gpu will-change-transform ${GPU_LAYER}`}
      style={{ zIndex: index + 1 }}
      animate={{
        x: isHoveredContainer
          ? isFirst
            ? "-28%"
            : isCenter
              ? "0%"
              : "28%"
          : idleX,
        y: isHoveredContainer ? (isCenter ? -15 : 10) : idleY,
        rotate: isHoveredContainer
          ? isFirst
            ? -8
            : isCenter
              ? 0
              : 8
          : idleRotate,
        scale: isHoveredContainer
          ? isCenter
            ? 1.02
            : 0.98
          : 1 - index * 0.02,
        z: isHoveredContainer && isCenter ? 30 : 0,
      }}
      transition={fanTransition}
      whileHover={{
        y: -25,
        z: 50,
        scale: 1.04,
        transition:
          fanTransition.type === "tween"
            ? fanTransition
            : { duration: 0.25 * animationMultiplier, ease: "easeOut" },
      }}
    >
      <article
        className={`group glass-card h-full cursor-pointer rounded-3xl p-5 shadow-2xl transition-shadow duration-300 ${
          isEasterEggActive && isHoveredContainer
            ? "shadow-[0_0_40px_rgba(236,72,153,0.15)]"
            : ""
        }`}
      >
        <div className="flex h-full flex-col gap-5 md:flex-row">
          <ProjectPreview project={project} previewLabel={previewLabel} />
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <h3
                className={`mb-2 text-lg font-bold text-white transition-colors ${
                  isEasterEggActive ? "group-hover:text-pink-300" : "group-hover:text-cyan-300"
                }`}
              >
                {project.title}
              </h3>
              <p className="mb-4 line-clamp-3 text-sm leading-relaxed font-light text-gray-400">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.techs.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-gray-400"
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

export default function PortfolioSection() {
  const { portfolio } = content;
  const { isEasterEggActive, animationMultiplier } = useEasterEgg();
  const { disableHeavyEffects, motionTransition } = usePerformanceController();
  const [isHoveredContainer, setIsHoveredContainer] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const enable3D = !disableHeavyEffects && !isMobile;

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

      <div className="space-y-8 md:hidden">
        {portfolio.items.map((project) => (
          <MobileProjectCard
            key={project.title}
            project={project}
            previewLabel={portfolio.previewLabel}
            githubLabel={portfolio.githubLabel}
            demoLabel={portfolio.demoLabel}
            isEasterEggActive={isEasterEggActive}
          />
        ))}
      </div>

      <div
        className="relative mx-auto hidden h-[500px] max-w-5xl overflow-visible md:block"
        onMouseEnter={() => enable3D && setIsHoveredContainer(true)}
        onMouseLeave={() => setIsHoveredContainer(false)}
      >
        {portfolio.items.map((project, index) => (
          <DesktopFanCard
            key={project.title}
            project={project}
            index={index}
            isHoveredContainer={enable3D && isHoveredContainer}
            previewLabel={portfolio.previewLabel}
            githubLabel={portfolio.githubLabel}
            demoLabel={portfolio.demoLabel}
            isEasterEggActive={isEasterEggActive}
            animationMultiplier={animationMultiplier}
            motionTransition={motionTransition}
          />
        ))}
      </div>
    </section>
  );
}
