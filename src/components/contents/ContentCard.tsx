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
      // Prioritize our hand-crafted natural meaning (expression_ko)
      getNormalizedWordData(content.expression, content.expression_ko).then(setExpressionData);
    }
  }, [content.expression, content.expression_ko]);

  // Difficulty styling
  const difficultyColors = {
    easy: "bg-success text-white border-success-shadow",
    medium: "bg-warning text-white border-warning-shadow",
    hard: "bg-error text-white border-error-shadow"
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

    playTTS(cleanWord, 'en-US');
    setSelectedWordIndex(index);
    
    // Check if word is part of the key expression for contextual meaning
    const cleanExpression = content.expression?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const isPartOfExpression = cleanExpression && cleanWord && cleanExpression.includes(cleanWord.toLowerCase());
    const contextualMeaning = isPartOfExpression ? content.expression_ko : undefined;

    // Inline Dictionary Lookup with contextual fallback
    const data = await getNormalizedWordData(cleanWord, contextualMeaning);
    setActiveWordData(data);
  };

  // Helper to check if a word is part of the key expression
  const isKeyExpression = (word: string) => {
    return content.expression && word.toLowerCase().includes(content.expression.toLowerCase().split(' ')[0]);
  };

  return (
    <div className="group relative w-full bg-surface card-tactile p-8 sm:p-10 flex flex-col gap-6 transition-all duration-300">
      {/* Enhanced Metadata & Difficulty */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">
               {content.category} • {content.scene}
             </p>
             <div className={cn(
               "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border-b-2",
               difficultyColors[content.difficulty as keyof typeof difficultyColors] || "bg-muted text-muted-foreground"
             )}>
               {content.difficulty}
             </div>
          </div>
          <h3 className="text-sm font-bold text-muted-foreground/80">{content.title}</h3>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {content.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-lg text-[10px] font-bold text-muted-foreground">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          {content.explanation_ko && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className={cn(
                "p-2 h-auto rounded-xl",
                showExplanation ? "text-primary bg-primary/10" : "text-muted-foreground/40"
              )}
              aria-label="Teacher's Note"
            >
              <Info className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSavedContent(content.id)}
            aria-label={isSaved ? "Saved" : "Save content"}
            className={cn(
              "p-2 h-auto rounded-xl",
              isSaved ? "text-error" : "text-muted-foreground/40"
            )}
          >
            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Main English Line - Natural Sentence Layout with Highlights */}
      <div className="flex flex-wrap gap-x-1 gap-y-2 justify-center py-6">
        {words.map((word, i) => {
          const isHidden = hiddenWordIndices.includes(i);
          const isSelected = selectedWordIndex === i;
          
          // Check if word is part of the key expression
          const cleanExpression = content.expression?.toLowerCase().replace(/[^a-z0-9\s]/g, '');
          const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isPartOfExpression = cleanExpression && cleanWord && cleanExpression.includes(cleanWord);
          const isHighlighted = isPartOfExpression && !isQuizMode;
          
          return (
            <button
              key={`${word}-${i}`}
              onClick={() => handleWordClick(word, i)}
              className={cn(
                "relative text-2xl sm:text-4xl font-black rounded transition-all px-0.5 select-none touch-manipulation",
                isHidden 
                  ? "bg-muted text-transparent min-w-[60px] border-2 border-dashed border-border" 
                  : isSelected
                    ? "text-primary bg-primary/10 shadow-[0_2px_0_0_rgba(var(--primary-shadow),0.2)]"
                    : isHighlighted
                      ? "text-foreground underline decoration-primary/30 decoration-4 underline-offset-8"
                      : "text-foreground hover:text-primary active:scale-95"
              )}
            >
              {isHidden ? '' : word}
              {isSelected && !isHidden && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Enhanced Key Expression Section */}
      {content.expression && (
        <div className="relative overflow-hidden group/expression px-6 py-6 bg-primary/5 rounded-[2.5rem] border-2 border-primary/20 transition-all hover:bg-primary/10">
           <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-2">
               <div className="p-1.5 bg-primary text-white rounded-lg shadow-sm">
                 <Star className="w-3 h-3 fill-current" />
               </div>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">오늘의 핵심 표현</span>
             </div>
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => playTTS(content.expression || '', 'en-US')} 
               className="h-8 w-8 p-0 rounded-full text-primary hover:bg-primary/20"
             >
               <Volume2 className="w-4 h-4" />
             </Button>
           </div>
           
           <div className="space-y-1">
             <h4 className="text-xl font-black text-foreground leading-tight">
               {content.expression}
             </h4>
             {(content.expression_ko || expressionData?.meaning) && (
               <p className="text-base font-bold text-primary/80 break-keep">
                 {content.expression_ko || expressionData?.meaning}
               </p>
             )}
           </div>

           {/* Decorative background element */}
           <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 pointer-events-none">
             <Star className="w-24 h-24 text-primary" />
           </div>
        </div>
      )}

      {/* Teacher's Note Section - Integrated closer to expression */}
      <AnimatePresence>
        {showExplanation && content.explanation_ko && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-info/5 rounded-3xl border-l-[6px] border-info/40 space-y-2">
               <div className="flex items-center gap-2 mb-1">
                 <Info className="w-4 h-4 text-info/60" />
                 <p className="text-[10px] font-black text-info/60 uppercase tracking-widest">학습 포인트</p>
               </div>
               <p className="text-base font-bold text-foreground leading-relaxed">
                 {content.explanation_ko}
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeWordData && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.98 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
              <div className="bg-muted/30 rounded-3xl border-2 border-primary/20 p-6 space-y-4 relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
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
                        "p-2 rounded-xl transition-all",
                        favorites.some(f => f.word === activeWordData?.word) 
                            ? "bg-warning/20 text-warning" 
                            : "text-muted-foreground/30 hover:text-warning"
                    )}
                    aria-label="Save Word"
                  >
                    <Star className={cn("w-5 h-5", favorites.some(f => f.word === activeWordData?.word) && "fill-current")} />
                  </button>
                  <button 
                    onClick={() => { setActiveWordData(null); setSelectedWordIndex(null); }}
                    className="p-2 text-muted-foreground/30 hover:text-error transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-tactile border-b-primary-shadow">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-foreground capitalize">{activeWordData.word}</h4>
                    <p className="text-sm font-bold text-primary">{activeWordData.phonetic}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xl font-black text-foreground leading-tight">
                    {activeWordData.meaning}
                  </p>
                  {activeWordData.example && (
                    <p className="text-sm font-bold text-muted-foreground italic">
                      &quot;{activeWordData.example}&quot;
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onWordClick(activeWordData.word)}
                  className="w-full justify-center h-10 text-xs font-black uppercase text-primary tracking-widest hover:bg-primary/5"
                >
                  상세 정보 보기
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Integrated Translation & Controls */}
      <div className="space-y-6 pt-4 border-t border-border/50">
        <AnimatePresence mode="wait">
          {showKo ? (
            <motion.div
              key="ko-text"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-5 bg-muted/50 rounded-2xl border-2 border-border/50 text-xl font-bold text-foreground text-center break-keep"
            >
              {content.line_ko}
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-14 flex items-center justify-center"
            >
              <button 
                onClick={() => setShowKo(true)}
                className="text-xs font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
              >
                <Languages className="w-4 h-4" /> Reveal Translation
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => playTTS(content.line_en, 'en-US')}
            className="flex-1 h-16 rounded-2xl text-lg font-black"
            aria-label="Listen to full sentence"
          >
            <Play className="mr-3 h-6 w-6 fill-current" /> 문장 전체 듣기
          </Button>
          
          {showKo && (
            <Button
              variant="ghost"
              onClick={() => setShowKo(false)}
              className="h-16 px-6 rounded-2xl font-black text-muted-foreground"
            >
              숨기기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
