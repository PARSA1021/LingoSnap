import type { Metadata, Viewport } from "next";
import { Luckiest_Guy, Lilita_One, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { PWAInstallPrompt } from "@/components/layout/PWAInstallPrompt";

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
  title: "LingoSnap — 스마트 오프라인 영어 학습",
  description: "데이터 없이도 어디서나 즐기는 현대적인 영어 학습 플랫폼",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LingoSnap",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF385C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
      <body
        className="min-h-full flex flex-col pb-[80px] md:pb-0 relative overflow-x-hidden bg-[var(--color-background)] touch-manipulation select-none"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <TopNav />
          <PWAInstallPrompt />
          <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto pb-12">
            {children}
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
