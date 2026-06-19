"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, RefreshCw } from "lucide-react";

import { TerminalAboutPhoto } from "@/components/ui/AuthorPhotoVariants";
import { useInteraction } from "@/components/providers/interaction-provider";
import { content } from "@/content/ru";
import { useEasterEgg } from "@/context/EasterEggContext";
import { GPU_LAYER } from "@/lib/performance";
import { cn } from "@/lib/utils";

type TerminalTab = keyof typeof content.hero.terminal.commands;

const ALL_TABS = Object.keys(
  content.hero.terminal.commands,
) as TerminalTab[];

const VAULT_MESSAGE = "[ACCESS GRANTED]: SECRET VAULT UNLOCKED";

type HeroTerminalProps = {
  enableAboutTab?: boolean;
  defaultTab?: TerminalTab;
};

export function HeroTerminal({
  enableAboutTab = false,
  defaultTab,
}: HeroTerminalProps) {
  const { terminal } = content.hero;
  const interaction = useInteraction();
  const { isEasterEggActive } = useEasterEgg();
  const terminalTabs = enableAboutTab
    ? ALL_TABS
    : ALL_TABS.filter((tab) => tab !== "about");
  const initialTab =
    defaultTab && terminalTabs.includes(defaultTab)
      ? defaultTab
      : terminalTabs[0];
  const [activeTab, setActiveTab] = useState<TerminalTab>(initialTab);
  const isAboutTab = activeTab === "about";
  const lineCount = isAboutTab ? 0 : terminal.commands[activeTab].length;
  const [visibleLines, setVisibleLines] = useState<number>(lineCount);
  const [isSimulating, setIsSimulating] = useState(false);
  const showVault = isEasterEggActive;
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const triggerSimulation = useCallback(
    (tab: TerminalTab) => {
      clearTimeouts();
      setActiveTab(tab);
      if (tab === "about") {
        setIsSimulating(false);
        setVisibleLines(0);
        return;
      }

      setIsSimulating(true);
      setVisibleLines(0);

      const total = terminal.commands[tab].length;
      for (let i = 0; i <= total; i++) {
        const timeout = setTimeout(() => {
          setVisibleLines(i);
          if (i === total) setIsSimulating(false);
        }, i * 350);
        timeoutsRef.current.push(timeout);
      }
    },
    [clearTimeouts, terminal.commands],
  );

  useEffect(() => clearTimeouts, [clearTimeouts]);

  return (
    <div
      className={`glass-card w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 font-mono text-xs text-gray-300 shadow-2xl backdrop-blur-lg ${GPU_LAYER}`}
    >
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal
            className={`h-3.5 w-3.5 transition-colors duration-500 ${
              isEasterEggActive ? "text-pink-400" : "text-cyan-400"
            }`}
          />
          <span className="text-[11px] font-bold tracking-wider text-gray-400">
            {terminal.title}
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/40" />
        </div>
      </div>

      <div
        className={cn(
          "grid border-b border-white/5 bg-black/20 text-center text-[10px] font-bold tracking-widest text-gray-500",
          terminalTabs.length === 4 ? "grid-cols-4" : "grid-cols-3",
        )}
      >
        {terminalTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              if (isSimulating) return;
              interaction?.playClick();
              triggerSimulation(tab);
            }}
            className={`cursor-pointer border-r border-white/5 py-2.5 uppercase transition-colors last:border-0 ${
              activeTab === tab
                ? isEasterEggActive
                  ? "bg-white/[0.03] font-bold text-pink-400"
                  : "bg-white/[0.03] font-bold text-cyan-400"
                : "hover:text-white"
            }`}
          >
            {terminal.tabs[tab]}
          </button>
        ))}
      </div>

      <div className="min-h-[160px] space-y-2.5 bg-black/40 p-5">
        <AnimatePresence mode="popLayout">
          {showVault && (
            <motion.div
              key="vault"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`pt-1 font-bold ${isEasterEggActive ? "text-pink-400" : "text-emerald-400"} ${GPU_LAYER}`}
            >
              {VAULT_MESSAGE}
            </motion.div>
          )}

          {!showVault && isAboutTab && (
            <motion.div
              key="about-photo"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <TerminalAboutPhoto />
              <p className="text-center text-[10px] text-gray-500">
                {content.hero.authorPortrait.captionName} ·{" "}
                {content.hero.authorPortrait.captionRole}
              </p>
            </motion.div>
          )}

          {!showVault &&
            !isAboutTab &&
            terminal.commands[activeTab].slice(0, visibleLines).map((line, idx) => {
              const isLast = idx === lineCount - 1;
              return (
                <motion.div
                  key={`${activeTab}-${idx}`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`${
                    isLast
                      ? "pt-1 font-bold text-emerald-400"
                      : idx === 0
                        ? "text-white"
                        : "text-gray-400"
                  } ${GPU_LAYER}`}
                >
                  {line}
                </motion.div>
              );
            })}
        </AnimatePresence>

        {!showVault && !isAboutTab && visibleLines < lineCount && (
          <div
            className={`flex animate-pulse items-center gap-1 ${
              isEasterEggActive ? "text-pink-400" : "text-cyan-400"
            }`}
          >
            <span>{terminal.compiling}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.01] px-4 py-2.5 text-[10px] text-gray-500">
        <span>{terminal.engine}</span>
        <button
          type="button"
          onClick={() => !isSimulating && triggerSimulation(activeTab)}
          disabled={isSimulating || isAboutTab}
          className={`flex cursor-pointer items-center gap-1 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
            isEasterEggActive
              ? "text-pink-400 hover:text-pink-300"
              : "text-cyan-400 hover:text-cyan-300"
          }`}
        >
          {isSimulating ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          <span>{terminal.runLabel}</span>
        </button>
      </div>
    </div>
  );
}
