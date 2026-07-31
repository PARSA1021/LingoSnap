'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Volume2, Lightbulb, Sparkles } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/utils/cn';
import { useLearningStore } from '@/store/useLearningStore';
import { formatWord } from '@/lib/utils/format';

interface TypingPracticeProps {
  word: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  onSuccess: () => void;
  index: number;
  total: number;
}

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

  React.useEffect(() => {
    const chars = targetWord.split('').map((char, i) => ({
      id: i,
      char,
      isUsed: false
    })).filter(t => t.char !== ' ');
    
    setTiles(shuffle(chars));
    setSelectedIds([]);
    setTypedValue('');
    setStatus('typing');
  }, [word, targetWord]);

  const getCurrentString = (ids: number[]) => {
    let result = '';
    let usedIdsCount = 0;
    
    for (let i = 0; i < targetWord.length; i++) {
      if (targetWord[i] === ' ') {
        if (usedIdsCount < ids.length || (i > 0 && targetWord[i-1] === ' ')) {
          result += ' ';
        } else {
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

  const handleTileClick = (id: number) => {
    if (status === 'success') return;
    
    const tile = tiles.find(t => t.id === id);
    if (!tile || tile.isUsed) return;

    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);
    setTiles(prev => prev.map(t => t.id === id ? { ...t, isUsed: true } : t));

    const getFinalString = (ids: number[]) => {
      let result = '';
      let usedCount = 0;
      for (let i = 0; i < targetWord.length; i++) {
        if (targetWord[i] === ' ') {
          result += ' ';
        } else {
          if (usedCount < ids.length) {
            const tileItem = tiles.find(t => t.id === ids[usedCount]);
            result += tileItem?.char || '';
            usedCount++;
          }
        }
      }
      return result;
    };

    const newString = getFinalString(newSelected);
    const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,!?;:]+$/, "");
    
    if (normalize(newString) === normalize(targetWord)) {
      setStatus('success');
      addPoints(15);
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

  const handleInputChange = (val: string) => {
    const v = val.toLowerCase();
    setTypedValue(v);
    
    const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,!?;:]+$/, "");
    
    if (normalize(v) === normalize(targetWord)) {
      setStatus('success');
      addPoints(15);
      incrementLearnedWords();
      onSuccess();
    } else if (v.length >= targetWord.length && normalize(v) !== normalize(targetWord)) {
      const isMismatch = v.split('').some((char, i) => targetWord[i] && char.toLowerCase() !== targetWord[i].toLowerCase());
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
      const nextChar = targetWord[typedValue.length];
      if (nextChar) {
        handleInputChange(typedValue + nextChar);
      }
      return;
    }

    const currentFilledString = getCurrentString(selectedIds);
    let nextLetterIndex = 0;
    
    for (let i = 0; i < targetWord.length; i++) {
      if (targetWord[i] === ' ') continue;
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

  const sentenceParts = React.useMemo(() => {
    if (!example) return null;
    const escaped = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return example.split(regex);
  }, [example, targetWord]);

  return (
    <div className="w-full flex flex-col items-center space-y-4 py-2 max-w-xl mx-auto px-3 sm:px-4">
      {/* Header Area */}
      <div className="text-center space-y-2 w-full">
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full border border-[var(--color-primary)]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-black tracking-wider uppercase">철자 / 문장 완성</span>
          </div>
          
          {example ? (
            <div className="space-y-2 w-full px-2">
              <div className={cn(
                "flex flex-wrap justify-center items-center gap-x-1 gap-y-1 font-black bg-[var(--color-surface)] p-4 rounded-2xl border border-[var(--color-border)] italic shadow-xs",
                example.length > 60 ? "text-base sm:text-lg" : "text-lg sm:text-xl"
              )}>
                {sentenceParts?.map((part, i) => (
                  part.toLowerCase() === targetWord.toLowerCase() ? (
                    <span key={i} className="text-[var(--color-primary)] underline decoration-2 underline-offset-4">
                      {status === 'success' ? part : '____'}
                    </span>
                  ) : (
                    <span key={i} className="text-[var(--color-foreground)]">{part}</span>
                  )
                ))}
              </div>
              <p className="text-xs font-bold text-[var(--color-muted-foreground)] italic leading-tight">
                &quot;{exampleTranslation}&quot;
              </p>
            </div>
          ) : (
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-primary)] drop-shadow-xs">
              {formatWord(meaning)}
            </h2>
          )}
          
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 w-48 mx-auto mt-1">
            <button 
              onClick={() => handleModeToggle(false)}
              className={cn(
                "flex items-center justify-center gap-1 p-1.5 rounded-xl border text-xs font-bold transition-all",
                !isDirectMode 
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm" 
                  : "bg-[var(--color-surface)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
              )}
            >
              <Sparkles className="w-3 h-3" />
              <span>버블 모드</span>
            </button>
            <button 
              onClick={() => handleModeToggle(true)}
              className={cn(
                "flex items-center justify-center gap-1 p-1.5 rounded-xl border text-xs font-bold transition-all",
                isDirectMode 
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm" 
                  : "bg-[var(--color-surface)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
              )}
            >
              <RefreshCw className="w-3 h-3" />
              <span>키보드 모드</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slots Area */}
      <div className={cn(
        "w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow min-h-[90px] flex flex-wrap justify-center items-center gap-x-2 gap-y-3 transition-all rounded-3xl",
        shake && "animate-shake border-rose-500",
        status === 'success' && "border-emerald-500 bg-emerald-500/10"
      )}>
        {isDirectMode ? (
          <div className="w-full relative px-2 py-2">
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={typedValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className={cn(
                "w-full bg-[var(--color-background)] border-2 border-dashed border-[var(--color-border)] p-4 text-center font-black italic outline-none rounded-2xl transition-all focus:border-[var(--color-primary)]",
                isVeryLong ? "text-lg sm:text-xl" :
                isLong ? "text-xl sm:text-2xl" :
                "text-2xl sm:text-4xl"
              )}
              placeholder={targetWord.replace(/[a-zA-Z0-9]/g, '_')}
              spellCheck={false}
              autoComplete="off"
            />
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
                      "border-b-3 border-[var(--color-border)] flex items-center justify-center font-black transition-all italic rounded-xl",
                      isVeryLong ? "w-7 h-9 sm:w-9 sm:h-11 text-base sm:text-lg" :
                      isLong ? "w-8 h-11 sm:w-10 sm:h-13 text-xl sm:text-2xl" :
                      "w-10 h-12 sm:w-13 sm:h-16 text-2xl sm:text-3xl",
                      tile ? "bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm scale-105" : "bg-[var(--color-muted)]/40"
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

      {/* Control Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="secondary" 
          onClick={() => speak(word)} 
          className={cn(
            "h-11 w-11 rounded-full border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]",
            isPlaying ? "text-[var(--color-primary)] border-[var(--color-primary)]" : "text-[var(--color-foreground)]"
          )}
        >
          <Volume2 className="w-5 h-5" />
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleHint}
          disabled={status === 'success' || selectedIds.length === targetWord.length}
          className="h-11 w-11 rounded-full border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)] text-amber-500 disabled:opacity-40"
        >
          <Lightbulb className="w-5 h-5 fill-current" />
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleClear} 
          className="h-11 w-11 rounded-full border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)] text-[var(--color-foreground)]"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>

      {/* Tile Bubbles */}
      {!isDirectMode && (
        <div className="w-full flex flex-wrap justify-center gap-2 py-1">
          <AnimatePresence>
            {tiles.map((tile) => (
              !tile.isUsed && (
                <motion.button
                  key={tile.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleTileClick(tile.id)}
                  className={cn(
                    "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xs flex items-center justify-center font-black italic hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer active:scale-95",
                    isVeryLong ? "w-9 h-9 sm:w-10 sm:h-10 text-base" :
                    isLong ? "w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl" :
                    "w-12 h-12 sm:w-15 sm:h-15 text-xl sm:text-3xl"
                  )}
                >
                  {tile.char}
                </motion.button>
              )
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="h-4">
        {status === 'error' && <p className="text-rose-500 font-bold text-xs animate-bounce">다시 한번 확인해보세요!</p>}
      </div>
    </div>
  );
}
