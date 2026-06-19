"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { content, type WikiSlug } from "@/content/ru";

type RoiCalculatorProps = { slug: WikiSlug };

export function RoiCalculator({ slug }: RoiCalculatorProps) {
  const { roi } = content.wiki;
  const [hoursSpent, setHoursSpent] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(1500);

  const factor = roi.savingsFactors[slug] ?? roi.defaultFactor;
  const weeklySavingsHours = Math.round(hoursSpent * factor.ratio);
  const monthlySavingsMoney = Math.round(weeklySavingsHours * 4 * hourlyRate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-6 rounded-xl border border-white/5 bg-[#0d0d11] p-6"
    >
      <div>
        <span className="rounded-md border border-[#00d2ff]/10 bg-[#00d2ff]/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#00d2ff]">
          {roi.badge}
        </span>
        <h4 className="mt-3 text-lg font-bold tracking-tight text-white">{roi.title}</h4>
        <p className="mt-1 text-xs text-gray-500">{factor.label}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-gray-400">{roi.hoursLabel}</span>
              <span className="font-bold text-white">{hoursSpent} {roi.hoursUnit}</span>
            </div>
            <input type="range" min={2} max={60} value={hoursSpent} onChange={(e) => setHoursSpent(Number(e.target.value))} className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#00d2ff]" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-gray-400">{roi.rateLabel}</span>
              <span className="font-bold text-white">{hourlyRate} {roi.currency}</span>
            </div>
            <input type="range" min={500} max={5000} step={100} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#00d2ff]" />
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-3 rounded-xl border border-white/[0.02] bg-black/30 p-4">
          <div className="text-xs text-gray-400">{roi.resultResourceLabel}</div>
          <div className="font-mono text-2xl font-extrabold text-[#00d2ff]">~ {weeklySavingsHours} <span className="text-xs font-normal text-gray-500">{roi.hoursPerWeekUnit}</span></div>
          <div className="border-t border-white/[0.03] pt-2 text-xs text-gray-400">{roi.monthlyBudgetLabel}</div>
          <div className="font-mono text-2xl font-extrabold text-emerald-400">+ {monthlySavingsMoney.toLocaleString("ru-RU")} <span className="text-xs font-normal text-gray-500">{roi.currency}</span></div>
        </div>
      </div>
    </motion.div>
  );
}