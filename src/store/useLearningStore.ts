import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word } from '../types';

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
  stage: 'idle' | 'vocab' | 'sentences' | 'speaking' | 'result';
  contentFilter: 'all' | 'movie' | 'drama';
  difficultyFilter: 'all' | 'easy' | 'medium' | 'hard';
  
  // Actions
  setWords: (words: Word[]) => void;
  nextWord: () => void;
  nextSentence: () => void;
  setStage: (stage: 'idle' | 'vocab' | 'sentences' | 'speaking' | 'result') => void;
  resetSession: () => void;
  
  // Vocab Enhancement Actions
  addRecentSearch: (query: string) => void;
  toggleFavorite: (word: Word) => void;
  removeRecentSearch: (query: string) => void;
  setContentFilter: (filter: 'all' | 'movie' | 'drama') => void;
  setDifficultyFilter: (filter: 'all' | 'easy' | 'medium' | 'hard') => void;
  toggleSavedContent: (id: string) => void;
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
      
      setWords: (words) => set({ words }),
      
      nextWord: () => set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
      
      nextSentence: () => set((state) => ({ currentSentenceIndex: state.currentSentenceIndex + 1 })),
      
      setStage: (stage) => set({ stage }),
      
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
      })
    }),
    {
      name: 'learning-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        favorites: state.favorites,
        contentFilter: state.contentFilter,
        difficultyFilter: state.difficultyFilter,
        savedContents: state.savedContents
      })
    }
  )
);
