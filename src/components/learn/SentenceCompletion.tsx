'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, MousePointer2, ArrowRight } from 'lucide-react';
import { speak } from '@/lib/tts';
import { cn } from '@/lib/utils/cn';

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
    const currentWordData = (vocabData as any[]).find(v => v.word.toLowerCase() === targetWord.toLowerCase());
    const distractors = (vocabData as any[])
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
    <div className="w-full flex flex-col items-center space-y-8 py-6 max-w-2xl mx-auto px-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-1.5 border-4 border-black shadow-[4px_4px_0_#000] rotate-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest font-cartoon">Context Challenge {index + 1}/{total}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-black font-cartoon uppercase">Script Completion</h2>
        <p className="text-lg font-black text-primary font-reading italic">"{translation}"</p>
        <p className="text-xs font-black text-black/40 uppercase tracking-[0.2em]">Drag or click the correct block to fill the gap</p>
      </div>

      <div className={cn(
        "w-full bg-surface border-8 border-border p-8 sm:p-12 shadow-[12px_12px_0_var(--border)] transition-all relative overflow-hidden",
        shake && "animate-shake border-error",
        status === 'success' && "border-success scale-105"
      )}>
        <div className={cn(
          "flex flex-wrap justify-center items-center gap-x-2 gap-y-4 font-black font-reading",
          sentence.length > 60 ? "text-xl sm:text-2xl" :
          sentence.length > 40 ? "text-2xl sm:text-3xl" :
          "text-3xl sm:text-4xl"
        )}>
          {parts.map((part, i) => (
            part.toLowerCase() === targetWord.toLowerCase() ? (
              <motion.div
                key={i}
                className={cn(
                  "min-w-[80px] sm:min-w-[120px] h-14 sm:h-16 border-b-8 border-border flex items-center justify-center transition-all px-4",
                  selectedWord ? "text-primary scale-110" : "text-foreground/10"
                )}
                animate={selectedWord ? { y: [0, -5, 0] } : {}}
              >
                {selectedWord || '____'}
              </motion.div>
            ) : (
              <span key={i} className="text-foreground">{part}</span>
            )
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => speak(targetWord)} 
            className="flex items-center gap-3 border-4 border-border bg-surface shadow-[4px_4px_0_var(--border)] active:translate-y-1 font-cartoon text-sm uppercase text-foreground"
          >
            <Volume2 className="w-5 h-5 text-primary" /> Listen to missing word
          </Button>
        </div>
        
        {status === 'success' && (
           <div className="absolute top-4 right-4 text-success animate-bounce">
             <Sparkles className="w-10 h-10 fill-current" />
           </div>
        )}
      </div>

      <div className="w-full space-y-4 pt-4">
        <p className="text-center text-xs font-black text-foreground/40 uppercase tracking-widest flex items-center justify-center gap-2">
           Pick the right block
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOptionClick(opt)}
              className={cn(
                "px-8 py-4 bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)] text-xl sm:text-2xl font-black font-reading uppercase hover:bg-muted transition-all text-foreground",
                selectedWord === opt && status === 'success' && "bg-success text-white border-success",
                selectedWord === opt && status === 'error' && "bg-error text-white border-error"
              )}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-surface border-8 border-border p-10 sm:p-14 shadow-[20px_20px_0_var(--border)] text-center space-y-8 wobbly"
            >
              <div className="flex items-center justify-center gap-6">
                <Sparkles className="w-12 h-12 sm:w-20 sm:h-20 fill-info text-info" />
                <h2 className="text-6xl sm:text-8xl font-black text-foreground font-cartoon uppercase">PERFECT!</h2>
                <Sparkles className="w-12 h-12 sm:w-20 sm:h-20 fill-info text-info" />
              </div>

              <div className="flex flex-col items-center gap-4">
                <p className="text-2xl font-black text-foreground/60 uppercase tracking-widest font-cartoon">Context Mastered!</p>
                <div className="bg-info/10 px-6 py-2 border-4 border-dashed border-info">
                  <span className="text-xl font-black text-info uppercase font-cartoon">+100 Talkie Points</span>
                </div>
              </div>

              <div className="pt-6">
                 <Button 
                   onClick={onSuccess}
                   className="w-full h-20 text-3xl border-8 border-border bg-info text-white shadow-[10px_10px_0_var(--border)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all uppercase font-cartoon flex items-center justify-center gap-4"
                 >
                   Continue <ArrowRight className="w-8 h-8" />
                 </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
