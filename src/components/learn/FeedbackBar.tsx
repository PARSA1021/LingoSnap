'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [msg] = React.useState(() => {
    const list = ok ? SUCCESS_MESSAGES : ERROR_MESSAGES;
    return list[Math.floor(Math.random() * list.length)];
  });

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-20 flex justify-center pointer-events-none"
    >
      <div className={`w-full max-w-xl rounded-2xl border-4 border-border
        shadow-[0_4px_0_var(--border)] p-3 flex items-center justify-between gap-4 pointer-events-auto
        ${ok ? 'bg-success text-white' : 'bg-error text-white'}`}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-sm backdrop-blur-sm border-2 border-white/30">
            {ok
              ? <CheckCircle2 className="w-6 h-6" />
              : <XCircle className="w-6 h-6" />
            }
          </div>
          <div className="space-y-0.5">
            <h3 className="font-black text-sm leading-none font-cartoon">
              {ok ? '정답!' : '오답!'}
            </h3>
            <p className="text-[10px] font-bold opacity-90 leading-tight italic">
              {msg}
            </p>
          </div>
        </div>
        <Button
          onClick={onNext}
          className="h-10 px-6 text-sm font-black shrink-0 bg-white text-foreground hover:bg-white/90 border-2 border-border/10 shadow-[0_2px_0_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 font-cartoon"
        >
          계속 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
