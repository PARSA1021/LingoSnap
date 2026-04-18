'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Volume2, Lightbulb, Sparkles, Delete, ArrowRight } from 'lucide-react';
import { speak } from '@/lib/tts';
import { cn } from '@/lib/utils/cn';
import { useLearningStore } from '@/store/useLearningStore';

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
const shuffle = (array: any[]) => {
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
    <div className="w-full flex flex-col items-center space-y-6 py-6 max-w-2xl mx-auto px-4">
      {/* Header Area */}
      <div className="text-center space-y-4 w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 bg-black text-white px-6 py-2 border-4 border-black shadow-[4px_4px_0_#000] rotate-1">
             <Sparkles className="w-5 h-5 text-amber-400" />
             <span className="text-sm font-black uppercase tracking-[0.2em] font-cartoon">
               Scene Construction {index + 1}/{total}
             </span>
          </div>
          
          {example ? (
            <div className="space-y-4 w-full px-4 pt-2">
               <div className={cn(
                 "flex flex-wrap justify-center items-center gap-x-2 gap-y-2 font-black font-reading bg-white/50 p-6 rounded-3xl border-4 border-dashed border-black/10",
                 example.length > 60 ? "text-lg sm:text-xl" :
                 example.length > 40 ? "text-xl sm:text-2xl" :
                 "text-2xl sm:text-3xl"
               )}>
                 {sentenceParts?.map((part, i) => (
                   part.toLowerCase() === targetWord.toLowerCase() ? (
                     <span key={i} className="text-primary underline decoration-4 underline-offset-8 decoration-black/20">
                       {status === 'success' ? part : '____'}
                     </span>
                   ) : (
                     <span key={i} className="text-black/80">{part}</span>
                   )
                 ))}
               </div>
               <p className={cn(
                 "font-black text-primary font-reading italic drop-shadow-sm transition-all",
                 isVeryLong ? "text-base" : "text-lg"
               )}>
                 "{exampleTranslation}"
               </p>
            </div>
          ) : (
            <h2 className="text-4xl sm:text-5xl font-black text-primary font-cartoon uppercase drop-shadow-[3px_3px_0_#000] leading-tight break-keep">
              {meaning}
            </h2>
          )}
          
          {/* Enhanced Mode Selector */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mx-auto mt-4">
             <button 
               onClick={() => handleModeToggle(false)}
               className={cn(
                 "flex flex-col items-center gap-1.5 p-3 border-4 border-black transition-all rotate-1",
                 !isDirectMode 
                   ? "bg-black text-white shadow-none translate-y-1" 
                   : "bg-white text-black shadow-[4px_4px_0_#000] hover:-translate-y-1"
               )}
             >
               <Sparkles className={cn("w-5 h-5", !isDirectMode ? "fill-amber-400" : "text-black")} />
               <span className="text-[10px] font-black uppercase font-cartoon">Bubble Mode</span>
             </button>
             <button 
               onClick={() => handleModeToggle(true)}
               className={cn(
                 "flex flex-col items-center gap-1.5 p-3 border-4 border-black transition-all -rotate-1",
                 isDirectMode 
                   ? "bg-black text-white shadow-none translate-y-1" 
                   : "bg-white text-black shadow-[4px_4px_0_#000] hover:-translate-y-1"
               )}
             >
               <RefreshCw className={cn("w-5 h-5", isDirectMode ? "animate-spin-slow" : "")} />
               <span className="text-[10px] font-black uppercase font-cartoon">Keyboard Mode</span>
             </button>
          </div>

          <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] font-reading mt-2">
            {isDirectMode ? "Press 'Enter' to confirm when finished" : "Click the bubbles in the correct order"}
          </p>
        </div>
      </div>

      {/* Input / Slots Area */}
      <div className={cn(
        "w-full bg-white border-8 border-black p-6 sm:p-10 shadow-[12px_12px_0_#000] min-h-[140px] flex flex-wrap justify-center items-center gap-x-3 gap-y-6 transition-all",
        shake && "animate-shake border-error",
        status === 'success' && "border-success bg-success/5"
      )}>
        {isDirectMode ? (
          <div className="w-full relative px-4 py-4">
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={typedValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInputChange(typedValue)} // Manual trigger
              className={cn(
                "w-full bg-transparent text-center font-black font-reading uppercase outline-none placeholder:text-black/5",
                isVeryLong ? "text-2xl sm:text-4xl" :
                isLong ? "text-3xl sm:text-5xl" :
                "text-4xl sm:text-6xl"
              )}
              placeholder={targetWord.replace(/[a-zA-Z0-9]/g, '_')}
              spellCheck={false}
              autoComplete="off"
            />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/10 mx-10" />
            <div className="absolute bottom-0 left-0 h-2 bg-primary transition-all duration-300 mx-10" style={{ width: `${Math.min(100, (typedValue.length / targetWord.length) * 100)}%` }} />
          </div>
        ) : (
          /* Render words with gaps for spaces */
          targetWord.split(' ').map((wordPart, wordIdx) => (
            <div key={wordIdx} className="flex gap-2 items-center">
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
                      "border-b-8 border-black flex items-center justify-center font-black font-reading uppercase transition-all",
                      isVeryLong ? "w-7 h-10 sm:w-11 sm:h-14 text-xl sm:text-2xl" :
                      isLong ? "w-8 h-12 sm:w-13 sm:h-16 text-2xl sm:text-3xl" :
                      "w-10 h-14 sm:w-16 sm:h-20 text-3xl sm:text-4xl",
                      tile ? "bg-white border-4 shadow-[4px_4px_0_#000] cursor-pointer hover:bg-muted" : "border-black/10 cursor-default"
                    )}
                    initial={false}
                    animate={tile ? { scale: 1, y: 0 } : { scale: 0.95, y: 2 }}
                  >
                    {tile?.char}
                  </motion.button>
                );
              })}
              {wordIdx < targetWord.split(' ').length - 1 && (
                <div className="w-4 h-12 flex items-center justify-center opacity-20">
                  <div className="w-[4px] h-[30px] bg-black rotate-12" />
                </div>
              )}
            </div>
          )))
        }
      </div>

      {/* Interaction Controls */}
      <div className="flex gap-4">
        <Button 
          variant="secondary" 
          onClick={() => speak(word)} 
          className="h-16 w-16 rounded-full border-4 border-black shadow-[4px_4px_0_#000] bg-white text-black active:translate-y-1 active:shadow-none transition-all"
        >
          <Volume2 className="w-8 h-8" />
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleHint}
          disabled={status === 'success' || selectedIds.length === targetWord.length}
          className="h-16 w-16 rounded-full border-4 border-black shadow-[4px_4px_0_#000] bg-white text-amber-500 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
        >
          <Lightbulb className="w-8 h-8 fill-current" />
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleClear} 
          className="h-16 w-16 rounded-full border-4 border-black shadow-[4px_4px_0_#000] bg-white text-black active:translate-y-1 active:shadow-none transition-all"
        >
          <RefreshCw className="w-8 h-8" />
        </Button>
      </div>

      {/* Tiles Pool */}
      {!isDirectMode && (
        <div className="w-full flex flex-wrap justify-center gap-4 py-8">
          <AnimatePresence>
            {tiles.map((tile) => (
              !tile.isUsed && (
                <motion.button
                  key={tile.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ y: -5, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTileClick(tile.id)}
                  className={cn(
                    "bg-white border-4 border-black shadow-[6px_6px_0_#000] flex items-center justify-center font-black font-reading uppercase hover:bg-muted transition-colors cursor-pointer",
                    isVeryLong ? "w-9 h-9 sm:w-11 sm:h-11 text-lg sm:text-xl" :
                    isLong ? "w-11 h-11 sm:w-13 sm:h-13 text-xl sm:text-2xl" :
                    "w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl"
                  )}
                >
                  {tile.char}
                </motion.button>
              )
            ))}
          </AnimatePresence>
        </div>
      )}
      {/* Feedback & Success Overlay */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white border-8 border-black p-10 sm:p-14 shadow-[20px_20px_0_#000] text-center space-y-8 wobbly"
            >
              <div className="flex items-center justify-center gap-6">
                <Sparkles className="w-12 h-12 sm:w-20 sm:h-20 fill-success text-success" />
                <h2 className="text-6xl sm:text-8xl font-black text-black font-cartoon uppercase">BINGO!</h2>
                <Sparkles className="w-12 h-12 sm:w-20 sm:h-20 fill-success text-success" />
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <p className="text-2xl font-black text-black/60 uppercase tracking-widest font-cartoon">Wonderful Performance!</p>
                <div className="bg-success/10 px-6 py-2 border-4 border-dashed border-success">
                  <span className="text-xl font-black text-success uppercase font-cartoon">+50 Talkie Points</span>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={onSuccess}
                  className="w-full h-20 text-3xl border-8 border-black bg-primary text-white shadow-[10px_10px_0_#000] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all uppercase font-cartoon flex items-center justify-center gap-4"
                >
                  Next Step <ArrowRight className="w-8 h-8" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-8">
        {status === 'error' && <p className="text-error font-black uppercase text-sm font-cartoon animate-bounce">Check the sequence!</p>}
      </div>
    </div>
  );
}
