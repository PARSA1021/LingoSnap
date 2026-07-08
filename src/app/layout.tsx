import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
 themeColor: "#09090b",
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
 <body className="min-h-full flex flex-col pb-[80px] md:pb-0 relative overflow-x-hidden bg-[var(--color-background)]" suppressHydrationWarning>
 <ThemeProvider>
 <TopNav />
 <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto pb-12">
 {children}
 </main>
 <BottomNav />
 </ThemeProvider>
 </body>
 </html>
 );
}
