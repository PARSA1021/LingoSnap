'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, BookOpen, Briefcase, Plane, Coffee, Heart, Sparkles,
  RotateCcw, ChevronRight, Flame, Target, Clock
} from 'lucide-react';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';
import { cn } from '@/lib/utils/cn';

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',  label: '전체',   emoji: '✨', icon: Sparkles, color: 'from-violet-500 to-indigo-500',   desc: '모든 카테고리 혼합' },
  { id: '일상', label: '일상',   emoji: '☀️', icon: Coffee,    color: 'from-amber-400 to-orange-500',   desc: '매일 쓰는 표현들' },
  { id: '캐주얼', label: '캐주얼', emoji: '😎', icon: Heart,   color: 'from-pink-400 to-rose-500',      desc: '친구들과 쓰는 표현' },
  { id: '비즈니스', label: '비즈니스', emoji: '💼', icon: Briefcase, color: 'from-blue-500 to-cyan-500', desc: '직장·업무 표현' },
  { id: '여행', label: '여행',   emoji: '✈️', icon: Plane,    color: 'from-teal-400 to-emerald-500',   desc: '여행할 때 필수 표현' },
  { id: '숙어', label: '숙어',   emoji: '📚', icon: BookOpen, color: 'from-purple-500 to-violet-600',  desc: '네이티브 관용 표현' },
];

const WORD_COUNTS = [
  { n: 5,  label: '5개',  sublabel: '5~7분', desc: '가볍게 시작해요' },
  { n: 10, label: '10개', sublabel: '10~15분', desc: '집중 학습 모드' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function LearnSetupPage() {
  const router = useRouter();
  const reviewQueue = useLessonSessionStore(s => s.reviewQueue);

  const [category, setCategory] = React.useState('all');
  const [wordCount, setWordCount] = React.useState<5 | 10>(5);
  const [isTurbo, setIsTurbo] = React.useState(false);

  const handleStart = () => {
    const params = new URLSearchParams({
      mode: 'lesson',
      category,
      wordCount: String(wordCount),
      isTurbo: String(isTurbo),
    });
    router.push(`/learn/session?${params.toString()}`);
  };

  const handleReviewStart = () => {
    router.push('/learn/session?mode=review');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-8">

      {/* ─── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest border border-primary/20">
          <Target className="w-3 h-3" /> 오늘의 레슨
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          어떻게 학습할까요?
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          카테고리와 분량을 선택하고 바로 시작하세요 🚀
        </p>
      </motion.div>

      {/* ─── Review Banner ──────────────────────────────────────── */}
      <AnimatePresence>
        {reviewQueue.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={handleReviewStart}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-500/15 to-pink-500/15 border border-rose-400/25 backdrop-blur flex items-center justify-between gap-4 hover:from-rose-500/20 hover:to-pink-500/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center shadow-md">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">
                  오답 복습 <span className="text-rose-500">{reviewQueue.length}개</span> 대기 중
                </p>
                <p className="text-xs text-muted-foreground">지금 바로 틀린 단어를 정복해봐요</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Category Selector ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">카테고리</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'relative p-4 rounded-2xl border text-left transition-all duration-200 overflow-hidden',
                  isActive
                    ? 'border-primary/40 bg-primary/10 shadow-[0_0_0_2px_var(--primary)]'
                    : 'border-border bg-surface/60 backdrop-blur hover:border-primary/30 hover:bg-primary/5'
                )}
              >
                {/* Gradient shimmer when active */}
                {isActive && (
                  <motion.div
                    layoutId="cat-active-bg"
                    className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 rounded-2xl`}
                  />
                )}
                <div className="relative space-y-1.5">
                  <span className="text-xl">{cat.emoji}</span>
                  <p className="font-bold text-sm text-foreground">{cat.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{cat.desc}</p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="cat-check"
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ─── Word Count Selector ────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">학습 분량</h2>
        <div className="grid grid-cols-2 gap-3">
          {WORD_COUNTS.map(({ n, label, sublabel, desc }) => {
            const isActive = wordCount === n;
            return (
              <button
                key={n}
                onClick={() => setWordCount(n)}
                className={cn(
                  'relative p-5 rounded-2xl border text-left transition-all duration-200',
                  isActive
                    ? 'border-primary/40 bg-primary/10 shadow-[0_0_0_2px_var(--primary)]'
                    : 'border-border bg-surface/60 backdrop-blur hover:border-primary/30 hover:bg-primary/5'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl font-extrabold text-foreground">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="count-check"
                      className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Clock className="w-3 h-3" /> {sublabel}
                </div>
                <p className="text-xs font-medium text-muted-foreground">{desc}</p>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* ─── Turbo Mode ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => setIsTurbo(!isTurbo)}
          className={cn(
            'w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200',
            isTurbo
              ? 'border-amber-400/50 bg-amber-500/10 shadow-[0_0_0_2px_theme(colors.amber.400)]'
              : 'border-border bg-surface/60 backdrop-blur hover:border-amber-400/30'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
              isTurbo ? 'bg-amber-400 text-white' : 'bg-muted text-muted-foreground'
            )}>
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">터보 모드</p>
              <p className="text-xs text-muted-foreground">문장·말하기 생략, 퀴즈만 빠르게</p>
            </div>
          </div>
          <div className={cn(
            'w-11 h-6 rounded-full relative transition-colors duration-200',
            isTurbo ? 'bg-amber-400' : 'bg-muted'
          )}>
            <motion.div
              animate={{ x: isTurbo ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </div>
        </button>
      </motion.section>

      {/* ─── Start Button ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="pt-2 pb-4"
      >
        <motion.button
          onClick={handleStart}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          className="w-full h-14 sm:h-16 rounded-2xl bg-primary text-white font-bold text-lg tracking-tight shadow-lg hover:shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <Flame className="w-5 h-5" />
          <span>레슨 시작하기</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          {CATEGORIES.find(c => c.id === category)?.emoji} {CATEGORIES.find(c => c.id === category)?.label} · {wordCount}개 단어 · {isTurbo ? '⚡ 터보' : '일반 모드'}
        </p>
      </motion.div>
    </div>
  );
}