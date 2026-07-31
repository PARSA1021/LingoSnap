'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle2, XCircle, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatWord } from '@/lib/utils/format';
import { useTTS } from '@/hooks/useTTS';

interface ListeningQuizStepProps {
  answer: string;
  options: string[];
  prompt?: string;
  onCorrect: () => void;
  onWrong: () => void;
}

export function ListeningQuizStep({
  answer, options, prompt = "들리는 단어를 듣고 맞혀보세요", onCorrect, onWrong,
}: ListeningQuizStepProps) {
  const { speak, isPlaying, isLoading } = useTTS();
  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => speak(answer), 400);
    return () => clearTimeout(t);
  }, [answer, speak]);

  const handlePick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt.toLowerCase() === answer.toLowerCase()) {
      onCorrect();
    } else {
      onWrong();
    }
  };

  return (
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden w-full max-w-xl mx-auto rounded-3xl">
      <CardContent className="p-5 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 text-violet-600 border border-violet-500/20 rounded-full shadow-xs">
            <Headphones className="w-4 h-4" />
            <span className="text-xs font-black tracking-wider uppercase">리스닝 미션</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">{prompt}</h2>
        </div>

        <div className="flex justify-center py-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => speak(answer)}
            disabled={isLoading}
            className={cn(
              "w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 shadow-lg flex items-center justify-center transition-all",
              isPlaying 
                ? "bg-violet-600 text-white border-violet-400 animate-pulse" 
                : "bg-[var(--color-primary)] text-white border-rose-400 hover:scale-105",
              isLoading && "opacity-50 animate-pulse"
            )}
          >
            <Volume2 className={cn("w-10 h-10 sm:w-12 sm:h-12", isPlaying && "animate-pulse")} />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {options.map((opt) => {
            const done = selected !== null;
            const isCorrect = opt.toLowerCase() === answer.toLowerCase();
            const isSelected = selected === opt;

            return (
              <motion.button
                key={opt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={!done ? { scale: 0.97 } : undefined}
                onClick={() => handlePick(opt)}
                disabled={done}
                className={cn(
                  "h-16 sm:h-20 px-3 rounded-2xl border-2 sm:border-3 font-black text-lg sm:text-xl transition-all italic flex items-center justify-center",
                  !done
                    ? 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] shadow-xs hover:shadow-md'
                    : isCorrect
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                    : isSelected
                    ? 'border-rose-500 bg-rose-500 text-white shadow-md'
                    : 'border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-muted-foreground)] opacity-40 grayscale shadow-none'
                )}
              >
                <div className="flex flex-col items-center justify-center leading-snug">
                  <span>{formatWord(opt)}</span>
                  <AnimatePresence>
                    {done && isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1"><CheckCircle2 className="w-5 h-5 text-white" /></motion.div>}
                    {done && isSelected && !isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1"><XCircle className="w-5 h-5 text-white" /></motion.div>}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected && selected.toLowerCase() === answer.toLowerCase() && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -80, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-emerald-500 z-50 pointer-events-none drop-shadow-lg"
            >
              +10 P 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
