"use client";

import { CloudCog, ShieldCheck, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

import { content, type WikiComplianceIcon } from "@/content/ru";

const ICONS: Record<WikiComplianceIcon, typeof CloudCog> = {
  iac: CloudCog,
  security: ShieldCheck,
  production: GitBranch,
};

export function ComplianceCards() {
  const { compliance } = content.wiki;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{compliance.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{compliance.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {compliance.cards.map((card, index) => {
          const Icon = ICONS[card.icon];

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#0d0d11] p-6 transition-colors hover:border-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">{card.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{card.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}