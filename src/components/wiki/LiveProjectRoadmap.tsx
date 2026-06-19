"use client";

import { motion } from "framer-motion";

import { content, type WikiRoadmapStepStatus } from "@/content/ru";

const STATUS_STYLES: Record<
  WikiRoadmapStepStatus,
  { card: string; num: string; badge: string }
> = {
  done: {
    card: "bg-black/20 border-emerald-500/20",
    num: "text-gray-500",
    badge: "bg-emerald-500/5 border-emerald-500/10 text-emerald-400",
  },
  current: {
    card: "bg-[#0d0d11] border-[#00d2ff]/30 shadow-[0_0_20px_rgba(0,210,255,0.03)]",
    num: "text-[#00d2ff]",
    badge: "bg-[#00d2ff]/5 border-[#00d2ff]/10 text-[#00d2ff]",
  },
  pending: {
    card: "bg-transparent border-white/5 opacity-50",
    num: "text-gray-500",
    badge: "bg-white/5 border-white/5 text-gray-500",
  },
};

export function LiveProjectRoadmap() {
  const { roadmap } = content.wiki;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6 rounded-xl border border-white/5 bg-[#07070a] p-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="rounded-md border border-[#ff4b91]/10 bg-[#ff4b91]/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#ff4b91]">
            {roadmap.badge}
          </span>
          <h4 className="mt-2 text-lg font-bold tracking-tight text-white">{roadmap.title}</h4>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 font-mono text-xs text-gray-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00d2ff]" />
          {roadmap.nextRelease}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {roadmap.steps.map((step) => {
          const styles = STATUS_STYLES[step.status];

          return (
            <div
              key={step.num}
              className={`relative flex min-h-[140px] flex-col justify-between rounded-xl border p-4 transition-all ${styles.card}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${styles.num}`}>{step.num}</span>
                  <span
                    className={`rounded-md border px-2 py-0.5 font-mono text-[9px] ${styles.badge}`}
                  >
                    {step.badge}
                  </span>
                </div>
                <h5 className="mt-3 text-sm font-semibold text-white">{step.name}</h5>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
