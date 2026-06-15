"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { GPU_LAYER } from "@/lib/performance";
import { Cpu, SearchCode, ShieldCheck } from "lucide-react";

import { content, type WorkflowIcon } from "@/content/ru";
import { SectionParallax } from "@/components/ui/section-parallax";
import { usePerformanceController } from "@/hooks/usePerformanceController";

const icons: Record<WorkflowIcon, typeof SearchCode> = {
  searchCode: SearchCode,
  cpu: Cpu,
  shieldCheck: ShieldCheck,
};

const iconColors: Record<WorkflowIcon, string> = {
  searchCode: "text-cyan-400",
  cpu: "text-purple-400",
  shieldCheck: "text-emerald-400",
};

export function WorkflowSection() {
  const { workflow } = content;
  const containerRef = useRef<HTMLDivElement>(null);
  const { disableHeavyEffects, motionTransition } = usePerformanceController();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: disableHeavyEffects ? 500 : 120,
    damping: disableHeavyEffects ? 50 : 28,
    restDelta: 0.001,
  });

  return (
    <section
      id="workflow"
      ref={containerRef}
      className="relative z-10 mx-auto max-w-5xl px-4 py-24"
    >
      <SectionParallax className="mb-20 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-purple-400 backdrop-blur-sm"
        >
          {workflow.badge}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl"
        >
          {workflow.title}{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {workflow.titleHighlight}
          </span>
        </motion.h2>

        <p className="max-w-xl text-base font-light text-gray-400">{workflow.subtitle}</p>
      </SectionParallax>

      <div className="relative inline-block w-full text-left">
        <div className="absolute bottom-0 left-4 top-0 w-[2px] -translate-x-1/2 bg-white/5 md:left-1/2" />

        {!disableHeavyEffects && (
          <motion.div
            style={{ scaleY }}
            className={`absolute bottom-0 left-4 top-0 z-10 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-400 via-pink-500 to-cyan-400 shadow-[0_0_20px_rgba(168,85,247,0.7),0_0_40px_rgba(236,72,153,0.35)] md:left-1/2 ${GPU_LAYER}`}
          />
        )}

        <div className="space-y-16 md:space-y-24">
          {workflow.steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const Icon = icons[step.icon];
            const iconColor = iconColors[step.icon];

            return (
              <div
                key={step.num}
                className={`relative flex flex-col items-start md:flex-row ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="absolute left-4 top-6 z-20 flex -translate-x-1/2 items-center justify-center md:left-1/2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={motionTransition}
                    className="h-4 w-4 rounded-full border-2 border-pink-500 bg-[#030712] shadow-[0_0_10px_rgba(236,72,153,0.6)]"
                  />
                </div>

                <div className="hidden w-1/2 md:block" />

                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={motionTransition}
                  className="w-full pl-12 md:w-[calc(50%-32px)] md:pl-0"
                >
                  <div className="glass-card group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/30 p-6 backdrop-blur-lg transition-colors duration-300 hover:border-white/10 md:p-8">
                    <span className="pointer-events-none absolute right-6 top-4 select-none font-mono text-7xl font-black text-white/[0.02] transition-colors duration-300 group-hover:text-white/[0.04]">
                      {step.num}
                    </span>

                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-gray-400 transition-colors group-hover:bg-white/[0.05]">
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      </div>
                      <span className="font-mono text-xs tracking-wider text-gray-500">
                        {step.phase}
                      </span>
                    </div>

                    <h3 className="mb-3 text-lg font-bold text-white transition-all group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 group-hover:bg-clip-text group-hover:text-transparent md:text-xl">
                      {step.title}
                    </h3>

                    <p className="mb-6 text-sm font-light leading-relaxed text-gray-400">
                      {step.description}
                    </p>

                    <div className="inline-flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-gray-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      {step.badge}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
