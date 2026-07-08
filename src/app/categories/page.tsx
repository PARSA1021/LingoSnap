'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
 Briefcase, 
 Plane, 
 Heart, 
 Coffee, 
 Sparkles, 
 ArrowRight,
 GraduationCap,
 BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const categories = [
 { id: 'all', name: 'TOTAL RANDOM', icon: GraduationCap, desc: '모든 분야의 단어를 골고루 학습합니다.', color: 'bg-[var(--color-primary)]' },
 { id: '비즈니스', name: 'BUSINESS', icon: Briefcase, desc: '회의, 이메일, 협상, 발표 등 실무 표현', color: 'bg-blue-500' },
 { id: '여행', name: 'TRAVEL', icon: Plane, desc: '공항, 호텔, 길 찾기 등 여행 필수 표현', color: 'bg-emerald-500' },
 { id: 'sns', name: 'SNS/DIGITAL', icon: Sparkles, desc: '댓글, 리뷰, 밈 등 트렌디한 표현', color: 'bg-purple-500' },
 { id: '학술', name: 'ACADEMIC', icon: BookOpen, desc: '에세이, 발표, 논리적인 문장 구성', color: 'bg-indigo-500' },
 { id: '일상', name: 'DAILY LIFE', icon: Coffee, desc: '쇼핑, 날씨, 감정 등 실용적인 일상 표현', color: 'bg-amber-500' },
 { id: '감정', name: 'EMOTION', icon: Heart, desc: '기분, 성격, 인간관계 심층 표현', color: 'bg-rose-500' },
];

export default function CategoriesPage() {
 return (
 <div className="min-h-screen w-full flex flex-col bg-[var(--color-background)] pt-24 md:pt-36 pb-32 px-6 md:px-12 overflow-x-hidden">
 <div className="max-w-7xl mx-auto w-full flex flex-col gap-16 md:gap-24">
 
 <header className="flex flex-col gap-6 max-w-3xl">
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 className="inline-flex w-fit bg-black text-white text-[10px] md:text-xs font-black px-4 py-1.5 border border-[var(--color-border)] uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow"
 >
 Choose Your Focus
 </motion.div>
 <motion.h1 
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-5xl md:text-8xl font-black text-[var(--color-foreground)] uppercase leading-[0.9]"
 >
 What's the<br />Topic Today?
 </motion.h1>
 <motion.p 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.2 }}
 className="text-lg md:text-2xl font-bold text-[var(--color-muted-foreground)]"
 >
 Select a category to start your customized lesson. Master practical English used in real-world scenarios.
 </motion.p>
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
 {categories.map((cat, idx) => {
 const Icon = cat.icon;
 return (
 <motion.div
 key={cat.id}
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.1 + idx * 0.05 }}
 >
 <Link href={`/learn?category=${cat.id}`} className="block group h-full">
 <div className={cn(
 "h-full card-neon p-8 md:p-10 flex flex-col justify-between min-h-[320px] transition-all",
 cat.id === 'all' ? "bg-[var(--color-primary)]" : "bg-white dark:bg-black"
 )}>
 <div className="space-y-6">
 <div className={cn(
 "w-16 h-16 border border-[var(--color-border)] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow group-hover:rotate-12 transition-transform",
 cat.id === 'all' ? "bg-white" : cat.color
 )}>
 <Icon className={cn("w-8 h-8", cat.id === 'all' ? "text-[var(--color-primary)]" : "text-white")} />
 </div>
 <div className="space-y-3">
 <h3 className={cn(
 "text-2xl md:text-3xl font-black uppercase leading-tight",
 cat.id === 'all' ? "text-white" : "text-[var(--color-foreground)]"
 )}>{cat.name}</h3>
 <p className={cn(
 "text-sm font-bold leading-relaxed",
 cat.id === 'all' ? "text-white/80" : "text-[var(--color-muted-foreground)]"
 )}>{cat.desc}</p>
 </div>
 </div>
 
 <div className={cn(
 "flex items-center gap-2 font-black text-xs uppercase tracking-widest pt-6 border-t-4 border-black/10 group-hover:gap-4 transition-all",
 cat.id === 'all' ? "text-white" : "text-[var(--color-primary)]"
 )}>
 Start Lesson <ArrowRight className="w-5 h-5" />
 </div>
 </div>
 </Link>
 </motion.div>
 );
 })}
 </div>
 </div>
 </div>
 );
}

