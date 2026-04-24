'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { ArrowRight, CheckCircle2, XCircle, Volume2, RotateCcw, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatWord, formatSentence } from '@/lib/utils/format';

// ─── Types ────────────────────────────────────────────────────────────────────

type StepResult = { kind: 'none' } | { kind: 'correct' } | { kind: 'wrong' };

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

  // 복습 모드일 경우 자동으로 시작 (사용자 편의성)
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
      console.log('Removing from review:', item);
      removeFromReview(item);
    }
  }, [mode, removeFromReview]);

  const handleNext = React.useCallback(() => {
    setResult({ kind: 'none' });
    next();
  }, [next]);

  // Enter 키로 계속하기 지원
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
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 pt-6 sm:pt-12 pb-56 min-h-[90vh] flex flex-col gap-6 justify-center">

      {/* ── 진행 바 ── */}
      <header className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm font-black text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          ✕ 닫기
        </Link>
        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-black text-muted-foreground shrink-0 tabular-nums w-12 text-right">
          {stepIndex}/{total}
        </span>
      </header>

      {/* ── 스텝 렌더링 ── */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {step.type === 'intro' && (
              <IntroCard
                mode={mode}
                category={category}
                wordCount={wordCount}
                setWordCount={setWordCount}
                reviewCount={reviewQueue.length}
                onStart={handleStart}
              />
            )}

            {step.type === 'word_reveal' && (
              <WordRevealStep word={step.word} onNext={next} />
            )}

            {step.type === 'choice_quiz' && (
              <ChoiceQuizStep
                word={step.word}
                options={step.options}
                onCorrect={() => markCorrect({ kind: 'choice_quiz', word: step.word })}
                onWrong={() => markWrong({ kind: 'choice_quiz', word: step.word })}
              />
            )}

            {step.type === 'listening_quiz' && (
              <ListeningQuizStep
                answer={step.answer}
                options={step.options}
                prompt={step.prompt}
                onCorrect={() => markCorrect({ kind: 'listening_quiz', answer: step.answer })}
                onWrong={() => markWrong({ kind: 'listening_quiz', answer: step.answer })}
              />
            )}

            {step.type === 'fill_blank' && (
              <FillBlankStep
                word={step.word}
                sentence={step.sentence}
                blanked={step.blankedSentence}
                onCorrect={() => markCorrect({ kind: 'typing_exact', word: step.word })}
                onWrong={() => markWrong({ kind: 'typing_exact', word: step.word })}
              />
            )}

            {step.type === 'sentence_build' && (
              <SentenceBuildStep
                word={step.word}
                onCorrect={() => markCorrect({ kind: 'sentence_build', word: step.word })}
                onWrong={() => markWrong({ kind: 'sentence_build', word: step.word })}
              />
            )}

            {step.type === 'speaking' && (
              <SpeakingStep
                sentence={step.expectedSentence}
                onCorrect={() => markCorrect({ kind: 'speaking', expectedSentence: step.expectedSentence })}
                onWrong={() => markWrong({ kind: 'speaking', expectedSentence: step.expectedSentence })}
              />
            )}

            {step.type === 'result' && <ResultCard onRestart={restart} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 정답/오답 바 ── */}
      <AnimatePresence>
        {result.kind !== 'none' && (
          <FeedbackBar result={result} onNext={handleNext} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── IntroCard ────────────────────────────────────────────────────────────────

function IntroCard({
  mode, category, wordCount, setWordCount, reviewCount, onStart,
}: {
  mode: 'review' | 'lesson';
  category?: string;
  wordCount: 5 | 10;
  setWordCount: (n: 5 | 10) => void;
  reviewCount: number;
  onStart: () => void;
}) {
  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border-2 border-primary/20 text-[10px] font-black tracking-widest">
            {category && category !== 'all' ? `${category.toUpperCase()} COURSE` : 'GENERAL COURSE'}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {mode === 'review' ? '오답 복습' : '오늘의 레슨'}
            </h1>
            <p className="text-sm text-muted-foreground font-bold leading-relaxed">
              {mode === 'review'
                ? `틀렸던 ${reviewCount}개 단어를 다시 풀어요.`
                : '단어 확인 → 퀴즈 → 문장 만들기 → 말하기 순서로 진행해요.'}
            </p>
          </div>
        </div>

        {mode !== 'review' && (
          <div className="flex gap-2">
            {([5, 10] as const).map(n => (
              <button
                key={n}
                onClick={() => setWordCount(n)}
                className={`h-11 px-5 rounded-xl border-2 font-black text-sm transition-all
                  ${wordCount === n
                    ? 'border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_var(--primary)]'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                  }`}
              >
                {n === 5 ? '빠르게 5개' : '집중 10개'}
              </button>
            ))}
          </div>
        )}

        <Button onClick={onStart} className="h-12 w-full sm:w-auto font-black px-8 bg-primary text-primary-foreground hover:bg-primary/90">
          시작하기 <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── WordRevealStep ───────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  '일상': 'bg-blue-100 text-blue-700 border-blue-200',
  '캐주얼': 'bg-purple-100 text-purple-700 border-purple-200',
  '비즈니스': 'bg-amber-100 text-amber-700 border-amber-200',
  '여행': 'bg-green-100 text-green-700 border-green-200',
  '숙어': 'bg-rose-100 text-rose-700 border-rose-200',
};

function WordRevealStep({ word, onNext }: { word: Word; onNext: () => void }) {
  const { speak, isPlaying } = useTTS();
  const w = word as Word & { category?: string; level?: string };
  const catColor = CATEGORY_COLORS[w.category ?? ''] ?? 'bg-muted text-muted-foreground border-border';
  const [revealed, setRevealed] = React.useState(false);

  const reveal = () => {
    setRevealed(true);
    speak(word.word);
  };

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)] overflow-hidden">
      <CardContent className="p-6 sm:p-10 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-muted-foreground tracking-widest mr-1">새 단어</span>
            {w.category && (
              <span className={`text-[10px] font-black px-2 py-0.5 border-2 rounded-full ${catColor}`}>
                {w.category}
              </span>
            )}
            {w.level && (
              <span className="text-[10px] font-black px-2 py-0.5 border-2 border-border bg-background rounded-full text-muted-foreground">
                {w.level.charAt(0).toUpperCase() + w.level.slice(1)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-5xl sm:text-6xl font-black text-foreground tracking-tight">
              {formatWord(word.word)}
            </h2>
            <IconButton onClick={() => speak(word.word)} label="발음 듣기" className={cn("h-12 w-12", isPlaying && "border-primary text-primary bg-primary/5")}>
              <Volume2 className={cn("w-6 h-6", isPlaying && "animate-pulse")} />
            </IconButton>
          </div>
        </div>

        {!revealed ? (
          <Button onClick={reveal} className="h-14 w-full sm:w-auto px-10 text-lg font-black group">
            뜻 확인하기
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <p className="text-xs font-black text-muted-foreground tracking-widest">의미</p>
              <p className="text-3xl font-black text-primary leading-tight">{word.meaning}</p>
            </div>

            {word.example && (
              <div className="rounded-2xl bg-muted/30 border-2 border-border p-5 space-y-3 relative group">
                <p className="text-lg font-bold text-foreground leading-relaxed pr-8">
                  "{formatSentence(word.example)}"
                </p>
                <IconButton
                  onClick={() => speak(word.example!)}
                  label="예문 듣기"
                  className={cn(
                    "absolute top-4 right-4 transition-all",
                    isPlaying ? "opacity-100 border-primary text-primary" : "opacity-40 group-hover:opacity-100"
                  )}
                >
                  <Volume2 className={cn("w-4 h-4", isPlaying && "animate-pulse")} />
                </IconButton>
                {word.exampleTranslation && (
                  <p className="text-base text-muted-foreground font-bold border-t border-border/50 pt-2">
                    {word.exampleTranslation}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-border/50 flex justify-end">
              <Button onClick={onNext} className="h-12 font-black px-8">
                계속하기
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── ChoiceQuizStep ───────────────────────────────────────────────────────────

function ChoiceQuizStep({
  word, options, onCorrect, onWrong,
}: {
  word: Word; options: string[];
  onCorrect: () => void; onWrong: () => void;
}) {
  const [picked, setPicked] = React.useState<string | null>(null);

  const pick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === word.word) onCorrect(); else onWrong();
  };

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-black text-muted-foreground tracking-widest">
            단어 고르기
          </p>
          <p className="text-3xl sm:text-4xl font-black text-foreground break-keep leading-tight">
            {word.meaning}
          </p>
        </div>

        <div className="grid gap-4">
          {options.map((opt, i) => {
            const done = picked !== null;
            const isTarget = opt === word.word;
            const isSelected = picked === opt;

            return (
              <motion.button
                key={opt}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => pick(opt)}
                disabled={done}
                className={`group relative h-16 w-full px-6 rounded-2xl border-4 font-black text-left text-lg transition-all
                  ${!done
                    ? 'border-border bg-background hover:border-primary hover:-translate-y-1 hover:shadow-[0_4px_0_var(--primary)] active:translate-y-0 active:shadow-none'
                    : isTarget
                      ? 'border-success bg-success/10 text-success shadow-none'
                      : isSelected
                        ? 'border-error bg-error/10 text-error shadow-none'
                        : 'border-border bg-background opacity-40 grayscale cursor-default shadow-none'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span>{formatWord(opt)}</span>
                  {done && isTarget && <CheckCircle2 className="w-6 h-6" />}
                  {done && isSelected && !isTarget && <XCircle className="w-6 h-6" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── ListeningQuizStep ───────────────────────────────────────────────────────

function ListeningQuizStep({
  answer, options, prompt, onCorrect, onWrong
}: {
  answer: string; options: string[]; prompt?: string;
  onCorrect: () => void; onWrong: () => void;
}) {
  const { speak, isPlaying, isLoading } = useTTS();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => { 
    // Small delay to ensure browser readiness
    const t = setTimeout(() => speak(answer), 300);
    return () => clearTimeout(t);
  }, [answer, speak]);

  const handleSelect = (opt: string) => {
    if (submitted) return;
    setSelected(opt);
    setSubmitted(true);
    if (opt === answer) onCorrect(); else onWrong();
  };

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)] overflow-hidden">
      <CardContent className="p-6 sm:p-10 space-y-10">
        <div className="space-y-2 text-center">
          <p className="text-xs font-black text-muted-foreground tracking-widest">
            {prompt || '듣고 알맞은 단어를 선택하세요'}
          </p>
          <p className="text-sm font-bold text-muted-foreground">스피커 아이콘을 눌러 다시 들을 수 있습니다.</p>
        </div>

        <div className="flex justify-center py-6">
          <button
            onClick={() => speak(answer)}
            disabled={isLoading}
            className={cn(
              "w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] border-4 border-border shadow-[8px_8px_0_var(--border)] flex items-center justify-center hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all wobbly",
              isPlaying ? "bg-secondary text-white" : "bg-primary text-primary-foreground",
              isLoading && "opacity-50 animate-pulse"
            )}
          >
            <Volume2 className={cn("w-16 h-16 sm:w-20 sm:h-20", isPlaying && "animate-pulse")} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((opt) => {
            const isCorrect = opt === answer;
            const isSelected = selected === opt;
            
            let variantClass = 'bg-background hover:border-primary/50';
            if (submitted) {
              if (isCorrect) variantClass = 'bg-success/10 border-success text-success scale-[1.02]';
              else if (isSelected) variantClass = 'bg-error/10 border-error text-error opacity-60';
              else variantClass = 'opacity-40 grayscale';
            }

            return (
              <button
                key={opt}
                disabled={submitted}
                onClick={() => handleSelect(opt)}
                className={`h-20 sm:h-24 px-4 rounded-3xl border-4 font-black text-xl sm:text-2xl transition-all shadow-[4px_4px_0_var(--border)]
                  ${variantClass} ${!submitted && 'active:translate-y-1 active:shadow-none'}`}
              >
                {formatWord(opt)}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── FillBlankStep ────────────────────────────────────────────────────────────

function FillBlankStep({
  word, sentence, blanked, onCorrect, onWrong,
}: {
  word: Word; sentence: string; blanked: string;
  onCorrect: () => void; onWrong: () => void;
}) {
  const { speak, isPlaying } = useTTS();
  const [value, setValue] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const isCorrect = submitted && flexMatch(value, word.word);

  const submit = () => {
    if (!value.trim() || submitted) return;
    setSubmitted(true);
    if (flexMatch(value, word.word)) onCorrect(); else onWrong();
  };

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-black text-muted-foreground tracking-widest">
            빈칸 채우기
          </p>
          <p className="text-base text-muted-foreground font-bold">문맥에 맞는 단어를 채워보세요.</p>
        </div>

        <div className="rounded-2xl bg-muted/30 border-4 border-dashed border-border p-8 text-center space-y-4">
          <p className="text-2xl font-black text-foreground leading-relaxed">
            {blanked.split('______').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block min-w-[100px] border-b-4 border-primary text-primary mx-2">
                    {submitted ? value : '____'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-black border-2 border-primary/20">
            뜻: {word.meaning}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="여기에 입력..."
              disabled={submitted}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={`w-full h-16 px-6 rounded-2xl border-4 font-black text-xl bg-background
                text-foreground placeholder:text-muted-foreground/40 outline-none transition-all
                ${submitted
                  ? isCorrect ? 'border-success bg-success/5 shadow-none' : 'border-error bg-error/5 shadow-none'
                  : 'border-border focus:border-primary focus:shadow-[0_4px_0_var(--primary)]'
                }`}
            />
          </div>
          <Button 
            variant="secondary" 
            onClick={() => speak(sentence)} 
            className={cn(
              "h-16 w-16 p-0 rounded-2xl border-4 border-border shadow-none transition-all",
              isPlaying ? "border-primary text-primary bg-primary/5" : "hover:border-primary"
            )}
            disabled={submitted}
          >
            <Volume2 className={cn("w-8 h-8", isPlaying && "animate-pulse")} />
          </Button>
        </div>

        {submitted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl border-4 p-5 space-y-2
              ${isCorrect ? 'border-success bg-success/5' : 'border-error bg-error/5'}`}
          >
            <div className="flex items-center gap-3">
              {isCorrect ? <CheckCircle2 className="w-6 h-6 text-success" /> : <XCircle className="w-6 h-6 text-error" />}
              <p className="text-lg font-black text-foreground">
                {isCorrect ? '참 잘했어요!' : `아쉬워요. 정답은 "${word.word}" 입니다.`}
              </p>
            </div>
            <p className="text-base text-muted-foreground font-bold italic pl-9">"{formatSentence(sentence)}"</p>
          </motion.div>
        )}
        
        {!submitted && (
          <div className="flex justify-end pt-2">
            <Button onClick={submit} disabled={!value.trim()} className="h-14 px-10 text-lg font-black">
              확인
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── SentenceBuildStep ────────────────────────────────────────────────────────

function SentenceBuildStep({
  word, onCorrect, onWrong,
}: {
  word: Word; onCorrect: () => void; onWrong: () => void;
}) {
  const target = word.word.toLowerCase();
  const { speak, isPlaying } = useTTS();
  const [value, setValue] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [hintLevel, setHintLevel] = React.useState(0); // 0: none, 1: translation, 2: example
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => { textareaRef.current?.focus(); }, []);

  const bank = React.useMemo(() => {
    const common = ['I', 'She', 'He', 'We', 'They', 'am', 'is', 'are', 'have', 'to', 'a', 'the'];
    return [word.word, ...getRandomElements(common, 6)];
  }, [word.word]);

  const addWord = (w: string) => {
    setValue(prev => {
      const t = prev.trimEnd();
      return t ? `${t} ${w}` : w;
    });
    textareaRef.current?.focus();
  };

  /** 단어의 변형태(복수, 시제 등)를 고려한 유연한 매칭 */
  const getVariations = (w: string) => {
    const v = w.toLowerCase();
    const set = new Set([v]);
    
    // 기본 규칙 (복수형, 시제 등)
    set.add(`${v}s`);
    set.add(`${v}es`);
    if (v.endsWith('e')) {
      set.add(`${v}d`);
      set.add(`${v.slice(0, -1)}ing`);
    } else {
      set.add(`${v}ed`);
      set.add(`${v}ing`);
    }
    if (v.endsWith('y')) {
      set.add(`${v.slice(0, -1)}ies`);
      set.add(`${v.slice(0, -1)}ied`);
    }

    // 불규칙 동사 등 특수 케이스 (일부 예시)
    const irregulars: Record<string, string[]> = {
      'go': ['went', 'gone', 'going'],
      'be': ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
      'have': ['has', 'had', 'having'],
      'do': ['does', 'did', 'done', 'doing'],
      'eat': ['ate', 'eaten', 'eating'],
      'run': ['ran', 'running'],
      'see': ['saw', 'seen', 'seeing'],
      'take': ['took', 'taken', 'taking'],
      'make': ['made', 'making'],
      'get': ['got', 'gotten', 'getting'],
    };
    if (irregulars[v]) irregulars[v].forEach(i => set.add(i));
    
    return Array.from(set);
  };

  /** 스마트 채점 로직 */
  const evaluate = (v: string) => {
    const trimmed = v.trim();
    const lower = trimmed.toLowerCase();
    const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);
    const variations = getVariations(target);
    
    // 1. 단어 포함 여부 (변형태 포함)
    const hasWord = variations.some(vari => tokens.includes(vari));
    
    if (!hasWord) {
      // 혹시 문장 내에 부분 문자열로라도 있는지 체크 (예: 'apples'에 'apple' 포함)
      const partialMatch = tokens.some(t => variations.some(vari => t.startsWith(vari) || vari.startsWith(t)));
      if (!partialMatch) {
        return { ok: false, msg: `"${word.word}" 단어(또는 변형태)를 사용해주세요!` };
      }
    }
    
    // 2. 예문과 완전 일치 (마침표 제외)
    if (word.example && lower.replace(/[.!?]$/, '') === word.example.toLowerCase().replace(/[.!?]$/, '')) {
      return { ok: true, msg: '완벽해요! 예문과 똑같이 쓰셨네요 🎉' };
    }

    // 3. 최소 단어 수 (3단어)
    if (tokens.length < 3) return { ok: false, msg: '조금 더 길게 써볼까요? (3단어 이상)' };

    // 4. 합격
    return { ok: true, msg: '정말 좋은 문장이에요! 단어를 잘 활용하셨네요 ✅' };
  };

  const [evalResult, setEvalResult] = React.useState<{ ok: boolean, msg: string } | null>(null);

  const submit = () => {
    if (!value.trim() || submitted) return;
    const res = evaluate(value);
    setEvalResult(res);
    setSubmitted(true);
    if (res.ok) onCorrect(); else onWrong();
  };

  const variations = React.useMemo(() => getVariations(target), [target]);
  const currentTokens = value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const hasWord = variations.some(vari => currentTokens.includes(vari));

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)] overflow-hidden">
      <CardContent className="p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-black text-muted-foreground tracking-widest">
              자유 문장 만들기
            </p>
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-black text-foreground">{formatWord(word.word)}</span>
              <IconButton 
                onClick={() => speak(word.word)} 
                label="발음 듣기" 
                className={cn("h-10 w-10", isPlaying && "border-primary text-primary bg-primary/5")}
              >
                <Volume2 className={cn("w-5 h-5", isPlaying && "animate-pulse")} />
              </IconButton>
            </div>
            <p className="text-lg text-primary font-black">{word.meaning}</p>
          </div>
          
          <div className="bg-muted/30 px-4 py-2 rounded-2xl border-2 border-border text-center sm:text-right">
             <p className="text-[10px] font-black text-muted-foreground mb-1">인정되는 형태</p>
             <div className="flex flex-wrap justify-center sm:justify-end gap-1.5">
                {variations.slice(0, 4).map(v => (
                  <span key={v} className="text-[10px] font-bold px-2 py-0.5 bg-background rounded-md border border-border/50">{v}</span>
                ))}
                {variations.length > 4 && <span className="text-[10px] font-bold text-muted-foreground">...</span>}
             </div>
          </div>
        </div>

        {!submitted && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-muted-foreground tracking-widest">빠른 입력 & 힌트</p>
              {word.example && hintLevel < 2 && (
                <button 
                  onClick={() => setHintLevel(prev => prev + 1)}
                  className="text-sm font-black text-primary hover:underline flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full border border-primary/20"
                >
                  <Lightbulb className="w-4 h-4" /> 힌트 보기 ({hintLevel}/2)
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {bank.map(w => (
                <button
                  key={w}
                  onClick={() => addWord(w)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-black transition-all active:scale-95
                    ${target.includes(w.toLowerCase()) || w.toLowerCase().includes(target)
                      ? 'border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_var(--primary-foreground)]'
                      : 'border-border bg-background text-foreground hover:border-primary/60'
                    }`}
                >
                  {w}
                </button>
              ))}
            </div>
            
            <AnimatePresence>
              {hintLevel >= 1 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                  <div className="text-sm font-bold text-amber-700 bg-amber-50 px-4 py-3 rounded-2xl border-2 border-amber-200 flex items-start gap-3">
                    <div className="mt-0.5 bg-amber-200 p-1 rounded-lg"><Lightbulb className="w-3.5 h-3.5 text-amber-700" /></div>
                    <div>
                      <p className="text-xs font-black opacity-60 mb-0.5">뜻 풀이</p>
                      <p>{word.exampleTranslation || "이 단어를 사용해 문장을 만들어보세요."}</p>
                    </div>
                  </div>
                  {hintLevel >= 2 && word.example && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-blue-700 bg-blue-50 px-4 py-3 rounded-2xl border-2 border-blue-200 flex items-start gap-3">
                       <div className="mt-0.5 bg-blue-200 p-1 rounded-lg"><Volume2 className={cn("w-3.5 h-3.5 text-blue-700", isPlaying && "animate-pulse")} /></div>
                       <div>
                         <p className="text-xs font-black opacity-60 mb-0.5">참고 예문</p>
                         <p className={cn("italic underline cursor-pointer", isPlaying && "text-primary")} onClick={() => speak(word.example!)}>&quot;{word.example}&quot;</p>
                       </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
            }}
            disabled={submitted}
            rows={3}
            placeholder={`"${formatWord(word.word)}"를 넣어 문장을 완성해보세요...`}
            className={`w-full px-6 py-5 rounded-[2rem] border-4 font-black text-lg bg-background
              text-foreground placeholder:text-muted-foreground/30 resize-none outline-none transition-all
              ${submitted
                ? evalResult?.ok ? 'border-success bg-success/5 shadow-none' : 'border-error bg-error/5 shadow-none'
                : 'border-border focus:border-primary focus:shadow-[0_6px_0_var(--primary)]'
              }`}
          />
          {value && !submitted && (
            <div className="flex justify-between items-center px-4">
              <div className={`text-xs font-black flex items-center gap-1.5 ${hasWord ? 'text-success' : 'text-muted-foreground'}`}>
                {hasWord ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />}
                {hasWord ? `단어 포함됨` : `"${formatWord(word.word)}"를 포함해주세요`}
              </div>
              <p className="text-[10px] font-black text-muted-foreground">
                글자 수: {value.length} / 단어 수: {currentTokens.length}
              </p>
            </div>
          )}
        </div>

        {!submitted ? (
          <div className="flex justify-end pt-2">
            <Button onClick={submit} disabled={!value.trim()} className="h-14 px-10 text-xl font-black rounded-2xl shadow-[4px_4px_0_var(--border)]">
              완성하기
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[2rem] border-4 p-6 space-y-4
              ${evalResult?.ok ? 'border-success bg-success/5' : 'border-error bg-error/5'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border-2
                ${evalResult?.ok ? 'bg-success/20 border-success' : 'bg-error/20 border-error'}`}>
                {evalResult?.ok ? <CheckCircle2 className="w-7 h-7 text-success" /> : <XCircle className="w-7 h-7 text-error" />}
              </div>
              <p className="font-black text-xl text-foreground leading-tight">{evalResult?.msg}</p>
            </div>
            
            {!evalResult?.ok ? (
              <Button 
                variant="secondary" 
                onClick={() => { setSubmitted(false); setEvalResult(null); }}
                className="w-full h-12 font-black border-2 border-error/20 hover:bg-error/5"
              >
                다시 시도하기
              </Button>
            ) : (
              word.example && (
                <div className="bg-background/50 rounded-2xl p-4 border-2 border-border/50 space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground tracking-tighter">링고스냅 추천 표현</p>
                  <p className="font-bold text-foreground italic flex items-center justify-between gap-3">
                    <span>&quot;{formatSentence(word.example)}&quot;</span>
                    <IconButton 
                      onClick={() => speak(word.example!)} 
                      label="듣기" 
                      className={cn("h-8 w-8 shrink-0", isPlaying && "border-primary text-primary bg-primary/5")}
                    >
                       <Volume2 className={cn("w-4 h-4", isPlaying && "animate-pulse")} />
                    </IconButton>
                  </p>
                </div>
              )
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── SpeakingStep ─────────────────────────────────────────────────────────────

function SpeakingStep({
  sentence, onCorrect, onWrong,
}: {
  sentence: string; onCorrect: () => void; onWrong: () => void;
}) {
  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-4">
        <p className="text-xs font-black text-muted-foreground tracking-widest">말하기</p>
        <SpeakingPractice
          expectedSentence={sentence}
          onContinue={passed => { if (passed) onCorrect(); else onWrong(); }}
        />
      </CardContent>
    </Card>
  );
}

// ─── ResultCard ───────────────────────────────────────────────────────────────

function ResultCard({ onRestart }: { onRestart: () => void }) {
  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-5 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 border-2 border-success flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-3xl font-black text-foreground">레슨 완료!</h2>
        <p className="text-sm text-muted-foreground font-bold">
          틀린 문제는 복습 탭에 저장됐어요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRestart} className="h-12 font-black px-6">
            <RotateCcw className="mr-2 w-4 h-4" /> 다시 하기
          </Button>
          <Link href="/review">
            <Button variant="secondary" className="w-full h-12 font-black px-6">
              복습 보기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── FeedbackBar ──────────────────────────────────────────────────────────────

function FeedbackBar({ result, onNext }: { result: StepResult; onNext: () => void }) {
  const ok = result.kind === 'correct';
  return (
    <motion.div
      initial={{ y: 150, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 150, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-10 sm:pb-20 flex justify-center pointer-events-none"
    >
      <div className={`w-full max-w-xl rounded-[2.5rem] border-4 border-border
        shadow-[0_12px_0_var(--border)] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto
        ${ok ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'}`}
      >
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-3xl bg-white/20 flex items-center justify-center shrink-0 rotate-3 shadow-lg backdrop-blur-sm">
            {ok
              ? <CheckCircle2 className="w-10 h-10 text-current" />
              : <XCircle className="w-10 h-10 text-current" />
            }
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-black text-2xl sm:text-3xl leading-none">
              {ok ? '정답입니다!' : '괜찮아요!'}
            </h3>
            <p className="text-sm sm:text-base font-bold opacity-90">
              {ok ? '아주 훌륭한 문장이에요.' : '오답은 복습에서 다시 풀 수 있어요.'}
            </p>
          </div>
        </div>
        <Button 
          onClick={onNext} 
          className="h-14 sm:h-16 w-full sm:w-auto px-12 text-xl font-black shrink-0 bg-white text-foreground hover:bg-white/90 border-4 border-border/10 shadow-[0_6px_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
        >
          계속하기 <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── IconButton (공통) ────────────────────────────────────────────────────────

function IconButton({
  onClick, label, children, className = '',
}: {
  onClick: () => void; label: string; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`h-9 w-9 rounded-full border-2 border-border flex items-center justify-center
        hover:border-primary hover:bg-primary/5 transition-colors active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** 유연한 정답 판별: 활용형(복수·과거·진행) 모두 허용 */
function flexMatch(input: string, target: string): boolean {
  const a = input.trim().toLowerCase();
  const b = target.trim().toLowerCase();
  if (a === b) return true;
  if (a === `${b}s` || a === `${b}es`) return true;
  if (a === `${b}ed` || a === `${b}d`) return true;
  if (a === `${b}ing`) return true;
  if (b.endsWith('e') && a === `${b.slice(0, -1)}ing`) return true;
  return false;
}

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

  // 만약 카테고리에 단어가 적으면 전체 풀 사용
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

  // Phase 1: 단어 확인 (모두 먼저)
  for (const w of words) {
    steps.push({ type: 'word_reveal', word: w });
  }

  // Phase 2: 단어별 퀴즈 2종
  for (const w of words) {
    // 선택 퀴즈 (항상)
    steps.push({ type: 'choice_quiz', word: w, options: buildOptions(w.word, pool) });

    // 빈칸(예문 있으면) or 문장 만들기
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

  // Phase 3: 말하기 1회
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
        // Typing/Fill blank 복습은 단어 의미를 보여주고 입력하는 형태
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
