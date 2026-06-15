"use client";

import { motion, useReducedMotion } from "framer-motion";

import { content } from "@/content/ru";
import { GPU_LAYER } from "@/lib/performance";

const duplicatedTechs = [
  ...content.techTicker.items,
  ...content.techTicker.items,
  ...content.techTicker.items,
];

export function TechTicker() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative z-10 w-full overflow-hidden border-y border-white/5 bg-slate-950/20 py-6 backdrop-blur-sm select-none">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 md:w-32"
        style={{
          backgroundImage: "linear-gradient(to right, #030408, transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 md:w-32"
        style={{
          backgroundImage: "linear-gradient(to left, #030408, transparent)",
        }}
      />

      {prefersReducedMotion ? (
        <div className="flex flex-wrap items-center justify-center gap-8 px-4">
          {content.techTicker.items.map((tech) => (
            <div key={tech} className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold tracking-widest text-gray-400">
                {tech}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-40" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            ease: "linear",
            duration: 25,
            repeat: Infinity,
          }}
          className={`flex w-max items-center gap-12 whitespace-nowrap ${GPU_LAYER}`}
        >
          {duplicatedTechs.map((tech, idx) => (
            <div key={`${tech}-${idx}`} className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold tracking-widest text-gray-400 transition-colors group-hover:text-white">
                {tech}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-40" />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
