"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface EasterEggContextType {
  isEasterEggActive: boolean;
  triggerClick: () => void;
  animationMultiplier: number;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(
  undefined,
);

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [clickCount, setClickCount] = useState(0);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const animationMultiplier = isEasterEggActive ? 0.65 : 1;

  useEffect(() => {
    if (clickCount === 0 || isEasterEggActive) return;
    const timer = setTimeout(() => setClickCount(0), 2000);
    return () => clearTimeout(timer);
  }, [clickCount, isEasterEggActive]);

  const triggerClick = () => {
    if (isEasterEggActive) return;

    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount >= 5) {
      setIsEasterEggActive(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }
  };

  return (
    <EasterEggContext.Provider
      value={{ isEasterEggActive, triggerClick, animationMultiplier }}
    >
      {children}

      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-[slideIn_0.3s_ease-out] rounded-xl border border-pink-500/30 bg-slate-950 p-4 font-mono text-xs text-gray-300 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
          <div className="mb-2 flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-bold text-pink-500">[SYSTEM_ALERT]</span>
            <span className="text-[10px] text-gray-600">CORRUPT_LOG</span>
          </div>
          <p className="leading-relaxed">
            <span className="text-pink-400">ACCELERATION MODE:</span> ACTIVATED.
            <br />
            <span className="text-pink-400">CHRONO TIME:</span> -30%
            <br />
            <span className="text-cyan-400">CYAN_GLOW</span> overflow. Switching
            to <span className="text-pink-500">NEON_PINK</span>.
          </p>
        </div>
      )}
    </EasterEggContext.Provider>
  );
}

export function useEasterEgg() {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error("useEasterEgg must be used within an EasterEggProvider");
  }
  return context;
}