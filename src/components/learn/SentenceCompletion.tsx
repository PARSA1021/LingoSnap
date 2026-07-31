'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/utils/cn';
import { formatWord } from '@/lib/utils/format';
import { useLearningStore } from '@/store/useLearningStore';
import vocabData from '@/data/vocabulary.json';

interface SentenceCompletionProps {
  sentence: string;
  translation: string;
  targetWord: string;
  onSuccess: () => void;
  index: number;
  total: number;
}

export function SentenceCompletion({ sentence, translation, targetWord, onSuccess, index, total }: SentenceCompletionProps) {
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [shake, setShake] = React.useState(false);
  const addPoints = useLearningStore(state => state.addPoints);
  const incrementLearnedWords = useLearningStore(state => state.incrementLearnedWords);
  const { speak, isPlaying } = useTTS();

  const parts = React.useMemo(() => {
    const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return sentence.split(regex);
  }, [sentence, targetWord]);

  const [options, setOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    type VocabItem = { word: string; category?: string };
    const vocabItems = vocabData as unknown as VocabItem[];

    const currentWordData = vocabItems.find(v => v.word.toLowerCase() === targetWord.toLowerCase());
    const distractors = vocabItems
      .filter(v => v.word.toLowerCase() !== targetWord.toLowerCase())
      .map(v => {
        let score = 0;
        if (currentWordData && v.category === currentWordData.category) score += 5;
        if (Math.abs(v.word.length - targetWord.length) <= 2) score += 3;
        if (v.word[0].toLowerCase() === targetWord[0].toLowerCase()) score += 2;
        return { word: v.word, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(v => v.word);

    setOptions([targetWord, ...distractors].sort(() => 0.5 - Math.random()));
    setSelectedWord(null);
    setStatus('idle');
  }, [targetWord]);

  const handleOptionClick = (word: string) => {
    if (status === 'success') return;
    
    setSelectedWord(word);
    if (word.toLowerCase() === targetWord.toLowerCase()) {
      setStatus('success');
      addPoints(15);
      incrementLearnedWords();
      onSuccess();
    } else {
      setStatus('error');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setStatus('idle');
        setSelectedWord(null);
      }, 600);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 py-2 max-w-xl mx-auto px-3 sm:px-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 rounded-full shadow-xs">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-black tracking-wider uppercase">문장 빈칸 채우기</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-[var(--color-muted-foreground)] italic leading-tight">&quot;{translation}&quot;</p>
      </div>

      <div className={cn(
        "w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-5 sm:p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden rounded-3xl",
        shake && "animate-shake border-rose-500",
        status === 'success' && "border-emerald-500 bg-emerald-500/10"
      )}>
        <div className={cn(
          "flex flex-wrap justify-center items-center gap-x-1.5 gap-y-2 font-black italic",
          sentence.length > 60 ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
        )}>
          {parts.map((part, i) => (
            part.toLowerCase() === targetWord.toLowerCase() ? (
              <motion.div
                key={i}
                className={cn(
                  "min-w-[80px] sm:min-w-[110px] h-10 sm:h-12 border-b-3 border-[var(--color-primary)] flex items-center justify-center transition-all px-2 font-black text-[var(--color-primary)]"
                )}
              >
                {selectedWord ? formatWord(selectedWord) : '______'}
              </motion.div>
            ) : (
              <span key={i} className="text-[var(--color-foreground)]">{part}</span>
            )
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => speak(sentence)} 
            className={cn(
              "flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-background)] rounded-full text-xs font-bold px-4 py-2 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all",
              isPlaying && "text-[var(--color-primary)] border-[var(--color-primary)]"
            )}
          >
            <Volume2 className="w-4 h-4" /> 예문 발음 듣기
          </Button>
        </div>
      </div>

      <div className="w-full space-y-3 pt-2">
        <div className="flex flex-wrap justify-center gap-3">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOptionClick(opt)}
              disabled={status === 'success'}
              className={cn(
                "px-5 py-3 bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-2xl shadow-xs text-base sm:text-lg font-black italic hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all text-[var(--color-foreground)]",
                selectedWord === opt && status === 'success' && "bg-emerald-500 text-white border-emerald-500 shadow-md",
                selectedWord === opt && status === 'error' && "bg-rose-500 text-white border-rose-500 shadow-md"
              )}
            >
              {formatWord(opt)}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -80, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-emerald-500 z-50 pointer-events-none drop-shadow-lg"
            >
              +15 P 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
