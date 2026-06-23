import Link from "next/link";

import { EasterEggTrigger } from "@/components/EasterEggTrigger";
import { content } from "@/content/ru";

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function PreviewFooter() {
  const { footer, preview } = content;

  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row md:px-[60px]">
        <div className="text-center md:text-left">
          <p className="text-sm font-light text-white/80">{footer.copyright}</p>
          <p className="mt-1 text-xs tracking-[0.05em] text-[#9a9a9a] uppercase">
            {preview.footer.tagline}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-[14px]">
          <Link
            href="/"
            className="font-semibold tracking-[0.021em] text-[#8052ff] transition-opacity hover:opacity-80"
          >
            {preview.footer.backLink}
          </Link>
          {footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="tracking-[0.021em] text-[#9a9a9a] transition-colors hover:text-white"
              {...(isExternalLink(link.href)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <EasterEggTrigger />
    </footer>
  );
}
