"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import { GPU_LAYER } from "@/lib/performance";

const RING_SIZE = 32;
const DOT_SIZE = 6;
const SPRING_CONFIG = { stiffness: 400, damping: 28 };

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.tagName === "A" ||
    target.tagName === "BUTTON" ||
    target.closest("a") !== null ||
    target.closest("button") !== null ||
    target.classList.contains("cursor-pointer")
  );
}

export function AppSmoothContainer() {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(
    useTransform(mouseX, (value) => value - RING_SIZE / 2),
    SPRING_CONFIG,
  );
  const ringY = useSpring(
    useTransform(mouseY, (value) => value - RING_SIZE / 2),
    SPRING_CONFIG,
  );
  const dotX = useTransform(mouseX, (value) => value - DOT_SIZE / 2);
  const dotY = useTransform(mouseY, (value) => value - DOT_SIZE / 2);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const moveCursor = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleMouseOver = (event: MouseEvent) => {
      setIsHovered(isInteractiveTarget(event.target));
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[60] hidden h-8 w-8 rounded-full border border-cyan-400/30 mix-blend-screen md:block ${GPU_LAYER}`}
        style={{
          x: ringX,
          y: ringY,
          scale: isHovered ? 2 : 1,
          backgroundColor: isHovered
            ? "rgba(6, 182, 212, 0.08)"
            : "transparent",
          borderColor: isHovered
            ? "rgba(6, 182, 212, 0.6)"
            : "rgba(6, 182, 212, 0.3)",
          boxShadow: isHovered
            ? "0 0 24px rgba(6, 182, 212, 0.35)"
            : "0 0 12px rgba(6, 182, 212, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <motion.div
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[61] hidden h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] md:block ${GPU_LAYER}`}
        style={{ x: dotX, y: dotY }}
      />
    </>
  );
}
