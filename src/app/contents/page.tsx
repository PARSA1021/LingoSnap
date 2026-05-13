'use client';

import * as React from 'react';
import { mediaContents } from '@/data/contents';
import { ContentCard } from '@/components/contents/ContentCard';
import { useLearningStore } from '@/store/useLearningStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Search, 
  Tv, 
  Sparkles,
  Clapperboard,
  Film
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function ContentsPage() {
  const { contentFilter, setContentFilter, difficultyFilter, setDifficultyFilter } = useLearningStore();
  const [isQuizMode, setIsQuizMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredContents = React.useMemo(() => {
    return mediaContents.filter(c => {
      const categoryMatch = contentFilter === 'all' || c.category === contentFilter;
      const difficultyMatch = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
      const searchMatch = !searchQuery || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.line_en.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && difficultyMatch && searchMatch;
    });
  }, [contentFilter, difficultyFilter, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-500/5 via-white to-violet-500/10 pb-32 pt-20 md:pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
        
        {/* ─── Playful Header ───────────────────────────────────────── */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div className="inline-flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-full shadow-[2px_2px_0_#000]">
            <Sparkles className="w-4 h-4 text-warning fill-warning" />
            <span className="font-black text-xs md:text-sm uppercase tracking-wide">Video Library</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black uppercase leading-none tracking-tight">
            영상 학습<br className="sm:hidden" /> 라이브러리
          </h1>
          <p className="text-sm md:text-lg font-bold text-black/60 max-w-xl">
            명작 영화와 드라마의 생생한 표현들을 게임처럼 재밌게 배워보세요!
          </p>
        </motion.header>

        {/* ─── Control Board ────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0_#000] flex flex-col xl:flex-row gap-6 sticky top-20 z-40"
        >
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-6 w-full">
            
            {/* Category / Filters */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2">분류</span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                 <FilterPill label="전체" isActive={contentFilter === 'all'} onClick={() => setContentFilter('all')} icon={<Clapperboard className="w-4 h-4" />} color="bg-primary" />
                 <FilterPill label="영화" isActive={contentFilter === 'movie'} onClick={() => setContentFilter('movie')} icon={<Film className="w-4 h-4" />} color="bg-info" />
              </div>
            </div>

            <div className="hidden xl:block w-1 h-12 bg-black/10 rounded-full mx-4" />

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2">난이도</span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                 <FilterPill label="ALL" isActive={difficultyFilter === 'all'} onClick={() => setDifficultyFilter('all')} color="bg-black text-white" />
                 <FilterPill label="EASY" isActive={difficultyFilter === 'easy'} onClick={() => setDifficultyFilter('easy')} color="bg-success" />
                 <FilterPill label="MEDIUM" isActive={difficultyFilter === 'medium'} onClick={() => setDifficultyFilter('medium')} color="bg-warning" />
                 <FilterPill label="HARD" isActive={difficultyFilter === 'hard'} onClick={() => setDifficultyFilter('hard')} color="bg-error" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex-1 flex gap-3 sm:ml-auto">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
                 <input 
                   type="text" 
                   placeholder="검색..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full h-12 bg-gray-100 border-2 border-black rounded-xl pl-12 pr-4 font-bold focus:bg-white focus:shadow-[4px_4px_0_#000] focus:outline-none transition-all"
                 />
              </div>
              <button
                onClick={() => setIsQuizMode(!isQuizMode)}
                className={cn(
                  "h-12 px-4 rounded-xl border-2 border-black font-black text-xs sm:text-sm uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap",
                  isQuizMode 
                    ? "bg-warning text-black shadow-none translate-y-[2px]" 
                    : "bg-white text-black shadow-[4px_4px_0_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#000]"
                )}
              >
                <Lightbulb className={cn("w-5 h-5", isQuizMode && "fill-current")} />
                <span className="hidden sm:inline">퀴즈 모드</span>
              </button>
            </div>

          </div>
        </motion.div>

        {/* ─── Results Info ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between px-2">
           <p className="font-bold text-black/60 text-lg">
             <span className="text-black font-black text-2xl">{filteredContents.length}</span> 개의 콘텐츠
           </p>
        </div>

        {/* ─── Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <ContentCard 
                  content={content} 
                  isQuizMode={isQuizMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredContents.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0_#000] flex items-center justify-center mb-6 rotate-3">
                <Search className="w-10 h-10 text-black/20" />
              </div>
              <h3 className="text-2xl font-black mb-2">검색 결과가 없어요!</h3>
              <p className="font-bold text-black/50">다른 키워드나 조건으로 검색해보세요.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function FilterPill({ label, isActive, onClick, color, icon }: { label: string, isActive: boolean, onClick: () => void, color?: string, icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-10 px-4 rounded-xl border-2 border-black font-black text-xs transition-all whitespace-nowrap flex items-center gap-2",
        isActive 
          ? cn(color, 'text-white shadow-none translate-y-[2px]') 
          : 'bg-white text-black/60 hover:text-black hover:bg-gray-50 shadow-[2px_2px_0_#000]'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
