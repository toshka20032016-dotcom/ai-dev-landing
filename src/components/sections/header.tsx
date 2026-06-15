"use client";

import { motion } from "framer-motion";
import { Cpu, Terminal } from "lucide-react";

import { useEasterEgg } from "@/context/EasterEggContext";
import { content } from "@/content/ru";
import { GPU_LAYER } from "@/lib/performance";

export function Header() {
  const { header } = content;
  const { triggerClick, isEasterEggActive } = useEasterEgg();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`pointer-events-none fixed top-0 right-0 left-0 z-40 px-4 pt-4 ${GPU_LAYER}`}
    >
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 p-3 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
        <button
          type="button"
          onClick={triggerClick}
          className={`flex cursor-pointer items-center gap-2 pl-2 transition-colors duration-500 select-none hover:opacity-80 ${
            isEasterEggActive ? "text-pink-500 hover:text-pink-400" : "text-white"
          }`}
          aria-label={header.logo}
        >
          <Terminal
            className={`h-4 w-4 transition-colors duration-500 ${
              isEasterEggActive ? "text-pink-400" : "text-cyan-400"
            }`}
          />
          <span className="font-mono text-xs font-bold tracking-widest uppercase">
            {header.logo}
            {isEasterEggActive && (
              <span className="ml-2 text-[10px] text-pink-400 animate-pulse">
                [OVERCLOCKED]
              </span>
            )}
          </span>
        </button>

        <div className="flex items-center gap-4 pr-2">
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-1 font-mono text-[10px] font-medium text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {header.status}
          </div>

          <div className="hidden items-center gap-1.5 font-mono text-[10px] text-gray-500 sm:inline-flex">
            <Cpu className="h-3 w-3 animate-pulse text-purple-500" />
            {header.edge}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
