import type { Metadata } from "next";

import { content } from "@/content/ru";

export const metadata: Metadata = {
  title: content.pricingPage.meta.title,
  description: content.pricingPage.meta.description,
  openGraph: {
    title: content.pricingPage.meta.title,
    description: content.pricingPage.meta.description,
    type: "website",
  },
};

export default function PricingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
