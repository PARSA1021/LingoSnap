'use client';

import * as React from 'react';
import { Shuffle, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { VocabCard } from './VocabCard';
import { cn } from '@/lib/utils/cn';
import { toWord, type ProcessedVocabItem } from '@/lib/vocab';

interface VocabStudyModeProps {
  words: ProcessedVocabItem[];
  emptyMessage?: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function VocabStudyMode({ words, emptyMessage = '공부할 단어가 없습니다.' }: VocabStudyModeProps) {
  const [deck, setDeck] = React.useState<ProcessedVocabItem[]>(() => words);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setDeck(words);
    setIndex(0);
  }, [words]);

  const current = deck[index];
  const progress = deck.length > 0 ? ((index + 1) / deck.length) * 100 : 0;

  const goNext = () => setIndex((i) => Math.min(i + 1, deck.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleShuffle = () => {
    setDeck(shuffleArray(deck));
    setIndex(0);
  };

  const handleReset = () => {
    setDeck(words);
    setIndex(0);
  };

  if (words.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center text-center px-4">
        <p className="text-[var(--color-muted-foreground)] font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-lg mx-auto w-full">
      {/* Progress */}
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-sm font-bold text-[var(--color-muted-foreground)]">
          {index + 1} / {deck.length}
        </span>
        <div className="flex-1 h-2 bg-[var(--color-muted)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleShuffle}
            aria-label="섞기"
            className="p-2 rounded-full text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors touch-manipulation"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="처음부터"
            className="p-2 rounded-full text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors touch-manipulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card */}
      {current && (
        <VocabCard
          key={current.word}
          word={toWord(current)}
          onNext={index < deck.length - 1 ? goNext : undefined}
          onPrev={index > 0 ? goPrev : undefined}
          showPrev={index > 0}
        />
      )}

      {/* Mobile nav */}
      <div className="flex gap-3 sm:hidden">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className={cn(
            'flex-1 h-12 rounded-2xl border border-[var(--color-border)] font-bold text-sm flex items-center justify-center gap-1 touch-manipulation',
            index === 0 ? 'opacity-40' : 'bg-[var(--color-surface)] active:scale-[0.98]'
          )}
        >
          <ChevronLeft className="w-5 h-5" /> 이전
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={index >= deck.length - 1}
          className={cn(
            'flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-1 touch-manipulation',
            index >= deck.length - 1
              ? 'opacity-40 bg-[var(--color-muted)]'
              : 'bg-[var(--color-primary)] text-white active:scale-[0.98]'
          )}
        >
          다음 <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
