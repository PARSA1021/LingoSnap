'use client';

import * as React from 'react';
import { useLearningStore } from '@/store/useLearningStore';
import { VocabCard } from '@/components/vocab/VocabCard';
import { SpeakingPractice } from '@/components/speaking/SpeakingPractice';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import vocabData from '@/data/vocabulary.json';
import sentenceData from '@/data/sentences.json';

const SESSION_WORD_COUNT = 5;

const getRandomElements = (arr: any[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

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
          id: w.id, word: w.word, meaning: w.meaning, example: w.example, exampleTranslation: w.exampleTranslation, level: w.level, category: w.category
        }));

        store.setWords(resolvedWords);
        store.setStage('vocab');
        
        const randomSentenceObj: any = getRandomElements(sentenceData, 1)[0];
        setDailySentence(randomSentenceObj.text);
      } else {
        const randomSentenceObj: any = getRandomElements(sentenceData, 1)[0];
        setDailySentence(randomSentenceObj.text);
      }
      setLoading(false);
    }
    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[70vh]">
        <Loader2 className="w-14 h-14 animate-spin text-blue-500 mb-6 drop-shadow-sm" />
        <p className="text-slate-500 text-lg font-bold tracking-wide animate-pulse">오늘의 학습을 준비하고 있어요...</p>
      </div>
    );
  }

  const { stage, currentWordIndex, words } = store;
  const currentWord = words[currentWordIndex];
  
  // Progress Calculation
  const totalSteps = words.length + 1; // +1 for the speaking challenge
  let currentStep = stage === 'vocab' ? currentWordIndex : stage === 'speaking' ? words.length : totalSteps;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col w-full min-h-[85vh] bg-slate-50/50">
      
      {/* Top Navigation & Unified Progress Bar */}
      {stage !== 'result' && (
        <div className="max-w-3xl mx-auto w-full mb-8 sticky top-4 z-50 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-slate-100/50">
          <div className="flex justify-between items-center mb-3 px-1">
            <p className="text-sm font-black text-slate-400 tracking-wider">진행률</p>
            <p className="text-sm font-black text-blue-600">{currentStep} / {totalSteps}</p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-blue-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Main Orchestrator Content */}
      <div className="flex-1 flex w-full max-w-3xl mx-auto items-center justify-center">
        <AnimatePresence mode="wait">
          
          {stage === 'vocab' && (
            <motion.div 
              key={`vocab-${currentWordIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col"
            >
              <div className="mb-6 text-center">
                <p className="text-blue-500 font-black tracking-widest text-sm uppercase mb-2">Step {currentWordIndex + 1}</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">오늘의 핵심 단어</h1>
              </div>
              
              {currentWord && (
                <VocabCard 
                  word={currentWord}
                  onNext={() => {
                    if (currentWordIndex < words.length - 1) {
                      store.nextWord();
                    } else {
                      store.setStage('speaking');
                    }
                  }}
                />
              )}
            </motion.div>
          )}

          {stage === 'speaking' && (
            <motion.div 
              key="speaking"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col"
            >
               <div className="mb-6 text-center">
                 <p className="text-emerald-500 font-black tracking-widest text-sm uppercase mb-2">Final Step</p>
                 <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">마지막, 말하기 챌린지!</h1>
               </div>
              <SpeakingPractice 
                expectedSentence={dailySentence}
                onContinue={(passed) => {
                  store.setStage('result');
                }}
              />
            </motion.div>
          )}

          {stage === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-full max-w-lg mx-auto flex flex-col items-center justify-center space-y-10 text-center py-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="h-32 w-32 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-xl relative z-10 border-[6px] border-white">
                  <CheckCircle2 className="h-20 w-20" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">학습 완료!</h1>
                <p className="text-slate-600 text-lg sm:text-xl font-bold leading-relaxed break-keep">
                  오늘 단어 <span className="text-blue-600">{words.length}개</span>를 새롭게 익히고,<br/>말하기 연습까지 완벽하게 끝냈어요.
                </p>
              </div>
              
              <div className="pt-8 flex flex-col gap-4 w-full">
                <Button onClick={() => { store.resetSession(); window.location.reload(); }} variant="secondary" size="lg" className="h-16 w-full text-lg">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  새로운 세션 시작하기
                </Button>
                <Link href="/" className="w-full">
                  <Button size="lg" variant="primary" className="w-full text-xl h-16 shadow-lg shadow-blue-500/20">
                    마치기 <ArrowRight className="w-6 h-6 ml-2" />
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
