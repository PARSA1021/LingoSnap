'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BookA, Mic, Tv, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

const tabs = [
  { name: '홈',    href: '/',         icon: Home },
  { name: '레슨',  href: '/learn',    icon: Lightbulb },
  { name: '복습',  href: '/review',   icon: RotateCcw },
  { name: '단어장', href: '/vocab',   icon: BookA },
  { name: '콘텐츠', href: '/contents', icon: Tv },
  { name: '말하기', href: '/speaking', icon: Mic },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10"
    >
      {/* Safe area spacer for iOS home indicator */}
      <div className="max-w-2xl mx-auto flex justify-around items-center px-2 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
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
              className="relative flex flex-col items-center gap-0.5 w-12 sm:w-16 py-1 select-none touch-manipulation group"
            >
              {/* Active pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-primary/15"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}

              <div className={cn(
                'relative z-10 p-1.5 rounded-lg transition-colors duration-150',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )}>
                <Icon className="w-5 h-5 sm:w-[1.35rem] sm:h-[1.35rem]" />
              </div>

              <span className={cn(
                'relative z-10 text-[9px] sm:text-[10px] font-semibold tracking-tight transition-colors duration-150',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
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
