"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import { SectionParallax } from "@/components/ui/section-parallax";
import { content, type PricingCard } from "@/content/ru";
import { useEasterEgg } from "@/context/EasterEggContext";
import { GPU_LAYER } from "@/lib/performance";
import {
  isPreviewVariant,
  previewSection,
  type SectionVariant,
} from "@/lib/preview-variant";

const accentStyles: Record<
  PricingCard["accent"],
  { border: string; glow: string; subtitle: string; button: string }
> = {
  cyan: {
    border: "hover:border-cyan-400/25",
    glow: "hover:shadow-[0_0_30px_rgba(0,210,255,0.1)]",
    subtitle: "text-cyan-400",
    button:
      "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-400/15",
  },
  purple: {
    border: "hover:border-purple-400/25",
    glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]",
    subtitle: "text-purple-400",
    button:
      "border-purple-400/30 bg-purple-400/10 text-purple-300 hover:border-purple-400/50 hover:bg-purple-400/15",
  },
};

export function PricingSection({ variant = "default" }: { variant?: SectionVariant }) {
  const { pricing } = content;
  const { isEasterEggActive } = useEasterEgg();
  const isPreview = isPreviewVariant(variant);

  return (
    <section id="pricing" className="relative z-10 mx-auto max-w-5xl px-4 py-24">
      <SectionParallax className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className={`mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-sm ${
            isPreview
              ? previewSection.badge.replace("mb-4 ", "")
              : isEasterEggActive
                ? "text-pink-400"
                : "text-cyan-400"
          }`}
        >
          {!isPreview && (
            <span
              className={`flex h-2 w-2 animate-pulse rounded-full ${
                isEasterEggActive ? "bg-pink-400" : "bg-cyan-400"
              }`}
            />
          )}
          {pricing.badge}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={
            isPreview
              ? previewSection.title
              : "mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl"
          }
        >
          {pricing.title}{" "}
          <span
            className={
              isPreview
                ? previewSection.titleAccent
                : "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            }
          >
            {pricing.titleHighlight}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-base font-light text-gray-400 md:text-lg"
        >
          {pricing.subtitle}
        </motion.p>
      </SectionParallax>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {pricing.cards.map((card, index) => {
          const styles = accentStyles[card.accent];

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className={`group relative flex flex-col overflow-hidden transition-all duration-300 ${
                isPreview
                  ? previewSection.card
                  : `rounded-3xl border border-white/10 bg-slate-950/40 p-8 shadow-2xl backdrop-blur-lg ${styles.border} ${styles.glow} ${GPU_LAYER}`
              }`}
            >
              {!isPreview && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
              )}

              <div className="relative mb-6">
                <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${isPreview ? "text-[#8052ff]" : styles.subtitle}`}>
                  {card.subtitle}
                </p>
                <h3 className={`text-2xl text-white ${isPreview ? "font-light" : "font-bold"}`}>{card.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-400">
                  {card.description}
                </p>
              </div>

              <ul className="relative mb-8 flex-1 space-y-3">
                {card.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isPreview ? "text-[#8052ff]" : styles.subtitle}`} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/#contact"
                className={`relative inline-flex w-full items-center justify-center gap-2 transition-all duration-300 ${
                  isPreview
                    ? previewSection.pillBtn
                    : `rounded-xl border px-4 py-3 text-sm font-semibold backdrop-blur-sm ${styles.button}`
                }`}
              >
                {pricing.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}