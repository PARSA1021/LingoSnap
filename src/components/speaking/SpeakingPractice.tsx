'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mic, Square, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { speechService } from '@/lib/speech';
import { playTTS } from '@/lib/tts';
import { checkGrammar } from '@/lib/grammar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SpeakingPracticeProps {
  expectedSentence: string;
  onContinue: (passed: boolean) => void;
}

export function SpeakingPractice({ expectedSentence, onContinue }: SpeakingPracticeProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'evaluating' | 'success' | 'failed'>('idle');
  const [grammarErrors, setGrammarErrors] = React.useState<any[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [quizMode, setQuizMode] = React.useState(false);
  const [hiddenWordIndices, setHiddenWordIndices] = React.useState<number[]>([]);

  const words = React.useMemo(() => expectedSentence.split(' '), [expectedSentence]);

  React.useEffect(() => {
    if (quizMode) {
      const numToHide = words.length >= 6 ? 2 : (words.length > 2 ? 1 : 0);
      const indices: number[] = [];
      while (indices.length < numToHide) {
        const r = Math.floor(Math.random() * words.length);
        if (!indices.includes(r)) indices.push(r);
      }
      setHiddenWordIndices(indices);
    } else {
      setHiddenWordIndices([]);
    }
  }, [quizMode, words]);

  const handleWordClick = (index: number) => {
    if (quizMode && hiddenWordIndices.includes(index)) {
      setHiddenWordIndices(prev => prev.filter(i => i !== index));
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript('');
    setStatus('idle');
    setGrammarErrors([]);
    setErrorMsg(null);
    
    speechService.start({
      lang: 'en-US',
      onResult: (text: string) => setTranscript(text),
      onError: (err: string) => {
        console.error(err);
        if (err === 'not-allowed') {
          setErrorMsg('마이크 접근 권한이 없어요.');
        } else {
          setErrorMsg(`오류 발생: ${err}`);
        }
      },
      onEnd: () => setIsRecording(false)
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    speechService.stop();
  };

  React.useEffect(() => {
    if (!isRecording && transcript) {
      evaluateSpeech();
    }
  }, [isRecording, transcript]);

  const evaluateSpeech = async () => {
    setStatus('evaluating');
    const cleanTranscript = transcript.trim().toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, ' ');
    const cleanExpected = expectedSentence.toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, ' ');

    if (cleanTranscript === cleanExpected || cleanTranscript.includes(cleanExpected)) {
      setStatus('success');
    } else {
      const result = await checkGrammar(transcript);
      setGrammarErrors(result.errors);
      setStatus('failed');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-surface border-4 sm:border-8 border-border relative overflow-visible shadow-[8px_8px_0_var(--border)] sm:shadow-[12px_12px_0_var(--border)]">
      <div className="absolute top-4 right-4 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuizMode(!quizMode)}
          aria-label="Toggle Quiz Mode"
          className={cn(
            "p-3 border-4 sm:border-8 border-border shadow-[4px_4px_0_var(--border)] sm:shadow-[6px_6px_0_var(--border)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all",
            quizMode 
              ? 'bg-secondary text-white' 
              : 'bg-surface text-foreground'
          )}
        >
          <Lightbulb className={cn("w-6 h-6", quizMode ? 'fill-current' : '')} />
        </motion.button>
      </div>

      <CardContent className="p-4 sm:p-12 flex flex-col items-center text-center space-y-6 sm:space-y-10 select-none">
        
        <div className="space-y-6 w-full pt-4">
           <p className="text-sm font-black text-background uppercase tracking-[0.2em] bg-foreground px-6 py-2 border-4 border-border shadow-[4px_4px_0_var(--border)] w-auto mx-auto wobbly-slow font-cartoon">Speak the Lines!</p>
          <div className="bg-surface p-6 sm:p-10 border-4 sm:border-8 border-border shadow-[6px_6px_0_var(--border)] sm:shadow-[10px_10px_0_var(--border)] wobbly-slow">
            <h2 className="text-2xl sm:text-6xl font-black text-foreground leading-tight break-keep flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 font-lilita">
              {words.map((word, i) => {
                const isHidden = hiddenWordIndices.includes(i);
                return (
                  <span
                    key={`${word}-${i}`}
                    onClick={() => handleWordClick(i)}
                    className={cn(
                      "transition-all drop-shadow-[2px_2px_0_var(--background)]",
                      isHidden && "bg-surface text-transparent min-w-[80px] border-8 border-dashed border-border cursor-pointer shadow-[6px_6px_0_var(--border)]"
                    )}
                  >
                    {isHidden ? '?' : word}
                  </span>
                );
              })}
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

        {/* Mic Control */}
        <div className="relative flex flex-col items-center pt-4">
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
          {errorMsg && <p className="mt-4 text-error font-bold text-sm bg-error/5 px-4 py-2 rounded-xl">{errorMsg}</p>}
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
