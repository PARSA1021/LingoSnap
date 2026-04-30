import type { Metadata } from "next";
import { Luckiest_Guy, Lilita_One, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";

// Kept for backward-compat (font-luckiest-guy / font-lilita-one CSS vars still used in theme)
const luckiestGuy = Luckiest_Guy({
  weight: '400',
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  display: "swap",
});

const lilitaOne = Lilita_One({
  weight: '400',
  variable: "--font-lilita-one",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LingoSnap — 스마트 영어 학습",
  description: "Modern, AI-powered English learning experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${luckiestGuy.variable} ${lilitaOne.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-[80px] relative overflow-x-hidden" suppressHydrationWarning>
        {/* Ambient background orbs */}
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />

        <ThemeProvider>
          <TopNav />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
