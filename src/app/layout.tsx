import type { Metadata } from "next";
import { Luckiest_Guy, Lilita_One, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";

const luckiestGuy = Luckiest_Guy({
  weight: '400',
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
});

const lilitaOne = Lilita_One({
  weight: '400',
  variable: "--font-lilita-one",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Talkie Talkie!",
  description: "Vintage-Style English Conversation Adventure",
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
      <body className="min-h-full flex flex-col pb-[100px]">
        <ThemeProvider>
          <TopNav />
          <main className="flex-1">
            {children}
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}

