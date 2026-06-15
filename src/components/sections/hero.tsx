"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

import { content } from "@/content/ru";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { AuthorPortrait } from "@/components/ui/AuthorPortrait";
import { HeroTerminal } from "@/components/ui/HeroTerminal";
import { useEasterEgg } from "@/context/EasterEggContext";
import { usePerformanceController } from "@/hooks/usePerformanceController";
import { GPU_LAYER } from "@/lib/performance";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.178 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.021C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
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

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [8, -8]),
    { stiffness: 150, damping: 20 },
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-8, 8]),
    { stiffness: 150, damping: 20 },
  );

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

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={enable3D ? handleMouseLeave : undefined}
      className="relative min-h-screen overflow-hidden pt-28"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
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

      <div className="relative z-[2] mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-center px-4 py-20 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 * animationMultiplier }}
            className={`order-1 ${GPU_LAYER}`}
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 * animationMultiplier }}
              className={`mb-6 inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 ${GPU_LAYER}`}
            >
              {content.hero.badge}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 * animationMultiplier, delay: 0.1 * animationMultiplier }}
              className={`max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl ${GPU_LAYER}`}
            >
              {content.hero.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span
                className={
                  isEasterEggActive
                    ? "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-300 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent"
                }
              >
                {content.hero.title.split(" ").slice(-2).join(" ")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 * animationMultiplier, delay: 0.2 * animationMultiplier }}
              className={`mt-6 max-w-2xl text-lg text-white/60 md:text-xl ${GPU_LAYER}`}
            >
              {content.hero.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 * animationMultiplier, delay: 0.3 * animationMultiplier }}
              className={`mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center ${GPU_LAYER}`}
            >
              <Button size="lg">
                {content.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                {content.hero.secondaryCta}
              </Button>
              <a
                href={content.hero.stackBadge.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-[11px] tracking-wide text-white/60 backdrop-blur-md transition-all duration-300 ${
                  isEasterEggActive
                    ? "hover:border-pink-500/20 hover:bg-pink-500/5 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.12)]"
                    : "hover:border-cyan-500/20 hover:bg-cyan-500/5 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                }`}
              >
                <GithubMark className="h-3.5 w-3.5" />
                {content.hero.stackBadge.label}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            ref={terminalRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 * animationMultiplier, delay: 0.35 * animationMultiplier }}
            className={`order-2 flex flex-col items-center gap-8 lg:items-end lg:justify-center ${GPU_LAYER}`}
            style={enable3D ? { perspective: 2000 } : undefined}
          >
            <div className={`relative w-full max-w-xl min-h-[280px] lg:min-h-[420px] ${GPU_LAYER}`}>
              <div
                aria-hidden
                className={`pointer-events-none absolute -inset-4 rounded-3xl blur-3xl select-none ${
                  isEasterEggActive ? "bg-pink-500/20" : "bg-cyan-500/20"
                }`}
              />
              <motion.div
                className={`relative flex flex-col gap-8 lg:block ${GPU_LAYER}`}
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
                <div className="relative z-0 w-full max-w-[280px] mx-auto lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-6 lg:max-w-[300px]">
                  <AuthorPortrait />
                </div>
                <div className="relative z-10 w-full max-w-md ml-auto">
                  <HeroTerminal />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
