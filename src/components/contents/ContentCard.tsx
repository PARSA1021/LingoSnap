'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentLine } from '@/data/contents';
import { Play, Languages, Bookmark, Volume2, Info } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useLearningStore } from '@/store/useLearningStore';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

interface ContentCardProps {
  content: ContentLine;
  onWordClick?: (word: string) => void;
  isQuizMode?: boolean;
}

export function ContentCard({ content, onWordClick, isQuizMode = false }: ContentCardProps) {
  const { savedContents, toggleSavedContent } = useLearningStore();
  const { speak, isPlaying } = useTTS();
  const [showKo, setShowKo] = React.useState(false);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [hiddenWordIndices, setHiddenWordIndices] = React.useState<number[]>([]);

  const words = React.useMemo(() => content.line_en.split(/\s+/), [content.line_en]);
  const isSaved = savedContents.includes(content.id);

  // Difficulty styling
  const difficultyColors = {
    easy: "bg-success text-white border-black",
    medium: "bg-warning text-black border-black",
    hard: "bg-primary text-white border-black"
  };

  React.useEffect(() => {
    if (isQuizMode) {
      const numToHide = Math.min(words.length, words.length > 5 ? 2 : 1);
      const indices: number[] = [];
      while (indices.length < numToHide) {
        const r = Math.floor(Math.random() * words.length);
        if (!indices.includes(r)) indices.push(r);
      }
      setHiddenWordIndices(indices);
    } else {
      setHiddenWordIndices([]);
    }
  }, [isQuizMode, words]);

  const handleWordClick = (wordRaw: string, index: number) => {
    if (isQuizMode && hiddenWordIndices.includes(index)) {
      setHiddenWordIndices(prev => prev.filter(i => i !== index));
      return; 
    }

    const cleanWord = wordRaw.replace(/[^a-zA-Z0-9-']/g, '');
    if (!cleanWord) return;

    speak(cleanWord);
  };

  return (
    <div className="group relative w-full bg-white border-4 sm:border-8 border-black p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 shadow-[6px_6px_0_#000] sm:shadow-[10px_10px_0_#000] transition-all duration-300 wobbly-slow hover:-translate-y-2 hover:-translate-x-2 h-full">
      {/* Enhanced Metadata & Difficulty */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
             <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black">
               {content.category}
             </span>
             <div className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0_#000]",
                difficultyColors[content.difficulty as keyof typeof difficultyColors] || "bg-white text-black"
              )}>
                {content.difficulty}
              </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-black uppercase font-cartoon leading-none">{content.title}</h3>
        </div>
        
        <div className="flex gap-2 ml-auto sm:ml-0">
          {content.explanation_ko && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className={cn(
                "h-10 w-10 border-4 border-black shadow-[3px_3px_0_#000] active:translate-y-1 active:shadow-none transition-all wobbly",
                showExplanation ? "bg-secondary text-white" : "bg-white text-black"
              )}
            >
              <Info className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSavedContent(content.id)}
            className={cn(
              "h-10 w-10 border-4 border-black shadow-[3px_3px_0_#000] active:translate-y-1 active:shadow-none transition-all",
              isSaved ? "bg-primary text-white" : "bg-white text-black"
            )}
          >
            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Main English Line - Vertical Focus */}
      <div className="py-6 sm:py-10 flex flex-col items-center gap-4">
        <div className="flex flex-wrap gap-x-2 gap-y-3 justify-center">
          {words.map((word, i) => {
            const isHidden = hiddenWordIndices.includes(i);
            const cleanExpression = content.expression?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
            const isHighlighted = cleanExpression && cleanWord && cleanExpression.includes(cleanWord);
            
            return (
              <button
                key={`${word}-${i}`}
                onClick={() => handleWordClick(word, i)}
                className={cn(
                  "text-3xl sm:text-5xl font-black rounded transition-all px-1.5 py-0.5 select-none font-reading",
                  isHidden 
                    ? "bg-black/5 text-transparent border-4 border-dashed border-black/20" 
                    : isHighlighted && !isQuizMode
                      ? "text-primary underline decoration-primary decoration-[4px] underline-offset-4"
                      : "text-black active:scale-95 transition-transform"
                )}
              >
                {isHidden ? '???' : word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Expression - More Integrated */}
      {content.expression && (
        <div className="bg-primary/5 border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0_#000] relative overflow-hidden group/exp">
           <div className="flex items-center justify-between mb-2">
             <div className="bg-primary text-white text-[8px] font-black px-2 py-0.5 border-2 border-black uppercase tracking-widest">KEY POINT</div>
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => speak(content.expression || '')} 
               className="h-8 w-8 border-2 border-black bg-white"
             >
               <Volume2 className="w-4 h-4" />
             </Button>
           </div>
           <h4 className="text-xl font-black text-black font-lilita italic">{content.expression}</h4>
           <p className="text-lg font-black text-primary mt-1 line-clamp-1">{content.expression_ko}</p>
        </div>
      )}

      {/* Teacher's Note */}
      <AnimatePresence>
        {showExplanation && content.explanation_ko && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-secondary/10 border-4 border-secondary shadow-[4px_4px_0_#000] mt-2 italic font-bold text-black border-dashed">
              ↳ {content.explanation_ko}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integrated Translation & Controls */}
      <div className="space-y-8 pt-6 border-t-8 border-black">
        <AnimatePresence mode="wait">
          {showKo ? (
            <motion.div
              key="ko-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 sm:p-10 bg-black text-white text-xl sm:text-4xl font-black text-center break-keep border-4 sm:border-8 border-primary shadow-[6px_6px_0_#000] sm:shadow-[10px_10px_0_#000] font-cartoon -rotate-1"
            >
              {content.line_ko}
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-16 flex items-center justify-center"
            >
              <button 
                onClick={() => setShowKo(true)}
                className="text-lg font-black text-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-4 border-b-8 border-black font-cartoon"
              >
                <Languages className="w-6 h-6 text-primary" /> Reveal Translation
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center gap-6">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => speak(content.line_en)}
            className="flex-1 h-20 border-8 border-black text-2xl font-black bg-secondary text-white shadow-[8px_8px_0_#000] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all uppercase font-cartoon"
            aria-label="Listen to full sentence"
          >
            <Play className="mr-4 h-8 w-8 fill-current" /> 문장 듣기
          </Button>
          
          {showKo && (
            <Button
              variant="ghost"
              onClick={() => setShowKo(false)}
              className="h-20 px-8 border-8 border-black font-black text-black bg-white shadow-[8px_8px_0_#000] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all uppercase font-cartoon"
            >
              숨기기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
