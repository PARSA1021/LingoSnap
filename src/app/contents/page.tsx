'use client';

import * as React from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { mediaContents } from '@/data/contents';
import { ContentCard } from '@/components/contents/ContentCard';
import { useLearningStore } from '@/store/useLearningStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { speak } from '@/lib/tts';

export default function ContentsPage() {
  const { contentFilter, setContentFilter, difficultyFilter, setDifficultyFilter } = useLearningStore();
  const [isQuizMode, setIsQuizMode] = React.useState(false);

  const filteredContents = React.useMemo(() => {
    return mediaContents.filter(c => {
      const categoryMatch = contentFilter === 'all' || c.category === contentFilter;
      const difficultyMatch = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
      return categoryMatch && difficultyMatch;
    });
  }, [contentFilter, difficultyFilter]);

  // Prefetch words for the first 5 cards to make lookups "instant"
  React.useEffect(() => {
    const prefetchTrigger = async () => {
      const wordsToPrefetch = filteredContents
        .slice(0, 5)
        .flatMap(c => c.line_en.split(/\s+/))
        .map(w => w.replace(/[^a-zA-Z0-9-']/g, ''))
        .filter(Boolean);
      
      const { prefetchWords } = await import('@/lib/dictionary');
      prefetchWords(wordsToPrefetch);
    };
    
    prefetchTrigger();
  }, [filteredContents]);



  return (
    <main className="min-h-screen flex flex-col bg-background pb-20 dot-pattern">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        
        {/* Study Control Bar - Premium Mobile Optimization */}
        <div className="flex flex-col gap-4 mb-8 sticky top-0 z-40 bg-background/80 backdrop-blur-md pt-4 pb-2 px-1">
          <div className="flex items-center justify-between gap-4">
             {/* Horizontal Scroller for Genres */}
             <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1 mask-fade-right">
                <FilterButton label="ALL" isActive={contentFilter === 'all'} onClick={() => setContentFilter('all')} />
                <FilterButton label="MOVIES" isActive={contentFilter === 'movie'} onClick={() => setContentFilter('movie')} />
                <FilterButton label="DRAMA" isActive={contentFilter === 'drama'} onClick={() => setContentFilter('drama')} />
                <div className="w-[2px] bg-black/10 mx-2 shrink-0" />
                <FilterButton label="BEGINNER" isActive={difficultyFilter === 'easy'} onClick={() => setDifficultyFilter('easy')} activeColor="bg-success shadow-[3px_3px_0_#000]" />
                <FilterButton label="PRO" isActive={difficultyFilter === 'hard'} onClick={() => setDifficultyFilter('hard')} activeColor="bg-primary shadow-[3px_3px_0_#000]" />
             </div>

             <button
               onClick={() => setIsQuizMode(!isQuizMode)}
               className={cn(
                 "shrink-0 h-10 px-4 border-4 border-black font-black text-xs uppercase transition-all shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none font-cartoon flex items-center gap-2",
                 isQuizMode ? "bg-warning text-black" : "bg-white text-black"
               )}
             >
               <Lightbulb className={cn("w-4 h-4", isQuizMode && "fill-current")} />
               {isQuizMode ? 'QUIZ ON' : 'QUIZ OFF'}
             </button>
          </div>
        </div>

        {/* Study Feed Layout - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="flex"
              >
                <ContentCard 
                  content={content} 
                  isQuizMode={isQuizMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </main>
  );
}

function FilterButton({ label, isActive, onClick, activeColor }: { label: string, isActive: boolean, onClick: () => void, activeColor?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 border-4 border-black font-black text-[10px] transition-all whitespace-nowrap shrink-0 uppercase font-cartoon",
        isActive 
          ? cn(activeColor || 'bg-primary text-white shadow-[3px_3px_0_#000]', '-translate-y-0.5') 
          : 'bg-white text-black/60 shadow-[2px_2px_0_#000]'
      )}
    >
      {label}
    </button>
  );
}
