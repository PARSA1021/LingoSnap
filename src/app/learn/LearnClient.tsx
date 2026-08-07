'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const SpeakingPractice = dynamic(
  () => import('@/components/speaking/SpeakingPractice').then((mod) => mod.SpeakingPractice),
  { ssr: false }
);
import { getRandomElements } from '@/lib/utils/random';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';
import { useLearningStore } from '@/store/useLearningStore';
import { soundFX } from '@/lib/sound';
import type { LessonStep, ReviewItem } from '@/types/lesson';
import type { Word } from '@/types';
import sentenceData from '@/data/sentences.json';
import { grammarContents, getCategoryWords, vocabulary } from '@/data/contents';
import { XCircle, Flame } from 'lucide-react';
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

export function LearnClient({
  mode = 'lesson',
  category = 'all',
  wordCount = 10,
  isTurbo = false,
  movieId,
}: {
  mode?: 'review' | 'lesson';
  category?: string;
  wordCount?: 5 | 10 | 15;
  isTurbo?: boolean;
  movieId?: string;
}) {
  const steps = useLessonSessionStore(s => s.steps);
  const stepIndex = useLessonSessionStore(s => s.stepIndex);
  const startLesson = useLessonSessionStore(s => s.startLesson);
  const next = useLessonSessionStore(s => s.next);
  const restart = useLessonSessionStore(s => s.restart);
  const reviewQueue = useLessonSessionStore(s => s.reviewQueue);
  const pushToReview = useLessonSessionStore(s => s.pushToReview);
  const removeFromReview = useLessonSessionStore(s => s.removeFromReview);

  const recordLearningActivity = useLearningStore(s => s.recordLearningActivity);
  const addPoints = useLearningStore(s => s.addPoints);

  const [result, setResult] = React.useState<StepResult>({ kind: 'none' });
  const [comboCount, setComboCount] = React.useState(0);

  const step = steps[stepIndex];
  const total = Math.max(steps.length - 1, 1);
  const progress = steps.length > 1 ? Math.round((stepIndex / total) * 100) : 0;

  React.useEffect(() => { setResult({ kind: 'none' }); }, [stepIndex]);

  // Start the session exactly once on mount
  const hasStarted = React.useRef(false);
  React.useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    startLesson(
      movieId
        ? buildMovieSteps(movieId)
        : mode === 'review'
        ? buildReviewSteps(reviewQueue)
        : buildLessonSteps(wordCount, category, isTurbo)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markWrong = React.useCallback((item: ReviewItem, msg?: string) => {
    pushToReview(item);
    setResult({ kind: 'wrong', msg });
    setComboCount(0);
    soundFX.playWrong();
  }, [pushToReview]);

  const markCorrect = React.useCallback((item?: ReviewItem) => {
    setResult({ kind: 'correct' });
    setComboCount(prev => prev + 1);
    soundFX.playCorrect();

    const bonusPoints = comboCount >= 3 ? 15 : 10;
    addPoints(bonusPoints);
    
    if (mode === 'review' && item) {
      removeFromReview(item);
    }
  }, [mode, removeFromReview, addPoints, comboCount]);

  const handleNext = React.useCallback(() => {
    setResult({ kind: 'none' });
    next();

    // Check if moving to result step
    if (steps[stepIndex + 1]?.type === 'result') {
      recordLearningActivity();
      soundFX.playVictory();
    }
  }, [next, steps, stepIndex, recordLearningActivity]);

  // Auto-advance after correct answer
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (result.kind === 'correct') {
      timeout = setTimeout(() => {
        handleNext();
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, [result.kind, handleNext]);

  const handleRestart = React.useCallback(() => {
    restart();
    hasStarted.current = false;
    setComboCount(0);
    startLesson(
      movieId
        ? buildMovieSteps(movieId)
        : mode === 'review'
        ? buildReviewSteps(reviewQueue)
        : buildLessonSteps(wordCount, category, isTurbo)
    );
  }, [restart, startLesson, mode, reviewQueue, wordCount, category, isTurbo, movieId]);

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
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] relative">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full px-4 pt-4 pb-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
          {/* Back to setup */}
          <button
            onClick={() => window.history.back()}
            title="나가기"
            className="h-10 w-10 rounded-2xl bg-[var(--color-muted)] text-[var(--color-muted-foreground)] flex items-center justify-center hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)] transition-colors shrink-0"
          >
            <XCircle className="w-6 h-6" />
          </button>

          {/* Progress & Combo */}
          <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {mode === 'review' ? '복습 세션' : '레슨 진행중'}
                </span>
                {isTurbo && (
                  <span className="text-[9px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    TURBO
                  </span>
                )}
              </div>

              {comboCount >= 2 && (
                <div className="flex items-center gap-1 text-xs font-black text-orange-500 animate-bounce">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{comboCount} COMBO!</span>
                </div>
              )}
            </div>
            <div className="h-3.5 w-full bg-[var(--color-muted)] rounded-full overflow-hidden border border-[var(--color-border)]">
              <div
                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-pink-500 rounded-full relative transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Skip button */}
          {step && step.type !== 'result' && (
            <button
              onClick={handleNext}
              className="h-10 px-3.5 sm:px-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs sm:text-sm font-bold text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all shrink-0 flex items-center gap-1"
            >
              건너뛰기
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-3 sm:px-4 py-6 flex flex-col items-center custom-scrollbar">
        <div className="max-w-4xl mx-auto w-full flex-1 grid place-items-center pb-28 sm:pb-36 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={stepIndex} 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <div className="w-full max-w-xl">
                {renderStep()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Fixed bottom Feedback bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        {result.kind !== 'none' && (
          <div className="pointer-events-auto">
            <FeedbackBar
              result={{ kind: result.kind as 'correct' | 'wrong' }}
              onNext={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  );

  function renderStep() {
    if (!step) return null;

    switch (step.type) {
      case 'word_reveal':
        return <WordRevealStep word={step.word} onNext={next} isReview={mode === 'review'} />;
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
            onContinue={(passed, msg) => passed
              ? markCorrect({ kind: 'speaking', expectedSentence: step.expectedSentence })
              : markWrong({ kind: 'speaking', expectedSentence: step.expectedSentence }, msg)}
          />
        );
      case 'result':
        return <ResultCard onRestart={handleRestart} isReview={mode === 'review'} />;
      default:
        return null;
    }
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function makeBlankSentence(sentence: string, word: string): string {
  return sentence.replace(new RegExp(`\\b${word}\\b`, 'i'), '______');
}

function buildOptions(answer: string, pool: string[], manualDistractors?: string[]): string[] {
  let distractors: string[] = [];

  if (manualDistractors && manualDistractors.length > 0) {
    distractors = getRandomElements(manualDistractors, 3);
  }

  if (distractors.length < 3) {
    const remainingCount = 3 - distractors.length;
    const randomPool = pool.filter(w => w !== answer && !distractors.includes(w));
    distractors = [...distractors, ...getRandomElements(randomPool, remainingCount)];
  }

  return getRandomElements([answer, ...distractors], 4);
}

// ─── Step Builders (Interleaved Micro-Learning) ────────────────────────────────

function buildLessonSteps(wordCount: 5 | 10 | 15, category: string = 'all', isTurbo: boolean = false): LessonStep[] {
  const vocabPool = getCategoryWords(category);

  const words = getRandomElements(vocabPool, wordCount).map(w => ({
    ...w,
    id: w.id ?? w.word,
    example: w.example || (w.examples && w.examples[0]?.text) || '',
    exampleTranslation: w.exampleTranslation || (w.examples && w.examples[0]?.translation) || '',
  }));

  const pool = vocabPool.map(w => w.word).filter(Boolean);

  const speakingSentence =
    getRandomElements(grammarContents, 1)[0]?.examples?.[0]?.en ||
    (sentenceData
      ? getRandomElements(sentenceData as unknown as { text: string }[], 1)[0]?.text
      : '') ||
    'Focus on your goals.';

  const steps: LessonStep[] = [];

  // Interleaved Micro-Learning Flow:
  // Presentation -> Immediate Active Test -> Next Concept -> Interleaved Review
  for (let i = 0; i < words.length; i++) {
    const w = words[i];

    // 1. Reveal Word
    steps.push({ type: 'word_reveal', word: w });

    // 2. Immediate Active Choice Quiz for Word
    steps.push({ type: 'choice_quiz', word: w, options: buildOptions(w.word, pool, w.distractors) });

    if (!isTurbo) {
      // 3. Sentence completion or building
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

      // 4. Every 2 words, trigger an interleaved review quiz of previous words
      if (i > 0 && i % 2 === 1) {
        const previousWord = words[i - 1];
        steps.push({
          type: 'listening_quiz',
          answer: previousWord.word,
          options: buildOptions(previousWord.word, pool, previousWord.distractors),
          prompt: `[복습] 방금 학습한 표현의 원어민 발음을 다시 들어볼까요?`
        });
      }
    }
  }

  // 5. Final Speaking Challenge
  if (!isTurbo) {
    steps.push({ type: 'speaking', expectedSentence: speakingSentence });
  }

  // 6. Result & Celebration
  steps.push({ type: 'result' });

  return steps;
}

function buildReviewSteps(queue: ReviewItem[]): LessonStep[] {
  const allVocab = vocabulary;
  const pool = allVocab.map(w => w.word).filter(Boolean);

  const items = getRandomElements(queue.slice(0, 15), Math.min(queue.length || 5, 10));
  const steps: LessonStep[] = [];

  for (const item of items) {
    let fullWord: Word | undefined;
    if ('word' in item) {
      fullWord = allVocab.find(w => w.word === item.word.word) || item.word;
    } else if (item.kind === 'listening_quiz') {
      fullWord = allVocab.find(w => w.word === item.answer);
    }

    if (fullWord) {
      steps.push({ type: 'word_reveal', word: fullWord });
    }

    switch (item.kind) {
      case 'speaking':
        steps.push({ type: 'speaking', expectedSentence: item.expectedSentence });
        break;
      case 'listening_quiz':
        steps.push({
          type: 'listening_quiz',
          answer: item.answer,
          options: buildOptions(item.answer, pool, fullWord?.distractors),
          prompt: "다시 한번 들어볼까요? 정확히 어떤 단어였나요?"
        });
        break;
      case 'choice_quiz':
        const quizWord = fullWord || item.word;
        steps.push({
          type: 'choice_quiz',
          word: quizWord,
          options: buildOptions(quizWord.word, pool, quizWord.distractors)
        });
        break;
      case 'typing_exact':
        const word = fullWord || item.word;
        steps.push({
          type: 'fill_blank',
          word: word,
          sentence: word.example || `${word.word} is an important word.`,
          blankedSentence: makeBlankSentence(word.example || `${word.word} is an important word.`, word.word)
        });
        break;
      case 'sentence_build':
        steps.push({ type: 'sentence_build', word: fullWord || item.word });
        break;
    }
  }

  if (steps.length === 0) {
    // Fallback if queue is empty
    return buildLessonSteps(5);
  }

  steps.push({ type: 'result' });
  return steps;
}

function buildMovieSteps(movieId: string): LessonStep[] {
  const content = grammarContents.find(c => c.id === movieId);
  if (!content) return buildLessonSteps(5);

  const steps: LessonStep[] = [];
  
  const example = content.examples?.[0];
  const targetWord = example?.en.split(' ')[0] || 'Learn';
  
  steps.push({
    type: 'listening_quiz',
    answer: targetWord,
    options: buildOptions(targetWord, [], ['Study', 'Practice', 'Read']),
    prompt: `[${content.title}] 예문에서 첫 번째 단어는 무엇인가요?`
  });

  steps.push({
    type: 'speaking',
    expectedSentence: example?.en || 'Practice makes perfect.'
  });

  steps.push({ type: 'result' });
  return steps;
}