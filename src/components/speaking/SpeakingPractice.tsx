'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mic, Square, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Loader2 } from 'lucide-react';
import { speechService } from '@/lib/speech';
import { playTTS } from '@/lib/tts';
import { checkGrammar } from '@/lib/grammar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';

interface SpeakingPracticeProps {
  expectedSentence: string;
  onContinue: (passed: boolean) => void;
}

type GrammarError = {
  message: string;
  shortMessage?: string;
  replacements?: string[];
  offset?: number;
  length?: number;
};

export function SpeakingPractice({ expectedSentence, onContinue }: SpeakingPracticeProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'evaluating' | 'success' | 'failed'>('idle');
  const [grammarErrors, setGrammarErrors] = React.useState<GrammarError[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [showManualInput, setShowManualInput] = React.useState(false);
  const [manualText, setManualText] = React.useState('');

  const words = React.useMemo(() => expectedSentence.split(' '), [expectedSentence]);

  const handleStartRecording = () => {
    if (!speechService || !speechService.supported()) {
      setErrorMsg('이 브라우저는 음성 인식을 지원하지 않아요. 아래에 직접 입력으로 진행할 수 있어요.');
      return;
    }

    setIsRecording(true);
    setTranscript('');
    setStatus('idle');
    setGrammarErrors([]);
    setErrorMsg(null);
    
    speechService.start({
      lang: 'en-US',
      onResult: (text: string) => setTranscript(text),
      onError: (err: string) => {
        console.warn('Speech Recognition Error:', err);
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          setErrorMsg('마이크 접근 권한이 거부되었거나 지원되지 않습니다.');
          setShowManualInput(true); // 권한 거부 시 직접 입력 활성화
        } else if (err === 'network') {
          setErrorMsg('네트워크 연결을 확인해주세요.');
        } else {
          setErrorMsg(`음성 인식 오류: ${err}`);
        }
      },
      onEnd: () => setIsRecording(false)
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    speechService?.stop();
  };

  const evaluateSpeech = React.useCallback(async () => {
    setStatus('evaluating');
    const sourceText = transcript || manualText;
    const cleanTranscript = sourceText.trim().toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, ' ');
    const cleanExpected = expectedSentence.toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, ' ');

    if (cleanTranscript === cleanExpected || cleanTranscript.includes(cleanExpected)) {
      setStatus('success');
      return;
    }

    const result = await checkGrammar(sourceText);
    setGrammarErrors(result.errors as GrammarError[]);
    setStatus('failed');
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

  return (
    <Card className="w-full max-w-lg mx-auto bg-surface border-4 sm:border-8 border-border relative overflow-visible shadow-[8px_8px_0_var(--border)] sm:shadow-[12px_12px_0_var(--border)]">
      <CardContent className="p-4 sm:p-12 flex flex-col items-center text-center space-y-6 sm:space-y-10 select-none">
        
        <div className="space-y-6 w-full pt-4">
           <p className="text-sm font-black text-background uppercase tracking-[0.2em] bg-foreground px-6 py-2 border-4 border-border shadow-[4px_4px_0_var(--border)] w-auto mx-auto wobbly-slow font-cartoon">Speak the Lines!</p>
          <div className="bg-surface p-6 sm:p-10 border-4 sm:border-8 border-border shadow-[6px_6px_0_var(--border)] sm:shadow-[10px_10px_0_var(--border)] wobbly-slow">
            <h2 className="text-2xl sm:text-6xl font-black text-foreground leading-tight break-keep flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 font-lilita">
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="drop-shadow-[2px_2px_0_var(--background)]"
                >
                  {word}
                </span>
              ))}
            </h2>
            <div className="mt-8">
                <Button
                  onClick={() => playTTS(expectedSentence)}
                  aria-label="Play pronunciation"
                  className="rounded-2xl px-6 h-12 bg-surface text-foreground border-4 border-border shadow-[4px_4px_0_var(--border)] font-black hover:bg-muted active:translate-y-1 active:translate-x-1 active:shadow-none transition-all wobbly-slow"
                >
                  <Volume2 className="h-5 w-5 mr-3" /> 발음 듣기
                </Button>
            </div>
          </div>
        </div>

        {/* Mic Control or Manual Fallback */}
        <div className="relative flex flex-col items-center pt-4 w-full">
          {speechService?.supported() && !showManualInput ? (
            <>
              <Button
                aria-label={isRecording ? "Stop recording" : "Microphone"}
                className={cn(
                  "w-28 h-28 sm:w-40 sm:h-40 rounded-full relative transition-all border-4 sm:border-8 border-border shadow-[6px_6px_0_var(--border)] sm:shadow-[10px_10px_0_var(--border)] active:translate-y-2 active:translate-x-2 active:shadow-none wobbly",
                  isRecording 
                    ? 'bg-error text-white' 
                    : 'bg-primary text-white'
                )}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
              >
                {isRecording ? <Square className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
              </Button>
              <p className={`mt-10 font-black tracking-tight uppercase text-sm ${isRecording ? 'text-error animate-pulse' : 'text-muted-foreground'}`}>
                {isRecording ? '듣는 중... 완료하려면 버튼 클릭' : '마이크를 눌러 시작'}
              </p>
              
              <button 
                onClick={() => setShowManualInput(true)}
                className="mt-4 text-xs font-black text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              >
                키보드로 직접 입력할래요
              </button>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg space-y-4 bg-muted/30 p-6 rounded-3xl border-4 border-dashed border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Square className="w-4 h-4 text-primary" />
                <p className="text-sm font-black text-foreground">
                  직접 입력하기
                </p>
              </div>
              <Input
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && manualText.trim() && evaluateSpeech()}
                placeholder="방금 말한 문장을 입력하세요"
                className="h-14 text-lg border-4 border-border rounded-xl font-bold bg-background"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!manualText.trim()) return;
                    evaluateSpeech();
                  }}
                  className="h-14 font-black flex-1 text-lg shadow-[4px_4px_0_var(--border)] active:translate-y-1 active:shadow-none transition-all"
                >
                  확인
                </Button>
                {speechService?.supported() && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowManualInput(false);
                      setErrorMsg(null);
                    }}
                    className="h-14 px-4 font-black"
                    title="마이크 다시 시도"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                )}
              </div>
              {errorMsg && (
                <p className="text-[11px] font-bold text-error mt-2">
                  ℹ️ {errorMsg}
                </p>
              )}
            </motion.div>
          )}
          {errorMsg && !showManualInput && <p className="mt-4 text-error font-bold text-sm bg-error/5 px-4 py-2 rounded-xl">{errorMsg}</p>}
        </div>

        {/* Feedback Section */}
        <AnimatePresence mode="wait">
          {transcript && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
               <div className="bg-surface p-6 rounded-2xl border-4 border-border shadow-[4px_4px_0_var(--border)] text-left">
                  <p className="text-[10px] font-black text-muted-foreground uppercase mb-2">당신이 말한 내용</p>
                  <p className="text-xl font-bold text-foreground italic leading-snug">&quot;{transcript.trim()}&quot;</p>
               </div>

               {status === 'evaluating' && <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />}
               
               {status === 'success' && (
                 <div className="flex flex-col items-center gap-3 text-success">
                    <CheckCircle2 className="w-16 h-16" />
                    <p className="text-2xl font-black text-foreground">완벽해요!</p>
                 </div>
               )}

               {status === 'failed' && (
                 <div className="bg-surface p-6 rounded-2xl border-4 border-border shadow-[4px_4px_0_var(--border)]">
                    <div className="flex items-center gap-3 text-error mb-4 justify-center">
                       <XCircle className="w-8 h-8" />
                       <p className="text-xl font-black text-foreground">조금 더 노력이 필요해요</p>
                    </div>
                    {grammarErrors.length > 0 && (
                      <ul className="text-left space-y-2 text-sm font-bold text-muted-foreground list-disc pl-5">
                         {grammarErrors.map((e, idx) => <li key={idx}>{e.message}</li>)}
                      </ul>
                    )}
                 </div>
               )}

               {status !== 'evaluating' && (
                 <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button variant="secondary" onClick={handleStartRecording} className="flex-1 h-14 rounded-2xl font-black">
                       <RotateCcw className="mr-2 h-5 w-5" /> 다시 시도
                    </Button>
                    <Button onClick={() => onContinue(status === 'success')} className="flex-[1.5] h-14 rounded-2xl font-black text-lg">
                       계속하기 <ArrowRight className="ml-2 h-6 w-6" />
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
