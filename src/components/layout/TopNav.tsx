'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/Button';

export function TopNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header 
      aria-label="Top Navigation"
      className="sticky top-0 z-50 w-full bg-surface h-16 sm:h-20 flex items-center px-4 sm:px-8 border-b-4 border-border"
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="group flex items-center gap-3 active:scale-95 transition-transform" aria-label="LingoSnap Home">
          <div className="flex flex-col -rotate-3 group-hover:rotate-0 transition-transform">
            <span className="text-3xl sm:text-5xl font-black text-white tracking-widest drop-shadow-[4px_4px_0_#000] -mb-2">LINGO</span>
            <span className="text-2xl sm:text-4xl font-black text-primary tracking-widest drop-shadow-[4px_4px_0_#000] ml-4">SNAP</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
