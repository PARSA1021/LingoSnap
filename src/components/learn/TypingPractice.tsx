'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Volume2, Lightbulb, Sparkles, Delete } from 'lucide-react';
import { speak } from '@/lib/tts';
import { cn } from '@/lib/utils/cn';

interface TypingPracticeProps {
  word: string;
  meaning: string;
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

export function TypingPractice({ word, meaning, onSuccess, index, total }: TypingPracticeProps) {
  const targetWord = word.trim().toLowerCase();
  // Array of objects to handle duplicate letters as unique tiles
  const [tiles, setTiles] = React.useState<{ id: number, char: string, isUsed: boolean }[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [status, setStatus] = React.useState<'typing' | 'success' | 'error'>('typing');
  const [shake, setShake] = React.useState(false);

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
    setStatus('typing');
    speak(word);
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
      setTimeout(onSuccess, 1200);
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
    setTiles(prev => prev.map(t => ({ ...t, isUsed: false })));
    setStatus('typing');
  };

  const handleHint = () => {
    const nextCharIndex = selectedIds.length;
    if (nextCharIndex < targetWord.length) {
      const nextChar = targetWord[nextCharIndex];
      const unusedMatchingTile = tiles.find(t => t.char === nextChar && !t.isUsed);
      if (unusedMatchingTile) {
        handleTileClick(unusedMatchingTile.id);
      }
    }
  };

  // Keyboard support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'success') return;
      if (e.key === 'Backspace') {
        if (selectedIds.length > 0) handleRemove(selectedIds.length - 1);
      } else if (e.key.length === 1) {
        const char = e.key.toLowerCase();
        const availableTile = tiles.find(t => t.char === char && !t.isUsed);
        if (availableTile) handleTileClick(availableTile.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tiles, selectedIds, status]);

  return (
    <div className="w-full flex flex-col items-center space-y-8 py-6 max-w-2xl mx-auto px-4">
      {/* Header Area */}
      <div className="text-center space-y-4 w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 bg-black text-white px-6 py-2 border-4 border-black shadow-[4px_4px_0_#000] rotate-1">
             <Sparkles className="w-5 h-5 text-amber-400" />
             <span className="text-sm font-black uppercase tracking-[0.2em] font-cartoon">
               Word Puzzle {index + 1}/{total}
             </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-primary font-cartoon uppercase drop-shadow-[3px_3px_0_#000] leading-tight break-keep">
            {meaning}
          </h2>
          <p className="text-sm font-bold text-black/40 uppercase tracking-widest font-reading">Click tiles to spell the word</p>
        </div>
      </div>

      {/* Slots Area */}
      <div className={cn(
        "w-full bg-white border-8 border-black p-6 sm:p-10 shadow-[12px_12px_0_#000] min-h-[140px] flex flex-wrap justify-center items-center gap-x-3 gap-y-6 transition-all",
        shake && "animate-shake border-error",
        status === 'success' && "border-success bg-success/5"
      )}>
        {/* Render words with gaps for spaces */}
        {targetWord.split(' ').map((wordPart, wordIdx) => (
          <div key={wordIdx} className="flex gap-2 items-center">
            {wordPart.split('').map((char, charIdx) => {
              // Calculate the global index of this character
              const previousWordsLength = targetWord.split(' ').slice(0, wordIdx).join(' ').length;
              const globalIdx = (wordIdx === 0 ? 0 : previousWordsLength + 1) + charIdx;
              
              // Find which selectedId corresponds to this non-space character
              // We count how many non-space characters come before globalIdx
              const nonSpaceBefore = targetWord.slice(0, globalIdx).replace(/\s/g, '').length;
              const selectedId = selectedIds[nonSpaceBefore];
              const tile = selectedId !== undefined ? tiles.find(t => t.id === selectedId) : null;

              return (
                <motion.button
                  key={`${wordIdx}-${charIdx}`}
                  layout
                  onClick={() => tile && handleRemove(nonSpaceBefore)}
                  className={cn(
                    "w-10 h-14 sm:w-16 sm:h-20 border-b-8 border-black flex items-center justify-center text-3xl sm:text-4xl font-black font-reading uppercase transition-all",
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
        ))}
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
                className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-4 border-black shadow-[6px_6px_0_#000] flex items-center justify-center text-2xl sm:text-3xl font-black font-reading uppercase hover:bg-muted transition-colors cursor-pointer"
              >
                {tile.char}
              </motion.button>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Feedback & Success Overlay */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-black/5"
          >
            <div className="bg-success text-white px-10 py-6 border-8 border-black shadow-[20px_20px_0_#000] text-5xl sm:text-7xl font-black font-cartoon uppercase -rotate-2 flex items-center gap-6">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 fill-current text-white" />
              BINGO!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-8">
        {status === 'error' && <p className="text-error font-black uppercase text-sm font-cartoon animate-bounce">Check the sequence!</p>}
      </div>
    </div>
  );
}
