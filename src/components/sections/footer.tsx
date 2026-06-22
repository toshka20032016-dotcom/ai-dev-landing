import { content } from "@/content/ru";
import { EasterEggTrigger } from "@/components/EasterEggTrigger";
import { SystemStatus } from "@/components/ui/SystemStatus";

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <SystemStatus />
      <div className="py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-white/70">{content.footer.copyright}</p>
          <p className="mt-1 text-xs text-white/40">{content.footer.tagline}</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
          {content.footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-white/80"
              {...(isExternalLink(link.href)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>
        </div>
      </div>
      <EasterEggTrigger />
    </footer>
  );
}
