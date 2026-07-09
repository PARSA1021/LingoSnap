'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Coffee,
  Plane,
  Briefcase,
  Sparkles,
  UtensilsCrossed,
  Heart,
  MessageSquare,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { categories, getCategoryWords } from '@/data/contents';

const iconMap: Record<string, LucideIcon> = {
  Coffee,
  Plane,
  Briefcase,
  Sparkles,
  BookOpen,
  UtensilsCrossed,
  Heart,
  MessageSquare,
};

type WordCount = 5 | 10 | 15;

export default function LearnPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = React.useState<URLSearchParams | null>(null);

  // 클라이언트에서만 searchParams 처리
  React.useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  // Setup state
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedCount, setSelectedCount] = React.useState<WordCount>(10);

  // URL 파라미터에서 초기값 설정
  React.useEffect(() => {
    if (!searchParams) return;

    const categoryParam = searchParams.get('category');
    if (categoryParam && (categoryParam === 'all' || categories.some(c => c.id === categoryParam))) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const startLearning = () => {
    router.push(`/learn/session?category=${selectedCategory}&wordCount=${selectedCount}`);
  };

  const previewWords = React.useMemo(() => {
    const words = getCategoryWords(selectedCategory);
    return words.slice(0, 6); // Show up to 6 words
  }, [selectedCategory]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] pb-32 pt-6 sm:pt-8 md:pt-10 lg:pt-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-10">

        {/* Header */}
        <header className="flex flex-col gap-3 sm:gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-foreground)]">
            학습 준비하기
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-[var(--color-muted-foreground)] font-medium max-w-md">
            학습할 카테고리와 개수를 선택하고 학습을 시작해보세요!
          </p>
        </header>

        {/* Category Selection */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[var(--color-primary)]" />
            카테고리
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-3.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "h-14 sm:h-16 md:h-18 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all text-center px-2",
                selectedCategory === 'all'
                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
              )}
            >
              <span className="text-xl sm:text-2xl">🎯</span>
              <span className="text-[10px] sm:text-xs md:text-sm font-bold">전체</span>
            </button>
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Sparkles;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "h-14 sm:h-16 md:h-18 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all text-center px-2",
                    selectedCategory === cat.id
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg"
                      : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold truncate w-full">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Count Selection */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[var(--color-primary)]" />
            학습할 개수
          </h2>
          <div className="flex gap-2.5 sm:gap-3 md:gap-3.5">
            {([5, 10, 15] as const).map((num) => (
              <button
                key={num}
                onClick={() => setSelectedCount(num)}
                className={cn(
                  "flex-1 h-14 sm:h-16 md:h-18 rounded-xl sm:rounded-2xl border flex items-center justify-center font-bold text-lg sm:text-xl md:text-2xl transition-all",
                  selectedCount === num
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                )}
              >
                {num}개
              </button>
            ))}
          </div>
        </div>

        {/* Word Preview */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[var(--color-primary)]" />
            학습할 단어 미리보기
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {previewWords.map((word) => (
              <div
                key={word.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md"
              >
                <div className="font-bold text-lg sm:text-xl text-[var(--color-foreground)] mb-1">
                  {word.word}
                </div>
                <div className="text-sm text-[var(--color-muted-foreground)]">
                  {word.meaning}
                </div>
              </div>
            ))}
          </div>
          {previewWords.length === 0 && (
            <div className="text-center py-8 text-[var(--color-muted-foreground)] text-sm">
              선택한 카테고리에 단어가 없습니다!
            </div>
          )}
        </div>

        {/* Quick Start Buttons */}
        <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-3">
          <button
            onClick={startLearning}
            className="w-full bg-[var(--color-primary)] text-white py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl md:text-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
          >
            학습 시작하기
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => router.push('/learn/session?mode=review')}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] py-3 sm:py-4 rounded-2xl sm:rounded-3xl font-semibold text-xs sm:text-sm md:text-lg flex items-center justify-center gap-2 hover:bg-[var(--color-surface-hover)] transition-all"
          >
            <RotateCcw className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            복습 모드
          </button>
        </div>
      </div>
    </div>
  );
}