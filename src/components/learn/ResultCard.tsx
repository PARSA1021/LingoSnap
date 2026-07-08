'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RotateCcw, Sparkles, BookOpen, Trophy, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';

interface ResultCardProps {
 onRestart: () => void;
 isReview?: boolean;
 points?: number;
}

export function ResultCard({ onRestart, isReview = false, points = 100 }: ResultCardProps) {
 const [displayPoints, setDisplayPoints] = React.useState(0);
 const reviewQueue = useLessonSessionStore(s => s.reviewQueue);

 React.useEffect(() => {
 const duration = 1000;
 const steps = 20;
 const interval = duration / steps;
 const increment = points / steps;
 let current = 0;
 
 const timer = setInterval(() => {
 current += increment;
 if (current >= points) {
 setDisplayPoints(points);
 clearInterval(timer);
 } else {
 setDisplayPoints(Math.floor(current));
 }
 }, interval);
 
 return () => clearInterval(timer);
 }, [points]);

 if (isReview) {
 const remaining = reviewQueue.length;
 const allDone = remaining === 0;

 return (
 <div className="relative">
 <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden max-w-sm mx-auto">
 <CardContent className="p-6 sm:p-10 space-y-8 text-center">
 {/* 아이콘 */}
 <motion.div
 initial={{ scale: 0, rotate: -10 }}
 animate={{ scale: 1, rotate: 0 }}
 transition={{ type: 'spring', stiffness: 200, damping: 15 }}
 className="mx-auto w-24 h-24 rounded-[2rem] flex items-center justify-center relative border border-[var(--color-border)]"
 style={{ background: allDone ? 'var(--success)' : 'var(--primary)' }}
 >
 {allDone
 ? <CheckCircle2 className="w-12 h-12 text-white" />
 : <RotateCcw className="w-12 h-12 text-white" />
 }
 <motion.div
 animate={{ scale: [1, 1.2, 1] }}
 transition={{ repeat: Infinity, duration: 2 }}
 className="absolute -top-2 -right-2"
 >
 <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
 </motion.div>
 </motion.div>

 {/* 메시지 */}
 <div className="space-y-2">
 <h2 className="text-3xl sm:text-4xl font-black text-[var(--color-foreground)] leading-none">
 {allDone ? '완벽 정복! 🎉' : '복습 완료!'}
 </h2>
 <p className="text-sm font-bold text-[var(--color-muted-foreground)] italic leading-tight">
 {allDone
 ? '오답 노트가 깨끗해졌어요. 대단해요!'
 : `${remaining}개의 단어가 아직 남아 있어요. 계속 도전해보세요!`
 }
 </p>
 </div>

 {/* 남은 단어 카운터 */}
 <div className="bg-[var(--color-muted)]/40 border border-[var(--color-border)] rounded-2xl py-4 px-6 flex items-center justify-center gap-4">
 <div className="text-center">
 <p className="text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest ">남은 오답</p>
 <p className="text-4xl font-black text-[var(--color-foreground)] ">{remaining}</p>
 </div>
 {remaining > 0 && (
 <>
 <div className="h-10 w-px bg-border" />
 <div className="text-center">
 <p className="text-[9px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest ">이번 세션</p>
 <p className="text-4xl font-black text-[var(--color-success)] ">✓</p>
 </div>
 </>
 )}
 </div>

 {/* 버튼 */}
 <div className="flex flex-col gap-3 pt-2">
 {remaining > 0 && (
 <Button
 onClick={onRestart}
 className="h-14 text-lg font-black border border-[var(--color-border)] bg-[var(--color-primary)] text-white shadow-sm hover:shadow-md transition-shadow active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
 >
 <RotateCcw className="w-5 h-5" /> 한 번 더 복습
 </Button>
 )}
 <Link href="/review" className="w-full">
 <Button
 variant="secondary"
 className="h-14 w-full text-lg font-black border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm hover:shadow-md transition-shadow active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
 >
 <BookOpen className="w-5 h-5" /> 복습 센터로
 </Button>
 </Link>
 <Link href="/" className="w-full">
 <Button
 variant="ghost"
 className="h-10 w-full text-sm font-black border-2 border-dashed border-[var(--color-border)] hover:bg-[var(--color-muted)] "
 >
 홈으로 돌아가기
 </Button>
 </Link>
 </div>
 </CardContent>
 </Card>
 </div>
 );
 }

 // ─── 기본 레슨 완료 화면 ────────────────────────────────────────
 return (
 <div className="relative">
 <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden max-w-sm mx-auto">
 <CardContent className="p-6 sm:p-10 space-y-8 text-center">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 className="mx-auto w-24 h-24 rounded-[2rem] bg-[var(--color-info)]/10 border-4 border-info flex items-center justify-center relative"
 >
 <Trophy className="w-12 h-12 text-[var(--color-info)] fill-info/20" />
 <motion.div
 animate={{ scale: [1, 1.1, 1] }}
 transition={{ repeat: Infinity, duration: 2 }}
 className="absolute -top-2 -right-2"
 >
 <Sparkles className="w-8 h-8 text-amber-400 fill-amber-400" />
 </motion.div>
 </motion.div>

 <div className="space-y-2">
 <h2 className="text-3xl sm:text-5xl font-black text-[var(--color-foreground)] leading-none">레슨 완료!</h2>
 <p className="text-sm font-bold text-[var(--color-muted-foreground)] italic leading-tight">
 새로운 단어들을 정복하고 포인트를 획득했어요!
 </p>
 </div>

 <div className="grid grid-cols-2 gap-4 max-w-[280px] mx-auto">
 <div className="bg-[var(--color-success)]/10 border-2 border-success p-3 rounded-2xl">
 <p className="text-[8px] font-black text-[var(--color-success)] uppercase tracking-widest ">POINTS</p>
 <p className="text-xl font-black text-[var(--color-success)] ">+{displayPoints}</p>
 </div>
 <div className="bg-[var(--color-info)]/10 border-2 border-info p-3 rounded-2xl">
 <p className="text-[8px] font-black text-[var(--color-info)] uppercase tracking-widest ">STREAK</p>
 <p className="text-xl font-black text-[var(--color-info)] ">7 Days</p>
 </div>
 </div>

 <div className="flex flex-col gap-3 pt-2">
 <Button 
 onClick={onRestart} 
 className="h-14 text-lg font-black border border-[var(--color-border)] bg-white text-[var(--color-foreground)] shadow-sm hover:shadow-md transition-shadow active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
 >
 <RotateCcw className="w-5 h-5" /> 다시 연습하기
 </Button>
 <Link href="/review" className="w-full">
 <Button 
 variant="secondary" 
 className="h-14 w-full text-lg font-black border border-[var(--color-border)] bg-[var(--color-primary)] text-white shadow-sm hover:shadow-md transition-shadow active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
 >
 <BookOpen className="w-5 h-5" /> 복습 센터로 가기
 </Button>
 </Link>
 <Link href="/" className="w-full">
 <Button 
 variant="ghost" 
 className="h-10 w-full text-sm font-black border-2 border-dashed border-[var(--color-border)] hover:bg-[var(--color-muted)] "
 >
 홈으로 돌아가기
 </Button>
 </Link>
 </div>
 </CardContent>
 </Card>
 </div>
 );
}
