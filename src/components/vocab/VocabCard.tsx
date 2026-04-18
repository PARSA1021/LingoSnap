'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Volume2, ArrowRight, ArrowLeft, Star, Lightbulb, Check } from 'lucide-react';
import { playTTS } from '@/lib/tts';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/store/useLearningStore';
import { cn } from '@/lib/utils/cn';

interface VocabCardProps {
  word: any; // examples 배열이 포함된 객체 대응
  onNext?: () => void;
  onPrev?: () => void;
  showPrev?: boolean;
}

export function VocabCard({ word, onNext, onPrev, showPrev }: VocabCardProps) {
  const [showMeaning, setShowMeaning] = React.useState(true);
  const [quizMode, setQuizMode] = React.useState(false);
  const [englishDef, setEnglishDef] = React.useState<string | null>(null);

  const toggleFavorite = useLearningStore(state => state.toggleFavorite);
  const favorites = useLearningStore(state => state.favorites);

  React.useEffect(() => {
    if (quizMode) setShowMeaning(true);
  }, [word.word, quizMode]);

  React.useEffect(() => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.word}`)
      .then(r => r.json())
      .then(d => {
        if (d && d[0] && d[0].meanings[0]?.definitions[0]?.definition) {
          setEnglishDef(d[0].meanings[0].definitions[0].definition);
        }
      })
      .catch(() => { });
  }, [word.word]);

  const isFavorite = favorites.some(w => w.word === word.word);
  const isWordHidden = quizMode;

  return (
    <Card className="w-full max-w-lg mx-auto bg-white border-4 border-black relative overflow-visible mb-6 shadow-[6px_6px_0_#000]">
      {/* Action Tray - Mobile Friendly */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <button
          onClick={() => setQuizMode(!quizMode)}
          className={cn(
            "p-2.5 rounded-xl border-2 transition-all active:translate-y-0.5 shadow-[2px_2px_0_#000]",
            quizMode ? 'bg-primary text-white border-black' : 'bg-white text-black border-black'
          )}
        >
          <Lightbulb className={cn("w-5 h-5", quizMode && 'fill-current')} />
        </button>
        <button
          onClick={() => toggleFavorite(word)}
          className={cn(
            "p-2.5 rounded-xl border-2 transition-all active:translate-y-0.5 shadow-[2px_2px_0_#000]",
            isFavorite ? 'bg-warning text-black border-black' : 'bg-white text-black border-black'
          )}
        >
          <Star className={cn("w-5 h-5", isFavorite && 'fill-current')} />
        </button>
      </div>

      <CardContent className="p-6 sm:p-10 flex flex-col items-center text-center space-y-4">
        {/* Word Stage - High Impact */}
        <div className="w-full pt-6 min-h-[100px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isWordHidden ? (
              <motion.button
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setQuizMode(false)}
                className="w-full h-16 bg-black/5 border-2 border-dashed border-black/20 rounded-xl flex items-center justify-center gap-2 text-black/40 font-black text-sm uppercase tracking-widest active:bg-black/10 transition-all font-cartoon"
              >
                Reveal Word
              </motion.button>
            ) : (
              <motion.div key="visible" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
                <h2 className="text-4xl sm:text-5xl font-black text-black font-reading leading-tight italic">{word.word}</h2>
                <button 
                  onClick={() => playTTS(word.word)}
                  className="p-2 text-primary hover:scale-110 active:scale-95 transition-transform"
                >
                  <Volume2 className="h-6 w-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Meaning Area */}
        <div className="w-full min-h-[100px]">
          <AnimatePresence mode="wait">
            {!showMeaning && !quizMode ? (
              <button 
                onClick={() => setShowMeaning(true)} 
                className="w-full py-6 bg-primary text-white border-4 border-black font-black text-lg shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all font-cartoon"
              >
                CHECK MEANING
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-left space-y-4">
                <div className="bg-primary/5 p-4 border-2 border-dashed border-primary rounded-xl">
                  <p className="text-2xl font-black text-primary leading-tight font-cartoon uppercase">{word.meaning}</p>
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  {word.examples && word.examples.slice(0, 2).map((ex: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 border-2 border-black border-dashed">
                      <p className="font-bold text-base text-black leading-snug font-reading">&quot;{ex.text}&quot;</p>
                      {ex.translation && (
                        <p className="text-black/60 font-bold mt-1 text-xs font-reading">
                          ↳ {ex.translation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Controls */}
        {(onNext || showPrev) && (
          <div className="w-full flex gap-2 pt-2">
            {showPrev && (
              <button 
                onClick={onPrev} 
                className="flex-1 h-12 bg-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all font-cartoon flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {onNext && (
              <button 
                onClick={onNext} 
                disabled={!showMeaning} 
                className="flex-[2] h-12 bg-black text-white border-2 border-black font-black text-xs uppercase shadow-[4px_4px_0_#000] active:translate-y-0.5 active:shadow-none transition-all font-cartoon flex items-center justify-center gap-2 disabled:opacity-30"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}