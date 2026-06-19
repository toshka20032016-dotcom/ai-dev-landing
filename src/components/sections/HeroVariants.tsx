"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Cpu, Layers, Zap } from "lucide-react";

import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { buttonVariants } from "@/components/ui/button";
import { HeroTerminal } from "@/components/ui/HeroTerminal";
import { content } from "@/content/ru";
import { useEasterEgg } from "@/context/EasterEggContext";
import { useHeroVariant } from "@/context/HeroVariantContext";
import { usePerformanceController } from "@/hooks/usePerformanceController";
import { GPU_LAYER } from "@/lib/performance";
import { cn } from "@/lib/utils";

export type HeroPageContext = "home" | "pricing";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };

const FEATURE_ICONS = {
  zap: Zap,
  layers: Layers,
  cpu: Cpu,
} as const;

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function useCalculatorHref(pageContext: HeroPageContext): string {
  return pageContext === "pricing" ? "#calculator" : "/pricing#calculator";
}

type VariantContentProps = {
  pageContext: HeroPageContext;
  animationMultiplier: number;
};

export function HeroOption1({ pageContext, animationMultiplier }: VariantContentProps) {
  const copy = content.heroVariants.variant1;
  const calculatorHref = useCalculatorHref(pageContext);
  const { isEasterEggActive } = useEasterEgg();

  return (
    <motion.div
      key="hero-v1"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 * animationMultiplier }}
      className={GPU_LAYER}
    >
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 * animationMultiplier }}
        className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
        </span>
        {copy.badge}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 * animationMultiplier, delay: 0.08 * animationMultiplier }}
        className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl"
      >
        {copy.titlePrefix}{" "}
        <span
          className={
            isEasterEggActive
              ? "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-300 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent"
          }
        >
          {copy.titleGradient}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 * animationMultiplier, delay: 0.16 * animationMultiplier }}
        className="mt-6 max-w-2xl font-mono text-sm text-white/50 md:text-base"
      >
        {copy.intro}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 * animationMultiplier, delay: 0.24 * animationMultiplier }}
        className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
      >
        <a href={calculatorHref} className={cn(buttonVariants({ size: "lg" }))}>
          {copy.primaryCta}
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href={copy.stackBadge.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-[11px] tracking-wide text-white/60 backdrop-blur-md transition-all duration-300",
            isEasterEggActive
              ? "hover:border-pink-500/20 hover:bg-pink-500/5 hover:text-pink-300"
              : "hover:border-cyan-500/20 hover:bg-cyan-500/5 hover:text-cyan-300",
          )}
        >
          <GithubMark className="h-3.5 w-3.5" />
          {copy.stackBadge.label}
        </a>
      </motion.div>
    </motion.div>
  );
}

export function HeroOption2({ pageContext, animationMultiplier }: VariantContentProps) {
  const copy = content.heroVariants.variant2;
  const calculatorHref = useCalculatorHref(pageContext);

  return (
    <motion.div
      key="hero-v2"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 * animationMultiplier }}
      className={GPU_LAYER}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.05 * animationMultiplier }}
        className="mb-8 flex flex-wrap gap-2"
      >
        {copy.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] tracking-wide text-white/45"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.1 * animationMultiplier }}
        className="max-w-4xl text-3xl font-black uppercase tracking-[0.08em] text-white md:text-5xl lg:text-6xl"
      >
        {copy.headline}
      </motion.h1>

      <motion.blockquote
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...SPRING, delay: 0.18 * animationMultiplier }}
        className="mt-8 max-w-xl border-l-2 border-cyan-400/60 pl-5 text-base font-light leading-relaxed text-white/55 md:text-lg"
      >
        {copy.quote}
      </motion.blockquote>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.26 * animationMultiplier }}
        className="mt-10 flex flex-wrap gap-6"
      >
        {copy.features.map(({ icon, label }) => {
          const Icon = FEATURE_ICONS[icon];
          return (
            <div key={label} className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                <Icon className="h-4 w-4 text-cyan-400" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-white/60">
                {label}
              </span>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.34 * animationMultiplier }}
        className="mt-10"
      >
        <a
          href={calculatorHref}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white px-8 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          {copy.primaryCta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </motion.div>
  );
}

export function HeroOption3({ pageContext, animationMultiplier }: VariantContentProps) {
  const copy = content.heroVariants.variant3;
  const calculatorHref = useCalculatorHref(pageContext);

  return (
    <motion.div
      key="hero-v3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45 * animationMultiplier }}
      className={cn("text-white", GPU_LAYER)}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 * animationMultiplier }}
        className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-white/35"
      >
        {copy.overline}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.1 * animationMultiplier }}
        className="max-w-4xl text-5xl font-light leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl"
      >
        {copy.headline}
        <br />
        <span className="text-white/40">{copy.subline}</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.22 * animationMultiplier }}
        className="mt-12"
      >
        <a
          href={calculatorHref}
          className="inline-flex items-center gap-3 rounded-lg border border-white/15 bg-transparent px-5 py-3 font-mono text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
        >
          <span className="text-emerald-400/80">$</span>
          {copy.cta}
        </a>
      </motion.div>
    </motion.div>
  );
}

function HeroTerminalColumn({
  terminalRef,
  enable3D,
  rotateX,
  rotateY,
  animationMultiplier,
}: {
  terminalRef: React.RefObject<HTMLDivElement | null>;
  enable3D: boolean;
  rotateX: ReturnType<typeof useSpring>;
  rotateY: ReturnType<typeof useSpring>;
  animationMultiplier: number;
}) {
  const { isEasterEggActive } = useEasterEgg();

  return (
    <motion.div
      ref={terminalRef}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 * animationMultiplier, delay: 0.35 * animationMultiplier }}
      className={cn("flex items-center justify-center lg:justify-end", GPU_LAYER)}
      style={enable3D ? { perspective: 2000 } : undefined}
    >
      <div className={cn("relative w-full max-w-xl", GPU_LAYER)}>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-4 rounded-3xl blur-3xl select-none",
            isEasterEggActive ? "bg-pink-500/20" : "bg-cyan-500/20",
          )}
        />
        <motion.div
          className={cn("relative w-full", GPU_LAYER)}
          style={
            enable3D
              ? {
                  transformStyle: "preserve-3d",
                  rotateX,
                  rotateY,
                }
              : undefined
          }
        >
          <HeroTerminal />
        </motion.div>
      </div>
    </motion.div>
  );
}

type HeroSectionProps = {
  pageContext?: HeroPageContext;
  className?: string;
  compact?: boolean;
};

export function HeroSection({
  pageContext = "home",
  className,
  compact = false,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { variant } = useHeroVariant();
  const { disableHeavyEffects } = usePerformanceController();
  const [isMobile, setIsMobile] = useState(true);
  const { isEasterEggActive, animationMultiplier } = useEasterEgg();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const enable3D = !disableHeavyEffects && !isMobile;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);

      if (enable3D && terminalRef.current) {
        const termRect = terminalRef.current.getBoundingClientRect();
        mouseX.set((event.clientX - termRect.left) / termRect.width - 0.5);
        mouseY.set((event.clientY - termRect.top) / termRect.height - 0.5);
      }
    },
    [mouseX, mouseY, enable3D],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  let variantContent: ReactNode = null;
  if (variant === 1) {
    variantContent = (
      <HeroOption1 pageContext={pageContext} animationMultiplier={animationMultiplier} />
    );
  } else if (variant === 2) {
    variantContent = (
      <HeroOption2 pageContext={pageContext} animationMultiplier={animationMultiplier} />
    );
  } else {
    variantContent = (
      <HeroOption3 pageContext={pageContext} animationMultiplier={animationMultiplier} />
    );
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={disableHeavyEffects ? undefined : handleMouseMove}
      onMouseLeave={enable3D ? handleMouseLeave : undefined}
      className={cn(
        "relative overflow-hidden",
        compact ? "pt-4 pb-8 md:pt-8 md:pb-12" : "min-h-screen pt-28",
        className,
      )}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {!compact && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] select-none"
            style={{
              background: isEasterEggActive
                ? "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(236,72,153,0.15), transparent 50%)"
                : "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(6,182,212,0.15), transparent 50%)",
            }}
          />
          <AnimatedGridPattern />
        </>
      )}

      <div
        className={cn(
          "relative z-[2] mx-auto max-w-7xl px-4 md:px-6",
          compact
            ? "py-8 md:py-12"
            : "flex min-h-[calc(100vh-6rem)] flex-col justify-center py-20",
        )}
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="order-1 lg:col-span-7">{variantContent}</div>
          <div className="order-2 lg:col-span-5">
            <HeroTerminalColumn
              terminalRef={terminalRef}
              enable3D={enable3D}
              rotateX={rotateX}
              rotateY={rotateY}
              animationMultiplier={animationMultiplier}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroVariantSwitcher() {
  const { variant, setVariant } = useHeroVariant();
  const labels: Array<{ value: 1 | 2 | 3; label: string }> = [
    { value: 1, label: "I" },
    { value: 2, label: "II" },
    { value: 3, label: "III" },
  ];

  return (
    <div
      className="hidden items-center gap-0.5 rounded-lg border border-white/5 bg-black/20 p-0.5 sm:inline-flex"
      role="group"
      aria-label="Вариант hero-блока"
    >
      {labels.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setVariant(value)}
          aria-pressed={variant === value}
          className={cn(
            "min-w-[1.75rem] rounded-md px-1.5 py-0.5 font-mono text-[10px] tracking-wide transition-colors",
            variant === value
              ? "bg-cyan-500/15 text-cyan-300"
              : "text-white/35 hover:text-white/60",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
