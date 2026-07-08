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
 '일상': 'bg-blue-500 text-white border-blue-600',
 '캐주얼': 'bg-purple-500 text-white border-purple-600',
 '비즈니스': 'bg-amber-500 text-white border-amber-600',
 '여행': 'bg-green-500 text-white border-green-600',
 '숙어': 'bg-rose-500 text-white border-rose-600',
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
 <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden max-w-sm mx-auto">
 <CardContent className="p-4 sm:p-8 space-y-6">
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className={cn(
 "text-[10px] font-black tracking-widest ",
 isReview ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
 )}>
 {isReview ? 'REVIEW WORD' : 'NEW WORD'}
 </span>
 {w.category && (
 <span className={`text-[8px] font-black px-2 py-0.5 border-2 rounded-full ${catColor}`}>
 {w.category}
 </span>
 )}
 </div>
 {w.level && (
 <span className="text-[8px] font-black px-2 py-0.5 border border-[var(--color-border)] bg-[var(--color-background)] rounded-full text-[var(--color-muted-foreground)] ">
 {w.level.toUpperCase()}
 </span>
 )}
 </div>
 
 <div className="flex flex-col items-center gap-3 py-2">
 <h2 className="text-4xl sm:text-6xl font-black text-[var(--color-foreground)] tracking-tight italic">
 {formatWord(word.word)}
 </h2>
 <div className="flex items-center gap-3">
 <button 
 onClick={() => speak(word.word)}
 className="p-4 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] active:scale-95 transition-all border-2 border-transparent hover:border-primary/20 shadow-sm"
 >
 <Volume2 className="h-8 w-8" />
 </button>
 <button 
 onClick={() => toggleFavorite(word)}
 className={cn(
 "p-4 rounded-full active:scale-95 transition-all border-2 shadow-sm",
 isFavorite 
 ? "bg-amber-400/20 text-amber-500 border-amber-400/30" 
 : "bg-[var(--color-muted)]/50 text-[var(--color-muted-foreground)] border-transparent hover:border-muted-foreground/20"
 )}
 title={isFavorite ? "저장됨" : "내 단어장에 저장"}
 >
 <Star className={cn("h-8 w-8", isFavorite && "fill-current")} />
 </button>
 </div>
 </div>
 </div>

 <div className="min-h-[120px]">
 {!revealed ? (
 <Button 
 onClick={reveal} 
 className="h-16 w-full text-xl font-black bg-[var(--color-foreground)] text-[var(--color-background)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow active:translate-y-1 active:shadow-none transition-all "
 >
 뜻 확인하기 <Sparkles className="ml-2 w-6 h-6 text-amber-400" />
 </Button>
 ) : (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-4"
 >
 <div className="bg-[var(--color-primary)]/5 p-4 border-2 border-dashed border-primary rounded-2xl text-center">
 <p className="text-sm font-black text-[var(--color-primary)] leading-tight ">{word.meaning}</p>
 </div>

 {/* Pro Insight for Advanced Learners (Persona: Sarah) */}
 {(word.synonyms?.length || word.usageTips) && (
 <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
 <Sparkles className="w-8 h-8" />
 </div>
 <h4 className="text-[10px] font-black text-[var(--color-foreground)]/40 uppercase tracking-widest flex items-center gap-1.5 ">
 <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> Pro Insight
 </h4>
 
 {word.synonyms?.length && (
 <div className="space-y-1">
 <p className="text-[9px] font-black text-[var(--color-muted-foreground)] uppercase">유의어 (Synonyms)</p>
 <div className="flex flex-wrap gap-1.5">
 {word.synonyms.map((s: string) => (
 <span key={s} className="px-2 py-0.5 bg-[var(--color-muted)] rounded-lg text-[10px] font-bold text-[var(--color-foreground)] italic">
 {s}
 </span>
 ))}
 </div>
 </div>
 )}
 
 {word.usageTips && (
 <div className="space-y-1">
 <p className="text-[9px] font-black text-[var(--color-muted-foreground)] uppercase">학습 팁 (Usage Note)</p>
 <p className="text-[10px] font-bold text-[var(--color-foreground)] leading-relaxed italic">
 {word.usageTips}
 </p>
 </div>
 )}
 </div>
 )}

 {word.example && (
 <div className="rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] p-4 space-y-2 relative">
 <div className="flex justify-between items-start gap-4">
 <p className="text-sm font-bold text-[var(--color-foreground)] leading-relaxed italic">
 &quot;{formatSentence(word.example)}&quot;
 </p>
 <div className="flex flex-col gap-2">
 <button
 onClick={() => speak(word.example!)}
 className="p-2 bg-[var(--color-muted)] rounded-xl text-[var(--color-muted-foreground)] transition-all border border-[var(--color-border)] shrink-0 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
 >
 <Volume2 className="w-4 h-4" />
 </button>
 </div>
 </div>
 {word.exampleTranslation && (
 <p className="text-xs text-[var(--color-muted-foreground)] font-bold border-t border-[var(--color-border)]/10 pt-2 italic">
 ↳ {word.exampleTranslation}
 </p>
 )}
 </div>
 )}

 <div className="pt-2 flex justify-end">
 <Button 
 onClick={onNext} 
 className="h-14 px-10 text-lg font-black bg-[var(--color-primary)] text-white border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
 >
 다음 <ArrowRight className="w-6 h-6" />
 </Button>
 </div>
 </motion.div>
 )}
 </div>
 </CardContent>
 </Card>
 );
}
