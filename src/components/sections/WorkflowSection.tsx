"use client";

import { motion } from "framer-motion";
import { Cpu, Plug, SearchCode, ShieldCheck } from "lucide-react";

import { content, type WorkflowIcon } from "@/content/ru";
import { usePerformanceController } from "@/hooks/usePerformanceController";
import {
  isPreviewVariant,
  previewSection,
  type SectionVariant,
} from "@/lib/preview-variant";

const icons: Record<WorkflowIcon, typeof SearchCode> = {
  searchCode: SearchCode,
  cpu: Cpu,
  plug: Plug,
  shieldCheck: ShieldCheck,
};

const iconColors: Record<WorkflowIcon, string> = {
  searchCode: "text-cyan-400",
  cpu: "text-purple-400",
  plug: "text-amber-400",
  shieldCheck: "text-emerald-400",
};

const badgeStyles: Record<WorkflowIcon, string> = {
  searchCode:
    "border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.35)]",
  cpu: "border-purple-400/25 bg-purple-400/10 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.35)]",
  plug: "border-amber-400/25 bg-amber-400/10 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.35)]",
  shieldCheck:
    "border-emerald-400/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.35)]",
};

export function WorkflowSection({ variant = "default" }: { variant?: SectionVariant }) {
  const { workflow } = content;
  const isPreview = isPreviewVariant(variant);
  const { disableHeavyEffects, motionTransition } = usePerformanceController();

  if (isPreview) {
    return (
      <section
        id="workflow"
        className="relative z-10 flex min-h-[70vh] items-center py-24"
      >
        <div className="mx-auto flex w-full max-w-[1200px] justify-end px-6 md:px-[60px]">
          <div className="max-w-[480px]">
            <p className={previewSection.badge.replace("inline-flex ", "")}>
              {workflow.badge}
            </p>
            <h2 className={previewSection.title}>
              {workflow.title}{" "}
              <span className={previewSection.titleAccent}>
                {workflow.titleHighlight}
              </span>
            </h2>
            <p className={`${previewSection.subtitle.replace("mx-auto ", "")} mb-10`}>
              {workflow.subtitle}
            </p>

            <ol className="relative space-y-6 border-l border-white/10 pl-8">
              {workflow.steps.map((step, index) => {
                const Icon = icons[step.icon];
                return (
                  <li key={step.num} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[33px] top-6 flex h-3 w-3 items-center justify-center rounded-full border border-[#8052ff]/50 bg-black"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8052ff]" />
                    </span>
                    <article className={previewSection.card}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-[24px] border border-white/10 p-2">
                            <Icon className="h-4 w-4 text-[#8052ff]" />
                          </div>
                          <span className="text-xs tracking-[0.021em] text-[#9a9a9a]">
                            {step.phase}
                          </span>
                        </div>
                        <span className="rounded-[24px] border border-[#8052ff]/25 px-2.5 py-1 text-[11px] font-semibold tracking-[0.05em] text-[#8052ff] uppercase">
                          {step.badge}
                        </span>
                      </div>
                      <p className="mb-1 text-[10px] tracking-[0.05em] text-[#9a9a9a] uppercase">
                        Шаг {step.num}
                      </p>
                      <h3 className="mb-2 text-xl font-light text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed tracking-[0.025em] text-[#bdbdbd]">
                        {step.description}
                      </p>
                      {index < workflow.steps.length - 1 && (
                        <div
                          aria-hidden
                          className="mt-6 h-px w-full bg-white/5"
                        />
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="workflow"
      className="relative z-10 mx-auto max-w-5xl px-4 py-24"
    >
      <div className="mb-20 text-center md:text-left">
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
      </div>

      <div className="relative inline-block w-full text-left">
        <div className="absolute bottom-0 left-4 top-0 w-[2px] -translate-x-1/2 bg-white/5 md:left-1/2" />

        {!disableHeavyEffects && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-4 top-0 z-10 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-400 via-pink-500 to-cyan-400 shadow-[0_0_20px_rgba(168,85,247,0.7),0_0_40px_rgba(236,72,153,0.35)] md:left-1/2"
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
                    <span
                      className={`absolute right-4 top-4 z-10 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm ${badgeStyles[step.icon]}`}
                    >
                      {step.badge}
                    </span>

                    <span className="pointer-events-none absolute right-6 top-12 select-none font-mono text-7xl font-black text-white/[0.02] transition-colors duration-300 group-hover:text-white/[0.04]">
                      {step.num}
                    </span>

                    <div className="mb-4 flex items-center gap-3 pt-2">
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-gray-400 transition-colors group-hover:bg-white/[0.05]">
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      </div>
                      <span className="font-mono text-xs tracking-wider text-gray-400">
                        {step.phase}
                      </span>
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-white transition-all group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 group-hover:bg-clip-text group-hover:text-transparent md:text-2xl">
                      {step.title}
                    </h3>

                    <p className="text-sm font-light leading-relaxed text-gray-400">
                      {step.description}
                    </p>
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
