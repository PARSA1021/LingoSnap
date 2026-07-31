'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  PenTool, 
  Mic, 
  LayoutGrid, 
  X, 
  Sparkles, 
  Flame, 
  Star,
  ChevronRight,
  BookA,
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLearningStore } from '@/store/useLearningStore';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: '오늘의 레슨', href: '/learn', icon: Lightbulb, color: 'text-amber-500 bg-amber-500/10' },
  { name: '복습 스테이션', href: '/review', icon: RotateCcw, color: 'text-rose-500 bg-rose-500/10' },
  { name: '나만의 단어장', href: '/vocab', icon: BookA, color: 'text-purple-500 bg-purple-500/10' },
  { name: '핵심 문법 도서관', href: '/contents', icon: BookOpen, color: 'text-emerald-500 bg-emerald-500/10' },
  { name: '상황별 카테고리', href: '/categories', icon: LayoutGrid, color: 'text-blue-500 bg-blue-500/10' },
  { name: '문장 작문 연습', href: '/writing', icon: PenTool, color: 'text-indigo-500 bg-indigo-500/10' },
  { name: '말하기 연습', href: '/speaking', icon: Mic, color: 'text-pink-500 bg-pink-500/10' },
];

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const pathname = usePathname();
  const streakDays = useLearningStore((s) => s.streakDays || 1);
  const points = useLearningStore((s) => s.points || 0);

  // Body scroll lock when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[var(--color-surface)] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-[var(--color-border)]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white font-black text-sm shadow-md">
              LS
            </div>
            <div>
              <h2 className="font-black text-lg text-[var(--color-foreground)] leading-none">
                LingoSnap
              </h2>
              <p className="text-xs text-[var(--color-muted-foreground)] font-medium mt-0.5">
                전체 메뉴
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            aria-label="메뉴 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Stats Card */}
        <div className="p-4 bg-[var(--color-muted)]/40 border-b border-[var(--color-border)]">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--color-surface)] p-3 rounded-2xl border border-[var(--color-border)] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Flame className="w-4 h-4 fill-orange-500" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase">연속 학습</div>
                <div className="text-sm font-black text-[var(--color-foreground)]">{streakDays}일째</div>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] p-3 rounded-2xl border border-[var(--color-border)] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-muted-foreground)] uppercase">포인트</div>
                <div className="text-sm font-black text-[var(--color-foreground)]">{points} P</div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <div className="text-[11px] font-black text-[var(--color-muted-foreground)] uppercase tracking-wider px-3 mb-2">
            학습 메뉴
          </div>

          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-black"
                    : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105", item.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform group-hover:translate-x-1",
                  isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
                )} />
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-muted-foreground)] font-medium">
          <p>LingoSnap v1.0 • 스마트 영어 학습</p>
        </div>
      </div>
    </div>
  );
}
