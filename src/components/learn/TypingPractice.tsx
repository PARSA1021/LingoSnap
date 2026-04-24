'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Volume2, Lightbulb, Sparkles, Delete, ArrowRight } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/utils/cn';
import { useLearningStore } from '@/store/useLearningStore';
import { formatWord, formatSentence } from '@/lib/utils/format';

interface TypingPracticeProps {
  word: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  onSuccess: () => void;
  index: number;
  total: number;
}

// Helper to shuffle array
const shuffle = <T,>(array: readonly T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export function TypingPractice({ word, meaning, example, exampleTranslation, onSuccess, index, total }: TypingPracticeProps) {
  const targetWord = word.trim().toLowerCase();
  // Array of objects to handle duplicate letters as unique tiles
  const [tiles, setTiles] = React.useState<{ id: number, char: string, isUsed: boolean }[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [status, setStatus] = React.useState<'typing' | 'success' | 'error'>('typing');
  const [shake, setShake] = React.useState(false);
  const [isDirectMode, setIsDirectMode] = React.useState(false);
  const [typedValue, setTypedValue] = React.useState('');
  const { speak, isPlaying } = useTTS();
  
  const inputRef = React.useRef<HTMLInputElement>(null);
  const addPoints = useLearningStore(state => state.addPoints);
  const incrementLearnedWords = useLearningStore(state => state.incrementLearnedWords);
  const onSuccessRef = React.useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const isLong = targetWord.length > 12;
  const isVeryLong = targetWord.length > 18;

  // Initialize tiles
  React.useEffect(() => {
    // Only create tiles for non-space characters
    const chars = targetWord.split('').map((char, i) => ({
      id: i,
      char,
      isUsed: false
    })).filter(t => t.char !== ' ');
    
    setTiles(shuffle(chars));
    setSelectedIds([]);
    setTypedValue('');
    setStatus('typing');
    // Removed auto-play speak(word) to respect user focus
  }, [word]);

  // Updated string calculation to account for auto-inserted spaces
  const getCurrentString = (ids: number[]) => {
    let result = '';
    let usedIdsCount = 0;
    
    for (let i = 0; i < targetWord.length; i++) {
      if (targetWord[i] === ' ') {
        if (usedIdsCount < ids.length || (i > 0 && targetWord[i-1] === ' ')) {
          result += ' ';
        } else {
          // If we haven't reached this part yet in the input
          break;
        }
      } else {
        if (usedIdsCount < ids.length) {
          const tile = tiles.find(t => t.id === ids[usedIdsCount]);
          result += tile?.char || '';
          usedIdsCount++;
        } else {
          break;
        }
      }
    }
    return result;
  };

  const currentString = getCurrentString(selectedIds);

  // Handle tile click
  const handleTileClick = (id: number) => {
    if (status === 'success') return;
    
    const tile = tiles.find(t => t.id === id);
    if (!tile || tile.isUsed) return;

    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);
    setTiles(prev => prev.map(t => t.id === id ? { ...t, isUsed: true } : t));

    // The 'full' string including auto-spaces is needed for validation
    const getFinalString = (ids: number[]) => {
      let result = '';
      let usedCount = 0;
      for (let i = 0; i < targetWord.length; i++) {
        if (targetWord[i] === ' ') {
          result += ' ';
        } else {
          if (usedCount < ids.length) {
            const tile = tiles.find(t => t.id === ids[usedCount]);
            result += tile?.char || '';
            usedCount++;
          }
        }
      }
      return result;
    };

    const newString = getFinalString(newSelected);
    
    if (newString.trim() === targetWord.trim()) {
      setStatus('success');
      addPoints(50);
      incrementLearnedWords();
      onSuccess();
    } else if (newSelected.length === tiles.length) {
      setStatus('error');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    if (status === 'success') return;
    const id = selectedIds[indexToRemove];
    setSelectedIds(prev => prev.filter((_, i) => i !== indexToRemove));
    setTiles(prev => prev.map(t => t.id === id ? { ...t, isUsed: false } : t));
    setStatus('typing');
  };

  const handleClear = () => {
    setSelectedIds([]);
    setTypedValue('');
    setTiles(prev => prev.map(t => ({ ...t, isUsed: false })));
    setStatus('typing');
    if (isDirectMode) setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleModeToggle = (mode: boolean) => {
    setIsDirectMode(mode);
    handleClear();
  };

  // Direct Typing Handler
  const handleInputChange = (val: string) => {
    const v = val.toLowerCase();
    setTypedValue(v);
    
    if (v.trim() === targetWord.trim()) {
      setStatus('success');
      addPoints(50);
      incrementLearnedWords();
      onSuccess();
    } else if (v.length >= targetWord.length && v.trim() !== targetWord.trim()) {
      // Basic check for completion error
      const isMismatch = v.split('').some((char, i) => targetWord[i] && char !== targetWord[i]);
      if (isMismatch) {
        setStatus('error');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } else {
      setStatus('typing');
    }
  };



  const handleHint = () => {
    if (status === 'success') return;
    
    if (isDirectMode) {
      // Auto-fill next character in input
      const nextChar = targetWord[typedValue.length];
      if (nextChar) {
        handleInputChange(typedValue + nextChar);
      }
      return;
    }

    // Find the next letter index in the targetWord that hasn't been filled
    const currentFilledString = getCurrentString(selectedIds);
    let nextLetterIndex = 0;
    
    // Sync with targetWord to find which actual character is next
    for (let i = 0; i < targetWord.length; i++) {
        if (targetWord[i] === ' ') continue;
        
        // Count how many non-space characters we've already filled
        const filledMatchCount = currentFilledString.replace(/\s/g, '').length;
        const targetMatchCount = targetWord.slice(0, i + 1).replace(/\s/g, '').length;
        
        if (targetMatchCount > filledMatchCount) {
            nextLetterIndex = i;
            break;
        }
    }

    const nextChar = targetWord[nextLetterIndex];
    const unusedMatchingTile = tiles.find(t => t.char === nextChar && !t.isUsed);
    
    if (unusedMatchingTile) {
      handleTileClick(unusedMatchingTile.id);
    }
  };

  // Keyboard support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'success') {
        if (e.key === 'Enter') onSuccessRef.current();
        return;
      }
      
      if (isDirectMode) return;

      if (e.key === 'Backspace') {
        if (selectedIds.length > 0) handleRemove(selectedIds.length - 1);
        return;
      }

      if (e.key.length === 1) {
        const char = e.key.toLowerCase();
        const availableTile = tiles.find(t => t.char === char && !t.isUsed);
        if (availableTile) handleTileClick(availableTile.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles, selectedIds, status, isDirectMode]); 

  // Split sentence to find the blank if example exists
  const sentenceParts = React.useMemo(() => {
    if (!example) return null;
    const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return example.split(regex);
  }, [example, targetWord]);

  return (
    <div className="w-full flex flex-col items-center space-y-4 py-2 max-w-2xl mx-auto px-4">
      {/* Header Area */}
      <div className="text-center space-y-2 w-full">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 bg-foreground text-background px-4 py-1 border-2 border-border shadow-[2px_2px_0_var(--border)]">
             <Sparkles className="w-4 h-4 text-amber-400" />
             <span className="text-[10px] font-black tracking-widest font-cartoon uppercase">단어 완성하기</span>
          </div>
          
           {example ? (
            <div className="space-y-2 w-full px-2">
               <div className={cn(
                 "flex flex-wrap justify-center items-center gap-x-1 gap-y-1 font-black font-reading bg-surface/50 p-3 rounded-2xl border-2 border-dashed border-border/10 italic",
                 example.length > 60 ? "text-base sm:text-lg" :
                 example.length > 40 ? "text-lg sm:text-xl" :
                 "text-xl sm:text-2xl"
               )}>
                 {sentenceParts?.map((part, i) => (
                   part.toLowerCase() === targetWord.toLowerCase() ? (
                     <span key={i} className="text-primary underline decoration-2 underline-offset-4">
                       {status === 'success' ? part : '____'}
                     </span>
                   ) : (
                     <span key={i} className="text-foreground/80">{part}</span>
                   )
                 ))}
               </div>
               <p className="text-xs font-black text-primary font-reading italic leading-tight">
                 &quot;{exampleTranslation}&quot;
               </p>
            </div>
          ) : (
            <h2 className="text-2xl sm:text-4xl font-black text-primary font-cartoon drop-shadow-sm">
              {formatWord(meaning)}
            </h2>
          )}
          
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-[200px] mx-auto mt-2">
             <button 
               onClick={() => handleModeToggle(false)}
               className={cn(
                 "flex items-center justify-center gap-1.5 p-2 border-2 border-border transition-all",
                 !isDirectMode 
                   ? "bg-foreground text-background" 
                   : "bg-surface text-foreground"
               )}
             >
               <Sparkles className={cn("w-3 h-3", !isDirectMode ? "fill-amber-400" : "text-foreground")} />
               <span className="text-[10px] font-black font-cartoon uppercase">버블</span>
             </button>
             <button 
               onClick={() => handleModeToggle(true)}
               className={cn(
                 "flex items-center justify-center gap-1.5 p-2 border-2 border-border transition-all",
                 isDirectMode 
                   ? "bg-foreground text-background" 
                   : "bg-surface text-foreground"
               )}
             >
               <RefreshCw className={cn("w-3 h-3", isDirectMode ? "animate-spin-slow" : "")} />
               <span className="text-[10px] font-black font-cartoon uppercase">키보드</span>
             </button>
          </div>
        </div>
      </div>

      {/* Slots Area */}
      <div className={cn(
        "w-full bg-surface border-4 border-border p-4 sm:p-8 shadow-[6px_6px_0_var(--border)] min-h-[100px] flex flex-wrap justify-center items-center gap-x-2 gap-y-4 transition-all",
        shake && "animate-shake border-error",
        status === 'success' && "border-success bg-success/5"
      )}>
        {isDirectMode ? (
          <div className="w-full relative px-4 py-2">
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={typedValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className={cn(
                "w-full bg-transparent text-center font-black font-reading italic outline-none placeholder:text-black/5",
                isVeryLong ? "text-xl sm:text-2xl" :
                isLong ? "text-2xl sm:text-3xl" :
                "text-3xl sm:text-4xl"
              )}
              placeholder={targetWord.replace(/[a-zA-Z0-9]/g, '_')}
              spellCheck={false}
              autoComplete="off"
            />
            <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300 mx-8" style={{ width: `${Math.min(100, (typedValue.length / targetWord.length) * 100)}%` }} />
          </div>
        ) : (
          targetWord.split(' ').map((wordPart, wordIdx) => (
            <div key={wordIdx} className="flex gap-1.5 items-center">
              {wordPart.split('').map((char, charIdx) => {
                const previousWordsLength = targetWord.split(' ').slice(0, wordIdx).join(' ').length;
                const globalIdx = (wordIdx === 0 ? 0 : previousWordsLength + 1) + charIdx;
                const nonSpaceBefore = targetWord.slice(0, globalIdx).replace(/\s/g, '').length;
                const selectedId = selectedIds[nonSpaceBefore];
                const tile = selectedId !== undefined ? tiles.find(t => t.id === selectedId) : null;

                return (
                  <motion.button
                    key={`${wordIdx}-${charIdx}`}
                    layout
                    onClick={() => tile && handleRemove(nonSpaceBefore)}
                    className={cn(
                      "border-b-4 border-border flex items-center justify-center font-black font-reading transition-all italic",
                      isVeryLong ? "w-6 h-8 sm:w-9 sm:h-11 text-lg sm:text-xl" :
                      isLong ? "w-7 h-10 sm:w-11 sm:h-14 text-xl sm:text-2xl" :
                      "w-9 h-12 sm:w-14 sm:h-18 text-2xl sm:text-3xl",
                      tile ? "bg-surface border-2 shadow-[2px_2px_0_var(--border)]" : "border-border/10"
                    )}
                  >
                    {tile?.char}
                  </motion.button>
                );
              })}
            </div>
          )))
        }
      </div>

      <div className="flex gap-3">
        <Button 
          variant="secondary" 
          onClick={() => speak(word)} 
          className={cn(
            "h-12 w-12 rounded-full border-2 border-border shadow-[2px_2px_0_var(--border)] bg-surface",
            isPlaying ? "text-primary border-primary" : "text-foreground"
          )}
        >
          <Volume2 className={cn("w-6 h-6", isPlaying && "fill-primary/20")} />
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleHint}
          disabled={status === 'success' || selectedIds.length === targetWord.length}
          className="h-12 w-12 rounded-full border-2 border-border shadow-[2px_2px_0_var(--border)] bg-surface text-amber-500 disabled:opacity-50"
        >
          <Lightbulb className="w-6 h-6 fill-current" />
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleClear} 
          className="h-12 w-12 rounded-full border-2 border-border shadow-[2px_2px_0_var(--border)] bg-surface text-foreground"
        >
          <RefreshCw className="w-6 h-6" />
        </Button>
      </div>

      {!isDirectMode && (
        <div className="w-full flex flex-wrap justify-center gap-2 py-2">
          <AnimatePresence>
            {tiles.map((tile) => (
              !tile.isUsed && (
                <motion.button
                  key={tile.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTileClick(tile.id)}
                  className={cn(
                    "bg-surface border-2 border-border shadow-[4px_4px_0_var(--border)] flex items-center justify-center font-black font-reading italic hover:bg-muted transition-colors cursor-pointer",
                    isVeryLong ? "w-8 h-8 sm:w-10 sm:h-10 text-base sm:text-lg" :
                    isLong ? "w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl" :
                    "w-12 h-12 sm:w-15 sm:h-15 text-xl sm:text-2xl"
                  )}
                >
                  {tile.char}
                </motion.button>
              )
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="h-6">
        {status === 'error' && <p className="text-error font-black text-[10px] font-cartoon animate-bounce">다시 시도해보세요!</p>}
      </div>
    </div>
  );
}
