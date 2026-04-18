'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BookA, Mic, Tv } from 'lucide-react';
import { motion } from 'framer-motion';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: '홈', href: '/', icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '일일 학습', href: '/learn', icon: <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '표현 아카이브', href: '/vocab', icon: <BookA className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '미디어', href: '/contents', icon: <Tv className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '말하기', href: '/speaking', icon: <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-8 border-black pb-safe pt-2 sm:pt-3 shadow-[0_-8px_0_#000]"
    >
      <div className="max-w-3xl mx-auto flex justify-between items-end px-6 relative">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.name}
              href={tab.href}
              aria-label={tab.name}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center gap-0.5 sm:gap-1 group w-1/5 select-none touch-manipulation pb-1 sm:pb-4"
            >
              <div
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 border-2 sm:border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] ${isActive
                    ? 'bg-primary text-white wobbly -translate-y-1 sm:-translate-y-2 shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000]'
                    : 'text-black bg-white group-hover:bg-muted'
                  }`}
              >
                <div className="relative z-10 font-black scale-90 sm:scale-100">{tab.icon}</div>
              </div>
              <span className={`text-[8px] sm:text-xs font-black tracking-tight sm:tracking-widest uppercase font-cartoon mt-0.5 sm:mt-1 ${isActive ? 'text-primary' : 'text-black/60'} whitespace-nowrap`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
