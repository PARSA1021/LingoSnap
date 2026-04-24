'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
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
  answer, options, prompt = "Listen and pick the correct word", onCorrect, onWrong,
}: ListeningQuizStepProps) {
  const { speak, isPlaying, isLoading } = useTTS();
  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => speak(answer), 500);
    return () => clearTimeout(t);
  }, [answer, speak]);

  const handlePick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt.toLowerCase() === answer.toLowerCase()) onCorrect(); else onWrong();
  };

  return (
    <Card className="bg-surface border-4 border-border shadow-[4px_4px_0_var(--border)] overflow-hidden max-w-sm mx-auto">
      <CardContent className="p-4 sm:p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-info text-white border-2 border-border shadow-[2px_2px_0_var(--border)]">
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-widest font-cartoon">리스닝 미션</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-foreground font-cartoon">들리는 단어를 선택하세요</h2>
        </div>

        <div className="flex justify-center py-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => speak(answer)}
            disabled={isLoading}
            className={cn(
              "w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-border shadow-[6px_6px_0_var(--border)] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all",
              isPlaying ? "bg-secondary text-white" : "bg-primary text-white",
              isLoading && "opacity-50 animate-pulse"
            )}
          >
            <Volume2 className={cn("w-12 h-12 sm:w-16 sm:h-16", isPlaying && "animate-pulse")} />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const done = selected !== null;
            const isCorrect = opt.toLowerCase() === answer.toLowerCase();
            const isSelected = selected === opt;

            return (
              <motion.button
                key={opt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handlePick(opt)}
                disabled={done}
                className={cn(
                  "h-16 sm:h-20 px-3 rounded-xl border-4 font-black text-lg transition-all font-reading italic",
                  !done
                    ? 'border-border bg-background shadow-[4px_4px_0_var(--border)] active:translate-y-1 active:shadow-none'
                    : isCorrect
                      ? 'border-success bg-success text-white'
                      : isSelected
                        ? 'border-error bg-error text-white'
                        : 'border-border bg-background opacity-30 grayscale'
                )}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="leading-tight">{formatWord(opt)}</span>
                  <AnimatePresence>
                    {done && isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1"><CheckCircle2 className="w-4 h-4" /></motion.div>}
                    {done && isSelected && !isCorrect && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1"><XCircle className="w-4 h-4" /></motion.div>}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected && selected.toLowerCase() === answer.toLowerCase() && (
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
      </CardContent>
    </Card>
  );
}
