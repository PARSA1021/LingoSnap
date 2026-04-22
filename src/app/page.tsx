'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  BookOpen,
  Mic,
  Play,
  RotateCcw,
  LayoutGrid,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-info/10 p-3 sm:p-6 lg:p-8 overflow-hidden">
      <div className="w-full max-w-6xl h-full flex flex-col gap-3 sm:gap-5 lg:gap-6">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between shrink-0"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-xl sm:rounded-2xl border-2 sm:border-4 border-black shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000]" />
            <div>
              <h1 className="font-black text-xl sm:text-3xl lg:text-4xl tracking-tight text-black uppercase leading-none">
                Talkie Talkie!
              </h1>
              <p className="text-[10px] sm:text-sm font-bold text-black/60">게임처럼 배우는 영어</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 bg-white border-2 sm:border-3 border-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000]"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-warning fill-warning" />
            <span className="font-black text-[10px] sm:text-sm uppercase">Today</span>
          </motion.div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 min-h-0">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 md:col-span-1 lg:col-span-2 md:row-span-2"
          >
            <Link href="/learn" className="block h-full group">
              <div
                style={{ backgroundColor: 'var(--primary)' }}
                className="h-full rounded-2xl sm:rounded-[2rem] border-3 sm:border-6 border-black shadow-[4px_4px_0_#000] sm:shadow-[12px_12px_0_#000] group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 blur-[60px] sm:blur-[100px]" />

                <div className="relative h-full p-4 sm:p-8 lg:p-12 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 sm:space-y-3">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm border-2 sm:border-3 border-black px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000] font-black text-[9px] sm:text-xs uppercase">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-warning fill-warning" />
                        Daily Lesson
                      </div>
                      <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-none uppercase text-white drop-shadow-lg">
                        레슨<br />시작!
                      </h2>
                    </div>
                    <div className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white text-primary rounded-2xl sm:rounded-3xl flex items-center justify-center border-3 sm:border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] group-hover:rotate-12 group-hover:scale-105 transition-all">
                      <Play className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 fill-current ml-0.5 sm:ml-1" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-6">
                    <p className="hidden sm:block text-sm sm:text-lg lg:text-xl font-bold text-white/95 max-w-md leading-relaxed">
                      오늘의 10분 학습을 완료하고<br />
                      새로운 뱃지를 획득하세요!
                    </p>
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-black text-white font-black text-xs sm:text-lg lg:text-xl px-4 sm:px-8 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-[3px_3px_0_rgba(255,255,255,0.3)] group-hover:bg-white group-hover:text-primary transition-colors">
                      START NOW →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1"
          >
            <Link href="/categories" className="block h-full group">
              <div
                style={{ backgroundColor: 'var(--info)' }}
                className="h-full rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[8px_8px_0_#000] group-hover:-translate-y-1 transition-all p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative space-y-2 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white text-info rounded-xl sm:rounded-2xl flex items-center justify-center border-2 sm:border-3 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] group-hover:rotate-6 transition-transform">
                    <LayoutGrid className="w-5 h-5 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-3xl font-black uppercase text-white leading-none mb-1 sm:mb-2">
                      분야별<br />학습
                    </h3>
                    <p className="hidden sm:block text-xs sm:text-base font-bold text-white/90">
                      비즈니스 · 여행 · 일상
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-1"
          >
            <Link href="/review" className="block h-full group">
              <div
                style={{ backgroundColor: 'var(--error)' }}
                className="h-full rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[8px_8px_0_#000] group-hover:-translate-y-1 transition-all p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative space-y-2 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white text-error rounded-xl sm:rounded-2xl flex items-center justify-center border-2 sm:border-3 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] group-hover:rotate-6 transition-transform">
                    <RotateCcw className="w-5 h-5 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-3xl font-black uppercase text-white leading-none mb-1 sm:mb-2">
                      복습<br />스테이션
                    </h3>
                    <p className="hidden sm:block text-xs sm:text-base font-bold text-white/90">
                      틀린 단어만 집중
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1"
          >
            <Link href="/vocab" className="block h-full group">
              <div
                style={{ backgroundColor: 'var(--warning)' }}
                className="h-full rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[8px_8px_0_#000] group-hover:-translate-y-1 transition-all p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative space-y-2 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white text-warning rounded-xl sm:rounded-2xl flex items-center justify-center border-2 sm:border-3 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] group-hover:rotate-6 transition-transform">
                    <BookOpen className="w-5 h-5 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-3xl font-black uppercase text-black leading-none mb-1 sm:mb-2">
                      나만의<br />단어장
                    </h3>
                    <p className="hidden sm:block text-[10px] sm:text-base font-bold text-black/80">
                      MY VOCABULARY
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="col-span-1"
          >
            <Link href="/speaking" className="block h-full group">
              <div
                style={{ backgroundColor: 'var(--success)' }}
                className="h-full rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[8px_8px_0_#000] group-hover:-translate-y-1 transition-all p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative space-y-2 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white text-success rounded-xl sm:rounded-2xl flex items-center justify-center border-2 sm:border-3 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] group-hover:rotate-6 transition-transform">
                    <Mic className="w-5 h-5 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-3xl font-black uppercase text-white leading-none mb-1 sm:mb-2">
                      말하기<br />연습
                    </h3>
                    <p className="hidden sm:block text-[10px] sm:text-base font-bold text-white/90">
                      SPEAKING PRACTICE
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>

        {/* FOOTER DOTS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 sm:gap-3 pb-2"
        >
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary border-2 border-black shadow-[2px_2px_0_#000]" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-info border-2 border-black shadow-[2px_2px_0_#000]" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-success border-2 border-black shadow-[2px_2px_0_#000]" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-warning border-2 border-black shadow-[2px_2px_0_#000]" />
        </motion.div>

      </div>
    </div>
  );
}