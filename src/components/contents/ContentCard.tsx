'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentLine } from '@/data/contents';
import { Play, Languages, Bookmark, Volume2, Search, X } from 'lucide-react';
import { playTTS } from '@/lib/tts';
import { useLearningStore } from '@/store/useLearningStore';
import { cn } from '@/lib/utils/cn';

interface ContentCardProps {
  content: ContentLine;
  onWordClick: (word: string) => void;
  isQuizMode?: boolean;
}

export function ContentCard({ content, onWordClick, isQuizMode = false }: ContentCardProps) {
  const { savedContents, toggleSavedContent } = useLearningStore();
  const [showKo, setShowKo] = React.useState(false);
  const [selection, setSelection] = React.useState<{ start: number; end: number } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  
  const [hiddenWordIndices, setHiddenWordIndices] = React.useState<number[]>([]);

  const words = React.useMemo(() => content.line_en.split(/\s+/), [content]);
  const isSaved = savedContents.includes(content.id);

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

  const handlePointerDown = (index: number) => {
    setIsDragging(true);
    setSelection({ start: index, end: index });
  };

  const handlePointerEnter = (index: number) => {
    if (isDragging && selection) {
      setSelection({ ...selection, end: index });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    if (selection && selection.start === selection.end) {
      const wordRaw = words[selection.start];
      handleSingleWordClick(wordRaw, selection.start);
      setSelection(null);
    }
  };

  const handleSingleWordClick = (wordRaw: string, index: number) => {
    if (isQuizMode && hiddenWordIndices.includes(index)) {
      setHiddenWordIndices(prev => prev.filter(i => i !== index));
    }
    const cleanWord = wordRaw.replace(/[^a-zA-Z0-9-']/g, '');
    if (cleanWord) {
      playTTS(cleanWord, 'en-US'); 
      onWordClick(cleanWord);      
    }
  };

  const getSelectedText = () => {
    if (!selection) return '';
    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);
    return words.slice(start, end + 1).join(' ');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelection(null);
  };

  const isIndexSelected = (index: number) => {
    if (!selection) return false;
    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);
    return index >= start && index <= end;
  };

  return (
    <motion.div
      layout
      className={cn(
        "relative w-full h-full bg-surface card-tactile p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all duration-300 overflow-visible select-none",
        showKo ? "border-primary" : "border-border"
      )}
      onPointerLeave={() => setIsDragging(false)}
    >
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{content.category} • {content.scene}</span>
             <h3 className="font-black text-foreground text-xl sm:text-2xl leading-tight tracking-tight">{content.title}</h3>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); toggleSavedContent(content.id); }}
            className={cn(
              "p-2.5 rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all",
              isSaved ? "bg-error text-white border-error/30" : "bg-muted text-muted-foreground border-border"
            )}
          >
            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
          </motion.button>
        </div>

        <div className="relative flex flex-wrap gap-x-1.5 gap-y-3 py-2 min-h-[80px]" onPointerUp={handlePointerUp}>
          {words.map((word, i) => {
            const isHidden = hiddenWordIndices.includes(i);
            const isSelected = isIndexSelected(i);
            
            return (
              <motion.span
                key={`${word}-${i}`}
                onPointerDown={() => handlePointerDown(i)}
                onPointerEnter={() => handlePointerEnter(i)}
                className={cn(
                  "text-xl sm:text-3xl font-black rounded-lg transition-all px-1.5 py-0.5 cursor-pointer",
                  isHidden && !isSelected 
                    ? "bg-muted text-transparent border-2 border-dashed border-border w-20 h-8 sm:h-10" 
                    : "text-foreground",
                  isSelected && "bg-accent text-accent-foreground ring-2 ring-accent-foreground/20 shadow-sm",
                  !isSelected && !isHidden && "hover:text-primary active:scale-95"
                )}
              >
                {isHidden && !isSelected ? '' : word}
              </motion.span>
            );
          })}

          <AnimatePresence>
            {selection && selection.start !== selection.end && !isDragging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-primary/20 rounded-2xl shadow-tactile p-2 flex items-center gap-2 min-w-max"
              >
                 <button onClick={() => playTTS(getSelectedText(), 'en-US')} className="p-2 hover:bg-accent rounded-lg text-primary transition-colors"><Volume2 className="w-5 h-5" /></button>
                 <button onClick={() => { onWordClick(getSelectedText()); setSelection(null); }} className="p-2 hover:bg-accent rounded-lg text-primary transition-colors"><Search className="w-5 h-5" /></button>
                 <button onClick={clearSelection} className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors"><X className="w-5 h-5" /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showKo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-5 bg-muted rounded-2xl border-2 border-border/50 text-lg font-black text-foreground break-keep leading-snug"
            >
              {content.line_ko}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex justify-between items-center pt-4 border-t border-border/20">
        <button 
          onClick={() => setShowKo(!showKo)}
          className="text-xs font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
        >
          <Languages className="w-4 h-4" />
          {showKo ? 'Hide Translation' : 'See Translation'}
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); playTTS(content.line_en, 'en-US'); }}
          className="p-3 bg-primary text-white rounded-xl btn-tactile border-primary/30"
        >
          <Play className="w-5 h-5 fill-current" />
        </motion.button>
      </div>
    </motion.div>
  );
}
