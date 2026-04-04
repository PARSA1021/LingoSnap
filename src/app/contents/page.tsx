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

export default function ContentsPage() {
  const { contentFilter, setContentFilter } = useLearningStore();
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [wordData, setWordData] = React.useState<NormalizedWordData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isQuizMode, setIsQuizMode] = React.useState(false);

  const filteredContents = React.useMemo(() => {
    if (contentFilter === 'all') return mediaContents;
    return mediaContents.filter(c => c.category === contentFilter);
  }, [contentFilter]);

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
        
        {/* Tactile Control Bar */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12 sticky top-20 z-20 bg-surface border-b-4 border-border -mx-4 px-6 sm:-mx-8 sm:px-10 py-6 items-center justify-between shadow-sm">
          <div className="flex gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            <FilterChip label="전체" isActive={contentFilter === 'all'} onClick={() => setContentFilter('all')} />
            <FilterChip label="영화 🎬" isActive={contentFilter === 'movie'} onClick={() => setContentFilter('movie')} />
            <FilterChip label="드라마 📺" isActive={contentFilter === 'drama'} onClick={() => setContentFilter('drama')} />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsQuizMode(!isQuizMode)}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-sm transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
              isQuizMode 
                ? 'bg-primary text-white border-primary/30' 
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            <Lightbulb className={`w-5 h-5 ${isQuizMode ? 'fill-current animate-pulse' : ''}`} />
            퀴즈 모드 {isQuizMode ? 'ON' : 'OFF'}
          </motion.button>
        </div>

        {/* Tactile Feed */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
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
        </motion.div>
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div className="bg-muted rounded-3xl p-8 border-2 border-border shadow-inner">
                 <h4 className="font-black text-primary text-xs mb-2 uppercase tracking-widest">한국어 의미</h4>
                 <p className="text-3xl font-black text-foreground break-keep">{wordData.meaning}</p>
                 {wordData.level && (
                   <span className="inline-block mt-4 px-4 py-1.5 bg-white rounded-xl text-xs font-black text-primary border-2 border-primary/10">
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

function FilterChip({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full font-black text-sm transition-all whitespace-nowrap shrink-0 border-b-4 active:border-b-0 active:translate-y-1 ${
        isActive 
          ? 'bg-accent text-accent-foreground border-accent-foreground/30 shadow-tactile' 
          : 'bg-white text-muted-foreground border-border hover:bg-muted'
      }`}
    >
      {label}
    </button>
  );
}
