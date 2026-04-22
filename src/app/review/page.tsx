'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RotateCcw, ArrowRight, Trash2 } from 'lucide-react';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';

export default function ReviewPage() {
  const reviewQueue = useLessonSessionStore(s => s.reviewQueue);
  const clearReview = useLessonSessionStore(s => s.clearReview);

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">복습</h1>
        <p className="text-sm sm:text-base text-muted-foreground font-bold">
          틀린 문제를 모아서 다시 푸는 모드입니다.
        </p>
      </header>

      <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
        <CardContent className="p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center border-2 border-border">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-black text-foreground">복습을 시작해요</p>
              <p className="text-xs text-muted-foreground font-bold">오답이 쌓이면 자동으로 여기에 모입니다.</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-border bg-background/40 px-4 py-3">
            <p className="font-bold text-sm text-muted-foreground">
              현재 오답 {reviewQueue.length}개
            </p>
            <Button
              variant="secondary"
              onClick={clearReview}
              disabled={reviewQueue.length === 0}
              className="h-10 px-3 font-black"
            >
              <Trash2 className="w-4 h-4 mr-2" /> 비우기
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={reviewQueue.length > 0 ? "/learn?mode=review" : "/learn"} className="flex-1">
              <Button className="w-full h-12 font-black">
                복습 시작 <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/vocab" className="flex-1">
              <Button variant="secondary" className="w-full h-12 font-black">
                단어장 보기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

