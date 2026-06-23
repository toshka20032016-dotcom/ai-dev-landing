"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { SectionParallax } from "@/components/ui/section-parallax";
import { content } from "@/content/ru";
import { cn } from "@/lib/utils";
import { GPU_LAYER } from "@/lib/performance";

export function FaqSection() {
  const { faq } = content;
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative z-10 mx-auto max-w-3xl px-4 py-24">
      <SectionParallax className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-400 backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          {faq.badge}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl"
        >
          {faq.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-base font-light text-gray-400 md:text-lg"
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
                "overflow-hidden rounded-2xl border border-white/10 bg-slate-950/20 backdrop-blur-sm transition-colors hover:border-white/15",
                GPU_LAYER,
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-medium text-white"
                aria-expanded={isOpen}
              >
                {item.q}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-cyan-400 transition-transform duration-300",
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
                    <p className="border-t border-white/5 px-6 pt-3 pb-4 text-sm leading-relaxed text-gray-400">
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
