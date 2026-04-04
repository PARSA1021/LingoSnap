'use client';

import * as React from 'react';
import { Word } from '@/types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface QuizComponentProps {
  word: Word;
  options: string[]; 
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizComponent({ word, options, onAnswer }: QuizComponentProps) {
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    
    setTimeout(() => {
      onAnswer(option === word.word);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-surface card-tactile border-border overflow-visible">
      <CardContent className="p-8 sm:p-12 flex flex-col items-center space-y-10 select-none">
        
        <div className="text-center space-y-4 w-full pt-4">
          <p className="text-xs font-black text-primary uppercase tracking-[0.2em] bg-accent px-4 py-1.5 rounded-full w-fit mx-auto border-2 border-primary/20">
            알맞은 단어를 선택하세요
          </p>
          <div className="bg-muted rounded-[2rem] p-8 sm:p-10 border-2 border-border shadow-inner">
            <h3 className="text-3xl sm:text-4xl text-foreground font-black leading-tight tracking-tight break-keep">
              "{word.meaning}"
            </h3>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 gap-4 pb-4">
          {options.map((opt) => {
            const isSelected = selected === opt;
            const isCorrect = opt === word.word;
            
            let stateStyles = "bg-white border-border text-foreground hover:bg-muted";
            let Icon = null;
            
            if (selected) {
              if (isCorrect) {
                stateStyles = "bg-success text-white border-success/30 shadow-[0_4px_0_0_#45A302]";
                Icon = <CheckCircle2 className="w-6 h-6 mr-3" />;
              } else if (isSelected) {
                stateStyles = "bg-error text-white border-error/30 shadow-[0_4px_0_0_#D32F2F]";
                Icon = <XCircle className="w-6 h-6 mr-3" />;
              } else {
                stateStyles = "bg-muted text-muted-foreground border-border opacity-50 scale-95";
              }
            }

            return (
              <motion.button
                key={opt}
                whileHover={!selected ? { scale: 1.02 } : {}}
                whileTap={!selected ? { scale: 0.98 } : {}}
                disabled={!!selected}
                onClick={() => handleSelect(opt)}
                className={cn(
                  "w-full h-18 sm:h-20 px-8 flex items-center justify-start text-xl sm:text-2xl font-black rounded-2xl border-b-4 transition-all duration-150",
                  stateStyles,
                  !selected && "active:border-b-0 active:translate-y-1"
                )}
              >
                {Icon}
                <span className="flex-1 text-left">{opt}</span>
                {selected && isCorrect && !isSelected && <CheckCircle2 className="w-6 h-6 text-success" />}
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
