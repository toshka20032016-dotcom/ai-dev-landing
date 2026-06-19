"use client";

import { motion } from "framer-motion";

import { content, type WikiEdgeCase } from "@/content/ru";

type EdgeCasesGridProps = {
  cases: readonly [WikiEdgeCase, WikiEdgeCase];
};

export function EdgeCasesGrid({ cases }: EdgeCasesGridProps) {
  const { edgeCaseBadge, edgeCaseTriggerLabel } = content.wiki;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {cases.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="flex flex-col justify-between space-y-4 rounded-xl border border-white/5 bg-[#0d0d11] p-5 transition-colors hover:border-white/10"
        >
          <div>
            <span className="rounded-md border border-[#ff4b91]/10 bg-[#ff4b91]/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#ff4b91]">
              {edgeCaseBadge}
            </span>
            <h4 className="mt-3 text-base font-semibold tracking-tight text-white">
              {item.title}
            </h4>
            <p className="mt-1 font-mono text-xs text-gray-500">
              {edgeCaseTriggerLabel} {item.trigger}
            </p>
          </div>
          <p className="border-t border-white/[0.03] pt-2 text-sm leading-relaxed text-gray-400">
            {item.resolution}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
