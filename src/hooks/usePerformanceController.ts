"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, type Transition } from "framer-motion";

import {
  getDeviceCapabilities,
  getMotionTransition,
  isLowEndDevice,
} from "@/lib/performance";

export function usePerformanceController() {
  const prefersReducedMotion = useReducedMotion();
  const [disableHeavyEffects, setDisableHeavyEffects] = useState(
    prefersReducedMotion ?? false,
  );
  const [motionTransition, setMotionTransition] = useState<Transition>(() =>
    getMotionTransition(prefersReducedMotion ?? false),
  );

  useEffect(() => {
    const caps = getDeviceCapabilities();
    const lowEnd = isLowEndDevice(caps, prefersReducedMotion ?? false);
    setDisableHeavyEffects(lowEnd);
    setMotionTransition(getMotionTransition(lowEnd));
  }, [prefersReducedMotion]);

  return { disableHeavyEffects, motionTransition };
}
