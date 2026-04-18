import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word } from '../types';

export type LearningStage = 'idle' | 'vocab' | 'typing' | 'completion' | 'sentences' | 'speaking' | 'result';

interface LearningState {
  // Data
  words: Word[];
  
  // New Enhancements
  recentSearches: string[];
  favorites: Word[];
  savedContents: string[];
  
  // Progress
  currentWordIndex: number;
  currentSentenceIndex: number;
  stage: LearningStage;
  contentFilter: 'all' | 'movie' | 'drama';
  difficultyFilter: 'all' | 'easy' | 'medium' | 'hard';
  
  // Gamification
  points: number;
  totalLearnedWords: number;
  
  // Actions
  setWords: (words: Word[]) => void;
  nextWord: () => void;
  prevWord: () => void;
  nextSentence: () => void;
  setStage: (stage: LearningStage) => void;
  resetSession: () => void;
  
  // Vocab Enhancement Actions
  addRecentSearch: (query: string) => void;
  toggleFavorite: (word: Word) => void;
  removeRecentSearch: (query: string) => void;
  setContentFilter: (filter: 'all' | 'movie' | 'drama') => void;
  setDifficultyFilter: (filter: 'all' | 'easy' | 'medium' | 'hard') => void;
  toggleSavedContent: (id: string) => void;
  
  // Gamification Actions
  addPoints: (amount: number) => void;
  incrementLearnedWords: () => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      words: [],
      recentSearches: [],
      favorites: [],
      savedContents: [],
      
      currentWordIndex: 0,
      currentSentenceIndex: 0,
      stage: 'idle',
      contentFilter: 'all',
      difficultyFilter: 'all',
      
      points: 0,
      totalLearnedWords: 0,
      
      setWords: (words) => set({ words }),
      
      nextWord: () => set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
      
      prevWord: () => set((state) => ({ 
        currentWordIndex: Math.max(0, state.currentWordIndex - 1) 
      })),
      
      nextSentence: () => set((state) => ({ currentSentenceIndex: state.currentSentenceIndex + 1 })),
      
      setStage: (stage) => {
    if (stage === 'typing' || stage === 'vocab' || stage === 'completion') {
      set({ stage, currentWordIndex: 0 });
    } else {
      set({ stage });
    }
  },
      
      resetSession: () => set({
        currentWordIndex: 0,
        currentSentenceIndex: 0,
        stage: 'idle',
      }),
      
      addRecentSearch: (query) => set((state) => {
        const cleanQuery = query.toLowerCase().trim();
        if (!cleanQuery) return state;
        const filtered = state.recentSearches.filter(q => q !== cleanQuery);
        return { recentSearches: [cleanQuery, ...filtered].slice(0, 10) }; // Keep up to 10
      }),
      
      removeRecentSearch: (query) => set((state) => ({
        recentSearches: state.recentSearches.filter(q => q !== query)
      })),
      
      toggleFavorite: (word) => set((state) => {
        const isFavorite = state.favorites.some(w => w.word === word.word);
        if (isFavorite) {
          return { favorites: state.favorites.filter(w => w.word !== word.word) };
        } else {
          return { favorites: [word, ...state.favorites] };
        }
      }),
            setContentFilter: (filter) => set({ contentFilter: filter }),
      setDifficultyFilter: (filter) => set({ difficultyFilter: filter }),

      toggleSavedContent: (id) => set((state) => {
        const isSaved = state.savedContents.includes(id);
        if (isSaved) {
          return { savedContents: state.savedContents.filter(i => i !== id) };
        } else {
          return { savedContents: [id, ...state.savedContents] };
        }
      }),

      addPoints: (amount) => set((state) => ({ points: state.points + amount })),
      incrementLearnedWords: () => set((state) => ({ totalLearnedWords: state.totalLearnedWords + 1 }))
    }),
    {
      name: 'learning-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        favorites: state.favorites,
        contentFilter: state.contentFilter,
        difficultyFilter: state.difficultyFilter,
        savedContents: state.savedContents,
        points: state.points,
        totalLearnedWords: state.totalLearnedWords
      })
    }
  )
);
