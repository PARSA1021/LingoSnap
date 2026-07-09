'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { categories, getCategoryWords } from '@/data/contents';
import {
  Coffee,
  Plane,
  UtensilsCrossed,
  ShoppingBag,
  Briefcase,
  Users,
  Heart,
  Sparkles,
  Zap,
  BookOpen,
  MessageSquare,
  Play,
  type LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Coffee,
  Plane,
  UtensilsCrossed,
  ShoppingBag,
  Briefcase,
  Users,
  Heart,
  Sparkles,
  Zap,
  BookOpen,
  MessageSquare
};

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] pb-32 pt-6 sm:pt-8 md:pt-10 lg:pt-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-7 md:gap-8 lg:gap-10">

        {/* Header */}
        <header className="flex flex-col items-center text-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            <span className="font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Situational Learning
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-foreground)]">
            상황별 학습
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-[var(--color-muted-foreground)] max-w-md md:max-w-xl lg:max-w-2xl px-2 font-medium">
            실제로 마주칠 상황에 맞춰 표현을 배우고, 즉각적으로 사용해보세요!
          </p>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Sparkles;
            const words = getCategoryWords(cat.id);

            return (
              <div key={cat.id} className="group relative overflow-hidden rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="p-5 sm:p-6 md:p-7 flex flex-col gap-4 sm:gap-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[var(--color-primary)]/10 rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] tracking-tight">
                        {cat.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mt-0.5 sm:mt-1">
                        {words.length}개의 필수 표현
                      </p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Example words preview */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {words.slice(0, 3).map(w => (
                      <span key={w.id} className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[var(--color-muted)] text-[var(--color-foreground)] text-[10px] sm:text-xs font-medium rounded-full">
                        {w.word}
                      </span>
                    ))}
                    {words.length > 3 && (
                      <span className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[var(--color-muted-foreground)] text-[10px] sm:text-xs font-medium">
                        +{words.length - 3}개 더
                      </span>
                    )}
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-[var(--color-border)]/30 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-[var(--color-muted-foreground)] font-medium">
                      준비 완료 ✨
                    </span>
                    <button
                      onClick={() => router.push(`/learn?category=${cat.id}`)}
                      className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-[var(--color-primary)]/90 active:scale-95 transition-all shadow-md hover:shadow-lg"
                    >
                      학습 시작하기
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}