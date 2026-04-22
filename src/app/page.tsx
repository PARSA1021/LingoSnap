'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { BookOpen, Mic, Play, Sparkles, RotateCcw, Tv } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">

      {/* Hero Header - Compact & Polished */}
      <div className="w-full text-center space-y-4 mb-12 sm:mb-16 relative">
        <div className="inline-flex items-center gap-2 bg-surface text-foreground px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] border-4 border-border shadow-[4px_4px_0_var(--border)] wobbly-slow mb-4 -rotate-1">
          <Sparkles className="w-4 h-4 fill-primary" /> Daily English Adventure
        </div>
        <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-black text-foreground tracking-tighter leading-none break-keep drop-shadow-[5px_5px_0_var(--border)] sm:drop-shadow-[8px_8px_0_var(--border)] uppercase -rotate-1 px-4">
          Talkie <br /> <span className="text-info italic">Talkie!</span>
        </h1>
        <p className="text-sm sm:text-lg font-black text-foreground uppercase tracking-[0.2em] mt-2 opacity-80">Don&apos;t Deal with the Boredom!</p>
      </div>

      {/* Main Action Path - Compacted */}
      <div className="w-full max-w-sm sm:max-w-xl mb-12 mt-8 flex flex-col items-center gap-6">
        <Link href="/learn" className="block w-full group">
          <div className="relative bg-surface border-4 sm:border-8 border-border p-6 sm:p-8 shadow-[8px_8px_0_var(--border)] sm:shadow-[10px_10px_0_var(--border)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all wobbly-slow cursor-pointer">
            <div className="flex flex-row items-center gap-4 sm:gap-6 justify-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center border-4 border-border shadow-[4px_4px_0_var(--border)] group-hover:scale-110 transition-transform wobbly">
                <Play className="w-6 h-6 sm:w-10 sm:h-10 fill-white text-white translate-x-1" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl sm:text-4xl font-black text-foreground mb-0">학습 시작</h2>
                <p className="font-black text-[10px] sm:text-sm text-primary uppercase tracking-widest">Go to the Stage!</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/review" className="w-full">
          <Button variant="secondary" className="w-full h-12 font-black flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> 복습(오답)
          </Button>
        </Link>
      </div>

      {/* Quick access */}
      <div className="w-full grid grid-cols-2 gap-4 max-w-xl">
        <FeatureCard
          href="/vocab"
          icon={<BookOpen className="w-6 h-6" />}
          title="단어장"
          color="bg-info"
        />
        <FeatureCard
          href="/speaking"
          icon={<Mic className="w-6 h-6" />}
          title="말하기"
          color="bg-success"
        />
        <FeatureCard
          href="/contents"
          icon={<Tv className="w-6 h-6" />}
          title="콘텐츠"
          color="bg-success"
        />
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-muted-foreground/40 font-black tracking-widest text-[10px] uppercase">
        Playful english learning • v2.0
      </div>
    </div>
  );
}
