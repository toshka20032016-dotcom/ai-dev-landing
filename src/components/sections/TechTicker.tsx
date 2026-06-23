"use client";

import { motion, useReducedMotion } from "framer-motion";

import { content } from "@/content/ru";
import { GPU_LAYER } from "@/lib/performance";
import { isPreviewVariant, type SectionVariant } from "@/lib/preview-variant";

const duplicatedTechs = [
  ...content.techTicker.items,
  ...content.techTicker.items,
  ...content.techTicker.items,
];

export function TechTicker({ variant = "default" }: { variant?: SectionVariant }) {
  const prefersReducedMotion = useReducedMotion();
  const isPreview = isPreviewVariant(variant);

  return (
    <div
      className={`relative z-10 w-full overflow-hidden border-y py-6 select-none ${
        isPreview
          ? "border-white/10 bg-black"
          : "border-white/5 bg-slate-950/20 backdrop-blur-sm"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-16 md:w-32 ${
          isPreview ? "preview-ticker-fade-left" : ""
        }`}
        style={
          isPreview
            ? undefined
            : { backgroundImage: "linear-gradient(to right, #030408, transparent)" }
        }
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-16 md:w-32 ${
          isPreview ? "preview-ticker-fade-right" : ""
        }`}
        style={
          isPreview
            ? undefined
            : { backgroundImage: "linear-gradient(to left, #030408, transparent)" }
        }
      />

      {prefersReducedMotion ? (
        <div className="flex flex-wrap items-center justify-center gap-8 px-4">
          {content.techTicker.items.map((tech) => (
            <div key={tech} className="flex items-center gap-3">
              <span
                className={`font-mono text-xs font-semibold tracking-widest ${
                  isPreview ? "text-[#9a9a9a]" : "text-gray-400"
                }`}
              >
                {tech}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isPreview ? "bg-[#8052ff]" : "bg-gradient-to-r from-cyan-500 to-purple-500 opacity-40"
                }`}
              />
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
              <span
                className={`font-mono text-xs font-semibold tracking-widest transition-colors ${
                  isPreview ? "text-[#9a9a9a]" : "text-gray-400 group-hover:text-white"
                }`}
              >
                {tech}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isPreview
                    ? "bg-[#8052ff]/60"
                    : "bg-gradient-to-r from-cyan-500 to-purple-500 opacity-40"
                }`}
              />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
