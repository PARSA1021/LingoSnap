'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLearningStore } from '@/store/useLearningStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { BookOpen, Mic, BrainCircuit, Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      
      {/* Hero Welcome Unit */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full text-center space-y-4 mb-12 sm:mb-16 mt-6 sm:mt-12"
      >
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-2 shadow-sm border border-blue-100">
          <Sparkles className="w-4 h-4" /> 하루 5분 영어 완성
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] break-keep">
          영어 회화, <br className="sm:hidden" /> <span className="text-blue-500">지금 바로</span> 시작하세요.
        </h1>
      </motion.div>

      {/* Main Core Pathway */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-2xl mb-12"
      >
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-none rounded-[2rem] shadow-blue-500/30 shadow-2xl overflow-hidden relative group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardContent className="p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner rotate-3 group-hover:-rotate-3 transition-transform duration-500">
              <Play className="w-10 h-10 ml-1" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black mb-2">오늘의 학습 시작하기</h2>
              <p className="text-blue-100 font-medium text-lg leading-relaxed mb-6 break-keep">
                5개의 핵심 단어를 배우고, 원어민처럼 소리 내어 말해보세요.
              </p>
              <Link href="/learn" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 rounded-2xl h-16 text-xl shadow-lg hover:-translate-y-1 transition-all border-none font-black ring-offset-blue-500 px-10">
                  학습 시작
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modular Practice Grid optimized for Fold and Desktop */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 auto-rows-fr max-w-3xl">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
          <Link href="/vocab" className="block h-full outline-none focus-visible:ring-4 ring-blue-500 rounded-3xl">
            <Card className="group h-full cursor-pointer hover:border-indigo-200 transition-colors bg-white pb-2 flex flex-col justify-between">
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">단어장 검색</h3>
                <p className="text-slate-500 font-medium leading-relaxed flex-1">모르는 단어가 생겼나요? 원어민 발음과 예문을 검색해보세요.</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="h-full">
          <Link href="/speaking" className="block h-full outline-none focus-visible:ring-4 ring-emerald-500 rounded-3xl">
            <Card className="group h-full cursor-pointer hover:border-emerald-200 transition-colors bg-white pb-2 flex flex-col justify-between">
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Mic className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">자유 말하기 연습</h3>
                <p className="text-slate-500 font-medium leading-relaxed flex-1">50여 개의 상황별 핵심 문장들을 부담 없이 소리 내어 연습해보세요.</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
