import type { Word } from "@/types";

export type LessonStepType =
  | "intro"
  | "word_reveal"
  | "listening_quiz"
  | "choice_quiz"
  | "typing_exact"
  | "fill_blank"
  | "sentence_build"
  | "speaking"
  | "result";

export type LessonStep =
  | { type: "intro" }
  | { type: "word_reveal"; word: Word }
  | { type: "listening_quiz"; answer: string; options: string[]; prompt?: string }
  | { type: "choice_quiz"; word: Word; options: string[] }
  | { type: "typing_exact"; word: Word }
  | { type: "fill_blank"; word: Word; sentence: string; blankedSentence: string }
  | { type: "sentence_build"; word: Word }
  | { type: "speaking"; expectedSentence: string }
  | { type: "result" };

export type ReviewItem =
  | { kind: "listening_quiz"; answer: string }
  | { kind: "choice_quiz"; word: Word }
  | { kind: "typing_exact"; word: Word }
  | { kind: "sentence_build"; word: Word }
  | { kind: "speaking"; expectedSentence: string };

