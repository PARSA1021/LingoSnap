'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, MousePointer2, ArrowRight } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/utils/cn';
import { formatWord, formatSentence } from '@/lib/utils/format';

interface SentenceCompletionProps {
  sentence: string;
  translation: string;
  targetWord: string;
  onSuccess: () => void;
  index: number;
  total: number;
}

import { useLearningStore } from '@/store/useLearningStore';
import vocabData from '@/data/vocabulary.json';

export function SentenceCompletion({ sentence, translation, targetWord, onSuccess, index, total }: SentenceCompletionProps) {
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [shake, setShake] = React.useState(false);
  const addPoints = useLearningStore(state => state.addPoints);
  const incrementLearnedWords = useLearningStore(state => state.incrementLearnedWords);
  const { speak, isPlaying } = useTTS();

  // Split sentence to find the blank
  // We assume the targetWord or a variation is in the sentence
  const parts = React.useMemo(() => {
    // Escape special characters for regex
    const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return sentence.split(regex);
  }, [sentence, targetWord]);

  const [options, setOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Find words from same category or length to confuse the user
    type VocabItem = { word: string; category?: string };
    const vocabItems = vocabData as unknown as VocabItem[];

    const currentWordData = vocabItems.find(v => v.word.toLowerCase() === targetWord.toLowerCase());
    const distractors = vocabItems
      .filter(v => v.word.toLowerCase() !== targetWord.toLowerCase())
      .map(v => {
        let score = 0;
        // Same category is very confusing
        if (currentWordData && v.category === currentWordData.category) score += 5;
        // Similar length
        if (Math.abs(v.word.length - targetWord.length) <= 2) score += 3;
        // Same first letter
        if (v.word[0].toLowerCase() === targetWord[0].toLowerCase()) score += 2;
        return { word: v.word, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 15) // Top candidates
      .sort(() => 0.5 - Math.random())
      .slice(0, 2) // Pick 2
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
      addPoints(100); // More points for context challenge
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
    <div className="w-full flex flex-col items-center space-y-4 py-2 max-w-2xl mx-auto px-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-secondary text-white px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-black tracking-widest font-cartoon uppercase">문장 완성하기</span>
        </div>
        <p className="text-sm font-black text-primary font-reading italic leading-tight">&quot;{translation}&quot;</p>
      </div>

      <div className={cn(
        "w-full bg-surface border-4 border-border p-4 sm:p-8 shadow-[6px_6px_0_var(--border)] transition-all relative overflow-hidden",
        shake && "animate-shake border-error",
        status === 'success' && "border-success"
      )}>
        <div className={cn(
          "flex flex-wrap justify-center items-center gap-x-1 gap-y-2 font-black font-reading italic",
          sentence.length > 60 ? "text-lg sm:text-xl" :
          sentence.length > 40 ? "text-xl sm:text-2xl" :
          "text-2xl sm:text-3xl"
        )}>
          {parts.map((part, i) => (
            part.toLowerCase() === targetWord.toLowerCase() ? (
              <motion.div
                key={i}
                className={cn(
                  "min-w-[60px] sm:min-w-[100px] h-10 sm:h-12 border-b-4 border-border flex items-center justify-center transition-all px-2",
                  selectedWord ? "text-primary" : "text-foreground/10"
                )}
              >
                {selectedWord ? formatWord(selectedWord) : '____'}
              </motion.div>
            ) : (
              <span key={i} className="text-foreground">{part}</span>
            )
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => speak(targetWord)} 
            className={cn(
              "flex items-center gap-2 border-2 border-border bg-surface shadow-[2px_2px_0_var(--border)] active:translate-y-0.5 font-cartoon text-[10px] transition-all px-4 py-2",
              isPlaying ? "text-primary border-primary shadow-none translate-y-0.5" : "text-foreground"
            )}
          >
            <Volume2 className={cn("w-4 h-4", isPlaying && "text-primary fill-primary/20")} /> 발음 듣기
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
                "px-5 py-2.5 bg-surface border-2 border-border shadow-[4px_4px_0_var(--border)] text-base sm:text-xl font-black font-reading italic hover:bg-muted transition-all text-foreground",
                selectedWord === opt && status === 'success' && "bg-success text-white border-success shadow-none translate-y-1",
                selectedWord === opt && status === 'error' && "bg-error text-white border-error shadow-none translate-y-1"
              )}
            >
              {formatWord(opt)}
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -100 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-success z-50 pointer-events-none font-cartoon drop-shadow-lg"
            >
              +100
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
