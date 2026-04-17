'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Volume2, ArrowRight, ArrowLeft, Star, Lightbulb, Check } from 'lucide-react';
import { playTTS } from '@/lib/tts';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/store/useLearningStore';

interface VocabCardProps {
  word: any; // examples 배열이 포함된 객체 대응
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
    if (quizMode) setShowMeaning(true);
  }, [word.word, quizMode]);

  React.useEffect(() => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.word}`)
      .then(r => r.json())
      .then(d => {
        if (d && d[0] && d[0].meanings[0]?.definitions[0]?.definition) {
          setEnglishDef(d[0].meanings[0].definitions[0].definition);
        }
      })
      .catch(() => { });
  }, [word.word]);

  const isFavorite = favorites.some(w => w.word === word.word);
  const isWordHidden = quizMode;

  return (
    <Card className="w-full max-w-lg mx-auto bg-surface card-tactile relative overflow-visible mb-6">
      {/* Top Actions */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuizMode(!quizMode)}
          className={`p-3 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${quizMode ? 'bg-primary text-white border-primary-shadow' : 'bg-muted text-muted-foreground border-border'
            }`}
        >
          <Lightbulb className={`w-6 h-6 ${quizMode ? 'fill-current' : ''}`} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleFavorite(word)}
          className={`p-3 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${isFavorite ? 'bg-warning text-white border-warning-shadow' : 'bg-muted text-muted-foreground border-border'
            }`}
        >
          <Star className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      <CardContent className="p-8 sm:p-12 flex flex-col items-center text-center space-y-8">
        {/* Word Stage */}
        <div className="w-full pt-8 min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isWordHidden ? (
              <motion.button
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setQuizMode(false)}
                className="w-full h-24 bg-muted/30 border-2 border-dashed border-border rounded-3xl flex items-center justify-center gap-3 text-muted-foreground font-black text-xl"
              >
                <Check className="w-6 h-6" /> 단어 확인하기
              </motion.button>
            ) : (
              <motion.div key="visible" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
                <h2 className="text-5xl sm:text-6xl font-black text-foreground tracking-tighter">{word.word}</h2>
                <Button onClick={() => playTTS(word.word)} className="w-12 h-12 rounded-xl">
                  <Volume2 className="h-6 w-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Meaning & Examples Area */}
        <div className="w-full min-h-[140px]">
          <AnimatePresence mode="wait">
            {!showMeaning && !quizMode ? (
              <Button onClick={() => setShowMeaning(true)} className="w-full py-10 bg-accent text-accent-foreground rounded-[2rem] text-2xl font-black">
                의미 확인하기
              </Button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-left space-y-6">
                <div className="bg-muted/50 p-6 rounded-3xl border-2 border-border/50">
                  <p className="text-3xl font-black text-foreground mb-2 break-keep">{word.meaning}</p>
                  {englishDef && <p className="text-base font-bold text-muted-foreground italic">&quot;{englishDef}&quot;</p>}
                </div>

                {/* 예문 렌더링 로직 (제공해주신 examples: [{text, translation}] 구조 대응) */}
                <div className="space-y-4">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-2">Examples</p>
                  {word.examples && word.examples.length > 0 ? (
                    word.examples.map((ex: any, idx: number) => (
                      <div key={idx} className="bg-primary/5 p-5 rounded-2xl border-l-4 border-primary shadow-sm">
                        <p className="font-bold text-lg text-foreground leading-snug">&quot;{ex.text}&quot;</p>
                        {ex.translation && (
                          <p className="text-muted-foreground font-bold mt-2 text-sm">
                            ↳ {ex.translation}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-muted/20 rounded-2xl italic text-muted-foreground text-center text-sm">
                      No examples available
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {(onNext || showPrev) && (
          <div className="w-full flex gap-3 pt-4">
            {showPrev && (
              <Button variant="secondary" onClick={onPrev} className="flex-1 h-14 rounded-2xl font-black">
                <ArrowLeft className="mr-2" /> 이전
              </Button>
            )}
            {onNext && (
              <Button onClick={onNext} disabled={!showMeaning} className="flex-[2] h-14 rounded-2xl font-black text-lg">
                다음 <ArrowRight className="ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}