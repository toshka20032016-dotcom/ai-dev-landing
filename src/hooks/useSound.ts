"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const unlock = () => {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      void ctxRef.current.resume();
      setEnabled(true);
    };

    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  const playClick = useCallback(() => {
    const ctx = ctxRef.current;
    if (!enabled || !ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  }, [enabled]);

  return { playClick, soundEnabled: enabled };
}
