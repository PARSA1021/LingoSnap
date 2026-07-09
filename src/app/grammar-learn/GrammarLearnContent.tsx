'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  XCircle, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Volume2,
  Check,
  X
} from 'lucide-react';
import { grammarContents } from '@/data/contents';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

export default function GrammarLearnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const grammarId = searchParams.get('grammar');
  
  const currentContent = React.useMemo(() => {
    return grammarContents.find(c => c.id === grammarId) || grammarContents[0];
  }, [grammarId]);

  const [currentStep, setCurrentStep] = React.useState(0);
  const [quizAnswer, setQuizAnswer] = React.useState<number | null>(null);
  const [showResult, setShowResult] = React.useState(false);

  // 학습 단계: 0=설명, 1=예문, 2=퀴즈, 3=완료
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setQuizAnswer(null);
      setShowResult(false);
    } else {
      // 완료 후 문법 페이지로 돌아가기
      router.push('/contents');
    }
  };

  const handleQuizSelect = (index: number) => {
    setQuizAnswer(index);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer !== null) {
      setShowResult(true);
    }
  };

  const isCorrect = currentContent.practiceQuestions && 
    quizAnswer === currentContent.practiceQuestions[0]?.correctAnswer;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Header */}
      <header className="shrink-0 z-40 w-full px-4 pt-4 pb-3 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-[14px] bg-[var(--color-muted)] text-[var(--color-muted-foreground)] flex items-center justify-center hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-[11px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                문법 학습
              </span>
            </div>
            <div className="h-2.5 w-full bg-[var(--color-muted)] rounded-full overflow-hidden border border-[var(--color-border)]">
              <div 
                className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)] mb-2">
            {currentContent.title}
          </h2>
          <div className="flex items-center gap-3 mb-8">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest text-white",
              currentContent.difficulty === 'easy' && "bg-[var(--color-success)]",
              currentContent.difficulty === 'medium' && "bg-[var(--color-warning)]",
              currentContent.difficulty === 'hard' && "bg-[var(--color-error)]"
            )}>
              {currentContent.difficulty.toUpperCase()}
            </span>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              {currentContent.category}
            </span>
          </div>

          {/* Step 0: Grammar Explanation */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
                  <h3 className="text-lg font-bold text-[var(--color-foreground)]">문법 설명</h3>
                </div>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed text-base">
                  {currentContent.explanation}
                </p>
              </div>

              {currentContent.commonMistakes && currentContent.commonMistakes.length > 0 && (
                <div className="bg-[var(--color-error)]/5 border border-[var(--color-error)]/20 rounded-3xl p-6">
                  <h3 className="text-sm font-bold text-[var(--color-error)] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    주의할 실수
                  </h3>
                  <div className="space-y-4">
                    {currentContent.commonMistakes.map((mistake, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-[var(--color-error)] mt-1">✗</span>
                          <p className="text-sm text-[var(--color-muted-foreground)] line-through">
                            {mistake.wrong}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-[var(--color-success)] mt-1">✓</span>
                          <p className="text-sm font-medium text-[var(--color-foreground)]">
                            {mistake.correct}
                          </p>
                        </div>
                        <p className="text-xs text-[var(--color-muted-foreground)] ml-6">
                          {mistake.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Examples */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[var(--color-primary)]" />
                예문 확인하기
              </h3>
              {currentContent.examples?.map((example, idx) => (
                <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-primary)] transition-all">
                  <p className="text-lg font-medium text-[var(--color-foreground)] mb-2">
                    {example.en}
                  </p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {example.ko}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Practice Quiz */}
          {currentStep === 2 && currentContent.practiceQuestions && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">
                {currentContent.practiceQuestions[0].question}
              </h3>

              <div className="space-y-3">
                {currentContent.practiceQuestions[0].options.map((option, idx) => {
                  const isSelected = quizAnswer === idx;
                  const showCorrectness = showResult;
                  const isOptionCorrect = idx === currentContent.practiceQuestions[0].correctAnswer;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => !showResult && handleQuizSelect(idx)}
                      disabled={showResult}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl border transition-all duration-200",
                        showCorrectness ? (
                          isOptionCorrect 
                            ? "bg-[var(--color-success)]/10 border-[var(--color-success)] text-[var(--color-success)]"
                            : isSelected
                              ? "bg-[var(--color-error)]/10 border-[var(--color-error)] text-[var(--color-error)]"
                              : "bg-[var(--color-surface)] border-[var(--color-border)] opacity-50"
                        ) : (
                          isSelected
                            ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-foreground)]"
                            : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50 text-[var(--color-foreground)]"
                        )
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2",
                          showCorrectness ? (
                            isOptionCorrect
                              ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                              : isSelected
                                ? "bg-[var(--color-error)] border-[var(--color-error)] text-white"
                                : "bg-transparent border-[var(--color-border)] text-[var(--color-muted-foreground)]"
                          ) : (
                            isSelected
                              ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                              : "bg-transparent border-[var(--color-border)] text-[var(--color-muted-foreground)]"
                          )
                        )}>
                          {showCorrectness && isOptionCorrect && <Check className="w-4 h-4" />}
                          {showCorrectness && isSelected && !isOptionCorrect && <X className="w-4 h-4" />}
                          {!showCorrectness && String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!showResult && (
                <Button
                  variant="primary"
                  className="w-full h-12 rounded-xl font-bold text-base"
                  onClick={handleQuizSubmit}
                  disabled={quizAnswer === null}
                >
                  답안 제출
                </Button>
              )}

              {showResult && (
                <div className={cn(
                  "rounded-2xl p-5 border",
                  isCorrect 
                    ? "bg-[var(--color-success)]/10 border-[var(--color-success)]"
                    : "bg-[var(--color-error)]/10 border-[var(--color-error)]"
                )}>
                  <div className="flex items-center gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-[var(--color-success)]" />
                    ) : (
                      <XCircle className="w-6 h-6 text-[var(--color-error)]" />
                    )}
                    <span className={cn(
                      "font-bold text-base",
                      isCorrect ? "text-[var(--color-success)]" : "text-[var(--color-error)]"
                    )}>
                      {isCorrect ? "정답이에요! 🎉" : "아쉽지만 다음 기회에..."}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {currentContent.practiceQuestions[0].explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Completion */}
          {currentStep === 3 && (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-[var(--color-foreground)] mb-2">
                학습 완료! 🎊
              </h3>
              <p className="text-[var(--color-muted-foreground)] mb-8">
                {currentContent.title} 문법을 마스터했어요!
              </p>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 mb-8 text-left">
                <h4 className="font-bold text-[var(--color-foreground)] mb-3">배운 내용 요약</h4>
                <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)] mt-1">•</span>
                    <span>{currentContent.explanation.slice(0, 50)}...</span>
                  </li>
                  {currentContent.examples?.[0] && (
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-primary)] mt-1">•</span>
                      <span>예문: {currentContent.examples[0].en}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="shrink-0 bg-[var(--color-background)] border-t border-[var(--color-border)] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="primary"
            className="w-full h-14 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            onClick={handleNext}
          >
            {currentStep === totalSteps - 1 ? (
              "문법 목록으로 돌아가기"
            ) : (
              <>
                다음 단계
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
