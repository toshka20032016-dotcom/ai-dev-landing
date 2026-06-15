"use client";

import { motion } from "framer-motion";

import { useEasterEgg } from "@/context/EasterEggContext";
import { usePerformanceController } from "@/hooks/usePerformanceController";

const BLOB_BASE =
  "pointer-events-none absolute select-none transform-gpu will-change-transform";

export default function PremiumCanvas() {
  const { disableHeavyEffects } = usePerformanceController();
  const { isEasterEggActive, animationMultiplier } = useEasterEgg();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full select-none overflow-hidden bg-[#030408]">
      <div className="premium-noise pointer-events-none select-none" />

      <div className="pointer-events-none absolute inset-0 select-none bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

      {disableHeavyEffects ? (
        <>
          <div
            className={`${BLOB_BASE} top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-purple-600/20 blur-[140px] opacity-[0.18]`}
          />
          <div
            className={`${BLOB_BASE} top-[30%] right-[-5%] h-[45vw] w-[45vw] rounded-full blur-[160px] opacity-[0.14] ${
              isEasterEggActive ? "bg-pink-500/15" : "bg-cyan-500/15"
            }`}
          />
        </>
      ) : (
        <>
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.22, 0.15],
            }}
            transition={{
              duration: 10 * animationMultiplier,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`${BLOB_BASE} top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-purple-600/20 blur-[140px]`}
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.1, 0.18, 0.1],
            }}
            transition={{
              duration: 12 * animationMultiplier,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2 * animationMultiplier,
            }}
            className={`${BLOB_BASE} top-[30%] right-[-5%] h-[45vw] w-[45vw] rounded-full blur-[160px] ${
              isEasterEggActive ? "bg-pink-500/15" : "bg-cyan-500/15"
            }`}
          />
        </>
      )}

      <div
        className={`${BLOB_BASE} bottom-[-10%] left-[25%] h-[40vw] w-[50vw] rounded-full blur-[130px] ${
          isEasterEggActive ? "bg-pink-500/15" : "bg-pink-500/10"
        }`}
      />

      <div className="pointer-events-none absolute inset-0 select-none bg-[radial-gradient(circle_at_50%_-20%,transparent_30%,#030408_85%)]" />
    </div>
  );
}
