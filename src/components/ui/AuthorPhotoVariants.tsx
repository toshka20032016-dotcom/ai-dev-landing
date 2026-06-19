"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { content } from "@/content/ru";
import { useEasterEgg } from "@/context/EasterEggContext";
import { GPU_LAYER } from "@/lib/performance";
import { cn } from "@/lib/utils";

type AnimationProps = {
  animationMultiplier?: number;
};

export function DevAvatarPhoto({ animationMultiplier = 1 }: AnimationProps) {
  const { authorPortrait } = content.hero;
  const { devAvatarBadge } = authorPortrait;
  const { isEasterEggActive } = useEasterEgg();
  const [imageReady, setImageReady] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 * animationMultiplier, delay: 0.06 * animationMultiplier }}
      className={cn("relative w-fit", GPU_LAYER)}
    >
      <div
        className={cn(
          "relative h-28 w-28 overflow-hidden rounded-xl border-2 shadow-[0_0_24px_rgba(6,182,212,0.25)] sm:h-32 sm:w-32",
          isEasterEggActive
            ? "border-pink-400/70 shadow-[0_0_24px_rgba(236,72,153,0.25)]"
            : "border-cyan-400/70",
        )}
      >
        <Image
          src="/images/author.jpg"
          alt={authorPortrait.alt}
          fill
          priority
          sizes="128px"
          quality={85}
          onLoad={() => setImageReady(true)}
          className={cn(
            "object-cover object-[center_20%] transition-opacity duration-500",
            imageReady ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <span
        className={cn(
          "absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[9px] tracking-wider backdrop-blur-md",
          isEasterEggActive
            ? "border-pink-500/30 bg-pink-500/10 text-pink-300"
            : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
        )}
      >
        {devAvatarBadge}
      </span>
    </motion.div>
  );
}

export function SplitStackPhoto({ animationMultiplier = 1 }: AnimationProps) {
  const { authorPortrait } = content.hero;
  const [imageReady, setImageReady] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, y: -16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.65 * animationMultiplier, delay: 0.2 * animationMultiplier }}
      className={cn(
        "pointer-events-none absolute -left-8 -top-6 z-0 w-[88%] max-w-md",
        GPU_LAYER,
      )}
    >
      <motion.div
        className="group/split relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.12),0_0_60px_rgba(139,92,246,0.08)] ring-1 ring-violet-500/20 backdrop-blur-sm"
        whileHover={{ filter: "brightness(1.15) contrast(1.05)" }}
        transition={{ duration: 0.4 }}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950/60 to-violet-950/50"
        />
        <Image
          src="/images/author.jpg"
          alt={authorPortrait.alt}
          fill
          sizes="(max-width: 1024px) 80vw, 400px"
          quality={80}
          onLoad={() => setImageReady(true)}
          className={cn(
            "object-cover object-[center_20%] opacity-70 brightness-75 contrast-90 transition-all duration-500 group-hover/split:opacity-95 group-hover/split:brightness-100",
            imageReady ? "opacity-70" : "opacity-0",
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#030408_100%)] opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:12px_12px] opacity-50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030408] via-transparent to-[#030408]/30" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#030408]/80 to-transparent backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#030408]/80 to-transparent backdrop-blur-[2px]" />
      </motion.div>
    </motion.div>
  );
}

export function TerminalAboutPhoto() {
  const { authorPortrait } = content.hero;
  const { isEasterEggActive } = useEasterEgg();
  const [imageReady, setImageReady] = useState(false);

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[280px] overflow-hidden rounded-lg border border-white/10">
      <Image
        src="/images/author.jpg"
        alt={authorPortrait.alt}
        fill
        sizes="280px"
        quality={80}
        onLoad={() => setImageReady(true)}
        className={cn(
          "object-cover object-[center_20%] transition-opacity duration-500",
          imageReady ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-50",
          isEasterEggActive
            ? "bg-[linear-gradient(rgba(236,72,153,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.02),rgba(0,0,255,0.04))] bg-[size:100%_3px,2px_100%]"
            : "bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.02),rgba(0,0,255,0.04))] bg-[size:100%_4px,3px_100%]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')]" />
    </div>
  );
}
