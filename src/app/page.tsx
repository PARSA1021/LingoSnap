'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  BookOpen, 
  Mic, 
  Play, 
  Sparkles, 
  RotateCcw, 
  LayoutGrid,
  Zap,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:py-16 md:py-24 space-y-12 sm:space-y-20 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full text-center space-y-6 flex flex-col items-center">
        {/* Floating Decorative Elements */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl hidden md:block" 
        />
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 -right-20 w-48 h-48 bg-info/20 rounded-full blur-[100px] hidden md:block" 
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-white text-black border-4 border-black px-6 py-2 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-[4px_4px_0_#000] mb-4 -rotate-1"
        >
          <Star className="w-5 h-5 text-warning fill-warning" /> 
          Playful English Adventure
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-black text-black tracking-tighter leading-[0.85] uppercase drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)]"
        >
          Talkie <br /> <span className="text-primary italic inline-block hover:rotate-2 transition-transform cursor-default">Talkie!</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-xl md:text-2xl font-black text-black max-w-2xl mx-auto leading-relaxed bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-black/10"
        >
          지루한 공부는 이제 그만! <br className="sm:hidden" /> 
          <span className="text-primary underline decoration-4 underline-offset-4">게임처럼 터치하고</span> <span className="text-info underline decoration-4 underline-offset-4">말하며</span> 영어를 배워요.
        </motion.p>
      </section>

      {/* --- MAIN ACTION GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* BIG START CARD */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-7"
        >
          <Link href="/learn" className="block h-full group">
            <div 
              style={{ backgroundColor: 'var(--primary)' }}
              className="h-full rounded-none border-8 border-black shadow-[12px_12px_0_#000] group-hover:shadow-[16px_16px_0_#000] group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 blur-[100px] -mr-40 -mt-40" />
              <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-between flex-1 space-y-12">
                <div className="space-y-6">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white text-primary rounded-[2.5rem] flex items-center justify-center border-4 border-black shadow-[6px_6px_0_#000] group-hover:rotate-12 transition-transform">
                    <Play className="w-10 h-10 sm:w-14 sm:h-14 fill-current ml-1.5" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl sm:text-7xl font-black tracking-tight leading-none uppercase text-white">레슨 시작</h2>
                    <p className="text-lg sm:text-2xl font-black opacity-90 max-w-md leading-tight text-white/90">오늘의 10분 학습을 완료하고 뱃지를 획득하세요!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 font-black text-xl bg-white text-primary w-fit px-8 py-4 rounded-2xl shadow-[4px_4px_0_#000] group-hover:bg-black group-hover:text-white transition-colors">
                  GO STAGE! <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* SIDEBAR ACTIONS */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8">
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/categories" className="block group h-full">
              <div 
                style={{ backgroundColor: 'var(--info)' }}
                className="h-full p-8 border-4 border-black shadow-[8px_8px_0_#000] group-hover:shadow-[12px_12px_0_#000] group-hover:-translate-y-1 transition-all flex items-center gap-6"
              >
                <div className="w-16 h-16 bg-white text-info rounded-[1.5rem] flex items-center justify-center border-4 border-black shrink-0 shadow-[4px_4px_0_#000] group-hover:rotate-6 transition-transform">
                  <LayoutGrid className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black leading-none uppercase text-white">분야별 학습</h3>
                  <p className="text-sm sm:text-base font-black opacity-80 text-white/90">비즈니스, 여행, 일상 대화</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/review" className="block group h-full">
              <div 
                style={{ backgroundColor: 'var(--error)' }}
                className="h-full p-8 border-4 border-black shadow-[8px_8px_0_#000] group-hover:shadow-[12px_12px_0_#000] group-hover:-translate-y-1 transition-all flex items-center gap-6"
              >
                <div className="w-16 h-16 bg-white text-error rounded-[1.5rem] flex items-center justify-center border-4 border-black shrink-0 shadow-[4px_4px_0_#000] group-hover:rotate-6 transition-transform">
                  <RotateCcw className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black leading-none uppercase text-white">복습 스테이션</h3>
                  <p className="text-sm sm:text-base font-black opacity-80 text-white/90">틀린 단어만 집중 타격</p>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </div>

      {/* --- QUICK ACCESS --- */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
        {[
          { href: '/vocab', icon: BookOpen, title: '단어장', bg: 'var(--warning)', fg: 'black', desc: 'MY VOCAB' },
          { href: '/speaking', icon: Mic, title: '말하기', bg: 'var(--success)', fg: 'white', desc: 'SPEAKING' },
          { href: '#', icon: Award, title: '성과', bg: '#A855F7', fg: 'white', desc: 'BADGES' },
          { href: '#', icon: Zap, title: '미션', bg: '#F97316', fg: 'white', desc: 'DAILY MISSION' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              <Link href={item.href} className="block group">
                <div 
                  style={{ backgroundColor: item.bg, color: item.fg }}
                  className={`p-8 sm:p-10 rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_#000] group-hover:shadow-[12px_12px_0_#000] group-hover:-translate-y-1.5 transition-all flex flex-col items-center text-center gap-4`}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border-2 border-white/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-xl sm:text-2xl leading-none uppercase">{item.title}</h4>
                    <p className="text-[10px] sm:text-xs font-black opacity-80 tracking-widest">{item.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-16 pb-12 flex flex-col sm:flex-row items-center justify-between border-t-8 border-black gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl border-4 border-black shadow-[4px_4px_0_#000]" />
          <span className="font-black tracking-[0.3em] text-lg text-black uppercase">Talkie Talkie!</span>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <div className="text-[10px] sm:text-xs font-black text-black/40 uppercase tracking-widest">
            © 2026 PREMIUM LANGUAGE EXPERIENCE • V2.5
          </div>
          <div className="flex gap-4">
             <div className="w-3 h-3 rounded-full bg-primary" />
             <div className="w-3 h-3 rounded-full bg-info" />
             <div className="w-3 h-3 rounded-full bg-success" />
             <div className="w-3 h-3 rounded-full bg-warning" />
          </div>
        </div>
      </footer>
    </div>
  );
}
