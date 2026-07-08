'use client';

import * as React from 'react';
import { VocabCard } from '@/components/vocab/VocabCard';
import { Sparkles, Star, BookOpen, Filter, Layers } from 'lucide-react';
import { useLearningStore } from '@/store/useLearningStore';
import vocabData from '@/data/vocabulary.json';
import { cn } from '@/lib/utils/cn';

type Example = { text: string; translation?: string };
type VocabItem = {
  word: string;
  meaning: string;
  example: string;
  exampleTranslation?: string;
  category?: string;
  level?: string;
  examples?: Example[];
};

// 카테고리 목록 추출
const CATEGORIES = ['전체', '일상', '비즈니스', '여행', '학술', '캐주얼', '숙어', 'sns', '기타'];
const LEVELS = ['전체', 'beginner', 'intermediate', 'advanced'];

export default function VocabPage() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'favorites'>('all');
  const [selectedCategory, setSelectedCategory] = React.useState('전체');
  const [selectedLevel, setSelectedLevel] = React.useState('전체');
  const favorites = useLearningStore(state => state.favorites);

  const processedCards = React.useMemo(() => {
    const map = new Map<string, VocabItem>();
    (vocabData as unknown as Array<Partial<VocabItem> & { word: string; meaning: string }>).forEach((item) => {
      const key = item.word.toLowerCase().trim();
      const existing = map.get(key);
      const currentExamples: Example[] = (item.examples || [
        { text: item.example || '', translation: item.exampleTranslation },
      ]).filter((ex): ex is Example => typeof ex.text === 'string' && ex.text.length > 0);

      if (existing) {
        currentExamples.forEach((ex) => {
          if (ex.text && !(existing.examples || []).some((e) => e.text === ex.text)) {
            existing.examples = existing.examples || [];
            existing.examples.push(ex);
          }
        });
      } else {
        map.set(key, {
          ...item,
          example: item.example || '',
          category: item.category || '기타',
          level: item.level || 'beginner',
          examples: currentExamples
        });
      }
    });
    return Array.from(map.values());
  }, []);

  const favoriteWords = React.useMemo(() => {
    if (favorites.length === 0) return [];
    return processedCards.filter(w =>
      favorites.some(fav => fav.word.toLowerCase() === w.word.toLowerCase())
    );
  }, [favorites, processedCards]);

  // 필터링 적용
  const filteredWords = React.useMemo(() => {
    const baseWords = activeTab === 'all' ? processedCards : favoriteWords;
    return baseWords.filter(w => {
      const categoryMatch = selectedCategory === '전체' || w.category === selectedCategory;
      const levelMatch = selectedLevel === '전체' || w.level === selectedLevel;
      return categoryMatch && levelMatch;
    });
  }, [activeTab, processedCards, favoriteWords, selectedCategory, selectedLevel]);

  return (
    <div className="flex-1 w-full min-h-screen bg-[var(--color-background)] pb-20 sm:pb-24 pt-6 sm:pt-8 md:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6 sm:gap-8">

        {/* Header */}
        <header className="flex flex-col items-center text-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-3.5 sm:px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            <span className="font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Vocabulary
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-foreground)] leading-tight">
            나만의 단어장
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-[var(--color-muted-foreground)] max-w-md md:max-w-xl font-medium px-2">
            새로운 표현들을 배우고 즐겨찾기에 추가해 반복 학습하세요.
          </p>
        </header>

        {/* Tabs - All/Favorites */}
        <div className="flex justify-center mt-2 sm:mt-4">
          <div className="bg-[var(--color-surface)] p-1 sm:p-1.5 rounded-full border border-[var(--color-border)] shadow-sm flex gap-1 w-full max-w-xs sm:w-auto sm:max-w-none">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap",
                activeTab === 'all'
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              전체 단어
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={cn(
                "flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap",
                activeTab === 'favorites'
                  ? "bg-[var(--color-warning)] text-white shadow-md"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
            >
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              즐겨찾기
            </button>
          </div>
        </div>

        {/* Filter Tabs - Category & Level */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-3 sm:p-4 shadow-sm">
          {/* Category Tabs */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200",
                    selectedCategory === cat
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Tabs */}
          <div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={cn(
                    "px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200",
                    selectedLevel === level
                      ? "bg-[var(--color-secondary)] text-white shadow-sm"
                      : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"
                  )}
                >
                  {level === 'beginner' ? '초급' : level === 'intermediate' ? '중급' : level === 'advanced' ? '고급' : level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between px-2">
          <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
            총 <span className="text-[var(--color-foreground)] font-bold">{filteredWords.length}</span>개
          </p>
        </div>

        {/* Results Grid */}
        <div className="mt-2 sm:mt-4">
          {filteredWords.length === 0 ? (
            <div className="py-16 sm:py-20 flex flex-col items-center text-center px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[var(--color-surface)] rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-sm border border-[var(--color-border)]">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-muted-foreground)]/30" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-foreground)] mb-2">단어가 없습니다</h3>
              <p className="text-sm sm:text-base text-[var(--color-muted-foreground)]">
                {activeTab === 'favorites' 
                  ? '아직 즐겨찾기에 추가한 단어가 없네요!'
                  : '선택한 필터에 맞는 단어가 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredWords.map((w) => (
                <div key={w.word}>
                  <VocabCard
                    word={{
                      id: w.word,
                      word: w.word,
                      meaning: w.meaning,
                      example: w.example,
                      exampleTranslation: w.exampleTranslation,
                      ...(w.examples ? { examples: w.examples } : {}),
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}