'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackBarProps {
  result: { kind: 'correct' | 'wrong'; msg?: string };
  onNext: () => void;
}

const SUCCESS_MESSAGES = [
  "대단해요!", "완벽해요!", "천재 아니신가요?", "이대로 계속 가봐요!",
  "와우! 정답이에요!", "멋져요!", "학습 능력이 뛰어나시네요!",
  "정확해요!", "역시 대단하시네요!"
];

const ERROR_MESSAGES = [
  "아쉬워요, 다시 해볼까요?", "거의 다 왔어요!", "조금만 더 힘내봐요!",
  "기운 내세요! 다시 도전!", "틀려도 괜찮아요, 배워가는 거니까요."
];

export function FeedbackBar({ result, onNext }: FeedbackBarProps) {
  const ok = result.kind === 'correct';
  const [showWhy, setShowWhy] = React.useState(false);
  const [msg] = React.useState(() => {
    const list = ok ? SUCCESS_MESSAGES : ERROR_MESSAGES;
    return list[Math.floor(Math.random() * list.length)];
  });

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 sm:px-6 pb-[max(env(safe-area-inset-bottom)+6rem,6rem)] sm:pb-24 flex flex-col items-center pointer-events-none"
    >
      <div className="w-full max-w-xl space-y-2 pointer-events-auto">
        <AnimatePresence>
          {showWhy && result.msg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-surface border-4 border-border shadow-[0_-4px_0_var(--border)] rounded-2xl p-4 sm:p-5 overflow-hidden"
            >
              <h4 className="text-[11px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 font-cartoon">문법 분석 결과</h4>
              <p className="text-sm sm:text-base font-bold text-foreground font-reading italic leading-relaxed">
                {result.msg}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`w-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5
          ${ok
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_8px_32px_rgba(5,150,105,0.45)]'
            : 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_8px_32px_rgba(239,68,68,0.45)]'
          }`}
        >
          {/* Left: icon + message */}
          <div className="flex w-full items-center gap-3 sm:gap-4">
            <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/30">
              {ok
                ? <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                : <XCircle className="w-6 h-6 sm:w-7 sm:h-7" />
              }
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-extrabold text-lg sm:text-xl leading-none">
                {ok ? '정답! 🎉' : '오답'}
              </h3>
              <p className="text-xs sm:text-sm font-medium opacity-90 leading-tight">
                {msg}
              </p>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3">
            {!ok && result.msg && (
              <button
                onClick={() => setShowWhy(!showWhy)}
                className="flex-1 sm:flex-none h-11 sm:h-12 px-4 text-sm font-bold bg-white/15 hover:bg-white/25 border-2 border-white/40 text-white rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                이유 보기
              </button>
            )}
            <button
              onClick={onNext}
              className="flex-1 sm:flex-none h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-bold shrink-0 bg-white text-gray-900 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              계속하기 <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
