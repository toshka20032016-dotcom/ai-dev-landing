"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { GPU_LAYER } from "@/lib/performance";

type SectionParallaxProps = {
  children: ReactNode;
  className?: string;
  offset?: number;
};

export function SectionParallax({
  children,
  className,
  offset = -30,
}: SectionParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={`${className ?? ""} ${GPU_LAYER}`}>
      {children}
    </motion.div>
  );
}
