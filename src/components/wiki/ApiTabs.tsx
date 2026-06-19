"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { content, type WikiApiSpecTabKey, type WikiApiSpecs } from "@/content/ru";

const TAB_KEYS: WikiApiSpecTabKey[] = ["request", "response200", "error400"];

type ApiTabsProps = {
  specs: WikiApiSpecs;
};

export function ApiTabs({ specs }: ApiTabsProps) {
  const { apiSpecTabs } = content.wiki;
  const [activeTab, setActiveTab] = useState<WikiApiSpecTabKey>("request");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="grid w-full grid-cols-1 gap-4 rounded-xl border border-white/5 bg-[#09090d] p-4"
    >
      <div className="flex w-fit rounded-lg border border-white/5 bg-white/5 p-1">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeTab === key
                ? "bg-[#0d0d11] text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {apiSpecTabs[key]}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-lg border border-white/5 bg-[#09090d] p-4 font-mono text-sm leading-relaxed text-cyan-400/90">
        <code>{specs[activeTab]}</code>
      </pre>
    </motion.div>
  );
}
