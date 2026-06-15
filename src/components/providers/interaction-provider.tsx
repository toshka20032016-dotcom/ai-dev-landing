"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useSound } from "@/hooks/useSound";

type InteractionContextValue = {
  playClick: () => void;
};

const InteractionContext = createContext<InteractionContextValue | null>(null);

export function InteractionProvider({ children }: { children: ReactNode }) {
  const { playClick } = useSound();

  return (
    <InteractionContext.Provider value={{ playClick }}>
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  return useContext(InteractionContext);
}
