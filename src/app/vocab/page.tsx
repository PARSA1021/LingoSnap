'use client';

import * as React from 'react';
import { VocabCard } from '@/components/vocab/VocabCard';
import { Sparkles, Star, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  examples?: Example[];
};

export default function VocabPage() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'favorites'>('all');
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

  const displayedWords = activeTab === 'all' ? processedCards : favoriteWords;

  return (
    <div className="flex-1 w-full min-h-screen bg-[var(--color-background)] pb-24 pt-6 sm:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">

        {/* Header */}
        <header className="flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            <span className="font-bold text-xs md:text-sm uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Vocabulary
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--color-foreground)]">
            나만의 단어장
          </h1>
          <p className="text-sm md:text-base text-[var(--color-muted-foreground)] max-w-xl font-medium">
            새로운 표현들을 배우고 즐겨찾기에 추가해 반복 학습하세요.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mt-4">
          <div className="bg-[var(--color-surface)] p-1.5 rounded-full border border-[var(--color-border)] shadow-sm flex gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2",
                activeTab === 'all'
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
            >
              <BookOpen className="w-4 h-4" />
              전체 단어
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={cn(
                "px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2",
                activeTab === 'favorites'
                  ? "bg-[var(--color-warning)] text-white shadow-md"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
            >
              <Star className="w-4 h-4" />
              즐겨찾기
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-4">
          {displayedWords.length === 0 ? (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[var(--color-surface)] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[var(--color-border)]">
                <Star className="w-10 h-10 text-[var(--color-muted-foreground)]/30" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">단어가 없습니다</h3>
              <p className="text-[var(--color-muted-foreground)]">아직 저장된 단어가 없네요. 더 많은 레슨을 들어보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {displayedWords.map((w, idx) => (
                  <motion.div
                    key={w.word}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05, type: 'spring' }}
                  >
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}