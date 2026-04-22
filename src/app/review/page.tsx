'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RotateCcw, ArrowRight, Trash2, X, Volume2, BookOpen } from 'lucide-react';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';
import { speak } from '@/lib/tts';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewPage() {
  const reviewQueue = useLessonSessionStore(s => s.reviewQueue);
  const removeFromReview = useLessonSessionStore(s => s.removeFromReview);
  const clearReview = useLessonSessionStore(s => s.clearReview);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 sm:py-16 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border-2 border-primary/20 text-xs font-black uppercase tracking-widest">
            Learning Progress
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">복습 스테이션</h1>
          <p className="text-base sm:text-lg text-muted-foreground font-bold leading-relaxed max-w-xl">
            부족한 부분을 다시 채워보세요. 정답을 맞히면 리스트에서 자동으로 제외됩니다.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
           <Button
              variant="secondary"
              onClick={clearReview}
              disabled={reviewQueue.length === 0}
              className="h-14 px-6 font-black border-4 shadow-[4px_4px_0_var(--border)] active:translate-y-1 active:shadow-none"
            >
              <Trash2 className="w-5 h-5 mr-2" /> 전체 비우기
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 요약 및 시작 카드 */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-surface border-4 border-border shadow-[8px_8px_0_var(--border)] sticky top-24">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-primary text-white flex items-center justify-center border-4 border-border shadow-[4px_4px_0_var(--border)] rotate-3">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl font-black text-foreground">{reviewQueue.length}</p>
                  <p className="text-sm font-black text-muted-foreground uppercase">남은 오답</p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Link href={reviewQueue.length > 0 ? "/learn?mode=review" : "/learn"}>
                  <Button className="w-full h-16 text-xl font-black shadow-[6px_6px_0_var(--primary-foreground)] hover:-translate-y-1 active:translate-y-0 transition-all">
                    복습 시작 <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
                <p className="text-[11px] text-center font-bold text-muted-foreground">
                  {reviewQueue.length > 0 
                    ? "맞춤형 오답 세션이 생성됩니다." 
                    : "현재 복습할 내용이 없습니다."}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Link href="/vocab" className="block">
            <div className="p-6 rounded-3xl border-4 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <BookOpen className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                     <span className="font-black text-muted-foreground group-hover:text-foreground">전체 단어장 보기</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
               </div>
            </div>
          </Link>
        </div>

        {/* 오른쪽: 오답 리스트 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-foreground uppercase tracking-widest">오답 리스트</h2>
            <span className="text-xs font-bold text-muted-foreground italic">최근 50개까지 저장됩니다.</span>
          </div>

          <AnimatePresence initial={false}>
            {reviewQueue.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-muted/30 border-4 border-dashed border-border rounded-[2.5rem] p-20 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-background rounded-full border-4 border-border mx-auto flex items-center justify-center grayscale opacity-50">
                   <RotateCcw className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black text-foreground">깨끗한 오답 노트!</p>
                  <p className="text-sm font-bold text-muted-foreground">모든 문제를 정복하셨네요. 대단합니다!</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {reviewQueue.map((item, idx) => {
                  const { title, sub } = getReviewItemInfo(item);
                  
                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group bg-surface border-4 border-border rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_var(--border)] hover:shadow-[6px_6px_0_var(--border)] hover:-translate-y-0.5 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 border-border
                           ${item.kind === 'speaking' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                            {item.kind === 'speaking' ? <Mic className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
                         </div>
                         <div className="min-w-0">
                            <p className="text-lg font-black text-foreground truncate">{title}</p>
                            <p className="text-sm font-bold text-muted-foreground truncate">{sub}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                         <button
                           onClick={() => speak(title)}
                           className="h-10 w-10 rounded-full border-2 border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                         >
                            <Volume2 className="w-4 h-4" />
                         </button>
                         <button
                           onClick={() => removeFromReview(item)}
                           className="h-10 w-10 rounded-full border-2 border-border flex items-center justify-center hover:border-error hover:bg-error/5 transition-colors opacity-0 group-hover:opacity-100"
                           title="리스트에서 삭제"
                         >
                            <X className="w-4 h-4" />
                         </button>
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
  if (kind === 'speaking') return { title: item.expectedSentence, sub: '말하기 연습' };
  if (kind === 'listening_quiz') return { title: item.answer, sub: '리스닝 퀴즈' };
  return { title: item.word.word, sub: item.word.meaning };
}

// Helper icon
function Mic(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
  );
}

