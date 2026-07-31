'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Volume2, ArrowRight, ArrowLeft, Star, Turtle } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useLearningStore } from '@/store/useLearningStore';
import { cn } from '@/lib/utils/cn';
import { formatWord, formatSentence } from '@/lib/utils/format';
import { getPhonetic } from '@/lib/vocab';
import type { Word } from '@/types';

type Example = { text: string; translation?: string };
type WordWithExamples = Word & { phonetic?: string; examples?: Example[] };

interface VocabCardProps {
  word: WordWithExamples;
  onNext?: () => void;
  onPrev?: () => void;
  showPrev?: boolean;
  highlight?: string;
}

const HighlightText = ({ text, query }: { text: string; query?: string }) => {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-[var(--color-warning)]/20 text-[var(--color-warning)] px-0.5 rounded-sm font-bold">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export function VocabCard({ word, onNext, onPrev, showPrev, highlight }: VocabCardProps) {
  const [showMeaning, setShowMeaning] = React.useState(true);
  const { speak, speakSlow, isPlaying, isLoading } = useTTS();

  const toggleFavorite = useLearningStore((state) => state.toggleFavorite);
  const favorites = useLearningStore((state) => state.favorites);

  React.useEffect(() => {
    setShowMeaning(true);
  }, [word.word]);

  const isFavorite = favorites.some((w) => w.word === word.word);
  const phoneticText = word.phonetic || getPhonetic(word.word);

  return (
    <Card className="w-full max-w-lg mx-auto mb-6 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-lg transition-all duration-300 relative overflow-hidden rounded-3xl">
      {/* Favorite Button */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => toggleFavorite(word)}
          title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          className={cn(
            "p-2.5 rounded-full transition-all active:scale-95 border",
            isFavorite
              ? 'bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-[var(--color-warning)]/30'
              : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-transparent hover:text-[var(--color-foreground)]'
          )}
        >
          <Star className={cn("w-5 h-5", isFavorite && 'fill-current')} />
        </button>
      </div>

      <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
        {/* Word Stage & Pronunciation */}
        <div className="w-full pt-4 min-h-[120px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-foreground)] tracking-tight">
              <HighlightText text={formatWord(word.word)} query={highlight} />
            </h2>

            {/* IPA Phonetic representation */}
            <span className="text-xs sm:text-sm font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 font-bold">
              {phoneticText}
            </span>

            {/* Audio controls (Normal & Slow) */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => speak(word.word)}
                disabled={isLoading}
                title="일반 발음 듣기"
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 bg-[var(--color-primary)] text-white shadow-sm",
                  isPlaying && "animate-pulse"
                )}
              >
                <Volume2 className="h-4 w-4" />
                <span>일반</span>
              </button>

              <button
                onClick={() => speakSlow(word.word)}
                disabled={isLoading}
                title="느린 발음 듣기 (0.75x)"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] shadow-sm"
              >
                <Turtle className="h-4 w-4 text-emerald-600" />
                <span>느리게</span>
              </button>
            </div>
          </div>
        </div>

        {/* Meaning Area */}
        <div className="w-full min-h-[100px]">
          {!showMeaning ? (
            <button
              onClick={() => setShowMeaning(true)}
              className="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl shadow-sm hover:shadow-md active:translate-y-0.5 transition-all"
            >
              뜻 확인하기
            </button>
          ) : (
            <div className="text-left space-y-4">
              <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/15 p-4 rounded-2xl flex justify-center text-center">
                <p className="text-xl sm:text-2xl font-bold text-[var(--color-primary)] tracking-tight">
                  <HighlightText text={word.meaning} query={highlight} />
                </p>
              </div>

              {/* Examples */}
              <div className="space-y-3">
                {word.examples &&
                  word.examples.slice(0, 2).map((ex, idx) => (
                    <div key={idx} className="bg-[var(--color-muted)] p-3.5 sm:p-4 rounded-2xl border border-[var(--color-border)]/50">
                      <p className="font-semibold text-sm sm:text-base text-[var(--color-foreground)] leading-relaxed">
                        &quot;<HighlightText text={formatSentence(ex.text)} query={highlight} />&quot;
                      </p>
                      {ex.translation && (
                        <p className="text-[var(--color-muted-foreground)] font-medium mt-1 text-xs sm:text-sm">
                          {ex.translation}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Nav Controls */}
        {(onNext || showPrev) && (
          <div className="w-full flex gap-3 pt-2">
            {showPrev && (
              <button
                onClick={onPrev}
                className="flex-1 h-12 sm:h-14 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] rounded-2xl font-bold text-sm shadow-sm hover:bg-[var(--color-muted)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" /> 이전
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                disabled={!showMeaning}
                className="flex-[2] h-12 sm:h-14 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
              >
                다음 <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
