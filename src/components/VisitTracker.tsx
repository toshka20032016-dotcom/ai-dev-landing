"use client";

import { useEffect } from "react";

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function VisitTracker() {
  useEffect(() => {
    const trackVisit = () => {
      fetch("/api/visit", { method: "POST", keepalive: true }).catch(() => {});
    };
    const browserWindow = window as WindowWithIdleCallback;

    if (browserWindow.requestIdleCallback) {
      const idleId = browserWindow.requestIdleCallback(trackVisit, { timeout: 3000 });
      return () => browserWindow.cancelIdleCallback?.(idleId);
    }

    if (document.readyState === "complete") {
      const timeoutId = globalThis.setTimeout(trackVisit, 1);
      return () => globalThis.clearTimeout(timeoutId);
    }

    window.addEventListener("load", trackVisit, { once: true });
    return () => window.removeEventListener("load", trackVisit);
  }, []);

  return null;
}
