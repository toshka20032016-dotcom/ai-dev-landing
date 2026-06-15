"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { useSound } from "@/hooks/useSound";

type InteractionContextValue = {
  playClick: () => void;
  vaultUnlocked: boolean;
  registerLogoClick: () => void;
};

const InteractionContext = createContext<InteractionContextValue | null>(null);

export function InteractionProvider({ children }: { children: ReactNode }) {
  const { playClick } = useSound();
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [, setLogoClicks] = useState(0);

  const registerLogoClick = useCallback(() => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setVaultUnlocked(true);
        return 0;
      }
      return next;
    });
  }, []);

  return (
    <InteractionContext.Provider
      value={{ playClick, vaultUnlocked, registerLogoClick }}
    >
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  return useContext(InteractionContext);
}
