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
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-8">
        
        {/* Study Control Bar */}
        <div className="flex flex-col gap-6 mb-16 sticky top-20 z-20 bg-surface/80 backdrop-blur-md rounded-3xl border-2 border-border p-6 shadow-tactile border-b-secondary-shadow">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                <FilterChip label="전체" isActive={contentFilter === 'all'} onClick={() => setContentFilter('all')} />
                <FilterChip label="영화 🎬" isActive={contentFilter === 'movie'} onClick={() => setContentFilter('movie')} />
                <FilterChip label="드라마 📺" isActive={contentFilter === 'drama'} onClick={() => setContentFilter('drama')} />
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pt-1 border-t border-border/40">
                <FilterChip label="모든 난이도" isActive={difficultyFilter === 'all'} onClick={() => setDifficultyFilter('all')} />
                <FilterChip label="Easy" isActive={difficultyFilter === 'easy'} onClick={() => setDifficultyFilter('easy')} activeColor="bg-success" />
                <FilterChip label="Medium" isActive={difficultyFilter === 'medium'} onClick={() => setDifficultyFilter('medium')} activeColor="bg-warning" />
                <FilterChip label="Hard" isActive={difficultyFilter === 'hard'} onClick={() => setDifficultyFilter('hard')} activeColor="bg-error" />
              </div>
            </div>

            <Button
              variant={isQuizMode ? 'primary' : 'secondary'}
              onClick={() => setIsQuizMode(!isQuizMode)}
              className="w-full sm:w-auto px-8 h-12 rounded-2xl font-black text-sm"
            >
              <Lightbulb className={cn("w-5 h-5 mr-2", isQuizMode && "fill-current animate-pulse")} />
              퀴즈 모드 {isQuizMode ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        {/* Study Feed Layout */}
        <div className="max-w-2xl mx-auto flex flex-col space-y-12 pb-32">
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
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
              <div className="bg-muted rounded-3xl p-8 border-2 border-border shadow-inner">
                 <h4 className="font-black text-primary text-xs mb-2 uppercase tracking-widest">한국어 의미</h4>
                 <p className="text-3xl font-black text-foreground break-keep">{wordData.meaning}</p>
                 {wordData.level && (
                   <span className="inline-block mt-4 px-4 py-1.5 bg-white rounded-xl text-xs font-black text-primary border-2 border-primary-shadow/10">
                     LV: {wordData.level.toUpperCase()}
                   </span>
                 )}
              </div>
              
              {wordData.example && (
                <div className="bg-white rounded-3xl p-8 border-2 border-border shadow-sm">
                  <h4 className="font-black text-muted-foreground text-xs mb-2 uppercase tracking-widest">실전 예문</h4>
                  <p className="text-xl font-bold text-foreground italic leading-snug">"{wordData.example}"</p>
                  {wordData.exampleTranslation && (
                    <p className="text-muted-foreground font-bold text-lg mt-4 pt-4 border-t-2 border-dashed border-border">{wordData.exampleTranslation}</p>
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

function FilterChip({ label, isActive, onClick, activeColor }: { label: string, isActive: boolean, onClick: () => void, activeColor?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-full font-black text-sm transition-all whitespace-nowrap shrink-0 border-b-4 active:border-b-0 active:translate-y-1",
        isActive 
          ? cn(activeColor || 'bg-accent', activeColor ? 'text-white' : 'text-accent-foreground', 'border-black/20') 
          : 'bg-white dark:bg-muted text-muted-foreground border-border hover:bg-muted'
      )}
    >
      {label}
    </button>
  );
}
