"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { content, type StackKey } from "@/content/ru";
import { useEasterEgg } from "@/context/EasterEggContext";

export default function ArchitectureStack() {
  const { architectureStack } = content;
  const { isEasterEggActive, animationMultiplier } = useEasterEgg();
  const [activeTab, setActiveTab] = useState<StackKey>("frontend");
  const activeStack = architectureStack.stacks[activeTab];

  return (
    <section className="relative z-10 mx-auto max-w-6xl overflow-hidden px-4 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="relative transform-gpu rounded-3xl border border-white/5 bg-slate-950/20 p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md will-change-transform md:p-10">
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-white/5 pb-8 lg:flex-row lg:items-center">
          <div className="space-y-1">
            <span
              className={`block font-mono text-[10px] tracking-widest uppercase ${
                isEasterEggActive ? "text-pink-400" : "text-cyan-400"
              }`}
            >
              {architectureStack.badge}
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              {architectureStack.title}
            </h3>
          </div>

          <div className="flex gap-1 self-start rounded-xl border border-white/5 bg-black/40 p-1 lg:self-center">
            {architectureStack.tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative cursor-pointer rounded-lg px-4 py-2 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors duration-300 select-none ${
                  activeTab === tab.key
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeArchitectureTab"
                    className="absolute inset-0 rounded-lg border border-white/5 bg-white/10 shadow-inner"
                    transition={{
                      type: "spring",
                      stiffness: 380 / animationMultiplier,
                      damping: 30 / animationMultiplier,
                    }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 * animationMultiplier }}
            >
              <h4 className="mb-2 text-lg font-semibold text-white">
                {activeStack.title}
              </h4>
              <p className="text-sm leading-relaxed font-light text-gray-400">
                {activeStack.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-3 lg:gap-4">
          <AnimatePresence mode="popLayout">
            {activeStack.nodes.map((node, idx) => (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -15 }}
                transition={{
                  type: "spring",
                  stiffness: 120 / animationMultiplier,
                  damping: 20 / animationMultiplier,
                  delay: idx * 0.05 * animationMultiplier,
                }}
                className="group relative flex flex-col"
              >
                <div
                  className={`glass-card rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-md backdrop-blur-sm transition-colors duration-300 ${
                    isEasterEggActive
                      ? "hover:border-pink-500/20 hover:bg-slate-900/60"
                      : "hover:border-cyan-500/20 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] tracking-wider text-gray-400 uppercase">
                      {node.name}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full group-hover:animate-pulse ${
                        isEasterEggActive
                          ? "bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.6)]"
                          : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                      }`}
                    />
                  </div>

                  <div
                    className={`mb-2 font-mono text-base font-bold tracking-tight text-white transition-colors ${
                      isEasterEggActive ? "group-hover:text-pink-400" : "group-hover:text-cyan-400"
                    }`}
                  >
                    {node.tech}
                  </div>

                  <p className="text-xs leading-relaxed font-light text-gray-400">
                    {node.description}
                  </p>
                </div>

                {idx < 2 && (
                  <div className="pointer-events-none absolute top-1/2 -right-2 z-20 hidden w-full max-w-[32px] -translate-x-1/2 -translate-y-1/2 translate-x-1/2 flex-col items-center lg:flex">
                    <div
                      className={`mb-1 rounded bg-slate-950 px-1 py-0.5 font-mono text-[8px] whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        isEasterEggActive ? "text-pink-400/50" : "text-cyan-400/50"
                      }`}
                    >
                      link
                    </div>
                    <svg
                      className={`h-5 w-5 text-white/10 transition-colors duration-300 ${
                        isEasterEggActive
                          ? "group-hover:text-pink-500/40"
                          : "group-hover:text-cyan-500/40"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                )}

                {idx < 2 && (
                  <div className="pointer-events-none flex items-center justify-center py-4 lg:hidden">
                    <span className="mr-2 font-mono text-[9px] tracking-widest text-gray-600 uppercase">
                      {node.connectionText}
                    </span>
                    <svg
                      className="h-4 w-4 rotate-90 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
