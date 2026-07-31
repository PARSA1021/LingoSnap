'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BookA, RotateCcw, Menu } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { NavDrawer } from '@/components/layout/NavDrawer';

const coreTabs = [
  { name: '홈', href: '/', icon: Home },
  { name: '학습', href: '/learn', icon: Lightbulb },
  { name: '복습', href: '/review', icon: RotateCcw },
  { name: '단어', href: '/vocab', icon: BookA },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <>
      <nav
        aria-label="Main Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-[0_-4px_25px_rgba(0,0,0,0.06)] transition-colors duration-300 md:hidden"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
          {coreTabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== '/' && pathname.startsWith(tab.href));
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                aria-label={tab.name}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center min-w-[60px] py-1.5 select-none touch-manipulation group"
              >
                <div
                  className={cn(
                    'relative z-10 p-1 rounded-full transition-all duration-300 ease-out',
                    isActive
                      ? 'text-[var(--color-primary)] scale-110'
                      : 'text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]'
                  )}
                >
                  <Icon className={cn('w-6 h-6', isActive && 'stroke-[2.5px]')} />
                </div>

                <span
                  className={cn(
                    'relative z-10 text-[11px] font-bold tracking-tight transition-colors duration-300',
                    isActive
                      ? 'text-[var(--color-primary)] font-extrabold'
                      : 'text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]'
                  )}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}

          {/* More Drawer Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="더보기 메뉴"
            className="relative flex flex-col items-center justify-center min-w-[60px] py-1.5 select-none touch-manipulation group"
          >
            <div className="relative z-10 p-1 rounded-full text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors duration-300">
              <Menu className="w-6 h-6" />
            </div>
            <span className="relative z-10 text-[11px] font-bold tracking-tight text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors duration-300">
              더보기
            </span>
          </button>
        </div>
      </nav>

      {/* Drawer */}
      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
