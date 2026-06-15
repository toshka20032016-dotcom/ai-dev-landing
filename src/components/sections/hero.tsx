"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

import { content } from "@/content/ru";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { HeroTerminal } from "@/components/ui/HeroTerminal";
import { GPU_LAYER } from "@/lib/performance";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const enable3D = !prefersReducedMotion && !isMobile;

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
          background:
            "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(6,182,212,0.15), transparent 50%)",
        }}
      />

      <AnimatedGridPattern />

      <div className="relative z-[2] mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-center px-4 py-20 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`order-1 ${GPU_LAYER}`}
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mb-6 inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 ${GPU_LAYER}`}
            >
              {content.hero.badge}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl ${GPU_LAYER}`}
            >
              {content.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`mt-6 max-w-2xl text-lg text-white/60 md:text-xl ${GPU_LAYER}`}
            >
              {content.hero.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`mt-10 flex flex-col gap-4 sm:flex-row ${GPU_LAYER}`}
            >
              <Button size="lg">
                {content.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                {content.hero.secondaryCta}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            ref={terminalRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className={`order-2 flex justify-center lg:justify-end ${GPU_LAYER}`}
            style={enable3D ? { perspective: 2000 } : undefined}
          >
            <div className={`relative w-full max-w-xl ${GPU_LAYER}`}>
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-4 rounded-3xl bg-cyan-500/20 blur-3xl select-none"
              />
              <motion.div
                className={`relative ${GPU_LAYER}`}
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
        </div>
      </div>
    </section>
  );
}
