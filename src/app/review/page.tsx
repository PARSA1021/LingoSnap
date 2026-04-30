'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RotateCcw, ArrowRight, Trash2, X, Volume2, BookOpen, Flame, Target, CheckCircle } from 'lucide-react';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewPage() {
  const reviewQueue = useLessonSessionStore(s => s.reviewQueue);
  const removeFromReview = useLessonSessionStore(s => s.removeFromReview);
  const clearReview = useLessonSessionStore(s => s.clearReview);
  const { speak, isPlaying } = useTTS();
  const [confirmClear, setConfirmClear] = React.useState(false);

  const handleClear = () => {
    if (confirmClear) {
      clearReview();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-16 space-y-8 sm:space-y-12">

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border-2 border-primary/20 text-xs font-black uppercase tracking-widest w-fit">
          복습 센터
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">복습 스테이션</h1>
            <p className="text-base sm:text-lg text-muted-foreground font-bold leading-relaxed max-w-xl">
              부족한 부분을 다시 채워보세요. 정답을 맞히면 리스트에서 자동으로 제외됩니다.
            </p>
          </div>
          <AnimatePresence mode="wait">
            {confirmClear ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 shrink-0"
              >
                <span className="text-sm font-black text-error">정말 삭제할까요?</span>
                <Button
                  variant="secondary"
                  onClick={handleClear}
                  className="h-11 px-4 font-black border-4 border-error text-error bg-error/10 shadow-[3px_3px_0_var(--error)] active:translate-y-0.5 active:shadow-none text-sm"
                >
                  삭제
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setConfirmClear(false)}
                  className="h-11 px-4 font-black border-2 border-border text-sm"
                >
                  취소
                </Button>
              </motion.div>
            ) : (
              <motion.div key="delete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  variant="secondary"
                  onClick={handleClear}
                  disabled={reviewQueue.length === 0}
                  className="h-11 px-5 font-black border-4 border-border shadow-[4px_4px_0_var(--border)] active:translate-y-1 active:shadow-none disabled:opacity-40 text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> 전체 비우기
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ─── Main Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* 왼쪽: 요약 & 시작 카드 */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-surface border-4 border-border shadow-[8px_8px_0_var(--border)] lg:sticky lg:top-24">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* 카운터 */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center border-4 border-border shadow-[4px_4px_0_var(--border)] rotate-3 shrink-0">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-5xl font-black text-foreground leading-none">{reviewQueue.length}</p>
                  <p className="text-sm font-black text-muted-foreground uppercase mt-1">남은 오답</p>
                </div>
              </div>

              {/* 통계 그리드 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 border-2 border-border rounded-2xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">단어</span>
                  </div>
                  <p className="text-xl font-black text-foreground">
                    {reviewQueue.filter(i => i.kind !== 'speaking').length}
                  </p>
                </div>
                <div className="bg-muted/30 border-2 border-border rounded-2xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">말하기</span>
                  </div>
                  <p className="text-xl font-black text-foreground">
                    {reviewQueue.filter(i => i.kind === 'speaking').length}
                  </p>
                </div>
              </div>

              {/* 시작 버튼 */}
              <div className="space-y-3 pt-2">
                <Link href={reviewQueue.length > 0 ? "/learn/session?mode=review" : "/learn"} className="block">
                  <Button
                    className="w-full h-16 text-xl font-black border-4 border-border shadow-[6px_6px_0_var(--border)] hover:-translate-y-1 active:translate-y-0 transition-all font-cartoon flex items-center justify-center gap-2"
                  >
                    {reviewQueue.length > 0 ? (
                      <>복습 시작 <ArrowRight className="w-6 h-6" /></>
                    ) : (
                      <>새 레슨 시작 <ArrowRight className="w-6 h-6" /></>
                    )}
                  </Button>
                </Link>
                <p className="text-[11px] text-center font-bold text-muted-foreground">
                  {reviewQueue.length > 0
                    ? `최대 10개씩 맞춤형 오답 세션이 진행됩니다.`
                    : '현재 복습할 내용이 없습니다.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 전체 단어장 바로가기 */}
          <Link href="/vocab" className="block">
            <div className="p-5 rounded-3xl border-4 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-black text-muted-foreground group-hover:text-foreground text-sm">전체 단어장 보기</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </div>

        {/* 오른쪽: 오답 리스트 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-foreground uppercase tracking-widest">오답 리스트</h2>
            <span className="text-xs font-bold text-muted-foreground italic">최근 50개까지 저장</span>
          </div>

          <AnimatePresence initial={false}>
            {reviewQueue.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted/20 border-4 border-dashed border-border rounded-[2.5rem] py-20 px-8 text-center space-y-5"
              >
                <div className="w-20 h-20 bg-background rounded-full border-4 border-border mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-foreground">깨끗한 오답 노트!</p>
                  <p className="text-sm font-bold text-muted-foreground">모든 문제를 정복하셨네요. 대단합니다! 🎉</p>
                </div>
                <Link href="/learn">
                  <Button className="h-12 px-8 font-black border-4 border-border shadow-[4px_4px_0_var(--border)] active:translate-y-0.5 active:shadow-none mt-2">
                    새 레슨 시작하기
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {reviewQueue.map((item, idx) => {
                  const { title, sub, kindLabel, kindColor } = getReviewItemInfo(item);

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.92, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="group bg-surface border-4 border-border rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_var(--border)] hover:shadow-[6px_6px_0_var(--border)] hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* 왼쪽: 아이콘 + 텍스트 */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 border-border text-lg font-black font-cartoon",
                            kindColor
                          )}>
                            {item.kind === 'speaking' ? '🎤' : item.kind === 'listening_quiz' ? '👂' : '📝'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-base sm:text-lg font-black text-foreground truncate">{title}</p>
                              <span className={cn(
                                "shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border-2",
                                kindColor
                              )}>
                                {kindLabel}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-muted-foreground truncate mt-0.5">{sub}</p>
                          </div>
                        </div>

                        {/* 오른쪽: 액션 버튼 */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.kind !== 'speaking' && (
                            <button
                              onClick={() => speak(title)}
                              className={cn(
                                "h-10 w-10 rounded-full border-2 border-border flex items-center justify-center transition-all",
                                isPlaying
                                  ? "border-primary text-primary bg-primary/5"
                                  : "hover:border-primary hover:bg-primary/5"
                              )}
                              title="발음 듣기"
                            >
                              <Volume2 className={cn("w-4 h-4", isPlaying && "animate-pulse")} />
                            </button>
                          )}
                          <button
                            onClick={() => removeFromReview(item)}
                            className="h-10 w-10 rounded-full border-2 border-border flex items-center justify-center hover:border-error hover:bg-error/5 hover:text-error transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                            title="리스트에서 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function getReviewItemInfo(item: any) {
  const kind = item.kind;
  if (kind === 'speaking') return {
    title: item.expectedSentence,
    sub: '말하기 연습',
    kindLabel: '말하기',
    kindColor: 'bg-blue-100 text-blue-600 border-blue-200',
  };
  if (kind === 'listening_quiz') return {
    title: item.answer,
    sub: '리스닝 퀴즈',
    kindLabel: '듣기',
    kindColor: 'bg-violet-100 text-violet-600 border-violet-200',
  };
  if (kind === 'choice_quiz') return {
    title: item.word.word,
    sub: item.word.meaning,
    kindLabel: '선택',
    kindColor: 'bg-amber-100 text-amber-600 border-amber-200',
  };
  if (kind === 'typing_exact') return {
    title: item.word.word,
    sub: item.word.meaning,
    kindLabel: '타이핑',
    kindColor: 'bg-rose-100 text-rose-600 border-rose-200',
  };
  return {
    title: item.word?.word || '?',
    sub: item.word?.meaning || '',
    kindLabel: '문장',
    kindColor: 'bg-green-100 text-green-600 border-green-200',
  };
}
