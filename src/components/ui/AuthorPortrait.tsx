"use client";

import { useState } from "react";
import Image from "next/image";

import { content } from "@/content/ru";

export function AuthorPortrait() {
  const { authorPortrait } = content.hero;
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group/portrait w-full max-w-xl">
      <div className="relative aspect-[4/5] w-full transform-gpu overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 shadow-[0_0_30px_rgba(6,182,212,0.04),0_4px_40px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-500 will-change-transform group-hover/portrait:border-cyan-500/20 group-hover/portrait:shadow-[0_0_40px_rgba(6,182,212,0.12)]">
        {imageError ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-950/40 to-[#030408]"
          />
        ) : (
          <Image
            src="/images/author.jpg"
            alt={authorPortrait.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 400px"
            quality={85}
            onError={() => setImageError(true)}
            className="scale-[1.01] transform-gpu object-cover object-[center_20%] grayscale-[10%] transition-transform duration-700 ease-out group-hover/portrait:scale-[1.03] group-hover/portrait:grayscale-0"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[#030408] via-[#030408]/40 to-transparent" />

        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#030408]/30 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#030408]/30 to-transparent" />

        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,#030408_100%)] opacity-30" />

        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] opacity-60" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%] opacity-40" />

        <div className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-white/5 transition-colors duration-500 group-hover/portrait:ring-cyan-500/10" />

        <div className="absolute left-4 top-4 z-30 flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] tracking-wider text-emerald-400 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {authorPortrait.status}
        </div>
      </div>

      <div className="mt-3 flex select-none items-center justify-between pl-1 font-mono text-[10px] uppercase tracking-widest text-gray-500">
        <span>{authorPortrait.captionName}</span>
        <span className="text-gray-600">·</span>
        <span>{authorPortrait.captionRole}</span>
      </div>
    </div>
  );
}
