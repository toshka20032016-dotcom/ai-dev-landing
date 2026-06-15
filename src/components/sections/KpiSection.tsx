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
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group rounded-2xl border border-white/5 bg-slate-950/20 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-slate-950/40 ${GPU_LAYER}`}
            >
              <div className="mb-6 w-fit rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors group-hover:border-white/10">
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div className="mb-2 font-mono text-3xl font-black tracking-tight text-white">
                {stat.value}
              </div>
              <div className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase transition-colors group-hover:text-cyan-400">
                {stat.label}
              </div>
              <p className="text-xs leading-relaxed font-light text-gray-500">
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
