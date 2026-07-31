'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Volume2, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { speak } from '@/lib/tts';
import { cn } from '@/lib/utils/cn';
import { formatWord, formatSentence } from '@/lib/utils/format';
import type { Word } from '@/types';
import { useLearningStore } from '@/store/useLearningStore';

interface WordRevealStepProps {
    word: Word;
    onNext: () => void;
    isReview?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
    '일상': 'bg-blue-500/15 text-blue-600 border-blue-500/30',
    '캐주얼': 'bg-purple-500/15 text-purple-600 border-purple-500/30',
    '비즈니스': 'bg-amber-500/15 text-amber-600 border-amber-500/30',
    '여행': 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    '숙어': 'bg-rose-500/15 text-rose-600 border-rose-500/30',
};

export function WordRevealStep({ word, onNext, isReview = false }: WordRevealStepProps) {
    const [revealed, setRevealed] = React.useState(false);
    const w = word as Word & { category?: string; level?: string };
    const catColor = CATEGORY_COLORS[w.category ?? ''] ?? 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]';

    const favorites = useLearningStore(state => state.favorites);
    const toggleFavorite = useLearningStore(state => state.toggleFavorite);
    const isFavorite = favorites.some(f => f.word === word.word);

    const reveal = () => {
        setRevealed(true);
        speak(word.word);
    };

    return (
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden w-full max-w-xl mx-auto rounded-3xl">
            <CardContent className="p-5 sm:p-8 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-xs font-black tracking-widest uppercase",
                                isReview ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
                            )}>
                                {isReview ? '복습 단어' : 'NEW WORD'}
                            </span>
                            {w.category && (
                                <span className={`text-[10px] font-black px-2.5 py-0.5 border rounded-full ${catColor}`}>
                                    {w.category}
                                </span>
                            )}
                        </div>
                        {w.level && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 border border-[var(--color-border)] bg-[var(--color-background)] rounded-full text-[var(--color-muted-foreground)]">
                                {w.level.toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-3 py-3">
                        <h2 className="text-4xl sm:text-6xl font-black text-[var(--color-foreground)] tracking-tight italic text-center break-words leading-none">
                            {formatWord(word.word)}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <button
                                onClick={() => speak(word.word)}
                                className="p-3.5 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white active:scale-95 transition-all border border-[var(--color-primary)]/20 shadow-xs"
                                aria-label="발음 듣기"
                                title="원어민 발음 듣기"
                            >
                                <Volume2 className="h-6 w-6 sm:h-7 sm:w-7" />
                            </button>
                            <button
                                onClick={() => toggleFavorite(word)}
                                className={cn(
                                    "p-3.5 rounded-full active:scale-95 transition-all border shadow-xs",
                                    isFavorite
                                        ? "bg-amber-400/20 text-amber-500 border-amber-400/40"
                                        : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:text-[var(--color-foreground)]"
                                )}
                                title={isFavorite ? "저장됨" : "내 단어장에 저장"}
                                aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                            >
                                <Star className={cn("h-6 w-6 sm:h-7 sm:w-7", isFavorite && "fill-current")} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="min-h-[100px]">
                    {!revealed ? (
                        <Button
                            onClick={reveal}
                            className="h-14 sm:h-16 w-full text-lg sm:text-xl font-black bg-[var(--color-foreground)] text-[var(--color-background)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all active:scale-98 rounded-2xl"
                        >
                            뜻 확인하기 <Sparkles className="ml-2 w-5 h-5 text-amber-400 fill-amber-400" />
                        </Button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="bg-[var(--color-primary)]/10 p-4 border-2 border-dashed border-[var(--color-primary)]/40 rounded-2xl text-center">
                                <p className="text-base sm:text-lg font-black text-[var(--color-primary)] leading-tight">{word.meaning}</p>
                            </div>

                            {/* Pro Insight */}
                            {(word.synonyms?.length || word.usageTips) && (
                                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl space-y-3 shadow-xs relative overflow-hidden group">
                                    <div className="flex items-center gap-1.5 text-xs font-black text-[var(--color-muted-foreground)] uppercase tracking-wider">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Pro Insight
                                    </div>

                                    {word.synonyms?.length && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-[var(--color-muted-foreground)] uppercase">유의어 (Synonyms)</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {word.synonyms.map((s: string) => (
                                                    <span key={s} className="px-2.5 py-0.5 bg-[var(--color-muted)] rounded-lg text-xs font-bold text-[var(--color-foreground)] italic border border-[var(--color-border)]">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {word.usageTips && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-[var(--color-muted-foreground)] uppercase">학습 팁 (Usage Note)</p>
                                            <p className="text-xs font-bold text-[var(--color-foreground)] leading-relaxed italic">
                                                {word.usageTips}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {word.example && (
                                <div className="rounded-2xl bg-[var(--color-muted)]/30 border border-[var(--color-border)] p-4 space-y-2 relative">
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="text-sm sm:text-base font-bold text-[var(--color-foreground)] leading-relaxed italic">
                                            &quot;{formatSentence(word.example)}&quot;
                                        </p>
                                        <button
                                            onClick={() => speak(word.example!)}
                                            className="p-2 bg-[var(--color-surface)] rounded-xl text-[var(--color-muted-foreground)] transition-all border border-[var(--color-border)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] shrink-0"
                                            aria-label="예문 발음 듣기"
                                        >
                                            <Volume2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {word.exampleTranslation && (
                                        <p className="text-xs text-[var(--color-muted-foreground)] font-bold border-t border-[var(--color-border)] pt-2 italic">
                                            ↳ {word.exampleTranslation}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                <Button
                                    onClick={onNext}
                                    className="h-13 w-full sm:w-auto px-8 text-base sm:text-lg font-black bg-[var(--color-primary)] text-white border border-[var(--color-border)] shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 rounded-2xl"
                                >
                                    다음 <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}