'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SpeakingPractice } from '@/components/speaking/SpeakingPractice';
import { getRandomElements } from '@/lib/utils/random';
import { speak } from '@/lib/tts';
import { useLessonSessionStore } from '@/store/useLessonSessionStore';
import type { LessonStep, ReviewItem } from '@/types/lesson';
import type { Word } from '@/types';
import vocabData from '@/data/vocabulary.json';
import sentenceData from '@/data/sentences.json';
import { mediaContents } from '@/data/contents';
import { ArrowRight, CheckCircle2, XCircle, Volume2, RotateCcw } from 'lucide-react';

type StepResult = { kind: 'none' } | { kind: 'correct' } | { kind: 'wrong' };

export function LearnClient({ mode }: { mode: 'review' | 'lesson' }) {
  const steps = useLessonSessionStore(s => s.steps);
  const stepIndex = useLessonSessionStore(s => s.stepIndex);
  const startLesson = useLessonSessionStore(s => s.startLesson);
  const next = useLessonSessionStore(s => s.next);
  const restart = useLessonSessionStore(s => s.restart);
  const reviewQueue = useLessonSessionStore(s => s.reviewQueue);
  const pushToReview = useLessonSessionStore(s => s.pushToReview);

  const [result, setResult] = React.useState<StepResult>({ kind: 'none' });

  const [wordCount, setWordCount] = React.useState<5 | 10>(5);
  const [includeListening, setIncludeListening] = React.useState(true);
  const [includeTyping, setIncludeTyping] = React.useState(true);
  const [includeSpeaking, setIncludeSpeaking] = React.useState(true);

  const step = steps[stepIndex] || { type: 'intro' as const };
  const progress = Math.round(((stepIndex + 1) / Math.max(steps.length, 1)) * 100);

  React.useEffect(() => {
    setResult({ kind: 'none' });
  }, [stepIndex]);

  const handleStart = React.useCallback(() => {
    const nextSteps =
      mode === 'review'
        ? buildReviewSteps(reviewQueue)
        : buildLessonSteps({
            wordCount,
            includeListening,
            includeTyping,
            includeSpeaking,
          });
    startLesson(nextSteps);
  }, [includeListening, includeSpeaking, includeTyping, mode, reviewQueue, startLesson, wordCount]);

  const onStepWrong = React.useCallback((item: ReviewItem) => {
    pushToReview(item);
    setResult({ kind: 'wrong' });
  }, [pushToReview]);

  const onStepCorrect = React.useCallback(() => {
    setResult({ kind: 'correct' });
  }, []);

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 sm:py-10 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" className="text-sm font-black text-muted-foreground underline underline-offset-4">
          닫기
        </Link>
        <div className="flex-1 max-w-sm">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Link href="/review" className="text-sm font-black text-muted-foreground underline underline-offset-4">
          복습
        </Link>
      </header>

      {step.type === 'intro' && (
        <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
          <CardContent className="p-6 sm:p-10 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {mode === 'review' ? '복습 레슨' : '오늘의 레슨'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-bold leading-relaxed">
              {mode === 'review'
                ? '저장된 오답을 다시 풀어요. 한 문제씩, 깔끔하게.'
                : '단어 → 퀴즈 → 문장 만들기 → 말하기를 한 번에 진행해요.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleStart} className="h-12 font-black">
                시작하기 <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => speak('Audio test. Hello!')}
                className="h-12 font-black"
              >
                <Volume2 className="mr-2 w-5 h-5" /> 오디오 테스트
              </Button>
            </div>
            {mode === 'review' && (
              <p className="text-xs text-muted-foreground font-bold">
                오답 {reviewQueue.length}개
              </p>
            )}

            {mode !== 'review' && (
              <div className="pt-2 space-y-3">
                <div className="rounded-xl border-2 border-border bg-background/40 p-4 space-y-3">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                    레슨 설정
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={wordCount === 5 ? 'primary' : 'secondary'}
                      onClick={() => setWordCount(5)}
                      className="h-10 px-4 text-sm font-black"
                    >
                      짧게(5개)
                    </Button>
                    <Button
                      variant={wordCount === 10 ? 'primary' : 'secondary'}
                      onClick={() => setWordCount(10)}
                      className="h-10 px-4 text-sm font-black"
                    >
                      길게(10개)
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <ToggleChip
                      label="듣기 퀴즈"
                      value={includeListening}
                      onChange={setIncludeListening}
                    />
                    <ToggleChip
                      label="정확 타이핑"
                      value={includeTyping}
                      onChange={setIncludeTyping}
                    />
                    <ToggleChip
                      label="말하기"
                      value={includeSpeaking}
                      onChange={setIncludeSpeaking}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                    추천: 처음엔 “듣기+타이핑+말하기”를 켜고, 부담되면 말하기를 끄세요.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step.type === 'word_reveal' && (
        <WordRevealStep word={step.word} onNext={() => next()} />
      )}

      {step.type === 'listening_quiz' && (
        <ListeningQuizStep
          answer={step.answer}
          options={step.options}
          prompt={step.prompt}
          onCorrect={onStepCorrect}
          onWrong={() => onStepWrong({ kind: 'listening_quiz', answer: step.answer })}
        />
      )}

      {step.type === 'choice_quiz' && (
        <ChoiceQuizStep
          word={step.word}
          options={step.options}
          onCorrect={onStepCorrect}
          onWrong={() => onStepWrong({ kind: 'choice_quiz', word: step.word })}
        />
      )}

      {step.type === 'typing_exact' && (
        <TypingExactStep
          word={step.word}
          onCorrect={onStepCorrect}
          onWrong={() => onStepWrong({ kind: 'typing_exact', word: step.word })}
        />
      )}

      {step.type === 'sentence_build' && (
        <SentenceBuildStep
          word={step.word}
          onCorrect={onStepCorrect}
          onWrong={() => onStepWrong({ kind: 'sentence_build', word: step.word })}
        />
      )}

      {step.type === 'speaking' && (
        <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
          <CardContent className="p-6 sm:p-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">말하기</h2>
            <p className="text-sm text-muted-foreground font-bold">
              문장을 따라 말해보세요. (미지원 브라우저는 텍스트 입력으로 대체됩니다.)
            </p>
            <SpeakingPractice
              expectedSentence={step.expectedSentence}
              onContinue={(passed) => {
                if (!passed) onStepWrong({ kind: 'speaking', expectedSentence: step.expectedSentence });
                else onStepCorrect();
              }}
            />
          </CardContent>
        </Card>
      )}

      {step.type === 'result' && (
        <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
          <CardContent className="p-6 sm:p-10 space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-success text-white flex items-center justify-center border-2 border-border">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">완료!</h2>
            <p className="text-sm sm:text-base text-muted-foreground font-bold">
              복습에서 오답을 다시 풀 수 있어요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => restart()} className="h-12 font-black">
                <RotateCcw className="mr-2 w-5 h-5" /> 다시 하기
              </Button>
              <Link href="/review" className="sm:min-w-[200px]">
                <Button variant="secondary" className="w-full h-12 font-black">
                  복습으로 가기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <BottomFeedback
        result={result}
        onNext={() => {
          setResult({ kind: 'none' });
          next();
        }}
        canContinue={step.type !== 'intro' && step.type !== 'result' && result.kind !== 'none'}
      />
    </div>
  );
}

function BottomFeedback({
  result,
  onNext,
  canContinue,
}: {
  result: StepResult;
  onNext: () => void;
  canContinue: boolean;
}) {
  if (!canContinue) return null;
  const isCorrect = result.kind === 'correct';

  return (
    <div className="sticky bottom-[96px] sm:bottom-[110px] z-40">
      <div className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)] p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-success" />
          ) : (
            <XCircle className="w-6 h-6 text-error" />
          )}
          <p className="font-black text-foreground">
            {isCorrect ? '정답이에요' : '오답이에요. 복습에 저장했어요'}
          </p>
        </div>
        <Button onClick={onNext} className="h-11 px-5 font-black">
          계속 <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

function WordRevealStep({ word, onNext }: { word: Word; onNext: () => void }) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">단어</p>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">{word.word}</h2>
          </div>
          <Button variant="secondary" onClick={() => speak(word.word)} className="h-12 px-4 font-black">
            <Volume2 className="mr-2 w-5 h-5" /> 듣기
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">의미</p>
          {revealed ? (
            <p className="text-xl sm:text-2xl font-black text-primary">{word.meaning}</p>
          ) : (
            <Button onClick={() => setRevealed(true)} className="h-12 font-black">
              의미 보기
            </Button>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onNext} disabled={!revealed} className="h-12 font-black disabled:opacity-40">
            다음 <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ListeningQuizStep({
  answer,
  options,
  prompt,
  onCorrect,
  onWrong,
}: {
  answer: string;
  options: string[];
  prompt?: string;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [picked, setPicked] = React.useState<string | null>(null);
  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">듣기</p>
          <p className="text-sm text-muted-foreground font-bold">
            {prompt || '재생을 눌러 듣고, 맞는 단어를 선택하세요.'}
          </p>
        </div>
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => speak(answer)} className="h-12 px-6 font-black">
            <Volume2 className="mr-2 w-5 h-5" /> 재생
          </Button>
        </div>
        <div className="grid gap-3">
          {options.map((opt) => {
            const disabled = picked !== null;
            const isCorrect = opt === answer;
            const isSelected = picked === opt;
            const variant =
              picked === null
                ? 'secondary'
                : isCorrect
                  ? 'primary'
                  : isSelected
                    ? 'danger'
                    : 'secondary';
            return (
              <Button
                key={opt}
                variant={variant}
                disabled={disabled}
                onClick={() => {
                  setPicked(opt);
                  if (opt === answer) onCorrect();
                  else onWrong();
                }}
                className="h-14 justify-start font-black"
              >
                {opt}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ChoiceQuizStep({
  word,
  options,
  onCorrect,
  onWrong,
}: {
  word: Word;
  options: string[];
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [picked, setPicked] = React.useState<string | null>(null);

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">퀴즈</p>
          <p className="text-2xl sm:text-3xl font-black text-foreground break-keep">{word.meaning}</p>
        </div>

        <div className="grid gap-3">
          {options.map((opt) => {
            const isSelected = picked === opt;
            const isCorrect = opt === word.word;
            const disabled = picked !== null;
            const variant =
              picked === null
                ? 'secondary'
                : isCorrect
                  ? 'primary'
                  : isSelected
                    ? 'danger'
                    : 'secondary';

            return (
              <Button
                key={opt}
                variant={variant}
                disabled={disabled}
                onClick={() => {
                  setPicked(opt);
                  if (opt === word.word) onCorrect();
                  else onWrong();
                }}
                className="h-14 justify-start font-black"
              >
                {opt}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function TypingExactStep({
  word,
  onCorrect,
  onWrong,
}: {
  word: Word;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const target = word.word.trim().toLowerCase();
  const [value, setValue] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const ok = submitted && value.trim().toLowerCase() === target;

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">정확 타이핑</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground break-keep">{word.meaning}</p>
          </div>
          <Button variant="secondary" onClick={() => speak(word.word)} className="h-12 px-4 font-black">
            <Volume2 className="mr-2 w-5 h-5" /> 듣기
          </Button>
        </div>

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="단어를 정확히 입력하세요"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="flex justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setSubmitted(true);
              if (value.trim().toLowerCase() === target) onCorrect();
              else onWrong();
            }}
            className="h-12 font-black"
          >
            제출
          </Button>
        </div>

        {submitted && (
          <div className="rounded-xl border-2 border-border bg-background/40 p-4">
            <p className="font-black text-foreground">
              {ok ? '정확해요.' : `정답: ${word.word}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SentenceBuildStep({
  word,
  onCorrect,
  onWrong,
}: {
  word: Word;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const expected = word.example?.trim() || '';
  const target = word.word.trim().toLowerCase();
  const [value, setValue] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const isCorrect = submitted && value.trim().toLowerCase().includes(target);

  return (
    <Card className="bg-surface border-4 border-border shadow-[6px_6px_0_var(--border)]">
      <CardContent className="p-6 sm:p-10 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">문장 만들기</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground break-keep">
              {word.word}
            </p>
          </div>
          <Button variant="secondary" onClick={() => speak(word.word)} className="h-12 px-4 font-black">
            <Volume2 className="mr-2 w-5 h-5" /> 듣기
          </Button>
        </div>

        {expected ? (
          <div className="space-y-2">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">예문</p>
            <p className="font-bold text-foreground italic">&quot;{expected}&quot;</p>
            {word.exampleTranslation && (
              <p className="text-sm text-muted-foreground font-bold">&quot;{word.exampleTranslation}&quot;</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground font-bold">예문이 없어서, 단어를 포함한 문장을 직접 입력해요.</p>
        )}

        <div className="space-y-2">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">입력</p>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`"${word.word}"를 포함한 문장을 입력하세요`}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setSubmitted(true);
              if (value.trim().toLowerCase().includes(target)) onCorrect();
              else onWrong();
            }}
            className="h-12 font-black"
          >
            제출
          </Button>
        </div>

        {submitted && (
          <div className="rounded-xl border-2 border-border bg-background/40 p-4">
            <p className="font-black text-foreground">
              {isCorrect ? '좋아요. 단어가 포함됐어요.' : '아직 단어가 안 보여요. 다시 시도해요.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function buildLessonSteps(config: {
  wordCount: 5 | 10;
  includeListening: boolean;
  includeTyping: boolean;
  includeSpeaking: boolean;
}): LessonStep[] {
  type VocabJsonWord = Word & { examples?: Array<{ text: string; translation?: string }> };
  const words = getRandomElements(vocabData as unknown as VocabJsonWord[], config.wordCount).map((w) => ({
    ...w,
    id: w.id || w.word,
    example: w.example || w.examples?.[0]?.text || '',
    exampleTranslation: w.exampleTranslation || w.examples?.[0]?.translation || '',
  }));

  const speakingSource =
    getRandomElements(mediaContents, 1)[0]?.line_en ||
    (sentenceData ? getRandomElements(sentenceData as unknown as { text: string }[], 1)[0]?.text : '') ||
    'Focus on your goals.';

  const steps: LessonStep[] = [{ type: 'intro' }];
  for (const w of words) {
    steps.push({ type: 'word_reveal', word: w });
    if (config.includeListening) {
      steps.push({
        type: 'listening_quiz',
        answer: w.word,
        options: buildOptions(w.word),
        prompt: '재생을 눌러 듣고, 맞는 단어를 선택하세요.',
      });
    }
    steps.push({ type: 'choice_quiz', word: w, options: buildOptions(w.word) });
    if (config.includeTyping) {
      steps.push({ type: 'typing_exact', word: w });
    }
    steps.push({ type: 'sentence_build', word: w });
  }
  if (config.includeSpeaking) {
    steps.push({ type: 'speaking', expectedSentence: speakingSource });
  }
  steps.push({ type: 'result' });
  return steps;
}

function buildReviewSteps(queue: ReviewItem[]): LessonStep[] {
  const steps: LessonStep[] = [{ type: 'intro' }];
  for (const item of queue.slice(0, 10)) {
    if (item.kind === 'speaking') {
      steps.push({ type: 'speaking', expectedSentence: item.expectedSentence });
      continue;
    }
    if (item.kind === 'listening_quiz') {
      steps.push({
        type: 'listening_quiz',
        answer: item.answer,
        options: buildOptions(item.answer),
        prompt: '재생을 눌러 듣고, 맞는 단어를 선택하세요.',
      });
      continue;
    }
    const w = item.word;
    steps.push({ type: 'choice_quiz', word: w, options: buildOptions(w.word) });
    if (item.kind === 'typing_exact') {
      steps.push({ type: 'typing_exact', word: w });
    }
    steps.push({ type: 'sentence_build', word: w });
  }
  steps.push({ type: 'result' });
  return steps;
}

function buildOptions(answer: string) {
  const pool = (vocabData as unknown as Word[]).map(w => w.word).filter(Boolean);
  const distractors = getRandomElements(pool.filter(w => w !== answer), 2);
  const opts = [answer, ...distractors];
  return getRandomElements(opts, opts.length);
}

function ToggleChip({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Button
      variant={value ? 'primary' : 'secondary'}
      onClick={() => onChange(!value)}
      className="h-10 px-3 text-sm font-black justify-center"
    >
      {label}
    </Button>
  );
}

