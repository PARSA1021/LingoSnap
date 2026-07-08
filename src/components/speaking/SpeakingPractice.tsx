'use client';

import * as React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mic, Square, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Loader2 } from 'lucide-react';
import { speechService } from '@/lib/speech';
import { useTTS } from '@/hooks/useTTS';
import { checkGrammar } from '@/lib/grammar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';

interface SpeakingPracticeProps {
 expectedSentence: string;
 onContinue: (passed: boolean, msg?: string) => void;
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
 const { speak, isPlaying } = useTTS();

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
 <Card className="w-full max-w-lg mx-auto bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-visible shadow-sm hover:shadow-md transition-shadow">
 <CardContent className="p-4 sm:p-8 flex flex-col items-center text-center space-y-6 select-none">
 
 <div className="space-y-4 w-full pt-2">
 <p className="text-[10px] font-black text-[var(--color-background)] uppercase tracking-[0.2em] bg-[var(--color-foreground)] px-4 py-1 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow w-auto mx-auto ">문장을 소리내어 읽어보세요!</p>
 <div className="bg-[var(--color-surface)] p-4 sm:p-8 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
 <h2 className="text-xl sm:text-4xl font-black text-[var(--color-foreground)] leading-tight break-keep flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-2 sm:gap-y-4 font-lilita">
 {words.map((word, i) => (
 <span
 key={`${word}-${i}`}
 className="drop-shadow-sm hover:shadow-md transition-shadow"
 >
 {word}
 </span>
 ))}
 </h2>
 <div className="mt-4">
 <Button
 onClick={() => speak(expectedSentence)}
 aria-label="Play pronunciation"
 className="rounded-xl px-4 h-10 bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow font-black hover:bg-[var(--color-muted)] active:translate-y-0.5 transition-all "
 >
 <Volume2 className="h-4 w-4 mr-2" /> 발음 듣기
 </Button>
 </div>
 </div>
 </div>

 {/* Mic Control or Manual Fallback */}
 <div className="relative flex flex-col items-center pt-2 w-full">
 {speechService?.supported() && !showManualInput ? (
 <>
 <Button
 aria-label={isRecording ? "Stop recording" : "Microphone"}
 className={cn(
 "w-24 h-24 sm:w-32 sm:h-32 rounded-full relative transition-all border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow active:translate-y-1 active:shadow-none",
 isRecording 
 ? 'bg-[var(--color-error)] text-white' 
 : 'bg-[var(--color-primary)] text-white'
 )}
 onClick={isRecording ? handleStopRecording : handleStartRecording}
 >
 {isRecording ? <Square className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
 </Button>
 <p className={`mt-6 font-black tracking-tight uppercase text-[10px] ${isRecording ? 'text-[var(--color-error)] animate-pulse' : 'text-[var(--color-muted-foreground)]'}`}>
 {isRecording ? '듣는 중... 다시 눌러 완료' : '마이크를 눌러 시작'}
 </p>
 
 <button 
 onClick={() => setShowManualInput(true)}
 className="mt-4 text-xs font-black text-[var(--color-muted-foreground)] underline underline-offset-4 hover:text-[var(--color-foreground)] transition-colors"
 >
 키보드로 직접 입력할래요
 </button>
 </>
 ) : (
 <motion.div 
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="w-full max-w-lg space-y-4 bg-[var(--color-muted)]/30 p-6 rounded-3xl border-4 border-dashed border-[var(--color-border)]"
 >
 <div className="flex items-center gap-2 mb-2">
 <Square className="w-4 h-4 text-[var(--color-primary)]" />
 <p className="text-sm font-black text-[var(--color-foreground)]">
 직접 입력하기
 </p>
 </div>
 <Input
 value={manualText}
 onChange={(e) => setManualText(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && manualText.trim() && evaluateSpeech()}
 placeholder="방금 말한 문장을 입력하세요"
 className="h-14 text-lg border border-[var(--color-border)] rounded-xl font-bold bg-[var(--color-background)]"
 autoFocus
 />
 <div className="flex gap-2">
 <Button
 onClick={() => {
 if (!manualText.trim()) return;
 evaluateSpeech();
 }}
 className="h-14 font-black flex-1 text-lg shadow-sm hover:shadow-md transition-shadow active:translate-y-1 active:shadow-none transition-all"
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
 <p className="text-[11px] font-bold text-[var(--color-error)] mt-2">
 ℹ️ {errorMsg}
 </p>
 )}
 </motion.div>
 )}
 {errorMsg && !showManualInput && <p className="mt-4 text-[var(--color-error)] font-bold text-sm bg-[var(--color-error)]/5 px-4 py-2 rounded-xl">{errorMsg}</p>}
 </div>

 {/* Feedback Section */}
 <AnimatePresence mode="wait">
 {transcript && (
 <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
 <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow text-left">
 <p className="text-[10px] font-black text-[var(--color-muted-foreground)] uppercase mb-2">당신이 말한 내용</p>
 <p className="text-xl font-bold text-[var(--color-foreground)] italic leading-snug">&quot;{transcript.trim()}&quot;</p>
 </div>

 {status === 'evaluating' && <Loader2 className="w-10 h-10 animate-spin text-[var(--color-primary)] mx-auto" />}
 
 {status === 'success' && (
 <div className="flex flex-col items-center gap-3 text-[var(--color-success)]">
 <CheckCircle2 className="w-16 h-16" />
 <p className="text-2xl font-black text-[var(--color-foreground)]">완벽해요!</p>
 </div>
 )}

 {status === 'failed' && (
 <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
 <div className="flex items-center gap-3 text-[var(--color-error)] mb-4 justify-center">
 <XCircle className="w-8 h-8" />
 <p className="text-xl font-black text-[var(--color-foreground)]">조금 더 노력이 필요해요</p>
 </div>
 {grammarErrors.length > 0 && (
 <ul className="text-left space-y-2 text-sm font-bold text-[var(--color-muted-foreground)] list-disc pl-5">
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
 <Button onClick={() => {
 const msg = grammarErrors.map(e => e.message).join(' ');
 onContinue(status === 'success', msg);
 }} className="flex-[1.5] h-14 rounded-2xl font-black text-lg">
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
