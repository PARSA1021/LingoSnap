'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function TopNav() {
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header
      aria-label="Top Navigation"
      className={`sticky top-0 z-50 w-full h-14 sm:h-16 flex items-center px-4 sm:px-8 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/10 shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 select-none"
          aria-label="LingoSnap Home"
        >
          {/* Icon mark */}
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm leading-none">LS</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
              LingoSnap
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase leading-none mt-0.5">
              English Learning
            </span>
          </div>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
