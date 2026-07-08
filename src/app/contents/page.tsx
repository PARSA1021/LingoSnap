'use client';

import * as React from 'react';
import { grammarContents } from '@/data/contents';
import { ContentCard } from '@/components/contents/ContentCard';
import { useLearningStore } from '@/store/useLearningStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Search, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Zap,
  Coffee,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function ContentsPage() {
  const { contentFilter, setContentFilter, difficultyFilter, setDifficultyFilter } = useLearningStore();
  const [isQuizMode, setIsQuizMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredContents = React.useMemo(() => {
    return grammarContents.filter(c => {
      const categoryMatch = contentFilter === 'all' || c.category === contentFilter;
      const difficultyMatch = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
      const searchMatch = !searchQuery || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.explanation.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && difficultyMatch && searchMatch;
    });
  }, [contentFilter, difficultyFilter, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] pb-24 pt-6 md:pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-10">
        
        {/* ─── Header ───────────────────────────────────────────────── */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            <span className="font-bold text-xs md:text-sm uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Grammar Library
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--color-foreground)]">
            핵심 문법 도서관
          </h1>
          <p className="text-sm md:text-base text-[var(--color-muted-foreground)] max-w-xl px-4 font-medium">
            복잡한 문법도 쉽게, 핵심만 쏙쏙 뽑아 마스터해보세요!
          </p>
        </motion.header>

        {/* ─── Control Board ────────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--color-surface)] rounded-[32px] border border-[var(--color-border)] p-4 sm:p-5 md:p-6 shadow-sm flex flex-col lg:flex-row gap-5 md:gap-6 sticky top-4 sm:top-20 z-40"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 w-full">
            
            {/* Category / Filters */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest pl-2">카테고리</span>
              <div className="flex flex-wrap items-center gap-2">
                <FilterPill label="전체" isActive={contentFilter === 'all'} onClick={() => setContentFilter('all')} icon={<BookOpen className="w-4 h-4" />} />
                <FilterPill label="Daily Life" isActive={contentFilter === 'Daily Life'} onClick={() => setContentFilter('Daily Life')} icon={<Coffee className="w-4 h-4" />} />
                <FilterPill label="Tenses" isActive={contentFilter === 'Tenses'} onClick={() => setContentFilter('Tenses')} icon={<Zap className="w-4 h-4" />} />
                <FilterPill label="Conditionals" isActive={contentFilter === 'Conditionals'} onClick={() => setContentFilter('Conditionals')} icon={<GraduationCap className="w-4 h-4" />} />
                <FilterPill label="Phrasal Verbs" isActive={contentFilter === 'Phrasal Verbs'} onClick={() => setContentFilter('Phrasal Verbs')} icon={<MessageCircle className="w-4 h-4" />} />
              </div>
            </div>

            <div className="hidden lg:block w-px h-12 bg-[var(--color-border)] mx-2" />
            <div className="lg:hidden w-full h-px bg-[var(--color-border)]" />

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest pl-2">난이도</span>
              <div className="flex flex-wrap items-center gap-2">
                <FilterPill label="ALL" isActive={difficultyFilter === 'all'} onClick={() => setDifficultyFilter('all')} />
                <FilterPill label="EASY" isActive={difficultyFilter === 'easy'} onClick={() => setDifficultyFilter('easy')} />
                <FilterPill label="MEDIUM" isActive={difficultyFilter === 'medium'} onClick={() => setDifficultyFilter('medium')} />
                <FilterPill label="HARD" isActive={difficultyFilter === 'hard'} onClick={() => setDifficultyFilter('hard')} />
              </div>
            </div>

            {/* Actions */}
            <div className="w-full lg:w-auto flex flex-row gap-3 lg:ml-auto">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[var(--color-muted-foreground)]" />
                <input 
                  type="text" 
                  placeholder="검색..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 md:h-12 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full pl-9 md:pl-12 pr-4 text-sm md:text-base font-medium focus:border-[var(--color-primary)] focus:shadow-sm outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setIsQuizMode(!isQuizMode)}
                className={cn(
                  "h-10 md:h-12 px-4 rounded-full border font-bold text-[10px] md:text-xs sm:text-sm uppercase transition-all flex items-center justify-center gap-1.5 md:gap-2 whitespace-nowrap shrink-0 shadow-sm",
                  isQuizMode 
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md" 
                    : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                )}
              >
                <Lightbulb className={cn("w-4 h-4 md:w-5 md:h-5", isQuizMode && "fill-current")} />
                <span className="hidden sm:inline">퀴즈 모드</span>
              </button>
            </div>

          </div>
        </motion.div>

        {/* ─── Results Info ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between px-2">
          <p className="font-medium text-[var(--color-muted-foreground)] text-base">
            총 <span className="text-[var(--color-primary)] font-bold text-xl">{filteredContents.length}</span> 개의 학습 컨텐츠
          </p>
        </div>

        {/* ─── Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="h-full"
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
              <div className="w-24 h-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-sm flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-[var(--color-muted-foreground)]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">검색 결과가 없습니다!</h3>
              <p className="text-sm font-medium text-[var(--color-muted-foreground)]">다른 키워드나 조건으로 검색해보세요.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function FilterPill({ label, isActive, onClick, icon }: { label: string, isActive: boolean, onClick: () => void, icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 px-4 rounded-full border border-[var(--color-border)] font-bold text-[11px] md:text-xs transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm hover:shadow-md",
        isActive 
          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" 
          : "bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
