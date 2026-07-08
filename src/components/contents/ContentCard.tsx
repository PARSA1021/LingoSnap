'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentLine } from '@/data/contents';
import { Play, Bookmark, Info, CheckCircle2 } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';
import { useLearningStore } from '@/store/useLearningStore';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

interface ContentCardProps {
 content: ContentLine;
 onWordClick?: (word: string) => void;
 isQuizMode?: boolean;
}

export function ContentCard({ content, onWordClick, isQuizMode = false }: ContentCardProps) {
 const { savedContents, toggleSavedContent } = useLearningStore();
 const { speak, isPlaying } = useTTS();
 const [showDetails, setShowDetails] = React.useState(false);
 const [quizAnswer, setQuizAnswer] = React.useState<number | null>(null);
 const [showQuizResult, setShowQuizResult] = React.useState(false);
 const isSaved = savedContents.includes(content.id);

 // Difficulty styling
 const difficultyColors = {
 easy: "bg-[var(--color-success)] text-white",
 medium: "bg-[var(--color-warning)] text-white",
 hard: "bg-[var(--color-error)] text-white"
 };

 const handleQuizAnswer = (index: number) => {
 setQuizAnswer(index);
 setShowQuizResult(true);
 };

 return (
 <div className="group relative w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl flex flex-col shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-1 hover:border-[var(--color-primary)] overflow-hidden h-full">
 
 {/* Header Area */}
 <div className="relative p-6 pb-4">
 <div className="flex items-start justify-between mb-4">
 <div className="space-y-2">
 <span className={cn(
 "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
 difficultyColors[content.difficulty]
 )}>
 {content.difficulty.toUpperCase()}
 </span>
 <span className="text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest">
 {content.category}
 </span>
 </div>
 <button
 onClick={() => toggleSavedContent(content.id)}
 className={cn(
 "h-9 w-9 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all hover:bg-[var(--color-muted)]",
 isSaved && "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
 )}
 >
 <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
 </button>
 </div>
 
 <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-foreground)] leading-tight">
 {content.title}
 </h3>
 </div>

 {/* Main Content */}
 <div className="px-6 pb-6 flex flex-col flex-1 gap-4">
 
 {/* Explanation */}
 <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
 {content.explanation}
 </p>

 {/* Examples */}
 {content.examples && content.examples.length > 0 && (
 <div className="bg-[var(--color-muted)]/50 rounded-2xl p-4 border border-[var(--color-border)]">
 <p className="text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest mb-3">
 예문
 </p>
 <div className="space-y-2">
 {content.examples.slice(0, 2).map((example, i) => (
 <div key={i} className="space-y-1">
 <p className="text-sm font-medium text-[var(--color-foreground)]">
 {example.en}
 </p>
 <p className="text-xs text-[var(--color-muted-foreground)]">
 {example.ko}
 </p>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Quiz Mode */}
 <AnimatePresence>
 {isQuizMode && content.practiceQuestions && content.practiceQuestions.length > 0 && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 className="overflow-hidden"
 >
 <div className="bg-[var(--color-primary)]/5 rounded-2xl p-4 border border-[var(--color-primary)]/20">
 <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-3">
 연습 문제
 </p>
 <p className="text-sm font-medium text-[var(--color-foreground)] mb-4">
 {content.practiceQuestions[0].question}
 </p>
 <div className="space-y-2">
 {content.practiceQuestions[0].options.map((option, i) => (
 <button
 key={i}
 onClick={() => handleQuizAnswer(i)}
 disabled={showQuizResult}
 className={cn(
 "w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all",
 showQuizResult
 ? i === content.practiceQuestions[0].correctAnswer
 ? "bg-[var(--color-success)]/10 border-[var(--color-success)] text-[var(--color-success)]"
 : quizAnswer === i
 ? "bg-[var(--color-error)]/10 border-[var(--color-error)] text-[var(--color-error)]"
 : "bg-[var(--color-muted)] border-[var(--color-border)] text-[var(--color-muted-foreground)]"
 : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:bg-[var(--color-muted)]"
 )}
 >
 <div className="flex items-center gap-3">
 <span className={cn(
 "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2",
 showQuizResult
 ? i === content.practiceQuestions[0].correctAnswer
 ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
 : quizAnswer === i
 ? "bg-[var(--color-error)] border-[var(--color-error)] text-white"
 : "bg-transparent border-[var(--color-border)] text-[var(--color-muted-foreground)]"
 : "bg-transparent border-[var(--color-border)] text-[var(--color-muted-foreground)]"
 )}>
 {showQuizResult && i === content.practiceQuestions[0].correctAnswer && (
 <CheckCircle2 className="w-4 h-4" />
 )}
 {!showQuizResult && String.fromCharCode(65 + i)}
 </span>
 {option}
 </div>
 </button>
 ))}
 </div>
 {showQuizResult && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mt-4 p-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]"
 >
 <p className="text-xs text-[var(--color-muted-foreground)]">
 {content.practiceQuestions[0].explanation}
 </p>
 </motion.div>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Show Details Toggle */}
 <AnimatePresence>
 {showDetails && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="overflow-hidden space-y-4"
 >
 {/* Common Mistakes */}
 {content.commonMistakes && content.commonMistakes.length > 0 && (
 <div className="bg-[var(--color-error)]/5 rounded-2xl p-4 border border-[var(--color-error)]/20">
 <p className="text-[10px] font-bold text-[var(--color-error)] uppercase tracking-widest mb-3">
 흔히 하는 실수
 </p>
 <div className="space-y-3">
 {content.commonMistakes.map((mistake, i) => (
 <div key={i} className="space-y-1">
 <div className="flex items-start gap-2">
 <span className="text-xs font-bold text-[var(--color-error)]">✗</span>
 <p className="text-xs text-[var(--color-muted-foreground)] line-through">{mistake.wrong}</p>
 </div>
 <div className="flex items-start gap-2">
 <span className="text-xs font-bold text-[var(--color-success)]">✓</span>
 <p className="text-xs text-[var(--color-foreground)] font-medium">{mistake.correct}</p>
 </div>
 <p className="text-xs text-[var(--color-muted-foreground)] ml-5">{mistake.explanation}</p>
 </div>
 ))}
 </div>
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>

 {/* Action Buttons */}
 <div className="mt-auto pt-4 flex flex-col gap-3">
 <div className="flex gap-3">
 <Button
 variant="primary"
 className="flex-1 h-12 rounded-full font-bold"
 onClick={() => {
 if (content.examples && content.examples.length > 0) {
 speak(content.examples[0].en);
 }
 }}
 >
 <Play className="mr-2 h-4 w-4 fill-current" /> 
 예문 듣기
 </Button>
 <Button
 variant="outline"
 className="h-12 px-4 rounded-full"
 onClick={() => setShowDetails(!showDetails)}
 >
 <Info className="h-4 w-4" />
 </Button>
 </div>

 <button 
 className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors border border-dashed border-[var(--color-primary)]/30 rounded-full"
 onClick={() => window.location.href = `/learn/session?grammar=${content.id}`}
 >
 Start Grammar Lesson →
 </button>
 </div>
 </div>
 </div>
 );
}
