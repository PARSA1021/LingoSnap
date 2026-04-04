'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentLine } from '@/data/contents';
import { Play, Languages, Bookmark, Lightbulb, Check } from 'lucide-react';
import { playTTS } from '@/lib/tts';
import { useLearningStore } from '@/store/useLearningStore';

interface ContentCardProps {
  content: ContentLine;
  onWordClick: (word: string) => void;
}

export function ContentCard({ content, onWordClick }: ContentCardProps) {
  const { savedContents, toggleSavedContent } = useLearningStore();
  const [showKo, setShowKo] = React.useState(false);
  const [quizMode, setQuizMode] = React.useState(false);
  
  // Track hidden words for the quiz mode
  const [hiddenWordIndices, setHiddenWordIndices] = React.useState<number[]>([]);

  // Split punctuation out so only the alphanumeric word is sent to API
  const words = React.useMemo(() => content.line_en.split(' '), [content]);
  
  const isSaved = savedContents.includes(content.id);

  // Initialize Quiz Mode by randomly picking 1-2 words to blank out
  React.useEffect(() => {
    if (quizMode) {
      const numToHide = words.length > 5 ? 2 : 1;
      const indices: number[] = [];
      while (indices.length < numToHide) {
        const r = Math.floor(Math.random() * words.length);
        if (!indices.includes(r)) indices.push(r);
      }
      setHiddenWordIndices(indices);
    } else {
      setHiddenWordIndices([]);
    }
  }, [quizMode, words]);

  const handleWordClick = (wordRaw: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    // If quiz mode and word is hidden, reveal it
    if (quizMode && hiddenWordIndices.includes(index)) {
      setHiddenWordIndices(prev => prev.filter(i => i !== index));
    }

    // TTS & Search Lookup
    const cleanWord = wordRaw.replace(/[^a-zA-Z0-9-']/g, '');
    if (cleanWord) {
      playTTS(cleanWord, 'en-US'); 
      onWordClick(cleanWord);      
    }
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className={`relative w-full h-full bg-white rounded-3xl p-5 sm:p-7 flex flex-col justify-between gap-6 cursor-pointer touch-manipulation transition-all duration-300 ${
        showKo 
          ? 'shadow-[0_15px_40px_-10px_rgb(59,130,246,0.15)] ring-2 ring-blue-100 overflow-hidden' 
          : 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)]'
      }`}
      onClick={() => setShowKo(prev => !prev)}
    >
      <AnimatePresence>
        {showKo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-purple-50/40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col items-start gap-2">
            <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-xl ${
              content.category === 'movie' 
                ? 'bg-blue-50 text-blue-600' 
                : 'bg-purple-50 text-purple-600'
            }`}>
              {content.category === 'movie' ? '🎬 MOVIE' : '📺 DRAMA'}
            </span>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl leading-tight">
                {content.title}
              </h3>
              <p className="text-slate-500 font-bold text-sm mt-1">
                {content.scene}
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setQuizMode(!quizMode); }}
              className={`p-2.5 rounded-full transition-all touch-manipulation border ${
                quizMode 
                  ? 'bg-amber-50 border-amber-200 text-amber-500 active:bg-amber-100' 
                  : 'bg-white border-slate-100 text-slate-400 hover:text-amber-500 hover:bg-slate-50'
              }`}
            >
              <Lightbulb className={`w-4 h-4 sm:w-5 sm:h-5 ${quizMode ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSavedContent(content.id); }}
              className={`p-2.5 rounded-full transition-all touch-manipulation border ${
                isSaved 
                  ? 'bg-rose-50 border-rose-200 text-rose-500 active:bg-rose-100' 
                  : 'bg-white border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-1.5 gap-y-3">
          {words.map((word, i) => {
            const isHidden = hiddenWordIndices.includes(i);
            return (
              <motion.button
                key={`${word}-${i}`}
                whileHover={!isHidden ? { scale: 1.05, y: -1 } : { scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleWordClick(word, i, e)}
                className={`text-2xl sm:text-3xl font-extrabold transition-all duration-300 cursor-pointer outline-none touch-manipulation px-1.5 -mx-1.5 rounded-lg
                  ${isHidden 
                    ? 'bg-slate-100 text-slate-200 w-20 h-8 sm:h-10 ring-2 ring-slate-200/50 flex items-center justify-center' 
                    : 'text-slate-800 hover:text-blue-600 hover:bg-blue-50 active:text-blue-700'
                  }`}
              >
                {isHidden ? '' : word}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showKo && (
            <motion.div
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
              className="mt-6 pt-5 border-t-[3px] border-dashed border-blue-100"
            >
              <p className="text-lg sm:text-xl font-bold text-blue-600 leading-relaxed">
                {content.line_ko}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex justify-between items-center mt-2 pt-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
          <Languages className="w-4 h-4" />
          {showKo ? '터치하여 접기' : '터치하여 번역 보기'}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); playTTS(content.line_en, 'en-US'); }}
          className="p-3 bg-slate-800 text-white rounded-full hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-slate-200"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
