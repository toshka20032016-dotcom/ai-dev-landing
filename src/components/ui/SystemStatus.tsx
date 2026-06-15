import { content } from "@/content/ru";

export function SystemStatus() {
  const { systemStatus } = content;

  return (
    <div className="flex justify-center border-t border-white/5 bg-slate-950/30 px-4 py-2 backdrop-blur-sm">
      <div
        role="status"
        aria-live="polite"
        className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] tracking-wider text-emerald-400/90 uppercase"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </span>
          {systemStatus.operational}
        </span>
        <span className="hidden h-2.5 w-px bg-white/10 sm:block" aria-hidden />
        <span className="text-cyan-400/80">{systemStatus.edge}</span>
      </div>
    </div>
  );
}
