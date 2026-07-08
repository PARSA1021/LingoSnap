'use client';

import * as React from 'react';
import Link from 'next/link';
import {
 BookOpen,
 Mic,
 Play,
 RotateCcw,
 LayoutGrid,
 Star,
 Flame,
 ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export default function HomePage() {
 return (
 <div className="min-h-screen w-full bg-[var(--color-background)] p-4 sm:p-6 lg:p-8 font-sans">
 <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 lg:gap-10">

 {/* Greeting Section */}
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease: "easeOut" }}
 className="flex items-end justify-between mt-4 sm:mt-8"
 >
 <div>
 <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-foreground)] tracking-tight mb-1">
 반가워요! 👋
 </h1>
 <p className="text-base sm:text-lg text-[var(--color-muted-foreground)] font-medium">
 오늘도 영어를 정복해 볼까요?
 </p>
 </div>
 <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2 rounded-full shadow-sm">
 <Flame className="w-5 h-5 text-[var(--color-primary)] fill-[var(--color-primary)]" />
 <span className="font-bold text-sm sm:text-base text-[var(--color-foreground)]">3일째</span>
 </div>
 </motion.div>

 {/* Main Action - Cake / Duolingo Style Big Button */}
 <motion.div
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
 >
 <Link href="/learn" className="block w-full group">
 <div className="relative w-full bg-[var(--color-primary)] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-[0_8px_30px_rgba(255,56,92,0.2)] hover:shadow-[0_12px_40px_rgba(255,56,92,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden isolate">
 {/* Decorative elements */}
 <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl" />
 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-xl" />
 
 <div className="relative z-10 flex flex-col h-full justify-between gap-8 sm:gap-12">
 <div className="flex justify-between items-start">
 <div className="space-y-1">
 <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs sm:text-sm font-bold rounded-full backdrop-blur-md mb-2">
 오늘의 목표
 </span>
 <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
 필수 표현 <br />
 마스터하기
 </h2>
 </div>
 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
 <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-primary)] fill-[var(--color-primary)] ml-1" />
 </div>
 </div>

 <div className="flex items-center gap-2 text-white/90 font-medium text-sm sm:text-base bg-black/10 self-start px-4 py-2 rounded-2xl backdrop-blur-sm">
 <Star className="w-4 h-4 fill-current text-[var(--color-accent)]" />
 10분 소요 · +50XP
 </div>
 </div>
 </div>
 </Link>
 </motion.div>

 {/* Action Grid */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
 {[
 {
 href: '/categories',
 title: '상황별 학습',
 subtitle: '여행, 비즈니스',
 icon: LayoutGrid,
 color: 'text-[var(--color-info)]',
 bg: 'bg-[var(--color-info)]'
 },
 {
 href: '/review',
 title: '오답 노트',
 subtitle: '틀린 문제 복습',
 icon: RotateCcw,
 color: 'text-[var(--color-primary)]',
 bg: 'bg-[var(--color-primary)]'
 },
 {
 href: '/vocab',
 title: '단어장',
 subtitle: '나만의 단어',
 icon: BookOpen,
 color: 'text-[var(--color-warning)]',
 bg: 'bg-[var(--color-warning)]'
 },
 {
 href: '/speaking',
 title: '스피킹',
 subtitle: '발음 교정',
 icon: Mic,
 color: 'text-[var(--color-success)]',
 bg: 'bg-[var(--color-success)]'
 }
 ].map((item, idx) => (
 <motion.div
 key={item.title}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 + idx * 0.05, duration: 0.5, ease: "easeOut" }}
 >
 <Link href={item.href} className="block h-full group">
 <div className="h-full bg-[var(--color-surface)] rounded-[24px] p-5 border border-[var(--color-border)] shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-transparent transition-all duration-300">
 <div className="flex flex-col h-full justify-between gap-4">
 <div className={cn("w-12 h-12 rounded-[16px] flex items-center justify-center bg-opacity-10 transition-transform duration-300 group-hover:scale-110", item.color, item.bg.replace('bg-', 'bg-').replace(']', ']/10'))}>
 <item.icon className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-1 tracking-tight">
 {item.title}
 </h3>
 <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] font-medium">
 {item.subtitle}
 </p>
 </div>
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </div>

        {/* Daily Progress / Recommended */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="mt-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] tracking-tight">
              추천 코스
            </h2>
            <Link href="/contents" className="text-[var(--color-primary)] text-sm font-bold flex items-center hover:underline">
              모두 보기 <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {[
              { id: 'g16', emoji: '☕', label: 'Cafe', title: '카페에서 주문하기', desc: '자연스러운 주문 표현' },
              { id: 'g17', emoji: '✈️', label: 'Travel', title: '여행 필수 표현', desc: '공항·호텔에서 자신있게' },
              { id: 'g18', emoji: '🛍️', label: 'Shopping', title: '쇼핑 필수 표현', desc: '사이즈·가격·교환까지' },
              { id: 'g21', emoji: '💬', label: 'Small Talk', title: '스몰토크 마스터', desc: '어색함을 깨는 대화법' },
              { id: 'g19', emoji: '🛫', label: 'Airport', title: '공항 완전 정복', desc: '입국심사도 자신있게' },
            ].map((course) => (
              <Link key={course.id} href={`/learn/session?movie=${course.id}`} className="block min-w-[260px] sm:min-w-[300px] shrink-0">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--color-muted)] rounded-[14px] flex items-center justify-center border border-[var(--color-border)] shrink-0">
                      <span className="text-2xl sm:text-3xl">{course.emoji}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-xs font-bold text-[var(--color-secondary)] tracking-wider uppercase block mb-0.5">{course.label}</span>
                      <h3 className="text-base sm:text-lg font-bold text-[var(--color-foreground)] truncate">{course.title}</h3>
                      <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-0.5">{course.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

 </div>
 </div>
 );
}
