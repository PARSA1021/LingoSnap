import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { BookOpen, Mic, Play, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center dot-pattern">

      {/* Hero Header */}
      <div className="w-full text-center space-y-4 mb-16 sm:mb-24">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-primary/20">
          <Sparkles className="w-4 h-4" /> Daily English Practice
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground tracking-tighter leading-none break-keep">
          LingoSnap과 함께 <br /> <span className="text-primary">재미있게</span> 공부하세요.
        </h1>
      </div>

      {/* Main Action Path */}
      <div className="w-full max-w-2xl mb-12 sm:mb-16">
        <Link href="/learn" className="block group">
          <Card className="card-tactile bg-primary border-primary border-b-primary-shadow hover:translate-y-[2px] active:translate-y-[6px] transition-all duration-150">
            <CardContent className="p-8 sm:p-12 flex items-center gap-8 justify-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                <Play className="w-10 h-10 fill-white" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl sm:text-4xl font-black mb-1">학습 시작하기</h2>
                <p className="text-white/80 font-bold text-lg">오늘의 필수 표현 5개 마스터!</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Grid Features */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        <FeatureCard
          href="/vocab"
          icon={<BookOpen className="w-8 h-8" />}
          title="표현 검색"
          color="bg-info"
          shadowColor="#1CB0F6"
        />
        <FeatureCard
          href="/speaking"
          icon={<Mic className="w-8 h-8" />}
          title="자유 토킹"
          color="bg-success"
          shadowColor="#58CC02"
        />
      </div>

      {/* Footer Info */}
      <div className="mt-20 text-muted-foreground/40 font-black tracking-widest text-xs uppercase">
        Playful english learning • v2.0
      </div>
    </div>
  );
}
