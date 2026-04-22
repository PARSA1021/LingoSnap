import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LessonStep, ReviewItem } from "@/types/lesson";
import type { Word } from "@/types";

type LessonSessionState = {
  steps: LessonStep[];
  stepIndex: number;
  startedAt: number | null;
  completedAt: number | null;

  reviewQueue: ReviewItem[];

  startLesson: (steps: LessonStep[]) => void;
  next: () => void;
  restart: () => void;
  pushToReview: (item: ReviewItem) => void;
  clearReview: () => void;
};

export const useLessonSessionStore = create<LessonSessionState>()(
  persist(
    (set, get) => ({
      steps: [{ type: "intro" }],
      stepIndex: 0,
      startedAt: null,
      completedAt: null,

      reviewQueue: [],

      startLesson: (steps) =>
        set({
          steps,
          // If the first step is an intro screen, jump to the first actionable step.
          stepIndex: steps[0]?.type === "intro" ? 1 : 0,
          startedAt: Date.now(),
          completedAt: null,
        }),

      next: () => {
        const { steps, stepIndex } = get();
        const nextIndex = Math.min(stepIndex + 1, steps.length - 1);
        set({
          stepIndex: nextIndex,
          completedAt: nextIndex === steps.length - 1 ? Date.now() : get().completedAt,
        });
      },

      restart: () => {
        set({ stepIndex: 0, startedAt: Date.now(), completedAt: null });
      },

      pushToReview: (item) =>
        set((state) => {
          // Dedupe by stable key
          const key = reviewKey(item);
          const nextQueue = [item, ...state.reviewQueue.filter((i) => reviewKey(i) !== key)].slice(0, 50);
          return { reviewQueue: nextQueue };
        }),

      clearReview: () => set({ reviewQueue: [] }),
    }),
    {
      name: "lesson-session",
      partialize: (s) => ({ reviewQueue: s.reviewQueue }),
    }
  )
);

function reviewKey(item: ReviewItem) {
  if (item.kind === "speaking") return `speaking:${item.expectedSentence}`;
  if (item.kind === "listening_quiz") return `listening:${item.answer}`;
  return `${item.kind}:${(item.word as Word).word}`;
}

