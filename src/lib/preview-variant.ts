export type SectionVariant = "default" | "preview";

export function isPreviewVariant(variant?: SectionVariant): boolean {
  return variant === "preview";
}

/** Dala-inspired class bundles for preview sections */
export const previewSection = {
  badge:
    "mb-4 inline-flex items-center gap-2 rounded-[24px] border border-white/10 px-3 py-1 text-xs font-semibold tracking-[0.05em] text-[#8052ff] uppercase",
  title:
    "preview-section-headline mb-4 text-white",
  titleAccent: "text-[#8052ff]",
  subtitle:
    "mx-auto max-w-2xl text-[15px] font-normal leading-relaxed tracking-[0.025em] text-[#bdbdbd] md:text-base",
  card: "rounded-[24px] border border-white/10 bg-transparent p-6 transition-colors duration-300 hover:border-[#8052ff]/25 md:p-8",
  pillBtn:
    "inline-flex items-center justify-center rounded-[24px] bg-[#8052ff] px-4 py-3 text-xs font-semibold tracking-[0.05em] text-white uppercase transition-opacity hover:opacity-90",
  ghostBtn:
    "inline-flex items-center justify-center rounded-[24px] border border-white/10 px-4 py-3 text-xs font-semibold tracking-[0.05em] text-white uppercase transition-colors hover:border-[#8052ff]/40",
} as const;
