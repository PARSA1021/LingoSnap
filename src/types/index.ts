export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'daily' | 'travel' | 'business' | 'emotion' | 'sns' | 'academic' | 'general';

export type Word = {
 id?: string;
 word: string;
 meaning: string;
 example: string;
 exampleTranslation?: string;
 level?: string;
 category?: string;
 subCategory?: string;
 type?: 'vocabulary' | 'collocation' | 'pattern' | 'situation';
 phonetic?: string;
 audioUrl?: string;
 synonyms?: string[];
 usageTips?: string;
 distractors?: string[];
 examples?: Array<{ text: string; translation?: string }>;
 difficulty?: 'easy' | 'medium' | 'hard';
};

export type Sentence = {
 id: string;
 text: string;
 translation: string;
 level?: Level;
 category?: string;
 subCategory?: string;
 type?: 'minimal_pair' | 'intonation' | 'reduction' | 'situation';
 distractors?: string[];
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