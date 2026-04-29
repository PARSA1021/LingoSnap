'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Volume2, ArrowRight, ArrowLeft, Star } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/store/useLearningStore';
import { cn } from '@/lib/utils/cn';
import { formatWord, formatSentence } from '@/lib/utils/format';
import type { Word } from '@/types';

type Example = { text: string; translation?: string };
type WordWithExamples = Word & { examples?: Example[] };

interface VocabCardProps {
  word: WordWithExamples;
  onNext?: () => void;
  onPrev?: () => void;
  showPrev?: boolean;
  highlight?: string;
}

export function VocabCard({ word, onNext, onPrev, showPrev, highlight }: VocabCardProps) {
  const [showMeaning, setShowMeaning] = React.useState(true);
  const { speak, isPlaying, isLoading } = useTTS();

  const toggleFavorite = useLearningStore(state => state.toggleFavorite);
  const favorites = useLearningStore(state => state.favorites);

  React.useEffect(() => {
    setShowMeaning(true);
  }, [word.word]);

  const isFavorite = favorites.some(w => w.word === word.word);

  const HighlightText = ({ text, query }: { text: string; query?: string }) => {
    if (!query) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="bg-amber-200 text-black px-0.5 rounded-sm">{part}</span> 
            : part
        )}
      </>
    );
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white border-4 border-black relative overflow-visible mb-6 shadow-[6px_6px_0_#000]">
      {/* Action Tray - Mobile Friendly */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
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
            <motion.div key="visible" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
              <h2 className="text-4xl sm:text-5xl font-black text-black font-reading leading-tight italic">
                <HighlightText text={formatWord(word.word)} query={highlight} />
              </h2>
              <button 
                onClick={() => speak(word.word)}
                disabled={isLoading}
                className={cn(
                  "p-2 transition-all hover:scale-110 active:scale-95",
                  isPlaying ? "text-primary scale-110" : "text-black/40",
                  isLoading && "opacity-50 animate-pulse"
                )}
              >
                <Volume2 className={cn("h-6 w-6", isPlaying && "fill-primary/20")} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Meaning Area */}
        <div className="w-full min-h-[100px]">
          <AnimatePresence mode="wait">
            {!showMeaning ? (
              <button 
                onClick={() => setShowMeaning(true)} 
                className="w-full py-6 bg-primary text-white border-4 border-black font-black text-lg shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all font-cartoon"
              >
                Check Meaning
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-left space-y-4">
                <div className="bg-primary/5 p-4 border-2 border-dashed border-primary rounded-xl">
                  <p className="text-2xl font-black text-primary leading-tight font-cartoon">
                    <HighlightText text={word.meaning} query={highlight} />
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  {word.examples && word.examples.slice(0, 2).map((ex, idx) => (
                    <div key={idx} className="bg-white p-4 border-2 border-black border-dashed">
                      <p className="font-bold text-base text-black leading-snug font-reading">
                        &quot;<HighlightText text={formatSentence(ex.text)} query={highlight} />&quot;
                      </p>
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
                className="flex-1 h-12 bg-white border-2 border-black font-black text-xs shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all font-cartoon flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {onNext && (
              <button 
                onClick={onNext} 
                disabled={!showMeaning} 
                className="flex-[2] h-12 bg-black text-white border-2 border-black font-black text-xs shadow-[4px_4px_0_#000] active:translate-y-0.5 active:shadow-none transition-all font-cartoon flex items-center justify-center gap-2 disabled:opacity-30"
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