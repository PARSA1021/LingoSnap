'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mic, Square, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { speechService } from '@/lib/speech';
import { playTTS } from '@/lib/tts';
import { checkGrammar } from '@/lib/grammar';
import { motion, AnimatePresence } from 'framer-motion';

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
      onResult: (text: string) => setTranscript(old => old + ' ' + text),
      onError: (err: string) => {
        console.error(err);
        if (err === 'not-allowed') {
          setErrorMsg('마이크 접근 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해주세요.');
        } else {
          setErrorMsg(`녹음 중 오류가 발생했습니다: ${err}`);
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
    const cleanTranscript = transcript.trim().toLowerCase().replace(/[.,!?]/g, '');
    const cleanExpected = expectedSentence.toLowerCase().replace(/[.,!?]/g, '');

    if (cleanTranscript === cleanExpected || cleanTranscript.includes(cleanExpected)) {
      setStatus('success');
    } else {
      const result = await checkGrammar(transcript);
      setGrammarErrors(result.errors);
      setStatus('failed');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto overflow-visible bg-white border-b-[6px] border-slate-200 relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuizMode(!quizMode)}
          className={`p-2.5 rounded-full transition-all border shadow-sm ${
            quizMode 
              ? 'bg-amber-100 border-amber-200 text-amber-600 shadow-amber-100 active:bg-amber-200' 
              : 'bg-white border-slate-100 text-slate-300 hover:text-amber-400'
          }`}
        >
          <Lightbulb className={`w-6 h-6 ${quizMode ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      <CardContent className="p-6 sm:p-10 flex flex-col items-center text-center space-y-8 select-none">
        
        <div className="space-y-6 w-full pt-4">
          <p className="text-sm font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full w-fit mx-auto">
            소리 내어 읽어보세요
          </p>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 leading-snug break-keep flex flex-wrap justify-center gap-x-2 gap-y-3">
              {words.map((word, i) => {
                const isHidden = hiddenWordIndices.includes(i);
                return (
                  <motion.span
                    key={`${word}-${i}`}
                    onClick={() => handleWordClick(i)}
                    className={`${isHidden ? 'bg-slate-100 text-slate-200 w-24 rounded-lg inline-block text-center ring-2 ring-slate-200/50 cursor-pointer' : ''}`}
                  >
                    {isHidden ? '?' : word}
                  </motion.span>
                );
              })}
            </h2>
            <div className="mt-8 flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-6 h-12 text-slate-600 bg-white border border-slate-200 font-bold shadow-sm"
                  onClick={() => playTTS(expectedSentence)}
                >
                  <Volume2 className="h-5 w-5 mr-3 text-blue-500" />
                  원어민 발음 듣기
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mic Control */}
        <div className="relative flex flex-col items-center pt-6 pb-2">
          <div className={`absolute -inset-8 bg-blue-100 rounded-full scale-0 transition-transform duration-700 ease-out ${isRecording ? 'scale-100 animate-pulse' : ''}`} />
          <motion.div whileTap={{ scale: 0.85 }}>
            <Button
               size="xl"
              variant={isRecording ? 'danger' : 'primary'}
              className={`w-28 h-28 rounded-full relative shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)] ${isRecording ? 'shadow-red-500/50' : ''} border-none`}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? <Square className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            </Button>
          </motion.div>
          <p className="mt-6 text-sm font-bold text-slate-400 min-h-[20px] tracking-wide">
            {isRecording ? '듣고 있어요... 탭해서 완료' : '마이크를 눌러 시작하세요'}
          </p>
          {errorMsg && (
            <motion.p 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="mt-4 text-sm font-bold text-red-500 bg-red-50 px-5 py-3 rounded-2xl w-full max-w-xs break-keep shadow-sm"
            >
              {errorMsg}
            </motion.p>
          )}
        </div>

        {/* Result Breakdown UI */}
        <div className="w-full">
          <AnimatePresence mode="popLayout">
            {transcript && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full space-y-5"
              >
                <div className="p-4 rounded-3xl flex flex-col gap-2 text-left bg-slate-50 border-2 border-slate-100 shadow-inner break-words">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 pt-1">내 발음</p>
                  <p className="text-slate-800 text-xl font-bold leading-snug px-2 pb-2">"{transcript.trim()}"</p>
                </div>

                <AnimatePresence mode="wait">
                  {status === 'evaluating' && (
                    <motion.div 
                      key="eval"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3 text-blue-600 flex-col py-6"
                    >
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="text-sm font-bold tracking-wide">발음을 점검하고 있어요...</p>
                    </motion.div>
                  )}

                  {status === 'success' && (
                    <motion.div 
                      key="succ"
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center gap-3 text-green-600 py-6"
                    >
                      <div className="p-4 bg-green-100 rounded-full shadow-inner mb-2">
                        <CheckCircle2 className="w-12 h-12" />
                      </div>
                      <p className="font-extrabold text-2xl tracking-tight">완벽해요! 너무 잘했어요.</p>
                    </motion.div>
                  )}

                  {status === 'failed' && (
                    <motion.div 
                      key="fail"
                      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                      className="space-y-4 py-4"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 text-red-500">
                        <XCircle className="w-10 h-10 mb-2 opacity-50" />
                        <p className="font-extrabold text-xl">조금 아쉽네요. 다시 한번 해볼까요?</p>
                      </div>
                      
                      {grammarErrors.length > 0 && (
                        <div className="text-left bg-orange-50 border-[3px] border-orange-100 p-5 rounded-3xl text-orange-900 mt-4 shadow-sm">
                          <p className="text-xs font-black uppercase tracking-widest text-orange-400 mb-2">피드백 가이드</p>
                          <ul className="list-disc pl-5 space-y-1.5 text-base leading-relaxed font-bold">
                            {grammarErrors.map((e, i) => (
                              <li key={i}>{e.message}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {status !== 'evaluating' && status !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row gap-3 pt-4 w-full"
                  >
                    <Button size="lg" variant="secondary" className="flex-1 bg-slate-100 text-slate-700 h-14" onClick={handleStartRecording}>
                      <RotateCcw className="w-6 h-6 mr-2" /> 다시하기
                    </Button>
                    <Button size="lg" variant="primary" className="flex-1 h-14" onClick={() => onContinue(status === 'success')}>
                      계속하기 <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
