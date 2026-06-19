import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InteractionProvider } from "@/components/providers/interaction-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { EasterEggProvider } from "@/context/EasterEggContext";
import { content } from "@/content/ru";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
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
