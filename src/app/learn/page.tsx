'use client';

import * as React from 'react';
import { useLearningStore } from '@/store/useLearningStore';
import { SpeakingPractice } from '@/components/speaking/SpeakingPractice';
import { TypingPractice } from '@/components/learn/TypingPractice';
import { SentenceCompletion } from '@/components/learn/SentenceCompletion';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowRight, CheckCircle2, RefreshCw, Sparkles, ChevronRight, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { speak } from '@/lib/tts';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

import vocabData from '@/data/vocabulary.json';
import sentenceData from '@/data/sentences.json';

const SESSION_WORD_COUNT = 5;



const getRandomElements = (arr: any[], count: number) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

function LearningSwipeCard({ word, onNext, onPrev, index, total }: { word: any, onNext: () => void, onPrev: () => void, index: number, total: number }) {
  const [showMeaning, setShowMeaning] = React.useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Removed autoplay useEffect to prevent browser block
  /* React.useEffect(() => {
    speak(word.word);
  }, [word]); */

  const handleDragEnd = (_: any, info: any) => {
    if (!showMeaning) return;
    if (info.offset.x > 100 || info.offset.x < -100) {
      onNext();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={showMeaning ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={cn("absolute inset-0", showMeaning ? "cursor-grab active:cursor-grabbing" : "")}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
    >
      <div className="h-full w-full bg-surface border-8 border-border p-8 sm:p-12 flex flex-col justify-between items-center text-center shadow-[12px_12px_0_var(--border)]">
        <div className="w-full flex justify-between items-center">
          <span className="px-4 py-1.5 bg-surface border-2 border-border text-foreground text-xs font-black rounded-full uppercase tracking-widest shadow-[2px_2px_0_#111] wobbly-slow">
            Card {index + 1} / {total}
          </span>
          {/* 음성 다시 듣기 버튼: 모바일 터치 최적화 */}
          <button 
            onClick={(e) => { e.stopPropagation(); speak(word.word); }}
            className="p-3 bg-surface border-2 border-border rounded-full hover:bg-muted active:scale-90 transition-all shadow-[2px_2px_0_#111]"
          >
            <Volume2 className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center space-y-6 w-full relative">
          <div className="space-y-2 relative z-10 w-full mb-4">
            <h2 className={cn(
              "font-black text-foreground font-reading leading-tight tracking-tight break-keep",
              word.word.length > 20 ? "text-3xl sm:text-4xl" :
              word.word.length > 15 ? "text-4xl sm:text-5xl" :
              "text-5xl sm:text-6xl"
            )}>
              {word.word}
            </h2>
          </div>
          
          <AnimatePresence mode="popLayout">
            {!showMeaning ? (
              <motion.div
                key="hidden-meaning"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full mt-8"
              >
                <Button 
                  onClick={() => setShowMeaning(true)} 
                  className="w-full h-16 rounded-[2rem] text-xl font-black shadow-tactile active:translate-y-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  의미 확인하기
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="visible-meaning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center space-y-6 w-full"
              >
                <p className="text-2xl sm:text-3xl font-black text-primary drop-shadow-[1px_1px_0_var(--border)] break-keep">{word.meaning}</p>
                {word.examples && word.examples[0] && (
                  <div 
                    className="w-full p-6 bg-surface border-8 border-border shadow-[8px_8px_0_var(--border)] text-left wobbly-slow"
                    onClick={(e) => { e.stopPropagation(); speak(word.examples[0].text); }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">Example</p>
                      <Volume2 className="w-4 h-4 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-lg font-bold text-foreground italic leading-snug">"{word.examples[0].text}"</p>
                    <p className="text-sm font-bold text-muted-foreground mt-2 opacity-80">{word.examples[0].translation}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mt-4">
          <Button 
            variant="secondary" 
            onClick={onPrev} 
            disabled={index === 0}
            className="h-16 border-4 border-border shadow-[6px_6px_0_var(--border)] font-black uppercase font-cartoon text-lg active:translate-y-1 active:shadow-none transition-all text-foreground bg-surface"
          >
            Back
          </Button>
          <Button 
            onClick={onNext} 
            disabled={!showMeaning}
            className={cn(
               "h-16 border-4 border-border shadow-[6px_6px_0_var(--border)] font-black uppercase font-cartoon text-lg active:translate-y-1 active:shadow-none transition-all",
               !showMeaning ? "opacity-50 cursor-not-allowed" : "bg-primary text-white"
            )}
          >
            {index === total - 1 ? 'Start Mission' : 'Next Word'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function LearnFlowPage() {
  const store = useLearningStore();
  const [loading, setLoading] = React.useState(true);
  const [dailySentence, setDailySentence] = React.useState('');

  React.useEffect(() => {
    async function initSession() {
      if (store.words.length === 0) {
        setLoading(true);
        const rawWords: any = getRandomElements(vocabData, SESSION_WORD_COUNT);
        const resolvedWords = rawWords.map((w: any) => ({
          ...w,
          id: w.word,
          example: w.examples?.[0]?.text || '',
          exampleTranslation: w.examples?.[0]?.translation || ''
        }));
        store.setWords(resolvedWords);
        store.setStage('vocab');
        const randomSentenceObj: any = sentenceData ? getRandomElements(sentenceData, 1)[0] : { text: "Focus on your goals." };
        setDailySentence(randomSentenceObj.text);
      } else {
        const randomSentenceObj: any = sentenceData ? getRandomElements(sentenceData, 1)[0] : { text: "You are doing great." };
        setDailySentence(randomSentenceObj.text);
      }
      setLoading(false);
    }
    initSession();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[70vh]">
        <Loader2 className="w-14 h-14 animate-spin text-primary mb-6" />
        <p className="text-muted-foreground text-lg font-black animate-pulse">발음 데이터를 준비 중...</p>
      </div>
    );
  }

  const { stage, currentWordIndex, words } = store;
  const currentWord = words[currentWordIndex];
  const totalSteps = words.length * 3 + 1; // vocab cards + completion cards + typing cards + 1 speaking
  let currentStep = 0;
  if (stage === 'vocab') currentStep = currentWordIndex;
  else if (stage === 'completion') currentStep = words.length + currentWordIndex;
  else if (stage === 'typing') currentStep = words.length * 2 + currentWordIndex;
  else if (stage === 'speaking') currentStep = words.length * 3;
  else currentStep = totalSteps;

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex-1 p-4 sm:p-8 flex flex-col w-full min-h-screen bg-background dot-pattern overflow-hidden">
      {stage !== 'result' && (
        <div className="max-w-xl mx-auto w-full mb-6 sm:mb-8 space-y-4">
           <div className="flex justify-between items-center px-4">
             <Link href="/" className="p-1.5 bg-surface rounded-full font-black text-lg border-2 border-border shadow-[2px_2px_0_var(--border)] text-foreground">✕</Link>
             <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-full border-2 border-border shadow-[2px_2px_0_var(--border)]">
               <Sparkles className="w-3 h-3 text-amber-500" />
               <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Live Show</span>
             </div>
             <ThemeToggle />
           </div>
           <div className="flex gap-3 items-center px-4">
             <div className="bg-surface rounded-full h-3 flex-1 overflow-hidden border-2 border-border shadow-inner">
               <motion.div 
                 className="bg-primary h-full rounded-full"
                 initial={{ width: 0 }}
                 animate={{ width: `${progressPercent}%` }}
                 transition={{ type: "spring", stiffness: 40 }}
               />
             </div>
             <Button 
               onClick={() => speak('System Check')}
               variant="outline" 
               className="h-10 w-10 p-0 rounded-full border-2 border-border bg-surface text-foreground shadow-[2px_2px_0_var(--border)] active:translate-y-0.5 active:shadow-none transition-all"
             >
               <Volume2 className="w-4 h-4" />
             </Button>
           </div>
           
           {/* Stage Intro - Thematic Instructions */}
           <motion.div 
             key={stage}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="px-4 text-center space-y-1"
           >
             <h3 className="text-xl font-black text-foreground uppercase tracking-tight font-cartoon">
                {stage === 'vocab' && "Stage 1: Reel Discovery"}
                {stage === 'completion' && "Stage 2: Context Script"}
                {stage === 'typing' && "Stage 3: Word Assembly"}
                {stage === 'speaking' && "Final Stage: Sound Check"}
             </h3>
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">
                {stage === 'vocab' && "Swipe and memorize the golden lines"}
                {stage === 'completion' && "Fill the missing words in the script"}
                {stage === 'typing' && "Build the expressions block by block"}
                {stage === 'speaking' && "Record your voice to master the scene"}
             </p>
           </motion.div>
        </div>
      )}

      <div className="flex-1 flex w-full max-w-2xl mx-auto items-center justify-center relative pb-10">
        <AnimatePresence mode="wait" initial={false}>
          {stage === 'vocab' && (
            <motion.div key="vocab-container" className="w-full h-[520px] sm:h-[580px] relative">
              <AnimatePresence mode="wait">
                {currentWord && (
                  <LearningSwipeCard 
                    key={currentWord.word}
                    word={currentWord}
                    index={currentWordIndex}
                    total={words.length}
                    onPrev={() => {
                      if (currentWordIndex > 0) {
                        store.prevWord();
                      }
                    }}
                    onNext={() => {
                      if (currentWordIndex < words.length - 1) {
                        store.nextWord();
                      } else {
                        store.resetSession();
                        store.setStage('completion');
                      }
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {stage === 'typing' && (
            <motion.div key="typing-container" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full">
               <TypingPractice 
                 word={currentWord.word}
                 meaning={currentWord.meaning}
                 example={currentWord.example}
                 exampleTranslation={currentWord.exampleTranslation}
                 index={currentWordIndex}
                 total={words.length}
                 onSuccess={() => {
                    if (currentWordIndex < words.length - 1) {
                        store.nextWord();
                    } else {
                        store.setStage('speaking');
                    }
                 }}
               />
            </motion.div>
          )}

          {stage === 'completion' && (
            <motion.div key="completion-container" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full">
               <SentenceCompletion 
                 sentence={currentWord.example || ''}
                 translation={currentWord.exampleTranslation || ''}
                 targetWord={currentWord.word}
                 index={currentWordIndex}
                 total={words.length}
                 onSuccess={() => {
                    if (currentWordIndex < words.length - 1) {
                        store.nextWord();
                    } else {
                        store.setStage('typing');
                    }
                 }}
               />
            </motion.div>
          )}

          {stage === 'speaking' && (
            <motion.div key="speaking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex-1">
               <div className="mb-10 text-center space-y-2">
                 <h1 className="text-3xl font-black text-foreground tracking-tighter">문장 쉐도잉</h1>
                 <p className="text-primary font-black text-xs uppercase tracking-widest bg-surface py-1 px-3 rounded-full border-2 border-border inline-block">Final Mission</p>
               </div>
              <SpeakingPractice 
                expectedSentence={dailySentence}
                onContinue={() => store.setStage('result')}
              />
            </motion.div>
          )}

          {stage === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-12 text-center py-16 px-10 bg-surface border-8 border-border shadow-[15px_15px_0_var(--border)] wobbly-slow text-foreground">
              <div className="h-40 w-40 bg-secondary text-white border-8 border-border flex items-center justify-center shadow-[8px_8px_0_var(--border)] rotate-3">
                <CheckCircle2 className="h-24 w-24" />
              </div>
              <div className="space-y-4">
                <h1 className="text-6xl font-black tracking-tight drop-shadow-[4px_4px_0_var(--border)] uppercase font-cartoon -rotate-2">Knockout!</h1>
                <p className="text-foreground text-2xl font-black leading-relaxed break-keep uppercase font-cartoon">
                  You Mastered <br /><span className="text-primary text-5xl">{words.length}</span> <br/> Expressions!
                </p>
              </div>
              <div className="flex flex-col gap-6 w-full">
                <Button variant="secondary" onClick={() => { store.resetSession(); window.location.reload(); }} className="h-20 w-full border-8 border-border bg-secondary text-white shadow-[8px_8px_0_var(--border)] text-xl font-black uppercase font-cartoon">
                  <RefreshCw className="mr-3 h-6 w-6" /> Play Again
                </Button>
                <Link href="/" className="w-full">
                  <Button className="h-24 w-full text-3xl border-8 border-border bg-primary text-white shadow-[10px_10px_0_var(--border)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all uppercase font-cartoon">
                    Victory!
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}