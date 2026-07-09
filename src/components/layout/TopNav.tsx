'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils/cn';

const tabs = [
 { name: '홈', href: '/' },
 { name: '레슨', href: '/learn' },
 { name: '복습', href: '/review' },
 { name: '문법', href: '/contents' },
 { name: '단어', href: '/vocab' },
 { name: '문장', href: '/writing' },
 { name: '말하기', href: '/speaking' },
];

export function TopNav() {
 const [mounted, setMounted] = React.useState(false);
 const [scrolled, setScrolled] = React.useState(false);
 const pathname = usePathname();

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
 className={cn(
 "sticky top-0 z-50 w-full h-16 sm:h-20 flex items-center px-4 sm:px-8 transition-colors duration-300",
 scrolled
 ? 'bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm'
 : 'bg-[var(--color-background)]'
 )}
 >
 <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
 {/* Logo */}
 <Link
 href="/"
 className="group flex items-center gap-3 select-none"
 aria-label="LingoSnap Home"
 >
 <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shadow-[var(--shadow-soft)] group-hover:scale-105 transition-transform duration-300">
 <span className="text-white font-black text-lg leading-none tracking-tighter">LS</span>
 </div>
 <div className="flex flex-col leading-none justify-center">
 <span className="text-xl font-black text-[var(--color-foreground)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
 LingoSnap
 </span>
 </div>
 </Link>

 {/* Desktop Navigation */}
 <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
 {tabs.map((tab) => {
 const isActive =
 pathname === tab.href ||
 (tab.href !== '/' && pathname.startsWith(tab.href));
 return (
 <Link
 key={tab.name}
 href={tab.href}
 className={cn(
 "text-sm font-bold transition-all duration-200 hover:text-[var(--color-primary)]",
 isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
 )}
 >
 {tab.name}
 </Link>
 );
 })}
 </nav>

 {/* Right controls */}
 <div className="flex items-center gap-3">
 <ThemeToggle />
 </div>
 </div>
 </header>
 );
}
