'use client';

import * as React from 'react';
import { Suspense } from 'react';
import GrammarLearnContent from './GrammarLearnContent';

export default function GrammarLearnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-[var(--color-muted-foreground)] text-base">로딩 중...</div>
      </div>
    }>
      <GrammarLearnContent />
    </Suspense>
  );
}
