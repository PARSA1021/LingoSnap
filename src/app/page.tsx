'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { BookOpen, Mic, Play, Sparkles, Volume2 } from 'lucide-react';
import { speak } from '@/lib/tts';

export default function HomePage() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center">

      {/* Hero Header */}
      <div className="w-full text-center space-y-6 mb-16 sm:mb-24 relative">
        <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-2 rounded-xl font-black text-sm uppercase tracking-[0.2em] border-4 border-black shadow-[6px_6px_0_#000] wobbly-slow mb-8 -rotate-2">
          <Sparkles className="w-5 h-5 fill-primary" /> Daily English Adventure
        </div>
        <h1 className="text-5xl xs:text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] break-keep drop-shadow-[6px_6px_0_#000] sm:drop-shadow-[8px_8px_0_#000] uppercase -rotate-1 px-4">
          Lingo <br /> <span className="text-primary italic">Snap!</span>
        </h1>
        <p className="text-base sm:text-2xl font-black text-black uppercase tracking-widest mt-4 opacity-80">Don't Deal with the Boredom!</p>
      </div>

      {/* Main Action Path */}
      <div className="w-full max-w-sm sm:max-w-2xl mb-12 flex flex-col items-center gap-8">
        <div className="animate-bounce w-full flex justify-center">
          <Button 
            onClick={() => {
              speak('The show is about to begin! Sound is now enabled.');
            }}
            className="h-16 sm:h-20 px-6 sm:px-10 bg-primary text-white border-4 border-black shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000] font-black uppercase text-lg sm:text-2xl active:translate-y-1 active:shadow-none transition-all flex items-center gap-3 wobbly w-full max-w-[320px] sm:max-w-none justify-center"
          >
            <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 fill-current" /> Sound OK?
          </Button>
        </div>
        <Link href="/learn" className="block w-full group">
          <div className="relative bg-white border-4 sm:border-8 border-black p-6 sm:p-12 shadow-[8px_8px_0_#000] sm:shadow-[12px_12px_0_#000] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all wobbly-slow cursor-pointer">
            <div className="flex flex-row items-center gap-4 sm:gap-8 justify-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] group-hover:scale-110 transition-transform wobbly">
                <Play className="w-8 h-8 sm:w-12 sm:h-12 fill-white text-white translate-x-1" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl sm:text-5xl font-black text-black mb-1">학습 시작</h2>
                <p className="font-black text-sm sm:text-xl text-primary uppercase">Start the Show!</p>
              </div>
            </div>
          </div>
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
