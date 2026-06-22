"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

const CLICK_WINDOW_MS = 600;
const REQUIRED_CLICKS = 3;

export function EasterEggTrigger() {
  const router = useRouter();
  const clicksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    clicksRef.current += 1;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (clicksRef.current >= REQUIRED_CLICKS) {
      clicksRef.current = 0;
      router.push("/preview");
      return;
    }

    timerRef.current = setTimeout(() => {
      clicksRef.current = 0;
    }, CLICK_WINDOW_MS);
  }, [router]);

  return (
    <div className="flex justify-center border-t border-white/[0.03] py-2">
      <button
        type="button"
        onClick={handleClick}
        aria-label="v2"
        className="rounded-full px-2 py-0.5 font-mono text-[9px] tracking-widest text-white/15 transition-colors hover:text-white/30"
      >
        v2
      </button>
    </div>
  );
}
