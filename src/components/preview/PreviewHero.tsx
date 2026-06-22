"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { content } from "@/content/ru";

const { preview } = content;

export function PreviewHero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [perspective:1200px]"
      >
        <motion.div
          animate={{ rotateY: [8, -6, 8], rotateX: [-4, 5, -4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[18%] right-[8%] hidden h-32 w-32 rounded-3xl border border-white/10 md:block lg:h-40 lg:w-40"
        />
        <motion.div
          animate={{ rotateY: [-10, 6, -10], rotateX: [5, -3, 5] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[42%] right-[22%] hidden h-20 w-20 rounded-3xl border border-[#8052ff]/30 md:block"
        />
        <motion.div
          animate={{ rotateZ: [0, 8, 0], y: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[28%] right-[12%] hidden h-14 w-14 rounded-full border border-[#15846e]/40 md:block"
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1200px] gap-12 px-6 pb-24 pt-16 md:grid-cols-2 md:items-center md:gap-8 md:pt-24">
        <div className="max-w-[480px]">
          <p className="preview-kicker mb-4">{preview.eyebrow}</p>
          <h1 className="text-[clamp(2.75rem,8vw,5rem)] leading-[0.9] font-extralight tracking-[-0.04em]">
            {preview.title}
            <br />
            <span className="text-white/90">{preview.titleLine2}</span>
          </h1>
          <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed tracking-[0.025em] text-[#bdbdbd]">
            {preview.subtitle}
          </p>
          <Link href="#contact" className="preview-cta mt-10">
            {preview.cta}
          </Link>
        </div>

        <div className="relative hidden min-h-[420px] md:block" aria-hidden />
      </div>
    </section>
  );
}
