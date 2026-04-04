'use client';

import * as React from 'react';
import { Word } from '@/types';
import { VocabCard } from '@/components/vocab/VocabCard';
import { Search, Loader2, BookOpen, Sparkles, Star, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/store/useLearningStore';
import vocabData from '@/data/vocabulary.json';
import { getNormalizedWordData } from '@/lib/dictionary';

// Helper to grab random items safely
const getRandomElements = (arr: any[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function VocabSearchPage() {
  const [query, setQuery] = React.useState('');
  
  // Real-time matched words
  const [matchedWords, setMatchedWords] = React.useState<Word[]>([]);
  const [recommendedWords, setRecommendedWords] = React.useState<any[]>([]);

  // Web API Search State
  const [apiWord, setApiWord] = React.useState<Word | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const addRecentSearch = useLearningStore(state => state.addRecentSearch);
  const recentSearches = useLearningStore(state => state.recentSearches);
  const favorites = useLearningStore(state => state.favorites);

  React.useEffect(() => {
    // Load local discovery words on mount
    setRecommendedWords(getRandomElements(vocabData, 4));
  }, []);

  // Real-time auto filtering effect
  React.useEffect(() => {
    setApiWord(null);
    setError('');

    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      setMatchedWords([]);
      return;
    }

    const matches = vocabData.filter(w => 
      w.word.toLowerCase().includes(cleanQuery) || 
      w.meaning.includes(cleanQuery)
    ).slice(0, 5); // Limit to top 5 hits

    setMatchedWords(matches as Word[]);
    
    // Auto-record exact local matches
    const exactMatch = matches.find(w => w.word.toLowerCase() === cleanQuery);
    if (exactMatch) {
       addRecentSearch(exactMatch.word);
    }
  }, [query]);

  const handleApiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return;

    setLoading(true);
    setError('');
    setApiWord(null);

    try {
      const data = await getNormalizedWordData(cleanQuery, '검색된 의미 없음');
      // If meaning matches our default, we check if at least an english definition exists
      if (data && (data.meaning !== '검색된 의미 없음' || data.phonetic)) {
        setApiWord(data as Word);
        addRecentSearch(cleanQuery);
        // Clear local matches when showing direct API hit to keep UI clean
        setMatchedWords([]); 
      } else {
        setError(`"${query}" 단어를 영어 사전에서 찾지 못했습니다.`);
      }
    } catch (err) {
      setError('사전 검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const showEmptyState = !query.trim();

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col w-full max-w-4xl mx-auto min-h-[80vh]">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex-col flex gap-4 mt-2 sm:mt-4 mb-6"
      >
        <form onSubmit={handleApiSearch} className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10">
            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full h-16 sm:h-20 bg-white pl-16 pr-24 sm:pr-32 rounded-3xl sm:rounded-[2rem] border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg sm:text-2xl font-bold shadow-[0_8px_30px_rgb(0,0,0,0.06)] outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
            placeholder="궁금한 단어를 쳐보세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center z-10">
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="h-10 sm:h-14 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-base bg-blue-600 text-white font-bold border-none shadow-md hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-colors"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : '웹 사전'}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="w-full flex-1 flex flex-col">
        <AnimatePresence mode="wait">

          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-center font-bold p-6 bg-red-50 border-2 border-red-100 rounded-3xl mt-4 z-10"
            >
              {error}
            </motion.div>
          )}

          {showEmptyState && (
             <motion.div 
               key="empty"
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
               className="w-full flex flex-col space-y-10 mt-2"
             >
                {/* Favorites Row */}
                {favorites.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-yellow-500 font-extrabold px-2">
                       <Star className="w-5 h-5 fill-yellow-500" /> 즐겨찾기 단어장
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {favorites.map((fav, i) => (
                        <motion.button 
                           whileTap={{ scale: 0.95 }}
                           key={`fav-${fav.word}-${i}`}
                           onClick={() => setQuery(fav.word)}
                           className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 font-bold px-4 py-2 rounded-2xl transition-colors shadow-sm"
                        >
                          {fav.word}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-500 font-extrabold px-2">
                       <History className="w-5 h-5" /> 최근 검색 기록
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <motion.button 
                           whileTap={{ scale: 0.95 }}
                           key={`recent-${term}-${i}`}
                           onClick={() => setQuery(term)}
                           className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-2xl transition-colors shadow-sm tracking-wide"
                        >
                          {term}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Discovery */}
                <div className="space-y-4 pt-4 border-t-2 border-slate-100">
                  <div className="flex items-center gap-2 text-blue-500 font-extrabold px-2">
                      <Sparkles className="w-5 h-5" /> 오늘의 추천 영단어 
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedWords.map((rec, i) => (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={i}
                        onClick={() => setQuery(rec.word)}
                        className="bg-white border-2 border-slate-100 rounded-3xl p-5 cursor-pointer shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-center gap-2">
                           <span className="text-xl font-black text-slate-800">{rec.word}</span>
                           <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-5 h-5" /></span>
                        </div>
                        <p className="text-slate-500 font-medium mt-2 line-clamp-1">{rec.meaning}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

             </motion.div>
          )}

          {apiWord && (
             <motion.div
               key={`api-${apiWord.word}`}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
               className="mt-2 pb-10"
             >
                <div className="mb-4 flex items-center justify-between px-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
                  <span>웹 사전 검색 결과</span>
                  <button onClick={() => setApiWord(null)} className="text-slate-400 hover:text-slate-600">지우기 ✕</button>
                </div>
                <VocabCard word={apiWord} />
             </motion.div>
          )}

          {!showEmptyState && matchedWords.length === 0 && !apiWord && !error && !loading && (
             <motion.div 
               key="no-match"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="flex-1 flex flex-col items-center justify-center text-slate-400 font-medium space-y-4 pt-20"
             >
               <Search className="w-16 h-16 opacity-20" />
               <p className="text-lg">앱 단어장에 일치하는 단어가 없습니다.</p>
               <p className="text-sm">우측의 '웹 사전' 버튼을 눌러 온라인에서 검색해보세요!</p>
             </motion.div>
          )}

          {!showEmptyState && matchedWords.length > 0 && !apiWord && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 space-y-8 pb-10"
            >
              <div className="mb-2 px-2 text-indigo-400 font-bold text-sm uppercase tracking-widest">앱 단어장 결과</div>
              {matchedWords.map((w, index) => (
                <VocabCard key={`${w.word}-${index}`} word={w} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
