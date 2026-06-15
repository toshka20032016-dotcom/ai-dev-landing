"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

import {
  getDeviceCapabilities,
  getMotionTransition,
  isLowEndDevice,
  type DeviceCapabilities,
} from "@/lib/performance";

const SERVER_CAPS: DeviceCapabilities = { cores: 8, ram: 8, isSlowConnection: false };

function subscribeDeviceCapabilities(onStoreChange: () => void) {
  const connection =
    navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection;

  connection?.addEventListener("change", onStoreChange);
  return () => connection?.removeEventListener("change", onStoreChange);
}

export function usePerformanceController() {
  const prefersReducedMotion = useReducedMotion();
  const caps = useSyncExternalStore(
    subscribeDeviceCapabilities,
    getDeviceCapabilities,
    () => SERVER_CAPS,
  );

  return useMemo(() => {
    const lowEnd = isLowEndDevice(caps, prefersReducedMotion ?? false);
    return {
      disableHeavyEffects: lowEnd,
      motionTransition: getMotionTransition(lowEnd),
    };
  }, [caps, prefersReducedMotion]);
}
