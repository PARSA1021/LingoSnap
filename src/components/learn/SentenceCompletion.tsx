'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, MousePointer2 } from 'lucide-react';
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
    // Generate distractors - simple variations or common words
    const distractors = ['something', 'often', 'always', 'people', 'never'].filter(d => d.toLowerCase() !== targetWord.toLowerCase());
    const randomDistractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 2);
    setOptions([targetWord, ...randomDistractors].sort(() => 0.5 - Math.random()));
    setSelectedWord(null);
    setStatus('idle');
    // Auto-play the target word as a starting hint
    speak(targetWord);
  }, [targetWord]);

  const handleOptionClick = (word: string) => {
    if (status === 'success') return;
    
    setSelectedWord(word);
    if (word.toLowerCase() === targetWord.toLowerCase()) {
      setStatus('success');
      addPoints(100); // More points for context challenge
      incrementLearnedWords();
      speak(sentence); // Play full sentence on success
      setTimeout(onSuccess, 1500);
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
        <h2 className="text-3xl sm:text-4xl font-black text-black font-cartoon uppercase">Fill in the blank!</h2>
        <p className="text-lg font-black text-primary font-reading italic">"{translation}"</p>
      </div>

      <div className={cn(
        "w-full bg-white border-8 border-black p-8 sm:p-12 shadow-[12px_12px_0_#000] transition-all relative overflow-hidden",
        shake && "animate-shake border-error",
        status === 'success' && "border-success scale-105"
      )}>
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-4 text-3xl sm:text-4xl font-black font-reading">
          {parts.map((part, i) => (
            part.toLowerCase() === targetWord.toLowerCase() ? (
              <motion.div
                key={i}
                className={cn(
                  "min-w-[120px] h-14 sm:h-16 border-b-8 border-black flex items-center justify-center transition-all px-4",
                  selectedWord ? "text-primary scale-110" : "text-black/10"
                )}
                animate={selectedWord ? { y: [0, -5, 0] } : {}}
              >
                {selectedWord || '____'}
              </motion.div>
            ) : (
              <span key={i} className="text-black">{part}</span>
            )
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button 
            variant="ghost" 
            onClick={() => speak(targetWord)} 
            className="flex items-center gap-3 border-4 border-black bg-white shadow-[4px_4px_0_#000] active:translate-y-1 font-cartoon text-sm uppercase"
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
        <p className="text-center text-xs font-black text-black/40 uppercase tracking-widest flex items-center justify-center gap-2">
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
                "px-8 py-4 bg-white border-4 border-black shadow-[6px_6px_0_#000] text-xl sm:text-2xl font-black font-reading uppercase hover:bg-muted transition-all",
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
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <div className="bg-success text-white px-10 py-6 border-8 border-black shadow-[15px_15px_0_#000] text-5xl font-black font-cartoon uppercase -rotate-3">
              WELL DONE!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
