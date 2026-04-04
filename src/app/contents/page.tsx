'use client';

import * as React from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { mediaContents } from '@/data/contents';
import { ContentCard } from '@/components/contents/ContentCard';
import { useLearningStore } from '@/store/useLearningStore';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { getNormalizedWordData, NormalizedWordData } from '@/lib/dictionary';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function ContentsPage() {
  const { contentFilter, setContentFilter } = useLearningStore();
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [wordData, setWordData] = React.useState<NormalizedWordData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

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
        meaning: '뜻을 불러오지 못했습니다. 네트워크 상태를 확인하세요.',
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
    <main className="min-h-screen flex flex-col bg-slate-50 overscroll-y-auto pb-[calc(env(safe-area-inset-bottom)+6rem)]">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Inline Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-none sticky top-20 z-20 bg-slate-50/80 backdrop-blur-xl -mx-4 px-4 sm:-mx-6 sm:px-6 py-2">
          <FilterChip 
            label="전체보기" 
            isActive={contentFilter === 'all'} 
            onClick={() => setContentFilter('all')} 
          />
          <FilterChip 
            label="영화 🎬" 
            isActive={contentFilter === 'movie'} 
            onClick={() => setContentFilter('movie')} 
          />
          <FilterChip 
            label="드라마 📺" 
            isActive={contentFilter === 'drama'} 
            onClick={() => setContentFilter('drama')} 
          />
        </div>

        {/* Responsive Grid Feed */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', bounce: 0.3 }}
                className="h-full"
              >
                <ContentCard 
                  content={content} 
                  onWordClick={handleWordClick} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredContents.length === 0 && (
          <div className="w-full py-24 flex justify-center">
            <span className="text-slate-400 font-bold">콘텐츠가 없습니다.</span>
          </div>
        )}
      </div>

      <BottomSheet 
        isOpen={!!selectedWord} 
        onClose={() => setSelectedWord(null)}
        title={selectedWord || ''}
      >
        <div className="min-h-[200px] flex flex-col pt-2">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="font-medium animate-pulse">실시간 번역 및 사전 검색 중...</p>
            </div>
          ) : wordData ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                 <h4 className="font-bold text-blue-400 text-xs mb-2 uppercase tracking-wide">한국어 의미</h4>
                 <p className="text-2xl font-extrabold text-slate-800 break-words">{wordData.meaning}</p>
                 {wordData.level && (
                   <span className="inline-block mt-3 px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-400 shadow-sm border border-slate-100">
                     Level: {wordData.level.toUpperCase()}
                   </span>
                 )}
              </div>
              
              {wordData.example && (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h4 className="font-bold text-slate-400 text-xs mb-2 uppercase tracking-wide">사전 예문</h4>
                  <p className="text-lg font-medium text-slate-700 italic leading-snug">"{wordData.example}"</p>
                  {wordData.exampleTranslation && (
                    <p className="text-slate-500 font-medium mt-3 border-t border-slate-200/60 pt-3">{wordData.exampleTranslation}</p>
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
      className={`px-5 py-2.5 rounded-full font-extrabold text-[13px] sm:text-sm transition-all duration-300 focus:outline-none touch-manipulation whitespace-nowrap shrink-0 ${
        isActive 
          ? 'bg-slate-800 text-white shadow-lg shadow-slate-200 ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-50 scale-100' 
          : 'bg-white text-slate-500 border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 relative top-[2px]'
      }`}
    >
      {label}
    </button>
  );
}
