'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { BookOpen, Mic, Play, Sparkles, Volume2 } from 'lucide-react';
import { speak } from '@/lib/tts';
import { useLearningStore } from '@/store/useLearningStore';

export default function HomePage() {
  const points = useLearningStore(state => state.points);
  
  // Calculate Rank based on points
  const getRank = (pts: number) => {
    if (pts >= 10000) return 'Hollywood Legend';
    if (pts >= 5000) return 'Leading Actor';
    if (pts >= 2000) return 'Supporting Role';
    if (pts >= 500) return 'Rising Star';
    if (pts >= 100) return 'Extra';
    return 'Audience';
  };

  const rank = getRank(points);
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">

      {/* Hero Header - Compact & Polished */}
      <div className="w-full text-center space-y-4 mb-12 sm:mb-16 relative">
        <div className="inline-flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] border-4 border-black shadow-[4px_4px_0_#000] wobbly-slow mb-4 -rotate-1">
          <Sparkles className="w-4 h-4 fill-primary" /> Daily English Adventure
        </div>
        <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-none break-keep drop-shadow-[5px_5px_0_#000] sm:drop-shadow-[8px_8px_0_#000] uppercase -rotate-1 px-4">
          Talkie <br /> <span className="text-info italic">Talkie!</span>
        </h1>
        <p className="text-sm sm:text-lg font-black text-black uppercase tracking-[0.2em] mt-2 opacity-80">Don't Deal with the Boredom!</p>
      </div>

      {/* Quick Stats / Status - Thematic Dashboard */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_#000] rotate-1 flex flex-col items-center">
           <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Stage Rank</span>
           <span className="text-2xl font-black text-primary">{rank}</span>
        </div>
        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_#000] -rotate-1 flex flex-col items-center">
           <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">Talkie Points</span>
           <span className="text-2xl font-black text-info">{points.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Action Path - Compacted */}
      <div className="w-full max-w-sm sm:max-w-xl mb-12 flex flex-col items-center gap-6">
        <Link href="/learn" className="block w-full group">
          <div className="relative bg-white border-4 sm:border-8 border-black p-6 sm:p-8 shadow-[8px_8px_0_#000] sm:shadow-[10px_10px_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all wobbly-slow cursor-pointer">
            <div className="flex flex-row items-center gap-4 sm:gap-6 justify-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center border-4 border-black shadow-[4px_4px_0_#000] group-hover:scale-110 transition-transform wobbly">
                <Play className="w-6 h-6 sm:w-10 sm:h-10 fill-white text-white translate-x-1" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl sm:text-4xl font-black text-black mb-0">학습 시작</h2>
                <p className="font-black text-[10px] sm:text-sm text-primary uppercase tracking-widest">Go to the Stage!</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Floating Sound Toggle - Smaller & Smarter */}
        <Button 
          onClick={() => {
            speak('The show is about to begin! Sound is now enabled.');
          }}
          className="h-12 px-6 bg-white text-black border-4 border-black shadow-[4px_4px_0_#000] font-black uppercase text-sm active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 wobbly shrink-0"
        >
          <Volume2 className="w-4 h-4" /> Sound OK?
        </Button>
      </div>

      {/* Grid Features */}
      <div className="w-full grid grid-cols-2 gap-4 max-w-xl">
        <FeatureCard
          href="/vocab"
          icon={<BookOpen className="w-6 h-6" />}
          title="Archive"
          color="bg-info"
          shadowColor="#1CB0F6"
        />
        <FeatureCard
          href="/speaking"
          icon={<Mic className="w-6 h-6" />}
          title="Speaking"
          color="bg-success"
          shadowColor="#58CC02"
        />
      </div>

      {/* Footer Info */}
      <div className="mt-16 text-muted-foreground/40 font-black tracking-widest text-[10px] uppercase">
        Playful english learning • v2.0
      </div>
    </div>
  );
}
