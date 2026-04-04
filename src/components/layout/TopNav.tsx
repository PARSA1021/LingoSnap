'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Define titles based on routes
  const getTitle = () => {
    if (pathname === '/') return '홈';
    if (pathname.includes('/learn')) return '매일 학습';
    if (pathname.includes('/vocab')) return '단어장 탐색';
    if (pathname.includes('/speaking')) return '말하기 연습';
    if (pathname.includes('/contents')) return '미디어 몰입 학습';
    return '';
  };

  const title = getTitle();
  const showBack = pathname !== '/';

  return (
    <motion.header 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-[3px] border-slate-100"
    >
      <div className="flex h-16 sm:h-20 items-center justify-between px-4 max-w-5xl mx-auto">
        <div className="w-16 flex justify-start">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-500 hover:text-slate-900 rounded-full h-12 w-12 hover:bg-slate-100"
              onClick={() => router.back()}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}
        </div>
        
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight select-none">
          {title}
        </h1>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </div>
    </motion.header>
  );
}
