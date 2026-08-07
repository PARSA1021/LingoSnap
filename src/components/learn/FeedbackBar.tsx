'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
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
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 sm:px-6 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8 flex flex-col items-center pointer-events-none"
    >
      <div className="w-full max-w-xl space-y-2 pointer-events-auto">
        <AnimatePresence>
          {showWhy && result.msg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl rounded-2xl p-4 sm:p-5 overflow-hidden"
            >
              <h4 className="text-[11px] sm:text-xs font-black text-[var(--color-muted-foreground)] uppercase tracking-widest mb-2">분석 피드백</h4>
              <p className="text-sm sm:text-base font-bold text-[var(--color-foreground)] italic leading-relaxed">
                {result.msg}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`w-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5 shadow-2xl backdrop-blur-lg border ${
          ok
            ? 'bg-emerald-600/95 text-white border-emerald-400/40 shadow-emerald-900/30'
            : 'bg-rose-600/95 text-white border-rose-400/40 shadow-rose-900/30'
        }`}
        >
          {/* Left: icon + message */}
          <div className="flex w-full items-center gap-3 sm:gap-4 min-w-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/30">
              {ok
                ? <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                : <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              }
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="font-black text-base sm:text-xl leading-none">
                {ok ? '정답입니다! 🎉' : '오답입니다'}
              </h3>
              <p className="text-xs sm:text-sm font-medium opacity-90 leading-tight truncate">
                {msg}
              </p>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3 shrink-0">
            {!ok && result.msg && (
              <button
                onClick={() => setShowWhy(!showWhy)}
                className="flex-1 sm:flex-none h-11 sm:h-12 px-3.5 text-xs sm:text-sm font-bold bg-white/15 hover:bg-white/25 border border-white/40 text-white rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                이유 보기
              </button>
            )}
            <button
              onClick={onNext}
              className="flex-1 sm:flex-none h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-black shrink-0 bg-white text-gray-900 hover:bg-gray-100 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span>계속하기</span>
              <span className="hidden sm:inline-block text-[10px] bg-gray-200 text-gray-700 font-bold px-1.5 py-0.5 rounded">Enter ↵</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
