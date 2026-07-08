'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BookA, Mic, RotateCcw, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const tabs = [
 { name: '홈', href: '/', icon: Home },
 { name: '레슨', href: '/learn', icon: Lightbulb },
 { name: '복습', href: '/review', icon: RotateCcw },
 { name: '문법', href: '/contents', icon: BookOpen },
 { name: '단어', href: '/vocab', icon: BookA },
 { name: '말하기', href: '/speaking', icon: Mic },
];

export function BottomNav() {
 const pathname = usePathname();

 return (
 <nav
 aria-label="Main Navigation"
 className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 md:hidden"
 >
 {/* Safe area spacer for iOS home indicator */}
 <div className="max-w-md mx-auto flex justify-between items-center px-4 py-2 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
 {tabs.map((tab) => {
 const isActive =
 pathname === tab.href ||
 (tab.href !== '/' && pathname.startsWith(tab.href));
 const Icon = tab.icon;

 return (
 <Link
 key={tab.name}
 href={tab.href}
 aria-label={tab.name}
 aria-current={isActive ? 'page' : undefined}
 className="relative flex flex-col items-center gap-1 w-12 sm:w-16 py-1 select-none touch-manipulation group"
 >
 <div className={cn(
 'relative z-10 p-1.5 rounded-full transition-all duration-300 ease-out',
 isActive 
 ? 'text-[var(--color-primary)] scale-110' 
 : 'text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]'
 )}>
 <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
 </div>

 <span className={cn(
 'relative z-10 text-[10px] font-bold tracking-tight transition-colors duration-300',
 isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]'
 )}>
 {tab.name}
 </span>
 </Link>
 );
 })}
 </div>
 </nav>
 );
}
