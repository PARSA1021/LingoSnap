'use client';

import * as React from 'react';
import { Volume2, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useLearningStore } from '@/store/useLearningStore';
import { cn } from '@/lib/utils/cn';
import { formatWord, formatSentence } from '@/lib/utils/format';
import type { ProcessedVocabItem } from '@/lib/vocab';

interface VocabListItemProps {
  item: ProcessedVocabItem;
  isFavorite: boolean;
  highlight?: string;
  defaultExpanded?: boolean;
}

export const VocabListItem = React.memo(function VocabListItem({
  item,
  isFavorite,
  highlight,
  defaultExpanded = false,
}: VocabListItemProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const { speak, isPlaying, isLoading } = useTTS();
  const toggleFavorite = useLearningStore((s) => s.toggleFavorite);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.word);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <article
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden transition-shadow',
        expanded && 'shadow-[var(--shadow-soft)]'
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-3.5 sm:p-4 text-left touch-manipulation"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-foreground)] truncate">
              {formatWord(item.word)}
            </h3>
            {item.category && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] shrink-0">
                {item.category}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-muted-foreground)] truncate mt-0.5">
            {item.meaning}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleSpeak}
            disabled={isLoading}
            aria-label="발음 듣기"
            className={cn(
              'p-2 rounded-full transition-colors touch-manipulation',
              isPlaying
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]',
              isLoading && 'opacity-50'
            )}
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleFavorite}
            aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            className={cn(
              'p-2 rounded-full transition-colors touch-manipulation',
              isFavorite
                ? 'text-[var(--color-warning)] bg-[var(--color-warning)]/10'
                : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]'
            )}
          >
            <Star className={cn('w-4 h-4', isFavorite && 'fill-current')} />
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[var(--color-muted-foreground)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-2 border-t border-[var(--color-border)]/60">
          <p className="text-base font-semibold text-[var(--color-primary)] pt-3">{item.meaning}</p>
          {(item.examples?.length ? item.examples : [{ text: item.example, translation: item.exampleTranslation }])
            .filter((ex) => ex.text)
            .slice(0, 2)
            .map((ex, idx) => (
              <div key={idx} className="bg-[var(--color-muted)]/60 rounded-xl p-3">
                <p className="text-sm font-medium text-[var(--color-foreground)]">
                  &quot;{formatSentence(ex.text)}&quot;
                </p>
                {ex.translation && (
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1">{ex.translation}</p>
                )}
              </div>
            ))}
        </div>
      )}
    </article>
  );
});
