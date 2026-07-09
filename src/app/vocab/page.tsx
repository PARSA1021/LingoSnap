'use client';

import * as React from 'react';
import { vocabulary } from '@/data/contents';
import { VocabCard } from '@/components/vocab/VocabCard';
import { useLearningStore } from '@/store/useLearningStore';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  ShoppingBag, 
  Plane, 
  GraduationCap, 
  Zap, 
  MessageSquare, 
  Hash, 
  Check 
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function VocabPage() {
  const { contentFilter: vocabFilter, setContentFilter: setVocabFilter, difficultyFilter, setDifficultyFilter } = useLearningStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredVocab = React.useMemo(() => {
    const safeVocabFilter = vocabFilter || 'all';
    return vocabulary.filter(v => {
      const categoryMatch = safeVocabFilter === 'all' || (() => {
        const cat = v.category?.toLowerCase() || '';
        const targetId = safeVocabFilter.toLowerCase();
        if (targetId === 'everyday') return cat.includes('일상') || cat.includes('everyday');
        if (targetId === 'business') return cat.includes('비즈니스') || cat.includes('business');
        if (targetId === 'travel') return cat.includes('여행') || cat.includes('travel');
        if (targetId === 'academic') return cat.includes('학술') || cat.includes('academic');
        if (targetId === 'slang') return cat.includes('캐주얼') || cat.includes('casual') || cat.includes('slang');
        if (targetId === 'idioms') return cat.includes('숙어') || cat.includes('idiom');
        return cat.includes(targetId);
      })();
      const difficultyMatch = difficultyFilter === 'all' || v.difficulty === difficultyFilter;
      const searchMatch = !searchQuery || 
        v.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.meaning.includes(searchQuery);
      return categoryMatch && difficultyMatch && searchMatch;
    });
  }, [vocabFilter, difficultyFilter, searchQuery]);

  const categories = [
    { id: 'all', label: '전체', icon: BookOpen },
    { id: 'everyday', label: '일상', icon: Zap },
    { id: 'business', label: '비즈니스', icon: ShoppingBag },
    { id: 'travel', label: '여행', icon: Plane },
    { id: 'academic', label: '학술', icon: GraduationCap },
    { id: 'slang', label: '캐주얼', icon: MessageSquare },
    { id: 'idioms', label: '숙어', icon: Hash }
  ];

  const difficulties = [
    { id: 'all' as const, label: '전체' },
    { id: 'easy' as const, label: '초급' },
    { id: 'medium' as const, label: '중급' },
    { id: 'hard' as const, label: '고급' }
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] pb-32 pt-6 sm:pt-8 md:pt-10 lg:pt-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-10">
        
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            <span className="font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Vocabulary Book
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-foreground)]">
            나만의 단어장
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-[var(--color-muted-foreground)] max-w-md md:max-w-xl lg:max-w-2xl px-2 font-medium">
            상황별, 난이도별로 단어를 찾고, 예문으로 완벽히 이해하세요!
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative max-w-3xl mx-auto w-full">
          <Search className="absolute left-3 md:left-4 lg:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[var(--color-muted-foreground)]" />
          <input 
            type="text" 
            placeholder="단어나 뜻으로 검색하세요..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 sm:h-14 md:h-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl sm:rounded-3xl pl-10 sm:pl-12 md:pl-14 lg:pl-16 pr-3 sm:pr-4 md:pr-5 text-sm md:text-base lg:text-lg font-medium focus:border-[var(--color-primary)] focus:shadow-md outline-none transition-all placeholder:text-[var(--color-muted-foreground)]"
          />
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          {/* Category Filters */}
          <div className="space-y-3">
            <span className="text-[10px] sm:text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest pl-1">
              카테고리
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 md:gap-3.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = vocabFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setVocabFilter(cat.id)}
                    className={cn(
                      "h-16 sm:h-18 md:h-20 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md",
                      isActive
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg"
                        : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                    )}
                  >
                    <Icon className={cn("w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6", isActive ? "fill-current" : "text-[var(--color-foreground)]")} />
                    <span className="text-[11px] sm:text-xs md:text-sm font-bold">{cat.label}</span>
                    {isActive && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filters */}
          <div className="space-y-3">
            <span className="text-[10px] sm:text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest pl-1">
              난이도
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5">
              {difficulties.map((diff) => {
                const isActive = difficultyFilter === diff.id;
                return (
                  <button
                    key={diff.id}
                    onClick={() => setDifficultyFilter(diff.id)}
                    className={cn(
                      "h-8.5 sm:h-9 md:h-10 px-3.5 sm:px-4 md:px-5 rounded-full border font-bold text-[11px] sm:text-xs md:text-sm transition-all duration-200",
                      isActive
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)] border-[var(--color-foreground)]"
                        : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    )}
                  >
                    {diff.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm sm:text-base font-medium text-[var(--color-muted-foreground)]">
            총 <span className="text-[var(--color-primary)] font-bold text-lg sm:text-xl">{filteredVocab.length}</span> 개의 단어
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs sm:text-sm font-bold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              검색어 지우기
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {filteredVocab.map((word) => (
            <div key={word.id} className="h-full">
              <VocabCard word={word} />
            </div>
          ))}
          
          {filteredVocab.length === 0 && (
            <div className="col-span-full py-16 sm:py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full shadow-sm flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                <Search className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-[var(--color-muted-foreground)]" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2 text-[var(--color-foreground)]">
                검색 결과가 없습니다!
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-[var(--color-muted-foreground)]">
                다른 키워드나 조건으로 검색해보세요.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
