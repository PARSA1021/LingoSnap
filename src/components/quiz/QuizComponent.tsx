'use client';

import * as React from 'react';
import { Word } from '@/types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

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
    <Card className="w-full max-w-lg mx-auto overflow-visible bg-white border-b-[6px] border-slate-200">
      <CardContent className="p-6 sm:p-10 flex flex-col items-center space-y-8 select-none">
        
        <div className="text-center space-y-5 w-full pt-4">
          <motion.p 
            initial={{ y: -10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="text-sm font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full w-fit mx-auto"
          >
            퀴즈: 이 뜻을 가진 단어는?
          </motion.p>
          <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-inner relative break-keep">
            <h3 className="text-2xl sm:text-3xl text-slate-800 font-extrabold leading-tight">
              "{word.meaning}"
            </h3>
          </div>
        </div>

        <motion.div 
          className="w-full grid grid-cols-1 gap-3 sm:gap-4 pb-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === word.word;
            
            let btnVariant: "outline" | "success" | "danger" = "outline";
            let Icon = null;
            
            if (selected) {
              if (isCorrect) {
                btnVariant = "success";
                Icon = <CheckCircle2 className="w-6 h-6 mr-3 mix-blend-overlay" />;
              } else if (isSelected) {
                btnVariant = "danger";
                Icon = <XCircle className="w-6 h-6 mr-3 mix-blend-overlay" />;
              }
            }

            return (
              <motion.div
                key={opt}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
              >
                <Button
                  variant={btnVariant}
                  className={cn(
                    "w-full h-16 sm:h-20 text-lg sm:text-xl font-extrabold flex justify-start px-6 items-center border-[3px]",
                    selected && !isCorrect && !isSelected && "opacity-30 scale-95 border-slate-200 bg-slate-50 text-slate-400"
                  )}
                  onClick={() => handleSelect(opt)}
                  disabled={!!selected}
                >
                  <span className="flex-1 text-left flex items-center">
                    {selected && isCorrect && !isSelected ? <CheckCircle2 className="w-6 h-6 mr-3 text-green-300" /> : Icon}
                    {opt}
                  </span>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}

// Quick helper because framer-motion variants strip context
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
