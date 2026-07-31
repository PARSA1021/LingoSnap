'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mic, Square, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Loader2, Turtle, Sparkles, Keyboard, Forward } from 'lucide-react';
import { speechService, evaluateSpeechAccuracy, SpeechEvaluationResult } from '@/lib/speech';
import { useTTS } from '@/hooks/useTTS';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';

interface SpeakingPracticeProps {
  expectedSentence: string;
  onContinue: (passed: boolean, msg?: string) => void;
}

export function SpeakingPractice({ expectedSentence, onContinue }: SpeakingPracticeProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'evaluating' | 'evaluated'>('idle');
  const [evaluation, setEvaluation] = React.useState<SpeechEvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  
  const isMicSupported = React.useMemo(() => !!(speechService && speechService.supported()), []);
  const [showManualInput, setShowManualInput] = React.useState(!isMicSupported);
  const [manualText, setManualText] = React.useState('');
  const { speak, speakSlow } = useTTS();

  // Automatically switch to manual input if mic is not supported
  React.useEffect(() => {
    if (!isMicSupported) {
      setShowManualInput(true);
      setErrorMsg('현재 브라우저/기기에서 마이크 음성 인식이 지원되지 않아 키보드 직접 입력 모드로 전환되었습니다.');
    }
  }, [isMicSupported]);

  const handleStartRecording = () => {
    if (!speechService || !speechService.supported()) {
      setShowManualInput(true);
      setErrorMsg('이 브라우저는 음성 인식을 지원하지 않아요. 키보드 직접 입력 모드를 사용하세요.');
      return;
    }

    setIsRecording(true);
    setTranscript('');
    setStatus('idle');
    setEvaluation(null);
    setErrorMsg(null);

    speechService.start({
      lang: 'en-US',
      onResult: (text: string) => setTranscript(text),
      onError: (err: string) => {
        console.warn('Speech Recognition Error:', err);
        setIsRecording(false);
        if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'permission-denied') {
          setErrorMsg('마이크 접근 권한이 거부되었거나 설정되지 않았습니다. 키보드로 입력해보세요.');
          setShowManualInput(true);
        } else if (err === 'network') {
          setErrorMsg('네트워크 연결을 확인해주세요.');
          setShowManualInput(true);
        } else {
          setErrorMsg(`음성 인식 오류 (${err}). 키보드로 입력하여 계속 진행하세요.`);
          setShowManualInput(true);
        }
      },
      onEnd: () => setIsRecording(false)
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    speechService?.stop();
  };

  const evaluateSpeech = React.useCallback((customText?: string) => {
    setStatus('evaluating');
    const sourceText = customText || transcript || manualText;

    setTimeout(() => {
      const evalResult = evaluateSpeechAccuracy(expectedSentence, sourceText);
      setEvaluation(evalResult);
      setStatus('evaluated');
    }, 250);
  }, [expectedSentence, manualText, transcript]);

  React.useEffect(() => {
    if (!isRecording && transcript) {
      evaluateSpeech();
    }
  }, [evaluateSpeech, isRecording, transcript]);

  React.useEffect(() => {
    return () => {
      speechService?.stop();
    };
  }, []);

  const handleManualSubmit = () => {
    const textToEvaluate = manualText.trim() || expectedSentence;
    evaluateSpeech(textToEvaluate);
  };

  const handleSkipOrForcePass = () => {
    onContinue(true, '건너뛰기');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-visible shadow-sm hover:shadow-md transition-shadow rounded-3xl">
      <CardContent className="p-5 sm:p-8 flex flex-col items-center text-center space-y-6 select-none">
        
        {/* Header Prompt */}
        <div className="space-y-4 w-full pt-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>문장을 크게 소리 내어 읽어보세요</span>
          </div>

          <div className="bg-[var(--color-surface)] p-5 sm:p-8 border border-[var(--color-border)] rounded-3xl shadow-xs">
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-foreground)] leading-tight break-keep flex flex-wrap justify-center gap-x-2.5 sm:gap-x-4 gap-y-2 sm:gap-y-3 italic">
              {evaluation
                ? evaluation.words.map((w, i) => (
                    <span
                      key={`${w.word}-${i}`}
                      className={cn(
                        "px-2.5 py-1 rounded-xl border transition-all duration-300",
                        w.status === 'correct' && "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-black",
                        w.status === 'close' && "bg-amber-500/15 text-amber-600 border-amber-500/30 font-black",
                        w.status === 'missing' && "bg-rose-500/15 text-rose-600 border-rose-500/30 line-through opacity-80"
                      )}
                    >
                      {w.word}
                    </span>
                  ))
                : expectedSentence.split(' ').map((word, i) => (
                    <span key={`${word}-${i}`}>{word}</span>
                  ))}
            </h2>

            {/* Audio Buttons */}
            <div className="flex justify-center gap-2.5 mt-5">
              <Button
                onClick={() => speak(expectedSentence)}
                aria-label="일반 발음 듣기"
                className="rounded-full px-4 h-10 bg-[var(--color-primary)] text-white font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all"
              >
                <Volume2 className="h-4 w-4 mr-1.5" /> 일반 발음 (1.0x)
              </Button>

              <Button
                onClick={() => speakSlow(expectedSentence)}
                aria-label="느린 발음 듣기"
                variant="secondary"
                className="rounded-full px-4 h-10 bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] font-bold text-xs shadow-xs hover:bg-[var(--color-muted)] active:scale-95 transition-all"
              >
                <Turtle className="h-4 w-4 mr-1.5 text-emerald-600" /> 느린 발음 (0.75x)
              </Button>
            </div>
          </div>
        </div>

        {/* Mic Control or Manual Input */}
        <div className="relative flex flex-col items-center pt-2 w-full">
          {!showManualInput && isMicSupported ? (
            <>
              <div className="relative flex items-center justify-center">
                {/* Audio Waves Animation during recording */}
                {isRecording && (
                  <>
                    <span className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-rose-500/20 animate-ping" />
                    <span className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-rose-500/10 animate-pulse" />
                  </>
                )}

                <Button
                  aria-label={isRecording ? "녹음 중지" : "마이크 누르기"}
                  className={cn(
                    "w-24 h-24 sm:w-28 sm:h-28 rounded-full relative z-10 transition-all border-4 shadow-xl active:scale-95 flex items-center justify-center",
                    isRecording 
                      ? 'bg-rose-600 text-white border-rose-400 animate-bounce' 
                      : 'bg-[var(--color-primary)] text-white border-rose-300 hover:scale-105'
                  )}
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                >
                  {isRecording ? <Square className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                </Button>
              </div>
              
              <p className={cn(
                "mt-4 font-black tracking-tight uppercase text-xs sm:text-sm",
                isRecording ? 'text-rose-600 animate-pulse' : 'text-[var(--color-muted-foreground)]'
              )}>
                {isRecording ? '듣는 중... 말씀이 끝나면 다시 눌러주세요' : '마이크를 눌러 시작하세요'}
              </p>
              
              <div className="flex gap-4 mt-3">
                <button 
                  onClick={() => setShowManualInput(true)}
                  className="text-xs font-bold text-[var(--color-muted-foreground)] underline underline-offset-4 hover:text-[var(--color-foreground)] transition-colors flex items-center gap-1"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  키보드로 직접 입력하기
                </button>
                <button 
                  onClick={handleSkipOrForcePass}
                  className="text-xs font-bold text-[var(--color-primary)] underline underline-offset-4 hover:opacity-80 transition-colors flex items-center gap-1"
                >
                  <Forward className="w-3.5 h-3.5" />
                  건너뛰고 다음으로
                </button>
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg space-y-4 bg-[var(--color-muted)]/30 p-5 sm:p-6 rounded-3xl border-2 border-dashed border-[var(--color-border)]"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-[var(--color-primary)]" />
                  <p className="text-sm font-bold text-[var(--color-foreground)]">
                    키보드로 직접 입력하기
                  </p>
                </div>
                {isMicSupported && (
                  <button 
                    onClick={() => setShowManualInput(false)}
                    className="text-xs text-[var(--color-primary)] font-bold hover:underline flex items-center gap-1"
                  >
                    <Mic className="w-3.5 h-3.5" /> 마이크 모드로 전환
                  </button>
                )}
              </div>

              <Input
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleManualSubmit();
                  }
                }}
                placeholder="영문 문장을 직접 입력하세요..."
                className="h-13 text-base border border-[var(--color-border)] rounded-2xl font-medium bg-[var(--color-background)]"
                autoFocus
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleManualSubmit}
                  className="h-12 font-bold flex-1 text-base shadow-sm active:scale-98 transition-all bg-[var(--color-primary)] text-white rounded-2xl"
                >
                  답변 확인
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSkipOrForcePass}
                  className="h-12 px-4 font-bold text-xs rounded-2xl"
                  title="건너뛰기"
                >
                  <Forward className="w-4 h-4 mr-1" /> 건너뛰기
                </Button>
              </div>

              {errorMsg && (
                <p className="text-[11px] font-bold text-[var(--color-muted-foreground)] mt-2 bg-[var(--color-surface)] p-2.5 rounded-xl border border-[var(--color-border)]">
                  💡 {errorMsg}
                </p>
              )}
            </motion.div>
          )}

          {errorMsg && !showManualInput && (
            <p className="mt-4 text-rose-600 font-bold text-xs bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Feedback & Result Section */}
        <AnimatePresence mode="wait">
          {(transcript || manualText) && status !== 'idle' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-4">
              
              {/* Spoken Text Display */}
              <div className="bg-[var(--color-surface)] p-5 rounded-2xl border border-[var(--color-border)] text-left shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-[var(--color-muted-foreground)] uppercase tracking-wider">
                    입력된 문장
                  </span>
                  {evaluation && (
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-black border",
                      evaluation.isPassed ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" : "bg-rose-500/15 text-rose-600 border-rose-500/30"
                    )}>
                      {evaluation.score}% 일치
                    </span>
                  )}
                </div>
                <p className="text-lg font-bold text-[var(--color-foreground)] italic leading-snug">
                  &quot;{(transcript || manualText).trim()}&quot;
                </p>
              </div>

              {status === 'evaluating' && (
                <div className="py-4 flex items-center justify-center gap-2 text-[var(--color-primary)] font-bold">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>문장 확인하는 중...</span>
                </div>
              )}
              
              {status === 'evaluated' && evaluation && (
                <div className={cn(
                  "p-5 rounded-2xl border flex flex-col items-center gap-3 text-center",
                  evaluation.isPassed ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
                )}>
                  <div className="flex items-center gap-2">
                    {evaluation.isPassed ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-amber-600" />
                    )}
                    <h3 className="text-xl font-black text-[var(--color-foreground)]">
                      {evaluation.isPassed ? '잘하셨어요! 🎉' : '조금 아쉽네요!'}
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
                    {evaluation.feedbackMessage}
                  </p>
                </div>
              )}

              {status === 'evaluated' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setStatus('idle');
                      setEvaluation(null);
                      setManualText('');
                      setTranscript('');
                    }} 
                    className="flex-1 h-13 rounded-2xl font-bold border border-[var(--color-border)]"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> 다시 작성
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      onContinue(evaluation?.isPassed ?? true, evaluation?.feedbackMessage);
                    }} 
                    className="flex-[1.5] h-13 rounded-2xl font-bold text-base shadow-md bg-[var(--color-primary)] text-white"
                  >
                    다음 단계로 <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}
