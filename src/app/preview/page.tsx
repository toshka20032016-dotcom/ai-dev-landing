import type { Metadata } from "next";

import { PreviewHero } from "@/components/preview/PreviewHero";
import { content } from "@/content/ru";

export const metadata: Metadata = {
  title: content.preview.meta.title,
  description: content.preview.meta.description,
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <main className="bg-black">
      <PreviewHero />
    </main>
  );
}
