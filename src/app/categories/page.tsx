'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase, 
  Plane, 
  Cpu, 
  Heart, 
  Coffee, 
  Sparkles, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: '전체 학습', icon: GraduationCap, desc: '모든 분야의 단어를 골고루 학습합니다.', color: 'bg-primary' },
  { id: '비즈니스', name: '비즈니스', icon: Briefcase, desc: '오피스, 회의, 협력 관련 전문 용어', color: 'bg-blue-500' },
  { id: '여행', name: '여행/관광', icon: Plane, desc: '공항, 호텔, 예약 등 여행 필수 표현', color: 'bg-emerald-500' },
  { id: '기술', name: '기술/디지털', icon: Cpu, desc: 'IT, 소프트웨어, 최신 기술 관련 단어', color: 'bg-indigo-500' },
  { id: '감정', name: '감정/심리', icon: Heart, desc: '기분, 성격, 인간관계 표현', color: 'bg-rose-500' },
  { id: '일상', name: '데일리 라이프', icon: Coffee, desc: '매일 쓰는 기초적이고 실용적인 단어', color: 'bg-amber-500' },
  { id: '캐주얼', name: '캐주얼 대화', icon: Sparkles, desc: '친구들과 쓰는 자연스러운 표현', color: 'bg-purple-500' },
];

export default function CategoriesPage() {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 sm:py-20 space-y-12">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-2 border-primary/20 text-xs font-black uppercase tracking-widest"
        >
          Select Your Path
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-foreground tracking-tight"
        >
          무엇을 공부해볼까요?
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground font-bold max-w-2xl mx-auto"
        >
          관심 있는 분야를 선택하면 해당 카테고리의 단어들로 구성된 맞춤 레슨이 시작됩니다.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <Link href={`/learn?category=${cat.id}`} className="block group">
                <Card className="h-full bg-surface border-4 border-border shadow-[8px_8px_0_var(--border)] group-hover:shadow-[12px_12px_0_var(--primary)] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-24 h-24 ${cat.color} opacity-10 blur-3xl -mr-12 -mt-12 group-hover:opacity-20 transition-opacity`} />
                  <CardContent className="p-8 space-y-6">
                    <div className={`w-16 h-16 rounded-3xl ${cat.color} text-white flex items-center justify-center border-4 border-border shadow-[4px_4px_0_var(--border)] group-hover:rotate-6 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-sm font-bold text-muted-foreground leading-relaxed">{cat.desc}</p>
                    </div>
                    <div className="pt-4 flex items-center text-sm font-black text-primary gap-2">
                      레슨 시작하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <footer className="pt-12 text-center">
         <div className="inline-block p-1 rounded-2xl bg-muted/30 border-2 border-border">
            <Link href="/learn">
               <Button variant="ghost" className="h-12 px-8 font-black hover:bg-background rounded-xl transition-all">
                  전체 랜덤 레슨 시작
               </Button>
            </Link>
         </div>
      </footer>
    </div>
  );
}
