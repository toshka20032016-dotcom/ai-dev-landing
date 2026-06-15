"use client";

import { cn } from "@/lib/utils";

export function AnimatedGridPattern({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden opacity-40",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />
      <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-[var(--accent)]/20 blur-[100px]" />
      <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-[var(--accent-alt)]/20 blur-[100px]" />
    </div>
  );
}
