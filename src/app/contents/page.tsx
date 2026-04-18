'use client';

import * as React from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { mediaContents } from '@/data/contents';
import { ContentCard } from '@/components/contents/ContentCard';
import { useLearningStore } from '@/store/useLearningStore';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { getNormalizedWordData, NormalizedWordData } from '@/lib/dictionary';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { speak } from '@/lib/tts';

export default function ContentsPage() {
  const { contentFilter, setContentFilter, difficultyFilter, setDifficultyFilter } = useLearningStore();
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [wordData, setWordData] = React.useState<NormalizedWordData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
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

  const handleWordClick = async (word: string) => {
    setSelectedWord(word.toLowerCase());
    setWordData(null);
    setIsLoading(true);
    try {
      const data = await getNormalizedWordData(word.toLowerCase());
      setWordData(data);
    } catch (error) {
      console.error(error);
      setWordData({
        id: 'error',
        word: word,
        meaning: '뜻을 불러오지 못했습니다.',
        example: '',
        exampleTranslation: '',
        phonetic: '',
        audioUrl: '',
        level: 'beginner',
        category: 'daily'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background pb-20 dot-pattern">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        
        {/* Study Control Bar - Compact */}
        <div className="flex flex-col gap-3 mb-6 sticky top-2 sm:top-6 z-20 bg-white border-2 sm:border-8 border-black p-3 sm:p-6 shadow-[4px_4px_0_#000] sm:shadow-[10px_10px_0_#000] wobbly-slow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-row gap-2 w-full sm:w-auto overflow-hidden">
              {/* Simplified Filters Table/Compact */}
              <div className="flex gap-2 p-1 bg-black/5 border-2 sm:border-4 border-black overflow-x-auto no-scrollbar pb-2 sm:pb-1 mask-fade-right">
                <FilterButton label="ALL" isActive={contentFilter === 'all'} onClick={() => setContentFilter('all')} />
                <FilterButton label="CINEMA" isActive={contentFilter === 'movie'} onClick={() => setContentFilter('movie')} />
                <FilterButton label="SERIES" isActive={contentFilter === 'drama'} onClick={() => setContentFilter('drama')} />
                <div className="w-[1px] sm:w-[2px] bg-black/20 mx-1 shrink-0" />
                <FilterButton label="EASY" isActive={difficultyFilter === 'easy'} onClick={() => setDifficultyFilter('easy')} activeColor="bg-success" />
                <FilterButton label="HARD" isActive={difficultyFilter === 'hard'} onClick={() => setDifficultyFilter('hard')} activeColor="bg-error" />
              </div>
            </div>

            <Button
              variant={isQuizMode ? 'primary' : 'secondary'}
              onClick={() => setIsQuizMode(!isQuizMode)}
              className="w-full sm:w-auto px-6 h-10 sm:h-14 border-4 sm:border-8 border-black shadow-[3px_3px_0_#000] sm:shadow-[6px_6px_0_#000] font-black font-cartoon text-sm sm:text-lg"
            >
              <Lightbulb className={cn("w-4 h-4 sm:w-6 sm:h-6 mr-2", isQuizMode && "fill-current")} />
              {isQuizMode ? 'QUIZ OFF' : 'QUIZ ON'}
            </Button>
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
                  onWordClick={handleWordClick}
                  isQuizMode={isQuizMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <BottomSheet 
        isOpen={!!selectedWord} 
        onClose={() => setSelectedWord(null)}
        title={selectedWord || ''}
      >
        <div className="min-h-[250px] flex flex-col pt-4">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary opacity-40" />
              <p className="font-black text-muted-foreground uppercase tracking-widest text-sm">Searching...</p>
            </div>
          ) : wordData ? (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col gap-6">
              <div className="bg-surface rounded-2xl p-8 border-4 border-border shadow-[6px_6px_0_#111]">
                 <h4 className="font-black text-foreground text-xs mb-2 uppercase tracking-widest border-b-2 border-border w-fit">한국어 의미</h4>
                 <p className="text-3xl font-black text-primary drop-shadow-[1px_1px_0_#111] break-keep">{wordData.meaning}</p>
                 {wordData.level && (
                   <span className="inline-block mt-4 px-4 py-1.5 bg-surface rounded-lg text-xs font-black text-foreground border-4 border-border shadow-[2px_2px_0_#111]">
                     LV: {wordData.level.toUpperCase()}
                   </span>
                 )}
              </div>
              
              {wordData.example && (
                <div className="bg-surface rounded-2xl p-8 border-4 border-border shadow-[6px_6px_0_#111]">
                  <h4 className="font-black text-foreground/60 text-xs mb-2 uppercase tracking-widest border-b-2 border-border/40 w-fit">실전 예문</h4>
                  <p className="text-xl font-bold text-foreground italic leading-snug">&quot;{wordData.example}&quot;</p>
                  {wordData.exampleTranslation && (
                    <p className="text-foreground/80 font-bold text-lg mt-4 pt-4 border-t-4 border-dashed border-border">{wordData.exampleTranslation}</p>
                  )}
                </div>
              )}
            </motion.div>
          ) : null}
        </div>
      </BottomSheet>
    </main>
  );
}

function FilterButton({ label, isActive, onClick, activeColor }: { label: string, isActive: boolean, onClick: () => void, activeColor?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 font-black text-sm transition-all whitespace-nowrap shrink-0 uppercase font-cartoon",
        isActive 
          ? cn(activeColor || 'bg-primary', 'text-white border-2 border-black shadow-[2px_2px_0_0_#000] -translate-y-1') 
          : 'text-black/60 hover:text-black'
      )}
    >
      {label}
    </button>
  );
}
