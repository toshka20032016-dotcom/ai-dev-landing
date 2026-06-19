"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { content, WIKI_PAGES, type WikiSlug } from "@/content/ru";

type TerminalArchitectureProps = {
  slug: WikiSlug;
};

export function TerminalArchitecture({ slug }: TerminalArchitectureProps) {
  const { terminal } = content.wiki;
  const [copied, setCopied] = useState(false);
  const graph = WIKI_PAGES[slug]?.dataFlowGraph ?? "";

  const handleCopy = async () => {
    if (!graph) return;
    await navigator.clipboard.writeText(graph);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#07070a] font-mono text-xs shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="ml-2 text-[11px] text-gray-500">{terminal.filename}</span>
        </div>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[11px] text-gray-500 transition-colors hover:text-white"
        >
          {copied ? terminal.copied : terminal.copy}
        </button>
      </div>
      <pre className="overflow-x-auto border border-white/5 bg-[#09090d] p-4 font-mono text-sm text-cyan-400/90">
        <code>{graph || terminal.noGraph}</code>
      </pre>
    </motion.div>
  );
}
