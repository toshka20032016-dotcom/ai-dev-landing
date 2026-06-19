import type { Metadata } from "next";

import { getWikiSeo, WIKI_SLUGS } from "@/content/ru";

import { WikiPageClient } from "./WikiPageClient";

type WikiPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: WikiPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = getWikiSeo(slug);

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export function generateStaticParams() {
  return WIKI_SLUGS.map((slug) => ({ slug }));
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug } = await params;
  return <WikiPageClient slug={slug} />;
}
