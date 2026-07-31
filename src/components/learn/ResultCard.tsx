'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RotateCcw, Sparkles, BookOpen, Trophy, CheckCircle2, Star, Home } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';
import { useLearningStore } from '@/store/useLearningStore';

interface ResultCardProps {
  onRestart: () => void;
  isReview?: boolean;
  points?: number;
}

export function ResultCard({ onRestart, isReview = false, points = 100 }: ResultCardProps) {
  const [displayPoints, setDisplayPoints] = React.useState(0);
  const reviewQueue = useLessonSessionStore(s => s.reviewQueue);
  const streakDays = useLearningStore(s => s.streakDays || 1);

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
      <div className="relative w-full">
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md overflow-hidden max-w-xl mx-auto rounded-3xl">
          <CardContent className="p-6 sm:p-10 space-y-8 text-center">
            {/* Trophy Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center relative shadow-lg"
              style={{ background: allDone ? '#00A699' : 'var(--color-primary)' }}
            >
              {allDone
                ? <CheckCircle2 className="w-14 h-14 text-white" />
                : <RotateCcw className="w-14 h-14 text-white" />
              }
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2"
              >
                <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              </motion.div>
            </motion.div>

            {/* Message */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-[var(--color-foreground)] leading-tight">
                {allDone ? '완벽 정복! 🎉' : '복습 완료!'}
              </h2>
              <p className="text-sm sm:text-base font-bold text-[var(--color-muted-foreground)] italic leading-tight">
                {allDone
                  ? '오답 노트가 깨끗해졌어요. 대단해요!'
                  : `${remaining}개의 단어가 아직 남아 있어요. 계속 도전해보세요!`
                }
              </p>
            </div>

            {/* Counter */}
            <div className="bg-[var(--color-muted)]/40 border border-[var(--color-border)] rounded-2xl py-4 px-6 flex items-center justify-center gap-6 max-w-xs mx-auto">
              <div className="text-center">
                <p className="text-[10px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest">남은 오답</p>
                <p className="text-4xl font-black text-[var(--color-foreground)]">{remaining}</p>
              </div>
              {remaining > 0 && (
                <>
                  <div className="h-10 w-px bg-[var(--color-border)]" />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-[var(--color-muted-foreground)] uppercase tracking-widest">이번 세션</p>
                    <p className="text-4xl font-black text-emerald-500">✓</p>
                  </div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              {remaining > 0 && (
                <Button
                  onClick={onRestart}
                  className="h-14 text-lg font-black border border-[var(--color-border)] bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 rounded-2xl"
                >
                  <RotateCcw className="w-5 h-5" /> 한 번 더 복습
                </Button>
              )}
              <Link href="/review" className="w-full">
                <Button
                  variant="secondary"
                  className="h-14 w-full text-lg font-black border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 rounded-2xl"
                >
                  <BookOpen className="w-5 h-5" /> 복습 센터로
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button
                  variant="ghost"
                  className="h-11 w-full text-sm font-bold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center justify-center gap-1.5"
                >
                  <Home className="w-4 h-4" /> 홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Lesson Complete Screen ────────────────────────────────────────
  return (
    <div className="relative w-full">
      <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-md overflow-hidden max-w-xl mx-auto rounded-3xl">
        <CardContent className="p-6 sm:p-10 space-y-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center relative shadow-lg"
          >
            <Trophy className="w-14 h-14 text-amber-500 fill-amber-500/20" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-amber-400 fill-amber-400" />
            </motion.div>
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-foreground)] leading-none">레슨 완료! 🎉</h2>
            <p className="text-sm sm:text-base font-bold text-[var(--color-muted-foreground)] italic leading-tight">
              새로운 표현들을 완벽히 정복하고 포인트와 스트릭을 획득하셨어요!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-3.5 rounded-2xl">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">POINTS</p>
              <p className="text-2xl font-black text-emerald-600">+{displayPoints} P</p>
            </div>
            <div className="bg-amber-500/10 border-2 border-amber-500/30 p-3.5 rounded-2xl">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">STREAK</p>
              <p className="text-2xl font-black text-amber-600">{streakDays}일 달성!</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button 
              onClick={onRestart} 
              className="h-14 text-lg font-black border border-[var(--color-border)] bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 rounded-2xl"
            >
              <RotateCcw className="w-5 h-5" /> 다시 연습하기
            </Button>
            <Link href="/review" className="w-full">
              <Button 
                variant="secondary" 
                className="h-14 w-full text-lg font-black border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 rounded-2xl"
              >
                <BookOpen className="w-5 h-5" /> 복습 센터로 가기
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button 
                variant="ghost" 
                className="h-11 w-full text-sm font-bold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4" /> 홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
