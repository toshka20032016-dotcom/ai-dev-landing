"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { content } from "@/content/ru";

function isExternal(href: string) {
  return href.startsWith("http");
}

export function PreviewHeader() {
  const { preview } = content;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed top-0 right-0 left-0 z-40 px-4 pt-4"
    >
      <div className="pointer-events-auto mx-auto flex max-w-[1200px] items-center justify-between gap-4 rounded-3xl border border-white/10 px-4 py-3">
        <Link
          href="/preview"
          className="text-sm font-semibold tracking-[0.021em] text-white"
        >
          {preview.brand}
        </Link>

        <nav
          aria-label="Навигация превью"
          className="hidden items-center gap-1 lg:flex"
        >
          {preview.nav.links.map((link) => {
            const className =
              "rounded-3xl px-3 py-1.5 text-sm tracking-[0.021em] text-[#9a9a9a] transition-colors hover:text-white";

            if (isExternal(link.href)) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/"
            className="hidden text-sm tracking-[0.021em] text-[#9a9a9a] transition-colors hover:text-white sm:inline"
          >
            {preview.backLink}
          </Link>
          <Link
            href="#contact"
            className="rounded-3xl bg-[#8052ff] px-4 py-2.5 text-xs font-semibold tracking-[0.05em] text-white uppercase transition-opacity hover:opacity-90"
          >
            {preview.nav.cta}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
