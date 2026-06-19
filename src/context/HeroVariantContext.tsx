"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type HeroVariant = 1 | 2 | 3;

const STORAGE_KEY = "hero-variant";
const STORAGE_EVENT = "hero-variant-change";

interface HeroVariantContextType {
  variant: HeroVariant;
  setVariant: (variant: HeroVariant) => void;
}

const HeroVariantContext = createContext<HeroVariantContextType | undefined>(
  undefined,
);

function parseVariant(value: string | null): HeroVariant | null {
  if (value === "1" || value === "2" || value === "3") {
    return Number(value) as HeroVariant;
  }
  return null;
}

function readStoredVariant(): HeroVariant {
  if (typeof window === "undefined") return 1;

  const fromUrl = parseVariant(new URLSearchParams(window.location.search).get("v"));
  if (fromUrl) return fromUrl;

  const fromStorage = parseVariant(localStorage.getItem(STORAGE_KEY));
  if (fromStorage) return fromStorage;

  return 1;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(STORAGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function HeroVariantProvider({ children }: { children: ReactNode }) {
  const variant = useSyncExternalStore(
    subscribe,
    readStoredVariant,
    (): HeroVariant => 1,
  );

  const setVariant = useCallback((next: HeroVariant) => {
    localStorage.setItem(STORAGE_KEY, String(next));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  return (
    <HeroVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </HeroVariantContext.Provider>
  );
}

export function useHeroVariant() {
  const context = useContext(HeroVariantContext);
  if (!context) {
    throw new Error("useHeroVariant must be used within a HeroVariantProvider");
  }
  return context;
}
