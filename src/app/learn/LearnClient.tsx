'use client';

import * as React from 'react';
import { SpeakingPractice } from '@/components/speaking/SpeakingPractice';
import { getRandomElements } from '@/lib/utils/random';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';
import type { LessonStep, ReviewItem } from '@/types/lesson';
import type { Word } from '@/types';
import sentenceData from '@/data/sentences.json';
import { grammarContents, getCategoryWords, vocabulary } from '@/data/contents';
import { XCircle } from 'lucide-react';
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

 const [result, setResult] = React.useState<StepResult>({ kind: 'none' });

 const step = steps[stepIndex];
 const total = Math.max(steps.length - 1, 1);
 const progress = steps.length > 1 ? Math.round((stepIndex / total) * 100) : 0;

 React.useEffect(() => { setResult({ kind: 'none' }); }, [stepIndex]);

 // Start the session exactly once on mount, capturing the initial config values.
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

 const handleRestart = React.useCallback(() => {
 restart();
 hasStarted.current = false;
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
 <div className="h-[100dvh] flex flex-col bg-[var(--color-background)] overflow-hidden">
 {/* Header */}
 <header className="shrink-0 z-40 w-full px-4 pt-4 pb-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
 <div className="max-w-4xl mx-auto flex items-center gap-4">
 {/* Back to setup — clearly red exit */}
 <button
 onClick={() => window.history.back()}
 title="나가기"
 className="h-10 w-10 rounded-[14px] bg-[var(--color-muted)] text-[var(--color-muted-foreground)] flex items-center justify-center hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)] transition-colors shrink-0"
 >
 <XCircle className="w-6 h-6" />
 </button>

 {/* Progress */}
 <div className="flex-1 flex flex-col gap-2 overflow-hidden">
 <div className="flex justify-between items-center px-1">
 <div className="flex items-center gap-2">
 <span className="text-[11px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">
 {mode === 'review' ? '복습 세션' : '레슨 진행중'}
 </span>
 {isTurbo && (
 <span className="text-[9px] font-black bg-[var(--color-warning)] text-white px-2 py-0.5 rounded-full">
 TURBO
 </span>
 )}
 </div>
 </div>
 <div className="h-3.5 w-full bg-[var(--color-muted)] rounded-full overflow-hidden border border-[var(--color-border)]">
 <div
 className="h-full bg-[var(--color-secondary)] rounded-full relative transition-all duration-300 ease-out"
 style={{ width: `${progress}%` }}
 />
 </div>
 </div>

 {/* Skip button */}
 {step.type !== 'result' && (
 <button
 onClick={handleNext}
 className="h-10 px-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-bold text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all shrink-0 flex items-center gap-1.5"
 >
 건너뛰기
 </button>
 )}
 </div>
 </header>

 <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center custom-scrollbar">
 <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center pb-24 sm:pb-32">
 <div key={stepIndex} className="w-full">
 {renderStep()}
 </div>
 </div>
 </main>

 <div className="h-24 shrink-0">
 {result.kind !== 'none' && (
 <FeedbackBar
 result={{ kind: result.kind as 'correct' | 'wrong' }}
 onNext={handleNext}
 />
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
 // Prioritize manual distractors
 distractors = getRandomElements(manualDistractors, 3);
 }

 // If we don't have enough manual distractors, fill with random ones
 if (distractors.length < 3) {
 const remainingCount = 3 - distractors.length;
 const randomPool = pool.filter(w => w !== answer && !distractors.includes(w));
 distractors = [...distractors, ...getRandomElements(randomPool, remainingCount)];
 }

 return getRandomElements([answer, ...distractors], 4);
}

// ─── Step Builders ────────────────────────────────────────────────────────────

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

 for (const w of words) {
 steps.push({ type: 'word_reveal', word: w });
 }

 for (const w of words) {
 steps.push({ type: 'choice_quiz', word: w, options: buildOptions(w.word, pool, w.distractors) });

 if (!isTurbo) {
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
 }

 if (!isTurbo) {
 steps.push({ type: 'speaking', expectedSentence: speakingSentence });
 }

 steps.push({ type: 'result' });

 return steps;
}

function buildReviewSteps(queue: ReviewItem[]): LessonStep[] {
 const allVocab = vocabulary;
 const pool = allVocab.map(w => w.word).filter(Boolean);

 // 1. Take up to 10 items and shuffle them for a fresh experience
 const items = getRandomElements(queue.slice(0, 15), 10);
 const steps: LessonStep[] = [];

 for (const item of items) {
 // Try to get the full word object for better context
 let fullWord: Word | undefined;
 if ('word' in item) {
 fullWord = allVocab.find(w => w.word === item.word.word) || item.word;
 } else if (item.kind === 'listening_quiz') {
 fullWord = allVocab.find(w => w.word === item.answer);
 }

 // Natural Review Loop: Remind -> Re-test
 if (fullWord) {
 // Step A: Remind (Reveal) - Shortened version or just the card
 steps.push({ type: 'word_reveal', word: fullWord });
 }

 // Step B: Re-test (The failed activity)
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

 steps.push({ type: 'result' });
 return steps;
}

function buildMovieSteps(movieId: string): LessonStep[] {
 const content = grammarContents.find(c => c.id === movieId);
 if (!content) return buildLessonSteps(5);

 const steps: LessonStep[] = [];
 
 // 1. Listening Comprehension (using grammar examples)
 const example = content.examples?.[0];
 const targetWord = example?.en.split(' ')[0] || 'Learn';
 
 steps.push({
 type: 'listening_quiz',
 answer: targetWord,
 options: buildOptions(targetWord, [], ['Study', 'Practice', 'Read']),
 prompt: `[${content.title}] 예문에서 첫 번째 단어는 무엇인가요?`
 });

 // 2. Speaking Practice
 steps.push({
 type: 'speaking',
 expectedSentence: example?.en || 'Practice makes perfect.'
 });

 steps.push({ type: 'result' });
 return steps;
}