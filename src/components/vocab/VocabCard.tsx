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
  const isWordHidden = quizMode;

  return (
    <Card className="w-full max-w-lg mx-auto bg-surface card-tactile relative overflow-visible">
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
          className={`p-3 rounded-2xl transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
            quizMode 
              ? 'bg-primary text-white border-primary/30' 
              : 'bg-muted text-muted-foreground border-border'
          }`}
        >
          <Lightbulb className={`w-6 h-6 ${quizMode ? 'fill-current' : ''}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleFavorite(word)}
          className={`p-3 rounded-2xl transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
            isFavorite 
              ? 'bg-warning text-white border-warning/30'
              : 'bg-muted text-muted-foreground border-border'
          }`}
        >
          <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      <CardContent className="p-8 sm:p-12 flex flex-col items-center text-center space-y-8 select-none">
        
        {/* Word Stage */}
        <div className="w-full pt-8 min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isWordHidden ? (
              <motion.button
                key="hidden-word"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setQuizMode(false)}
                className="w-full max-w-[280px] h-24 bg-muted/30 border-2 border-dashed border-border rounded-3xl flex items-center justify-center gap-3 text-muted-foreground font-black text-xl hover:bg-muted/50 transition-colors"
              >
                <Check className="w-6 h-6" /> 단어 확인하기
              </motion.button>
            ) : (
              <motion.div 
                key="visible-word"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <h2 className="text-5xl sm:text-7xl font-black text-foreground tracking-tighter">{word.word}</h2>
                {word.phonetic && <p className="text-secondary-foreground font-mono text-xl">{word.phonetic}</p>}
                <Button 
                  onClick={() => playTTS(word.word)}
                  className="w-14 h-14 rounded-2xl bg-primary text-white btn-tactile border-primary/30 flex items-center justify-center"
                >
                  <Volume2 className="h-7 w-7" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Meaning Area */}
        <div className="w-full min-h-[140px]">
          <AnimatePresence mode="wait">
            {!showMeaning && !quizMode ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="hide-mean">
                <Button 
                  onClick={() => setShowMeaning(true)}
                  className="w-full py-10 bg-accent text-accent-foreground border-accent-foreground/20 border-b-4 active:border-b-0 active:translate-y-1 rounded-[2rem] text-2xl font-black"
                >
                  의미 확인하기
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                key="show-mean"
                className="text-left space-y-4"
              >
                 <div className="bg-muted/50 p-6 rounded-3xl border-2 border-border/50">
                    <p className="text-3xl font-black text-foreground mb-2 break-keep">{word.meaning}</p>
                    {englishDef && <p className="text-base font-bold text-muted-foreground italic">"{englishDef}"</p>}
                 </div>

                 {word.example && (
                   <div className="bg-primary/5 p-6 rounded-3xl border-l-8 border-primary">
                      <p className="font-black text-lg italic text-foreground">"{word.example}"</p>
                      {word.exampleTranslation && <p className="text-muted-foreground font-bold mt-1 text-sm">↳ {word.exampleTranslation}</p>}
                   </div>
                 )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div className="w-full flex gap-3 pt-4">
          {showPrev && (
            <Button onClick={onPrev} className="flex-1 bg-secondary text-secondary-foreground btn-tactile border-secondary-foreground/20 h-16 rounded-2xl font-black text-lg">
              <ArrowLeft className="mr-2" /> 이전
            </Button>
          )}
          {onNext && (
            <Button 
              onClick={onNext}
              disabled={(!showMeaning && !quizMode) || (quizMode && isWordHidden)}
              className="flex-[2] bg-primary text-white btn-tactile border-primary/30 h-16 rounded-2xl font-black text-xl"
            >
              다음 <ArrowRight className="ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
