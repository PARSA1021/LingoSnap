'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentLine } from '@/data/contents';
import { Play, Languages, Bookmark, Volume2, Info, Music } from 'lucide-react';
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
    <div className="group relative w-full bg-white border-4 border-black rounded-3xl flex flex-col shadow-[8px_8px_0_#000] transition-all duration-300 hover:-translate-y-2 hover:-translate-x-1 overflow-hidden h-full">
      {/* Thumbnail Area - Cinematic */}
      <div className="relative h-44 sm:h-52 md:h-60 bg-black overflow-hidden border-b-4 border-black">
        {content.thumbnailUrl ? (
          <img 
            src={content.thumbnailUrl} 
            alt={content.title}
            className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center">
             <Play className="w-12 h-12 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-3 left-4 right-4">
           <div className="flex items-center gap-2 mb-1.5 font-cartoon">
             <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 border-2 border-black rounded-full uppercase tracking-widest shadow-[2px_2px_0_#000]">
               {content.difficulty}
             </span>
             <span className="flex items-center gap-1 bg-black text-white text-[9px] font-black px-2 py-0.5 border-2 border-black rounded-full uppercase tracking-widest shadow-[2px_2px_0_#000]">
               {content.category === 'song' && <Music className="w-2.5 h-2.5" />}
               {content.category}
             </span>
           </div>
           <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase font-cartoon leading-none drop-shadow-[2px_2px_0_#000]">
             {content.title}
           </h3>
           <p className="text-white/70 text-[10px] md:text-xs font-bold mt-1 uppercase tracking-tighter truncate">{content.scene}</p>
        </div>

        {/* Save/Info Buttons - Always visible on mobile, hover on desktop */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-4 md:group-hover:translate-x-0 duration-300">
           <button
             onClick={() => toggleSavedContent(content.id)}
             className={cn(
               "h-9 w-9 md:h-10 md:w-10 rounded-full border-2 md:border-4 border-black flex items-center justify-center shadow-[3px_3px_0_#000] active:translate-y-0.5 active:shadow-none transition-all",
               isSaved ? "bg-primary text-white" : "bg-white text-black"
             )}
           >
             <Bookmark className={cn("w-4 h-4 md:w-5 md:h-5", isSaved && "fill-current")} />
           </button>
           {content.explanation_ko && (
             <button
               onClick={() => setShowExplanation(!showExplanation)}
               className={cn(
                 "h-9 w-9 md:h-10 md:w-10 rounded-full border-2 md:border-4 border-black flex items-center justify-center shadow-[3px_3px_0_#000] active:translate-y-0.5 active:shadow-none transition-all",
                 showExplanation ? "bg-secondary text-white" : "bg-white text-black"
               )}
             >
               <Info className="w-4 h-4 md:w-5 md:h-5" />
             </button>
           )}
        </div>
      </div>

      <div className="p-5 md:p-8 flex flex-col flex-1 gap-6">
        {/* Expression Section */}
        {content.expression && (
          <div className="flex items-center justify-between border-b-4 border-black pb-3 group/exp cursor-help" onClick={() => speak(content.expression || '')}>
             <div className="flex-1">
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">Focus Expression</span>
               <h4 className="text-lg md:text-xl font-black text-black leading-tight mt-0.5">{content.expression}</h4>
               <p className="text-xs md:text-sm font-bold text-muted-foreground">{content.expression_ko}</p>
             </div>
             <div className="h-10 w-10 rounded-2xl border-2 border-black bg-gray-50 flex items-center justify-center shadow-[2px_2px_0_#000] group-hover/exp:bg-primary group-hover/exp:text-white group-hover/exp:shadow-[4px_4px_0_#000] group-hover/exp:-translate-y-1 transition-all">
                <Volume2 className="w-5 h-5" />
             </div>
          </div>
        )}

        {/* Main Line Section */}
        <div className="flex-1 flex flex-col justify-center py-4">
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
                    "text-2xl sm:text-3xl md:text-4xl font-black rounded-xl transition-all px-2 py-1 select-none font-reading",
                    isHidden 
                      ? "bg-black/5 text-transparent border-2 md:border-4 border-dashed border-black/20" 
                      : isHighlighted && !isQuizMode
                        ? "text-primary bg-primary/10 border-b-4 md:border-b-8 border-primary"
                        : "text-black active:scale-90 transition-transform"
                  )}
                >
                  {isHidden ? '???' : word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Note Area */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-secondary/10 border-2 border-secondary rounded-2xl italic font-bold text-black text-sm md:text-base leading-snug">
                {content.explanation_ko}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <div className="mt-auto pt-6 border-t-4 border-black/10 flex flex-col gap-6">
          
          {/* Key Vocabulary Preview (Study Helper) */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Vocabulary Preview</span>
            <div className="flex flex-wrap gap-2">
              {words.slice(0, 4).map((w, i) => (
                <span key={i} className="text-[10px] font-bold px-2 py-1 bg-muted/30 border-2 border-black/10 rounded-lg uppercase tracking-tighter">
                  {w.replace(/[^a-zA-Z]/g, '')}
                </span>
              ))}
              {words.length > 4 && <span className="text-[10px] font-bold text-muted-foreground">+{words.length - 4} more</span>}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showKo ? (
              <motion.div
                key="ko"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-black text-white text-sm md:text-lg font-bold text-center rounded-2xl border-4 border-primary shadow-[4px_4px_0_#000] -rotate-1"
              >
                {content.line_ko}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 h-14 md:h-16 rounded-2xl border-4 border-black text-base md:text-lg font-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all uppercase bg-primary text-white"
              onClick={() => speak(content.line_en)}
            >
              <Play className="mr-3 h-5 w-5 md:h-6 md:w-6 fill-current" /> PLAY
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-14 md:h-16 px-6 md:px-8 rounded-2xl border-4 border-black font-black text-sm md:text-base shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all",
                showKo ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
              )}
              onClick={() => setShowKo(!showKo)}
            >
              <Languages className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>

          <button 
            className="w-full py-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors border-2 border-dashed border-primary/30 rounded-2xl"
            onClick={() => window.location.href = `/learn/session?movie=${content.id}`}
          >
            Start Mastery Lesson →
          </button>
        </div>
      </div>
    </div>
  );
}


