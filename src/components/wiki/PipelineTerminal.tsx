"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { content, type WikiPipelineLogKind } from "@/content/ru";

const LOG_PREFIX: Record<WikiPipelineLogKind, { symbol: string; className: string }> = {
  success: { symbol: "✔", className: "text-emerald-400" },
  command: { symbol: "❯", className: "text-cyan-400" },
  info: { symbol: "ℹ", className: "text-amber-400" },
};

const TICK_MS = 1200;

export function PipelineTerminal() {
  const { pipeline } = content.wiki;
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= pipeline.lines.length) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [pipeline.lines.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35 }}
      className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#07070a] font-mono text-xs shadow-xl"
    >
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-3 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
        </div>
        <span className="ml-1 text-[10px] text-gray-500">{pipeline.filename}</span>
      </div>

      <div className="min-h-[9rem] space-y-1.5 p-3" aria-live="polite">
        {pipeline.lines.slice(0, visibleCount).map((line, index) => {
          const prefix = LOG_PREFIX[line.kind];

          return (
            <div key={`${line.text}-${index}`} className="flex gap-2 leading-relaxed">
              <span className={`shrink-0 ${prefix.className}`}>{prefix.symbol}</span>
              <span className="text-gray-400">{line.text}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}