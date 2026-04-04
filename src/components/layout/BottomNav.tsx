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
    { name: '단어장', href: '/vocab', icon: <BookA className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '미디어', href: '/contents', icon: <Tv className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { name: '말하기', href: '/speaking', icon: <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-[3px] border-slate-100 pb-safe pb-4 sm:pb-6"
    >
      <div className="max-w-3xl mx-auto flex justify-between items-end px-6 pt-3 relative">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
          
          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className="flex flex-col items-center gap-1 group w-1/5 select-none touch-manipulation"
            >
              <div 
                className={`relative px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="bubble"
                    className="absolute inset-0 bg-blue-100/50 rounded-2xl border-2 border-blue-200"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10">{tab.icon}</div>
              </div>
              <span className={`text-[11px] sm:text-xs font-black tracking-wide ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
