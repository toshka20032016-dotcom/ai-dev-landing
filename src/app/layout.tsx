import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InteractionProvider } from "@/components/providers/interaction-provider";
import { VisitTracker } from "@/components/VisitTracker";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { EasterEggProvider } from "@/context/EasterEggContext";
import { content } from "@/content/ru";
import "./globals.css";

const siteUrl = new URL("https://blackcraftlab.vercel.app");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: content.meta.title,
  description: content.meta.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: siteUrl,
    siteName: "BLACKCRAFTLAB",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: content.meta.title,
    description: content.meta.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <VisitTracker />
        <EasterEggProvider>
          <MotionProvider>
            <SmoothScrollProvider>
              <InteractionProvider>{children}</InteractionProvider>
            </SmoothScrollProvider>
          </MotionProvider>
        </EasterEggProvider>
      </body>
    </html>
  );
}
