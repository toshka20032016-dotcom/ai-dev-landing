"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";

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
      className="pointer-events-none fixed top-0 right-0 left-0 z-40"
    >
      <div className="pointer-events-auto mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-6 md:px-[60px]">
        <Link
          href="/preview"
          className="flex items-center gap-2 text-[18px] font-semibold tracking-[0.021em] text-white"
        >
          <Hexagon
            className="h-5 w-5 text-[#8052ff]"
            strokeWidth={1.5}
            aria-hidden
          />
          {preview.brand}
        </Link>

        <nav
          aria-label="Навигация превью"
          className="hidden items-center gap-8 lg:flex"
        >
          {preview.nav.links.map((link) => {
            const className =
              "text-[14px] tracking-[0.021em] text-[#9a9a9a] transition-colors hover:text-white";

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

        <div className="flex shrink-0 items-center gap-4 md:gap-8">
          <Link
            href="/"
            className="hidden text-[14px] tracking-[0.021em] text-[#9a9a9a] transition-colors hover:text-white sm:inline"
          >
            {preview.backLink}
          </Link>
          <Link href="#contact" className="preview-cta">
            {preview.nav.cta}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
