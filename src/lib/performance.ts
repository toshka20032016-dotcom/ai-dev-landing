import type { Transition } from "framer-motion";

export type PerformanceMotionTransition = Transition;

/** GPU-composited layer for animated transforms */
export const GPU_LAYER = "transform-gpu will-change-transform";

export const MOTION_SPRING: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
};

export const MOTION_TWEEN: Transition = {
  type: "tween",
  duration: 0.15,
};

export type DeviceCapabilities = {
  cores: number;
  ram: number;
  isSlowConnection: boolean;
};

const SERVER_CAPS: DeviceCapabilities = {
  cores: 8,
  ram: 8,
  isSlowConnection: false,
};

let cachedClientCaps: DeviceCapabilities | null = null;

export function invalidateDeviceCapabilities() {
  cachedClientCaps = null;
}

function readDeviceCapabilities(): DeviceCapabilities {
  const cores = navigator.hardwareConcurrency || 4;
  const ram = navigator.deviceMemory ?? 8;

  const connection =
    navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection;

  const isSlowConnection = connection
    ? Boolean(
        connection.saveData ||
          ["slow-2g", "2g", "3g"].includes(connection.effectiveType ?? ""),
      )
    : false;

  return { cores, ram, isSlowConnection };
}

export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return SERVER_CAPS;
  }

  if (!cachedClientCaps) {
    cachedClientCaps = readDeviceCapabilities();
  }

  return cachedClientCaps;
}

export function isLowEndDevice(
  caps: DeviceCapabilities,
  prefersReducedMotion = false,
): boolean {
  return (
    caps.cores <= 4 || caps.ram <= 4 || caps.isSlowConnection || prefersReducedMotion
  );
}

export function getMotionTransition(lowEnd: boolean): Transition {
  return lowEnd ? MOTION_TWEEN : MOTION_SPRING;
}

/** Scale spring stiffness/damping by animation multiplier; pass through tween transitions. */
export function scaleMotionTransition(
  transition: Transition,
  multiplier = 1,
): Transition {
  if (transition.type !== "spring") {
    return transition;
  }

  const stiffness =
    typeof transition.stiffness === "number" ? transition.stiffness : 120;
  const damping =
    typeof transition.damping === "number" ? transition.damping : 20;

  return {
    ...transition,
    type: "spring",
    stiffness: stiffness / multiplier,
    damping: damping / multiplier,
  };
}
