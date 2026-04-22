'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BookA, Mic, Tv, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: '홈', href: '/', icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '레슨', href: '/learn', icon: <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '복습', href: '/review', icon: <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '단어장', href: '/vocab', icon: <BookA className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '콘텐츠', href: '/contents', icon: <Tv className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '말하기', href: '/speaking', icon: <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t-4 sm:border-t-8 border-border pb-safe pt-1 sm:pt-3 shadow-[0_-4px_0_var(--border)] sm:shadow-[0_-8px_0_var(--border)]"
    >
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4 sm:px-10 relative">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.name}
              href={tab.href}
              aria-label={tab.name}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center gap-0.5 group w-1/5 select-none touch-manipulation pb-1 sm:pb-3"
            >
              <div
                className={cn(
                  "relative px-4 py-2 transition-colors border-2 sm:border-4 border-border shadow-[3px_3px_0_var(--border)] sm:shadow-[6px_6px_0_var(--border)]",
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-foreground bg-surface hover:bg-muted'
                )}
              >
                <div className="relative z-10 font-black">{tab.icon}</div>
              </div>
              <span className={cn(
                "text-[7px] sm:text-[10px] font-black tracking-tight sm:tracking-widest uppercase font-cartoon mt-1 whitespace-nowrap transition-colors",
                isActive ? 'text-primary' : 'text-foreground/40'
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
