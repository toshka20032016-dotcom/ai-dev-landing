"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { content } from "@/content/ru";
export function SecurityGuards() {
  const { securityGuards } = content.wiki;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4 }} className="space-y-6">
      <h3 className="text-xl font-bold tracking-tight">{securityGuards.title}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {securityGuards.points.map((point) => (
          <div key={point.title} className="space-y-2 rounded-xl border border-white/5 bg-[#07070a] p-5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-[#00d2ff]/20 bg-[#00d2ff]/10 text-[#00d2ff]"><Check className="h-3 w-3" aria-hidden /></div>
            <h4 className="pt-1 text-sm font-semibold text-white">{point.title}</h4>
            <p className="text-xs leading-relaxed text-gray-400">{point.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
