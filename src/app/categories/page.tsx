'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Sparkles,
  Coffee,
  Plane,
  Briefcase,
  UtensilsCrossed,
  Heart,
  MessageSquare,
  type LucideIcon
} from 'lucide-react';
import { categories, getCategoryWords } from '@/data/contents';
import { cn } from '@/lib/utils/cn';

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

export default function CategoriesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const previewWords = selectedCategory ? getCategoryWords(selectedCategory).slice(0, 6) : [];

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId === selectedCategory ? null : catId);
  };

  const startLearning = () => {
    if (selectedCategory) {
      router.push(`/learn?category=${selectedCategory}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] pb-32 pt-6 sm:pt-8 md:pt-10 lg:pt-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-10">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-foreground)]">
            상황별 학습
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-[var(--color-muted-foreground)] font-medium max-w-xl">
            원하는 상황을 선택하고 실제로 쓸 수 있는 영어 표현을 학습하세요
          </p>
        </header>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;
            const wordsCount = getCategoryWords(cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={cn(
                  "cursor-pointer rounded-2xl sm:rounded-3xl p-6 sm:p-7 transition-all duration-300 border-2 shadow-sm hover:shadow-md",
                  isSelected
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg"
                    : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                )}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    "w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center",
                    isSelected ? "bg-white/20" : "bg-[var(--color-muted)]"
                  )}>
                    <Icon className={cn("w-7 h-7 sm:w-8 sm:h-8", isSelected ? "text-white" : "text-[var(--color-foreground)]")} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black">{cat.name}</h3>
                    <p className={cn("text-sm font-medium", isSelected ? "text-white/80" : "text-[var(--color-muted-foreground)]")}>
                      {wordsCount}개 단어
                    </p>
                  </div>
                </div>
                <p className={cn("text-sm", isSelected ? "text-white/90" : "text-[var(--color-muted-foreground)]")}>
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Word Preview & Start Button */}
        {selectedCategory && (
          <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
            <h2 className="text-lg sm:text-xl font-black text-[var(--color-foreground)]">
              학습할 단어 미리보기
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {previewWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-sm"
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
            <button
              onClick={startLearning}
              className="w-full bg-[var(--color-primary)] text-white py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl md:text-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3"
            >
              학습 시작하기
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}