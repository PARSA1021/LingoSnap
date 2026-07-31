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
    if (opt.toLowerCase() === word.word.toLowerCase()) {
      onCorrect();
    } else {
      onWrong();
    }
  };

  return (
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden w-full max-w-xl mx-auto rounded-3xl">
      <CardContent className="p-5 sm:p-8 space-y-6">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30 rounded-full shadow-xs">
            <Sparkles className="w-4 h-4 text-[var(--color-secondary)]" />
            <span className="text-xs font-black tracking-wider uppercase">뜻에 맞는 단어 선택</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--color-foreground)] break-keep leading-tight font-lilita">
            {word.meaning}
          </h2>
        </div>

        <div className="grid gap-3">
          {options.map((opt) => {
            const done = picked !== null;
            const isTarget = opt.toLowerCase() === word.word.toLowerCase();
            const isSelected = picked === opt;

            return (
              <motion.button
                key={opt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={!done ? { scale: 0.98 } : undefined}
                onClick={() => pick(opt)}
                disabled={done}
                className={cn(
                  "group relative h-14 sm:h-16 w-full px-5 sm:px-6 rounded-2xl border-2 sm:border-3 font-black text-left text-lg sm:text-xl transition-all italic flex items-center justify-between",
                  !done
                    ? 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 shadow-xs hover:shadow-md'
                    : isTarget
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                    : isSelected
                    ? 'border-rose-500 bg-rose-500 text-white shadow-md'
                    : 'border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-muted-foreground)] opacity-40 grayscale cursor-default shadow-none'
                )}
              >
                <span className="truncate">{formatWord(opt)}</span>
                <AnimatePresence>
                  {done && isTarget && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <CheckCircle2 className="w-6 h-6 shrink-0 text-white" />
                    </motion.div>
                  )}
                  {done && isSelected && !isTarget && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <XCircle className="w-6 h-6 shrink-0 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {picked && picked.toLowerCase() === word.word.toLowerCase() && (
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
