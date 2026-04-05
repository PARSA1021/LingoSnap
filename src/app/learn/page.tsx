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
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[70vh]">
        <Loader2 className="w-14 h-14 animate-spin text-primary mb-6" />
        <p className="text-muted-foreground text-lg font-black tracking-tight animate-pulse">학습을 준비하는 중...</p>
      </div>
    );
  }

  const { stage, currentWordIndex, words } = store;
  const currentWord = words[currentWordIndex];
  
  const totalSteps = words.length + 1;
  let currentStep = stage === 'vocab' ? currentWordIndex : stage === 'speaking' ? words.length : totalSteps;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex-1 p-4 md:p-10 flex flex-col w-full min-h-[85vh] bg-background dot-pattern">
      
      {/* Top Progress Bar */}
      {stage !== 'result' && (
        <div className="max-w-xl mx-auto w-full mb-12 flex items-center gap-4">
           <Link href="/" className="text-muted-foreground hover:text-foreground font-black text-2xl px-2">✕</Link>
           <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden border-2 border-border shadow-inner">
            <motion.div 
              className="bg-primary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Content Orchestrator */}
      <div className="flex-1 flex w-full max-w-3xl mx-auto items-center justify-center pb-12">
        <AnimatePresence mode="wait">
          
          {stage === 'vocab' && (
            <motion.div 
              key={`vocab-${currentWordIndex}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-1 flex flex-col"
            >
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-foreground tracking-tight">오늘의 핵심 단어</h1>
                <p className="text-primary font-black text-sm uppercase tracking-widest mt-1">{currentWordIndex + 1} / {words.length}</p>
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-1 flex flex-col"
            >
               <div className="mb-8 text-center">
                 <h1 className="text-3xl font-black text-foreground tracking-tight">문장 말하기 연습</h1>
                 <p className="text-success font-black text-sm uppercase tracking-widest mt-1">Final Challenge</p>
               </div>
              <SpeakingPractice 
                expectedSentence={dailySentence}
                onContinue={() => store.setStage('result')}
              />
            </motion.div>
          )}

          {stage === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl mx-auto flex flex-col items-center justify-center space-y-12 text-center py-12 px-8 bg-surface card-tactile border-b-success-shadow"
            >
              <div className="h-40 w-40 bg-success text-white rounded-full flex items-center justify-center shadow-tactile border-8 border-white">
                <CheckCircle2 className="h-24 w-24" />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-black text-foreground tracking-tighter">학습 완료!</h1>
                <p className="text-muted-foreground text-xl font-bold leading-snug break-keep">
                  오늘 단어 <span className="text-primary font-black">{words.length}개</span>를 마스터하고,<br/>발음 연습까지 완벽하게 끝냈어요!
                </p>
              </div>
              
              <div className="pt-6 flex flex-col gap-4 w-full">
                <Button variant="secondary" onClick={() => { store.resetSession(); window.location.reload(); }} className="h-16 w-full text-lg rounded-2xl font-black">
                  <RefreshCw className="mr-2 h-5 w-5" /> 다시 학습하기
                </Button>
                <Link href="/" className="w-full">
                  <Button size="lg" className="text-2xl h-20 rounded-2xl font-black">
                    홈으로 돌아가기 <ArrowRight className="ml-3" />
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
