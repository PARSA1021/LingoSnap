'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentLine } from '@/data/contents';
import { Play, Languages, Bookmark, Volume2, X, Info, Tag, Star } from 'lucide-react';
import { playTTS } from '@/lib/tts';
import { useLearningStore } from '@/store/useLearningStore';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { getNormalizedWordData, NormalizedWordData } from '@/lib/dictionary';

interface ContentCardProps {
  content: ContentLine;
  onWordClick: (word: string) => void;
  isQuizMode?: boolean;
}

export function ContentCard({ content, onWordClick, isQuizMode = false }: ContentCardProps) {
  const { savedContents, toggleSavedContent, favorites, toggleFavorite } = useLearningStore();
  const [showKo, setShowKo] = React.useState(false);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [hiddenWordIndices, setHiddenWordIndices] = React.useState<number[]>([]);
  const [activeWordData, setActiveWordData] = React.useState<NormalizedWordData | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = React.useState<number | null>(null);

  const [expressionData, setExpressionData] = React.useState<NormalizedWordData | null>(null);

  const words = React.useMemo(() => content.line_en.split(/\s+/), [content.line_en]);
  const isSaved = savedContents.includes(content.id);

  // Fetch expression data for more detail
  React.useEffect(() => {
    if (content.expression) {
      getNormalizedWordData(content.expression, content.expression_ko).then(setExpressionData);
    }
  }, [content.expression, content.expression_ko]);

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

  const handleWordClick = async (wordRaw: string, index: number) => {
    if (isQuizMode && hiddenWordIndices.includes(index)) {
      setHiddenWordIndices(prev => prev.filter(i => i !== index));
      return; 
    }

    const cleanWord = wordRaw.replace(/[^a-zA-Z0-9-']/g, '');
    if (!cleanWord) return;

    if (selectedWordIndex === index) {
      setSelectedWordIndex(null);
      setActiveWordData(null);
      return;
    }

    playTTS(cleanWord);
    setSelectedWordIndex(index);
    
    const cleanExpression = content.expression?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const isPartOfExpression = cleanExpression && cleanWord && cleanExpression.includes(cleanWord.toLowerCase());
    const contextualMeaning = isPartOfExpression ? content.expression_ko : undefined;

    const data = await getNormalizedWordData(cleanWord, contextualMeaning);
    setActiveWordData(data);
  };

  return (
    <div className="group relative w-full bg-white border-4 sm:border-8 border-black p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 shadow-[6px_6px_0_#000] sm:shadow-[10px_10px_0_#000] transition-all duration-300 wobbly-slow hover:-translate-y-2 hover:-translate-x-2 h-full">
      {/* Enhanced Metadata & Difficulty */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <p className="text-xs font-black text-black uppercase tracking-[0.2em] font-cartoon">
               {content.category} • {content.scene}
             </p>
              <div className={cn(
                "px-3 py-1 rounded-lg text-xs font-black uppercase border-4 border-black shadow-[4px_4px_0_#000]",
                difficultyColors[content.difficulty as keyof typeof difficultyColors] || "bg-white text-black"
              )}>
                {content.difficulty}
              </div>
          </div>
          <h3 className="text-lg font-black text-black uppercase font-cartoon">{content.title}</h3>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {content.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-white border-4 border-black text-xs font-black text-black uppercase font-cartoon">
                <Tag className="w-4 h-4" /> {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3">
          {content.explanation_ko && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className={cn(
                "h-12 w-12 border-4 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all wobbly",
                showExplanation ? "bg-secondary text-white" : "bg-white text-black"
              )}
              aria-label="Teacher's Note"
            >
              <Info className="w-6 h-6" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSavedContent(content.id)}
            aria-label={isSaved ? "Saved" : "Save content"}
            className={cn(
              "h-12 w-12 border-4 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all wobbly-slow",
              isSaved ? "bg-primary text-white" : "bg-white text-black"
            )}
          >
            <Bookmark className={cn("w-6 h-6", isSaved && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Main English Line - Natural Sentence Layout with Highlights */}
      <div className="flex flex-wrap gap-x-2 gap-y-3 justify-center py-4 sm:py-8">
        {words.map((word, i) => {
          const isHidden = hiddenWordIndices.includes(i);
          const isSelected = selectedWordIndex === i;
          
          const cleanExpression = content.expression?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isPartOfExpression = cleanExpression && cleanWord && cleanExpression.includes(cleanWord);
          const isHighlighted = isPartOfExpression && !isQuizMode;
          
          return (
            <button
              key={`${word}-${i}`}
              onClick={() => handleWordClick(word, i)}
              className={cn(
                "relative text-4xl sm:text-5xl font-bold rounded transition-all px-2 py-1 select-none touch-manipulation font-reading",
                isHidden 
                  ? "bg-white text-transparent min-w-[80px] border-8 border-dashed border-black shadow-[8px_8px_0_0_#000]" 
                  : isSelected
                    ? "text-primary bg-white border-8 border-primary shadow-[8px_8px_0_0_#000] rotate-3 scale-110"
                    : isHighlighted
                      ? "text-black underline decoration-primary decoration-[6px] underline-offset-8 decoration-solid"
                      : "text-black hover:text-primary active:scale-95"
              )}
            >
              {isHidden ? '?' : word}
            </button>
          );
        })}
      </div>

      {/* Enhanced Key Expression Section */}
      {content.expression && (
        <div className="relative overflow-hidden group/expression px-4 py-6 sm:px-8 sm:py-10 bg-white border-4 sm:border-8 border-primary shadow-[6px_6px_0_0_#000] sm:shadow-[10px_10px_0_0_#000] transition-all hover:-rotate-1 wobbly-slow">
           <div className="flex justify-between items-start mb-4">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-primary text-white border-4 border-black shadow-[2px_2px_0_#000]">
                 <Star className="w-5 h-5 fill-current" />
               </div>
               <span className="text-sm font-black text-black uppercase tracking-widest font-cartoon">오늘의 핵심 표현</span>
             </div>
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => playTTS(content.expression || '')} 
               className="h-10 w-10 border-4 border-black shadow-[2px_2px_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
             >
               <Volume2 className="w-5 h-5" />
             </Button>
           </div>
           
           <div className="space-y-2">
              <h4 className="text-2xl sm:text-4xl font-black text-black leading-tight uppercase font-lilita">
                {content.expression}
              </h4>
              {(content.expression_ko || expressionData?.meaning) && (
                <p className="text-xl sm:text-2xl font-black text-primary break-keep mt-2">
                  {content.expression_ko || expressionData?.meaning}
                </p>
              )}
           </div>

           <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 pointer-events-none">
             <Star className="w-32 h-32 text-primary" />
           </div>
        </div>
      )}

      {/* Teacher's Note Section */}
      <AnimatePresence>
        {showExplanation && content.explanation_ko && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 bg-secondary/10 border-8 border-secondary shadow-[8px_8px_0_#000] space-y-3 wobbly">
               <div className="flex items-center gap-3 mb-2">
                 <Info className="w-6 h-6 text-secondary" />
                 <p className="text-sm font-black text-secondary uppercase tracking-[0.2em] font-cartoon">학습 포인트</p>
               </div>
               <p className="text-2xl font-black text-black leading-relaxed">
                  {content.explanation_ko}
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeWordData && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white border-8 border-black p-8 sm:p-10 space-y-6 relative shadow-[12px_12px_0_#000] wobbly mt-4">
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  <button 
                    onClick={() => {
                        if (activeWordData) {
                            toggleFavorite({
                                word: activeWordData.word,
                                meaning: activeWordData.meaning,
                                example: activeWordData.example,
                                phonetic: activeWordData.phonetic,
                                category: 'daily'
                            });
                        }
                    }}
                    className={cn(
                        "p-3 border-4 border-black transition-all",
                        favorites.some(f => f.word === activeWordData?.word) 
                            ? "bg-warning text-black" 
                            : "bg-white text-black hover:bg-warning/20"
                    )}
                    aria-label="Save Word"
                  >
                    <Star className={cn("w-6 h-6", favorites.some(f => f.word === activeWordData?.word) && "fill-current")} />
                  </button>
                  <button 
                    onClick={() => { setActiveWordData(null); setSelectedWordIndex(null); }}
                    className="p-3 bg-white border-4 border-black hover:bg-error/20 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-primary text-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0_#000]">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-4xl font-black text-black uppercase font-cartoon">{activeWordData.word}</h4>
                    <p className="text-lg font-black text-primary">{activeWordData.phonetic}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t-4 border-black pt-4">
                  <p className="text-3xl font-black text-black leading-snug uppercase font-cartoon">
                    {activeWordData.meaning}
                  </p>
                  {activeWordData.example && (
                    <p className="text-lg font-black text-black/60 italic">
                      &quot;{activeWordData.example}&quot;
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onWordClick(activeWordData.word)}
                  className="w-full justify-center h-14 text-lg font-black uppercase text-white bg-black border-4 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all font-cartoon"
                >
                  상세 정보 보기
                </Button>
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
            onClick={() => playTTS(content.line_en)}
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
