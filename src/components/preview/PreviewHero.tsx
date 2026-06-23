import Link from "next/link";

import { content } from "@/content/ru";

const { preview } = content;

export function PreviewHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 md:px-[60px]">
        <div className="max-w-[480px] pt-20 md:pt-0">
          <p className="preview-kicker mb-3">{preview.eyebrow}</p>
          <h1 className="text-[clamp(4.875rem,10vw,7.0625rem)] leading-[0.81] font-light tracking-[-0.04em] text-white">
            {preview.title}
            <br />
            {preview.titleLine2}
          </h1>
          <p className="mt-6 max-w-[36ch] text-[18px] leading-[1.5] tracking-[0.025em] text-white/90">
            {preview.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="#contact" className="preview-cta">
              {preview.cta}
            </Link>
            <Link
              href="#services"
              className="preview-cta-ghost hidden sm:inline-flex"
            >
              {preview.secondaryCta}
            </Link>
          </div>

          {preview.heroStats.length > 0 && (
            <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {preview.heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[10px] tracking-[0.05em] text-[#9a9a9a] uppercase">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-light tracking-[-0.02em] text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
