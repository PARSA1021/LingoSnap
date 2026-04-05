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
      className="sticky top-0 z-50 w-full glass h-16 sm:h-20 flex items-center px-4 sm:px-8 border-b-2 border-border"
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="group flex items-center gap-3 active:scale-95 transition-transform" aria-label="LingoSnap Home">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl flex items-center justify-center shadow-tactile border-b-4 border-primary-shadow group-hover:rotate-12 transition-all">
            <span className="text-white font-black text-xl sm:text-2xl">L</span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-foreground tracking-tighter">LingoSnap</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:flex rounded-xl font-black text-sm" aria-label="Login">
            Login
          </Button>
          <Button size="sm" className="hidden sm:flex rounded-xl font-black text-sm" aria-label="Sign up">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}
