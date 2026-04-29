'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SpeakingPractice } from '@/components/speaking/SpeakingPractice';
import { getRandomElements } from '@/lib/utils/random';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/utils/cn';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';
import type { LessonStep, ReviewItem } from '@/types/lesson';
import type { Word } from '@/types';
import vocabData from '@/data/vocabulary.json';
import sentenceData from '@/data/sentences.json';
import { mediaContents } from '@/data/contents';
import { XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroCard } from '@/components/learn/IntroCard';
import { WordRevealStep } from '@/components/learn/WordRevealStep';
import { ChoiceQuizStep } from '@/components/learn/ChoiceQuizStep';
import { ListeningQuizStep } from '@/components/learn/ListeningQuizStep';
import { TypingPractice } from '@/components/learn/TypingPractice';
import { SentenceCompletion } from '@/components/learn/SentenceCompletion';
import { FeedbackBar } from '@/components/learn/FeedbackBar';
import { ResultCard } from '@/components/learn/ResultCard';

// ─── Types ────────────────────────────────────────────────────────────────────

type StepResult = { kind: 'none' | 'correct' | 'wrong'; msg?: string };

// ─── Main ─────────────────────────────────────────────────────────────────────

export function LearnClient({ mode = 'lesson', category = 'all' }: { mode?: 'review' | 'lesson', category?: string }) {
  const steps = useLessonSessionStore(s => s.steps);
  const stepIndex = useLessonSessionStore(s => s.stepIndex);
  const startLesson = useLessonSessionStore(s => s.startLesson);
  const next = useLessonSessionStore(s => s.next);
  const restart = useLessonSessionStore(s => s.restart);
  const reviewQueue = useLessonSessionStore(s => s.reviewQueue);
  const pushToReview = useLessonSessionStore(s => s.pushToReview);
  const removeFromReview = useLessonSessionStore(s => s.removeFromReview);

  const [result, setResult] = React.useState<StepResult>({ kind: 'none' });
  const [wordCount, setWordCount] = React.useState<5 | 10>(5);

  const step = steps[stepIndex] || { type: 'intro' as const };
  const total = Math.max(steps.length - 1, 1);
  const progress = steps.length > 1 ? Math.round((stepIndex / total) * 100) : 0;

  React.useEffect(() => { setResult({ kind: 'none' }); }, [stepIndex]);

  const handleStart = React.useCallback(() => {
    startLesson(
      mode === 'review'
        ? buildReviewSteps(reviewQueue)
        : buildLessonSteps(wordCount, category)
    );
  }, [mode, reviewQueue, startLesson, wordCount, category]);

  React.useEffect(() => {
    if (mode === 'review' && steps.length <= 1 && reviewQueue.length > 0) {
      handleStart();
    }
  }, [mode, steps.length, reviewQueue.length, handleStart]);

  const markWrong = React.useCallback((item: ReviewItem) => {
    pushToReview(item);
    setResult({ kind: 'wrong' });
  }, [pushToReview]);

  const markCorrect = React.useCallback((item?: ReviewItem) => {
    setResult({ kind: 'correct' });
    if (mode === 'review' && item) {
      removeFromReview(item);
    }
  }, [mode, removeFromReview]);

  const handleNext = React.useCallback(() => {
    setResult({ kind: 'none' });
    next();
  }, [next]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && result.kind !== 'none') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [result.kind, handleNext]);

  return (
    <div className="h-[100dvh] flex flex-col bg-[radial-gradient(circle_at_top,var(--secondary),transparent)] dark:bg-[radial-gradient(circle_at_top,#1e1b4b,transparent)] overflow-hidden">
      {/* Header */}
      <header className="shrink-0 z-40 w-full px-4 pt-4 pb-2 bg-background/50 backdrop-blur-md border-b-2 border-border/10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="h-10 w-10 rounded-xl border-2 border-border bg-surface shadow-[2px_2px_0_var(--border)] active:translate-y-0.5 active:shadow-none transition-all shrink-0"
            title="나가기"
          >
            <XCircle className="w-6 h-6 text-error" />
          </Button>

          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-end px-1">
              <span className="text-[10px] font-black text-foreground/40 font-cartoon tracking-widest uppercase">PROGRESS</span>
              <span className="text-xs font-black text-primary font-cartoon">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 w-full bg-surface border-2 border-border rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="h-full bg-primary relative"
              >
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              </motion.div>
            </div>
          </div>

          {step.type !== 'intro' && step.type !== 'result' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNext}
              className="h-10 px-3 rounded-xl border-2 border-border bg-surface text-[10px] font-black font-cartoon shadow-[2px_2px_0_var(--border)] active:translate-y-0.5 active:shadow-none transition-all shrink-0 hover:bg-muted"
            >
              SKIP
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center pb-24 sm:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="h-24 shrink-0">
        <AnimatePresence>
          {result.kind !== 'none' && (
            <FeedbackBar
              result={{ kind: result.kind as 'correct' | 'wrong' }}
              onNext={handleNext}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  function renderStep() {
    if (!step) return null;

    switch (step.type) {
      case 'intro':
        return (
          <IntroCard
            mode={mode}
            category={category}
            wordCount={wordCount}
            setWordCount={setWordCount}
            reviewCount={reviewQueue.length}
            onStart={handleStart}
          />
        );
      case 'word_reveal':
        return <WordRevealStep word={step.word} onNext={next} />;
      case 'choice_quiz':
        return (
          <ChoiceQuizStep
            word={step.word}
            options={step.options}
            onCorrect={() => markCorrect({ kind: 'choice_quiz', word: step.word })}
            onWrong={() => markWrong({ kind: 'choice_quiz', word: step.word })}
          />
        );
      case 'listening_quiz':
        return (
          <ListeningQuizStep
            answer={step.answer}
            options={step.options}
            prompt={step.prompt}
            onCorrect={() => markCorrect({ kind: 'listening_quiz', answer: step.answer })}
            onWrong={() => markWrong({ kind: 'listening_quiz', answer: step.answer })}
          />
        );
      case 'typing_exact':
        return (
          <TypingPractice
            word={step.word.word}
            meaning={step.word.meaning}
            example={step.word.example}
            exampleTranslation={step.word.exampleTranslation}
            onSuccess={() => markCorrect({ kind: 'typing_exact', word: step.word })}
            index={stepIndex}
            total={total}
          />
        );
      case 'fill_blank':
        return (
          <SentenceCompletion
            sentence={step.sentence}
            translation={step.word.meaning}
            targetWord={step.word.word}
            index={stepIndex}
            total={total}
            onSuccess={() => markCorrect({ kind: 'typing_exact', word: step.word })}
          />
        );
      case 'sentence_build':
        return (
          <TypingPractice
            word={step.word.word}
            meaning={step.word.meaning}
            example={step.word.example}
            exampleTranslation={step.word.exampleTranslation}
            onSuccess={() => markCorrect({ kind: 'sentence_build', word: step.word })}
            index={stepIndex}
            total={total}
          />
        );
      case 'speaking':
        return (
          <SpeakingPractice
            expectedSentence={step.expectedSentence}
            onContinue={(passed) => passed ? markCorrect({ kind: 'speaking', expectedSentence: step.expectedSentence }) : markWrong({ kind: 'speaking', expectedSentence: step.expectedSentence })}
          />
        );
      case 'result':
        return <ResultCard onRestart={restart} />;
      default:
        return null;
    }
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function makeBlankSentence(sentence: string, word: string): string {
  return sentence.replace(new RegExp(`\\b${word}\\b`, 'i'), '______');
}

function buildOptions(answer: string, pool: string[]): string[] {
  const distractors = getRandomElements(pool.filter(w => w !== answer), 3);
  return getRandomElements([answer, ...distractors], 4);
}

// ─── Step Builders ────────────────────────────────────────────────────────────

function buildLessonSteps(wordCount: 5 | 10, category: string = 'all'): LessonStep[] {
  type VocabJsonWord = Word & { examples?: Array<{ text: string; translation?: string }> };

  let vocabPool = vocabData as unknown as VocabJsonWord[];
  if (category && category !== 'all') {
    vocabPool = vocabPool.filter(w => w.category === category);
  }

  if (vocabPool.length < wordCount) {
    vocabPool = vocabData as unknown as VocabJsonWord[];
  }

  const words = getRandomElements(vocabPool, wordCount).map(w => ({
    ...w,
    id: w.id ?? w.word,
    example: w.example || w.examples?.[0]?.text || '',
    exampleTranslation: w.exampleTranslation || w.examples?.[0]?.translation || '',
  }));

  const pool = (vocabData as unknown as Word[]).map(w => w.word).filter(Boolean);

  const speakingSentence =
    getRandomElements(mediaContents, 1)[0]?.line_en ||
    (sentenceData
      ? getRandomElements(sentenceData as unknown as { text: string }[], 1)[0]?.text
      : '') ||
    'Focus on your goals.';

  const steps: LessonStep[] = [{ type: 'intro' }];

  for (const w of words) {
    steps.push({ type: 'word_reveal', word: w });
  }

  for (const w of words) {
    steps.push({ type: 'choice_quiz', word: w, options: buildOptions(w.word, pool) });

    if (w.example) {
      steps.push({
        type: 'fill_blank',
        word: w,
        sentence: w.example,
        blankedSentence: makeBlankSentence(w.example, w.word),
      });
    } else {
      steps.push({ type: 'sentence_build', word: w });
    }
  }

  steps.push({ type: 'speaking', expectedSentence: speakingSentence });
  steps.push({ type: 'result' });

  return steps;
}

function buildReviewSteps(queue: ReviewItem[]): LessonStep[] {
  const pool = (vocabData as unknown as Word[]).map(w => w.word).filter(Boolean);
  const steps: LessonStep[] = [{ type: 'intro' }];

  for (const item of queue.slice(0, 10)) {
    switch (item.kind) {
      case 'speaking':
        steps.push({ type: 'speaking', expectedSentence: item.expectedSentence });
        break;
      case 'listening_quiz':
        steps.push({ 
          type: 'listening_quiz', 
          answer: item.answer, 
          options: buildOptions(item.answer, pool),
          prompt: "다시 한번 들어보세요"
        });
        break;
      case 'choice_quiz':
        steps.push({ type: 'choice_quiz', word: item.word, options: buildOptions(item.word.word, pool) });
        break;
      case 'typing_exact':
        steps.push({ 
          type: 'fill_blank', 
          word: item.word, 
          sentence: item.word.example || `${item.word.word} is an important word.`, 
          blankedSentence: makeBlankSentence(item.word.example || `${item.word.word} is an important word.`, item.word.word)
        });
        break;
      case 'sentence_build':
        steps.push({ type: 'sentence_build', word: item.word });
        break;
    }
  }

  steps.push({ type: 'result' });
  return steps;
}
