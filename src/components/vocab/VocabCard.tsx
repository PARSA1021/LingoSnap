'use client';

import * as React from 'react';
import { Word } from '@/types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Volume2, ArrowRight, ArrowLeft, Star, Lightbulb, Check } from 'lucide-react';
import { playTTS } from '@/lib/tts';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/store/useLearningStore';

interface VocabCardProps {
  word: Word;
  onNext?: () => void;
  onPrev?: () => void;
  showPrev?: boolean;
}

export function VocabCard({ word, onNext, onPrev, showPrev }: VocabCardProps) {
  const [showMeaning, setShowMeaning] = React.useState(false);
  const [quizMode, setQuizMode] = React.useState(false);
  const [englishDef, setEnglishDef] = React.useState<string | null>(null);

  const toggleFavorite = useLearningStore(state => state.toggleFavorite);
  const favorites = useLearningStore(state => state.favorites);

  React.useEffect(() => {
    // Check if new word triggers auto quiz/meaning logic
    // In quiz mode, meaning is ALWAYS shown but word is hidden.
    if (quizMode) {
       setShowMeaning(true);
    }
  }, [word.word, quizMode]);

  React.useEffect(() => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.word}`)
      .then(r => r.json())
      .then(d => {
        if (d && d[0] && d[0].meanings[0]?.definitions[0]?.definition) {
           setEnglishDef(d[0].meanings[0].definitions[0].definition);
        }
      })
      .catch(() => {});
  }, [word.word]);

  const isFavorite = favorites.some(w => w.word === word.word);
  
  // When quiz mode is active and the user hasn't explicitly clicked "Reveal Word" (which we handle by just disabling quiz mode)
  const isWordHidden = quizMode;

  return (
    <Card className="w-full max-w-lg mx-auto bg-white border-b-[6px] border-slate-200 relative transition-all duration-300">
      {/* Top Absolute Actions */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const newQuizMode = !quizMode;
            setQuizMode(newQuizMode);
            if (newQuizMode) setShowMeaning(true);
          }}
          className={`p-2.5 rounded-full transition-all border shadow-sm ${
            quizMode 
              ? 'bg-amber-100 border-amber-200 text-amber-600 shadow-amber-100 active:bg-amber-200' 
              : 'bg-white border-slate-100 text-slate-300 hover:text-amber-400'
          }`}
        >
          <Lightbulb className={`w-6 h-6 ${quizMode ? 'fill-current' : ''}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleFavorite(word)}
          className={`p-2.5 rounded-full transition-all border shadow-sm ${
            isFavorite 
              ? 'bg-yellow-50 border-yellow-200 text-yellow-400 active:bg-yellow-100'
              : 'bg-white border-slate-100 text-slate-300 hover:text-yellow-400'
          }`}
        >
          <Star 
            className={`w-6 h-6 transition-colors duration-300 ${isFavorite ? 'fill-yellow-400 text-yellow-500' : ''}`} 
          />
        </motion.button>
      </div>

      <CardContent className="p-6 sm:p-10 flex flex-col items-center text-center space-y-8 select-none pt-12">
        
        {/* Word Stage */}
        <div className="space-y-4 w-full pt-2">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="flex flex-col items-center justify-center gap-5 relative min-h-[140px]"
          >
            {isWordHidden ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuizMode(false)}
                className="bg-slate-100 text-slate-400 w-full max-w-[240px] h-20 rounded-2xl flex items-center justify-center ring-4 ring-slate-200/50 cursor-pointer shadow-inner"
              >
                <div className="font-extrabold text-lg text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Check className="w-5 h-5" /> 터치하여 단어 보기
                </div>
              </motion.button>
            ) : (
              <>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tighter px-2 break-all">{word.word}</h2>
                {word.phonetic && (
                  <p className="text-slate-400 font-mono text-xl tracking-widest">{word.phonetic}</p>
                )}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full shadow-md w-14 h-14 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-none"
                    onClick={() => playTTS(word.word)}
                  >
                    <Volume2 className="h-7 w-7" />
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Dynamic Definition Dropdown */}
        <div className="w-full min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!showMeaning && !quizMode ? (
              <motion.div
                key="hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full py-8 text-xl font-bold bg-slate-50 border-dashed border-2 border-slate-300 text-slate-400 hover:bg-slate-100 hover:text-slate-600" 
                  onClick={() => setShowMeaning(true)}
                >
                  눌러서 뜻 확인하기
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full space-y-4 text-left"
              >
                <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl shadow-inner break-keep transition-all">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1.5">한국어 뜻</p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-snug">{word.meaning}</p>
                    </div>

                    <AnimatePresence>
                      {englishDef && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mt-2 mb-1.5">English Meaning</p>
                          <p className="text-lg font-bold text-slate-600 leading-relaxed bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                            {englishDef}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {word.example && (
                    <div className="pt-4 border-t-2 border-slate-100 space-y-2 mt-4">
                      <p className="text-xs font-black text-blue-400 uppercase tracking-widest">예문</p>
                      <p className="text-slate-600 font-medium text-lg italic bg-white p-3 rounded-xl shadow-sm border border-slate-50">"{word.example}"</p>
                      {word.exampleTranslation && (
                         <p className="text-slate-500 font-medium text-base px-1">↳ {word.exampleTranslation}</p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bottom Controls */}
        <div className="w-full flex gap-3 sm:gap-4 flex-col sm:flex-row pt-4">
          {showPrev && (
            <Button variant="secondary" size="lg" onClick={onPrev} className="flex-[0.3] w-full bg-slate-200 text-slate-700 h-14">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          
          {onNext && (
            <Button 
              size="lg" 
              variant="primary" 
              disabled={(!showMeaning && !quizMode) || (quizMode && isWordHidden)}
              className="flex-1 w-full text-xl shadow-blue-500/30 shadow-lg disabled:opacity-40 disabled:shadow-none h-14" 
              onClick={onNext}
            >
              다음 <ArrowRight className="h-6 w-6 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
