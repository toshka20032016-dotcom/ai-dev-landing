"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { SectionParallax } from "@/components/ui/section-parallax";
import { content } from "@/content/ru";
import { cn } from "@/lib/utils";
import { GPU_LAYER } from "@/lib/performance";
import {
  isPreviewVariant,
  previewSection,
  type SectionVariant,
} from "@/lib/preview-variant";

export function FaqSection({ variant = "default" }: { variant?: SectionVariant }) {
  const { faq } = content;
  const [open, setOpen] = useState(0);
  const isPreview = isPreviewVariant(variant);

  return (
    <section id="faq" className="relative z-10 mx-auto max-w-3xl px-4 py-24">
      <SectionParallax className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className={`mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-sm ${
            isPreview ? previewSection.badge.replace("mb-4 ", "") : "text-cyan-400"
          }`}
        >
          {!isPreview && (
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          )}
          {faq.badge}
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
          {faq.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={
            isPreview
              ? previewSection.subtitle
              : "mx-auto max-w-2xl text-base font-light text-gray-400 md:text-lg"
          }
        >
          {faq.subtitle}
        </motion.p>
      </SectionParallax>

      <div className="space-y-3">
        {faq.items.map((item, i) => {
          const isOpen = open === i;

          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn(
                "overflow-hidden transition-colors",
                isPreview
                  ? "rounded-[24px] border border-white/10 bg-transparent hover:border-[#8052ff]/25"
                  : "rounded-2xl border border-white/10 bg-slate-950/20 backdrop-blur-sm hover:border-white/15",
                GPU_LAYER,
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={`flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-white ${
                  isPreview ? "font-light" : "font-medium"
                }`}
                aria-expanded={isOpen}
              >
                {item.q}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    isPreview ? "text-[#8052ff]" : "text-cyan-400",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className={`border-t border-white/5 px-6 pt-3 pb-4 text-sm leading-relaxed ${isPreview ? "text-[#bdbdbd]" : "text-gray-400"}`}>
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
