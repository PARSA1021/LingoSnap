'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { motion } from 'framer-motion';
import { Play, Search, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function TopNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-[100] w-full bg-surface border-b-2 border-border h-16 sm:h-20 flex items-center px-4 sm:px-8">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20">
             <span className="text-2xl font-black text-primary">L</span>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-foreground text-opacity-90">
            Lingo<span className="text-primary tracking-tight">Snap</span>
          </span>
        </Link>

        {/* Global Nav - Simplified for Mobile Focus */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavButton href="/learn" isActive={pathname === '/learn'} icon={<Play className="w-5 h-5 fill-current" />} label="학습" />
          <NavButton href="/vocab" isActive={pathname === '/vocab'} icon={<Search className="w-5 h-5" />} label="검색" />
          <NavButton href="/contents" isActive={pathname === '/contents'} icon={<BookOpen className="w-5 h-5" />} label="미디어" />
          
          <div className="ml-2 pl-4 border-l-2 border-border hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavButton({ href, isActive, icon, label }: { href: string; isActive: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-sm",
          isActive 
            ? "bg-accent text-accent-foreground border-b-4 border-accent-foreground/30 shadow-tactile" 
            : "text-muted-foreground hover:bg-muted"
        )}
      >
        {icon}
        <span className="hidden md:inline">{label}</span>
      </motion.div>
    </Link>
  );
}
