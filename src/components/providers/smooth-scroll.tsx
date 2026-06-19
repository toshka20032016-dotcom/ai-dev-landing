"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const root = document.documentElement;
    root.classList.add("lenis");

    // ponytail: no Framer scroll-sync — native scroll + whileInView only; upgrade: lenis.on('scroll') → motion scrollY
    const lenis = new Lenis({ duration: 0.85, smoothWheel: true, touchMultiplier: 1.2 });
    lenisRef.current = lenis;

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"], a[href^="/#"]',
      );
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#" || href === "/#") return;

      const hash = href.startsWith("/#") ? href.slice(1) : href;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(hash, { offset: -96 });
    };

    document.addEventListener("click", onAnchorClick);

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      root.classList.remove("lenis");
    };
  }, []);

  return <>{children}</>;
}
