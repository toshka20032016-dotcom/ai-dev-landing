"use client";

import { motion } from "framer-motion";
import { Code2, ShieldAlert, Timer, Zap, type LucideIcon } from "lucide-react";

import { content } from "@/content/ru";
import { SectionParallax } from "@/components/ui/section-parallax";
import { GPU_LAYER } from "@/lib/performance";

const iconMap = {
  timer: Timer,
  zap: Zap,
  code: Code2,
  shield: ShieldAlert,
} as const satisfies Record<string, LucideIcon>;

const iconColors = {
  timer: "text-cyan-400",
  zap: "text-purple-400",
  code: "text-pink-400",
  shield: "text-emerald-400",
} as const;

export function KpiSection() {
  const { kpi } = content;

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
      <SectionParallax>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.items.map((stat, idx) => {
          const Icon = iconMap[stat.icon];
          const iconColor = iconColors[stat.icon];

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group glass-card relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:border-white/15 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)] ${GPU_LAYER}`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
              <div className="relative mb-6 w-fit rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors group-hover:border-white/20 group-hover:bg-white/[0.05]">
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div className="relative mb-2 font-mono text-3xl font-black tracking-tight text-white">
                {stat.value}
              </div>
              <div className="relative mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase transition-colors group-hover:text-cyan-400">
                {stat.label}
              </div>
              <p className="relative text-xs leading-relaxed font-light text-gray-500">
                {stat.desc}
              </p>
            </motion.div>
          );
        })}
        </div>
      </SectionParallax>
    </section>
  );
}
