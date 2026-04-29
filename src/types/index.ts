export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'daily' | 'travel' | 'business' | 'emotion' | 'general';

export type Word = {
  id?: string;
  word: string;
  meaning: string;
  example: string;
  exampleTranslation?: string;
  level?: string;
  category?: string;
  phonetic?: string;
  audioUrl?: string;
  synonyms?: string[];
  usageTips?: string;
};

export type Sentence = {
  id: string;
  text: string;
  translation: string; // 문장 해석 (추가됨)
  level?: Level;
  category?: Category;
};

export type DialogLine = {
  speaker: 'A' | 'B';
  text: string;
  translation: string;
};

export type Conversation = {
  id: string;
  title: string;
  dialogues: DialogLine[];
  level?: Level;
  category?: Category;
};

export type Progress = {
  incorrectWords: Word[]; 
};

export type SessionState = {
  stage: 'idle' | 'vocab' | 'sentences' | 'speaking' | 'result';
  currentWordIndex: number;
  currentSentenceIndex: number;
};