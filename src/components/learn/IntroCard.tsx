'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

import { ttsManager } from '@/lib/tts';

interface IntroCardProps {
  mode: 'review' | 'lesson';
  category?: string;
  wordCount: 5 | 10;
  setWordCount: (n: 5 | 10) => void;
  reviewCount: number;
  onStart: () => void;
}

export function IntroCard({
  mode, category, wordCount, setWordCount, reviewCount, onStart,
}: IntroCardProps) {
  return (
    <Card className="bg-surface border-4 border-border shadow-[4px_4px_0_var(--border)] overflow-hidden max-w-sm mx-auto">
      <CardContent className="p-4 sm:p-8 space-y-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white border-2 border-border shadow-[2px_2px_0_var(--border)]">
            <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-[10px] font-black tracking-widest font-cartoon">
              {category && category !== 'all' ? `${category.toUpperCase()} MISSION` : 'DAILY MISSION'}
            </span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight font-cartoon">
              {mode === 'review' ? '오답 복습' : '오늘의 레슨'}
            </h1>
            <p className="text-sm font-bold text-muted-foreground leading-relaxed italic">
              {mode === 'review'
                ? `틀렸던 ${reviewCount}개 단어를 다시 풀어볼까요?`
                : '단어 확인 → 퀴즈 → 문장 만들기 순서로 진행해요.'}
            </p>
          </div>
        </div>

        {mode !== 'review' && (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-muted-foreground tracking-widest font-cartoon">분량 선택</p>
            <div className="grid grid-cols-2 gap-3">
              {([5, 10] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setWordCount(n)}
                  className={cn(
                    "h-12 rounded-xl border-2 font-black text-base transition-all font-cartoon flex items-center justify-center gap-2",
                    wordCount === n
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-background text-foreground hover:border-primary/50'
                  )}
                >
                  <span>{n}개</span>
                  <span className="text-[8px] opacity-60 font-reading">{n === 5 ? '가볍게' : '집중해서'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button 
            onClick={() => {
              ttsManager?.unlock();
              onStart();
            }} 
            className="h-14 w-full font-black text-xl bg-primary text-white border-4 border-border shadow-[4px_4px_0_var(--border)] active:translate-y-1 active:shadow-none transition-all font-cartoon"
          >
            시작하기 <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
