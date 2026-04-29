'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatWord } from '@/lib/utils/format';
import type { Word } from '@/types';

interface ChoiceQuizStepProps {
  word: Word;
  options: string[];
  onCorrect: () => void;
  onWrong: () => void;
}

export function ChoiceQuizStep({
  word, options, onCorrect, onWrong,
}: ChoiceQuizStepProps) {
  const [picked, setPicked] = React.useState<string | null>(null);

  const pick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt.toLowerCase() === word.word.toLowerCase()) onCorrect(); else onWrong();
  };

  return (
    <Card className="bg-surface border-4 border-border shadow-[4px_4px_0_var(--border)] overflow-hidden max-w-sm mx-auto">
      <CardContent className="p-4 sm:p-8 space-y-6">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-secondary text-white border-2 border-border shadow-[2px_2px_0_var(--border)]">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-widest font-cartoon">뜻에 맞는 단어 선택</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-foreground break-keep leading-tight font-cartoon">
            {word.meaning}
          </h2>
        </div>

        <div className="grid gap-3">
          {options.map((opt, i) => {
            const done = picked !== null;
            const isTarget = opt.toLowerCase() === word.word.toLowerCase();
            const isSelected = picked === opt;

            return (
              <motion.button
                key={opt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => pick(opt)}
                disabled={done}
                className={cn(
                  "group relative h-16 w-full px-6 rounded-2xl border-4 font-black text-left text-xl transition-all font-reading italic",
                  !done
                    ? 'border-border bg-background hover:border-primary shadow-[6px_6px_0_var(--border)] active:translate-y-1 active:shadow-none'
                    : isTarget
                      ? 'border-success bg-success text-white shadow-none'
                      : isSelected
                        ? 'border-error bg-error text-white shadow-none'
                        : 'border-border bg-background opacity-30 grayscale cursor-default shadow-none'
                )}
              >
                <div className="flex items-center justify-between h-full">
                  <span>{formatWord(opt)}</span>
                  <AnimatePresence>
                    {done && isTarget && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                        <CheckCircle2 className="w-6 h-6" />
                      </motion.div>
                    )}
                    {done && isSelected && !isTarget && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                        <XCircle className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {picked && picked.toLowerCase() === word.word.toLowerCase() && (
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
