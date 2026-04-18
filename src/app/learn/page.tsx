'use client';

import * as React from 'react';
import { useLearningStore } from '@/store/useLearningStore';
import { SpeakingPractice } from '@/components/speaking/SpeakingPractice';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowRight, CheckCircle2, RefreshCw, Sparkles, ChevronRight, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

import vocabData from '@/data/vocabulary.json';
import sentenceData from '@/data/sentences.json';

const SESSION_WORD_COUNT = 5;

// --- TTS(음성 출력) 유틸리티 함수 ---
const speak = (text: string) => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    // 이전 음성 중단
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // 영어 발음 설정
    utterance.rate = 0.9;     // 속도를 살짝 느리게 하여 학습 효과 증대
    window.speechSynthesis.speak(utterance);
  }
};

const getRandomElements = (arr: any[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

function LearningSwipeCard({ word, onNext, index, total }: { word: any, onNext: () => void, index: number, total: number }) {
  const [showMeaning, setShowMeaning] = React.useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // 카드가 처음 나타날 때 자동으로 단어 읽어주기
  React.useEffect(() => {
    speak(word.word);
  }, [word]);

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
      <div className="h-full w-full bg-white rounded-[2.5rem] shadow-xl border-2 border-border p-8 flex flex-col justify-between items-center text-center card-tactile border-b-primary-shadow">
        <div className="w-full flex justify-between items-center">
          <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest">
            Card {index + 1} / {total}
          </span>
          {/* 음성 다시 듣기 버튼: 모바일 터치 최적화 */}
          <button 
            onClick={(e) => { e.stopPropagation(); speak(word.word); }}
            className="p-3 bg-muted/50 rounded-full hover:bg-primary/20 active:scale-90 transition-all focus:outline-none"
          >
            <Volume2 className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center space-y-6 w-full relative">
          <div className="space-y-2 relative z-10 w-full mb-4">
            <h2 className="text-5xl sm:text-6xl font-black text-primary tracking-tighter drop-shadow-sm">{word.word}</h2>
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
                <p className="text-2xl sm:text-3xl font-black text-foreground break-keep">{word.meaning}</p>
                {word.examples && word.examples[0] && (
                  <div 
                    className="w-full p-5 bg-muted/30 rounded-3xl cursor-pointer hover:bg-muted/50 transition-colors border-2 border-border/50 text-left"
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

        <div className="w-full flex flex-col items-center gap-3 mt-4 h-[60px] justify-end">
          <AnimatePresence>
            {showMeaning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center gap-2"
              >
                <Button onClick={onNext} className="w-full h-14 rounded-[1.5rem] font-black text-lg shadow-tactile active:translate-y-1">
                  다음으로 <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground opacity-50 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest">or Swipe</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
  const totalSteps = words.length + 1;
  let currentStep = stage === 'vocab' ? currentWordIndex : stage === 'speaking' ? words.length : totalSteps;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex-1 p-4 sm:p-8 flex flex-col w-full min-h-screen bg-background dot-pattern overflow-hidden">
      {stage !== 'result' && (
        <div className="max-w-xl mx-auto w-full mb-8 space-y-4">
           <div className="flex justify-between items-center px-2">
             <Link href="/" className="p-2 bg-white/50 rounded-full font-black text-xl">✕</Link>
             <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full border border-border">
               <Sparkles className="w-4 h-4 text-amber-500" />
               <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Learning Mode</span>
             </div>
             <div className="w-10" />
           </div>
           <div className="bg-muted rounded-full h-3 overflow-hidden border-2 border-border shadow-inner">
            <motion.div 
              className="bg-primary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 40 }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex w-full max-w-2xl mx-auto items-center justify-center relative pb-10">
        <AnimatePresence mode="wait">
          {stage === 'vocab' && (
            <motion.div key="vocab-container" className="w-full h-[520px] sm:h-[580px] relative">
              <AnimatePresence>
                {currentWord && (
                  <LearningSwipeCard 
                    key={currentWord.word}
                    word={currentWord}
                    index={currentWordIndex}
                    total={words.length}
                    onNext={() => {
                      if (currentWordIndex < words.length - 1) {
                        store.nextWord();
                      } else {
                        store.setStage('speaking');
                      }
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {stage === 'speaking' && (
            <motion.div key="speaking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex-1">
               <div className="mb-10 text-center space-y-2">
                 <h1 className="text-3xl font-black text-foreground tracking-tighter">문장 쉐도잉</h1>
                 <p className="text-success font-black text-xs uppercase tracking-widest bg-success/10 py-1 px-3 rounded-full inline-block">Final Mission</p>
               </div>
              <SpeakingPractice 
                expectedSentence={dailySentence}
                onContinue={() => store.setStage('result')}
              />
            </motion.div>
          )}

          {stage === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-10 text-center py-12 px-8 bg-surface card-tactile border-b-success-shadow rounded-[3.5rem]">
              <div className="h-32 w-32 bg-success text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
                <CheckCircle2 className="h-16 w-16" />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-black text-foreground tracking-tighter">오늘의 수집 완료!</h1>
                <p className="text-muted-foreground text-lg font-bold leading-relaxed break-keep">
                  귀로 듣고 입으로 말하며<br/><span className="text-primary font-black underline underline-offset-4">{words.length}개</span>의 표현을 완벽히 익혔어요.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Button variant="secondary" onClick={() => { store.resetSession(); window.location.reload(); }} className="h-14 w-full rounded-2xl font-black">
                  <RefreshCw className="mr-2 h-4 w-4" /> 한 번 더 하기
                </Button>
                <Link href="/" className="w-full">
                  <Button size="lg" className="h-16 w-full text-xl rounded-2xl font-black shadow-tactile active:translate-y-1">
                    메인으로 돌아가기
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