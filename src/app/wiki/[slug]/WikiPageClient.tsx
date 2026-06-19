"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { ApiTabs } from "@/components/wiki/ApiTabs";
import { EdgeCasesGrid } from "@/components/wiki/EdgeCasesGrid";
import { LiveProjectRoadmap } from "@/components/wiki/LiveProjectRoadmap";
import { RoiCalculator } from "@/components/wiki/RoiCalculator";
import { TechConfigurator } from "@/components/wiki/TechConfigurator";
import { TerminalArchitecture } from "@/components/wiki/TerminalArchitecture";
import { content, isWikiSlug, WIKI_PAGES } from "@/content/ru";

const sectionMotion = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4, ease: "easeOut" },
} as const;

type WikiPageClientProps = { slug: string };

export function WikiPageClient({ slug }: WikiPageClientProps) {
  const router = useRouter();
  const { wiki } = content;

  if (!isWikiSlug(slug)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] p-4 text-white">
        <h1 className="mb-4 text-2xl font-bold">{wiki.notFoundTitle}</h1>
        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 transition-colors hover:bg-white/10"
        >
          {wiki.notFoundCta}
        </Link>
      </div>
    );
  }

  const currentData = WIKI_PAGES[slug];

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-[#00d2ff]/20">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#030303]/60 px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-white"
          >
            {wiki.backToHome}
          </Link>
          <span className="text-white/20">/</span>
          <span className="rounded-full border border-[#00d2ff]/10 bg-[#00d2ff]/5 px-2.5 py-0.5 font-mono text-xs text-[#00d2ff]">
            {currentData.category}
          </span>
        </div>
        <div className="font-mono text-xs text-gray-500">{wiki.headerBrand}</div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-12 sm:py-20 lg:grid-cols-4">
        <aside className="h-fit space-y-2 lg:sticky lg:top-24 lg:col-span-1">
          <div className="mb-4 px-3 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            {wiki.otherSections}
          </div>
          {wiki.slugs.map((key) => {
            const item = WIKI_PAGES[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => router.push(`/wiki/${key}`)}
                className={`flex w-full flex-col gap-0.5 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                  key === slug
                    ? "border-white/10 bg-white/5 font-medium text-white shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                    : "border-transparent bg-transparent text-gray-400 hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <span>{item.title}</span>
                <span className="font-mono text-[10px] text-gray-500">{item.category}</span>
              </button>
            );
          })}

        </aside>

        <section className="space-y-16 lg:col-span-3">
          <div className="space-y-6">
            <h1 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              {currentData.title}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg">
              {currentData.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {currentData.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-white/5" />

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                {wiki.architectureTitle}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{wiki.architectureSubtitle}</p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-300">{wiki.dataFlowTitle}</h3>
              <TerminalArchitecture slug={slug} />
            </div>

            <div className="relative ml-4 space-y-12 border-l border-white/5 pl-6">
              {currentData.architecture.map((item) => (
                <div key={item.step} className="relative">
                  <span className="absolute -left-[35px] top-0 flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-[#0d0d11] font-mono text-[10px] text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                    {item.step}
                  </span>
                  <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-gray-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-white/5" />

          <motion.div className="space-y-4" {...sectionMotion}>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {wiki.observabilityTitle}
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-400">
              {currentData.observability}
            </p>
          </motion.div>

          <hr className="border-white/5" />

          <motion.div className="space-y-8" {...sectionMotion}>
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                {wiki.protocolsTitle}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{wiki.protocolsSubtitle}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300">{wiki.apiSpecsTitle}</h3>
              <ApiTabs specs={currentData.apiSpecs} />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300">{wiki.edgeCasesTitle}</h3>
              <EdgeCasesGrid cases={currentData.edgeCases} />
            </div>
          </motion.div>

          <hr className="border-white/5" />

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{wiki.faqTitle}</h2>
              <p className="mt-1 text-sm text-gray-500">{wiki.faqSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {currentData.faq.map((item) => (
                <div
                  key={item.q}
                  className="space-y-2 rounded-2xl border border-white/5 bg-[#0d0d11] p-6"
                >
                  <h3 className="flex items-center gap-2 font-mono text-sm font-bold text-[#ff4b91]">
                    <span>Q.</span> {item.q}
                  </h3>
                  <p className="pl-5 text-sm leading-relaxed text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <RoiCalculator slug={slug} />

          <TechConfigurator />

          <SecurityGuards />

          <RoiCalculator slug={slug} />
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/5 bg-gradient-to-r from-[#09090e] to-[#120a16] p-8 sm:flex-row">
            <div>
              <h3 className="text-lg font-bold">{wiki.ctaTitle}</h3>
              <p className="mt-1 text-xs text-gray-400">{wiki.ctaSubtitle}</p>
            </div>
            <Link
              href={wiki.contactHref}
              className="whitespace-nowrap rounded-xl bg-gradient-to-r from-[#00b4db] to-[#0083b0] px-5 py-3 text-xs font-semibold transition-opacity hover:opacity-90"
            >
              {wiki.ctaButton}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
