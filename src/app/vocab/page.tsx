'use client';

import * as React from 'react';
import { Word } from '@/types';
import { VocabCard } from '@/components/vocab/VocabCard';
import { Button } from '@/components/ui/Button';
import { Search, Loader2, BookOpen, Sparkles, Star, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/store/useLearningStore';
import vocabData from '@/data/vocabulary.json';
import { getNormalizedWordData } from '@/lib/dictionary';
import { cn } from '@/lib/utils/cn';

const getRandomElements = (arr: any[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function VocabSearchPage() {
  const [query, setQuery] = React.useState('');
  const [matchedWords, setMatchedWords] = React.useState<Word[]>([]);
  const [recommendedWords, setRecommendedWords] = React.useState<any[]>([]);
  const [apiWord, setApiWord] = React.useState<Word | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const addRecentSearch = useLearningStore(state => state.addRecentSearch);
  const recentSearches = useLearningStore(state => state.recentSearches);
  const favorites = useLearningStore(state => state.favorites);

  React.useEffect(() => {
    setRecommendedWords(getRandomElements(vocabData, 4));
  }, []);

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
    ).slice(0, 5);
    setMatchedWords(matches as Word[]);
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
      if (data && (data.meaning !== '검색된 의미 없음' || data.phonetic)) {
        setApiWord(data as Word);
        addRecentSearch(cleanQuery);
        setMatchedWords([]); 
      } else {
        setError(`"${query}" 단어를 찾지 못했습니다.`);
      }
    } catch (err) {
      setError('사전 검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const showEmptyState = !query.trim();

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col w-full max-w-4xl mx-auto min-h-[80vh] dot-pattern">
      <div className="w-full mt-4 mb-10">
        <form onSubmit={handleApiSearch} className="relative w-full group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-7 w-7" />
          </div>
          <input
            type="text"
            className="w-full h-18 sm:h-22 bg-surface pl-16 pr-32 rounded-3xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 text-xl font-black outline-none transition-all placeholder:text-muted-foreground/60 shadow-sm"
            placeholder="Search word..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-2 right-2 flex items-center z-10">
            <Button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="h-14 sm:h-18 px-6 sm:px-8 text-sm sm:text-lg"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : '사전 검색'}
            </Button>
          </div>
        </form>
      </div>

      <div className="w-full flex-1">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="p-6 bg-error/5 border-2 border-error/20 rounded-3xl text-error font-black text-center">
              {error}
            </motion.div>
          )}

          {showEmptyState && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-12">
                {favorites.length > 0 && (
                  <div className="space-y-4">
                    <p className="flex items-center gap-2 text-warning font-black text-xs uppercase tracking-widest pl-4"><Star className="w-4 h-4 fill-current" /> Favorites</p>
                    <div className="flex flex-wrap gap-2 px-2">
                       {favorites.map((fav, i) => (
                         <button key={i} onClick={() => setQuery(fav.word)} className="px-5 py-2.5 bg-warning/10 text-warning font-black rounded-xl border-b-4 border-warning-shadow active:border-b-0 active:translate-y-1 transition-all">{fav.word}</button>
                       ))}
                    </div>
                  </div>
                )}
                
                {recentSearches.length > 0 && (
                  <div className="space-y-4">
                    <p className="flex items-center gap-2 text-muted-foreground font-black text-xs uppercase tracking-widest pl-4"><History className="w-4 h-4" /> Recent</p>
                    <div className="flex flex-wrap gap-2 px-2">
                       {recentSearches.map((term, i) => (
                         <button key={i} onClick={() => setQuery(term)} className="px-5 py-2.5 bg-muted text-muted-foreground font-black rounded-xl border-b-4 border-secondary-shadow active:border-b-0 active:translate-y-1 transition-all">{term}</button>
                       ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6 pt-8 border-t-2 border-border/50">
                  <p className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest pl-4"><Sparkles className="w-5 h-5" /> Recommended</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedWords.map((rec, i) => (
                      <div 
                        key={i}
                        onClick={() => setQuery(rec.word)}
                        className="bg-surface p-6 rounded-3xl border-2 border-border border-b-4 border-b-secondary-shadow active:border-b-0 active:translate-y-1 cursor-pointer transition-all flex justify-between items-center group"
                      >
                         <div>
                            <p className="text-xl font-black text-foreground">{rec.word}</p>
                            <p className="text-sm font-bold text-muted-foreground mt-1">{rec.meaning}</p>
                         </div>
                         <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    ))}
                  </div>
                </div>
            </motion.div>
          )}

          {apiWord && (
             <motion.div key="api-res" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="pb-10">
                <div className="flex justify-between items-center mb-4 px-2">
                   <p className="text-primary font-black text-xs uppercase tracking-widest">Search Result</p>
                   <button onClick={() => setApiWord(null)} className="text-muted-foreground hover:text-foreground text-xs font-black">Clear ✕</button>
                </div>
                <VocabCard word={apiWord} />
             </motion.div>
          )}

          {!showEmptyState && matchedWords.length > 0 && !apiWord && (
            <motion.div key="local-res" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-8 pb-10">
              <p className="px-2 text-primary font-black text-xs uppercase tracking-widest">Local Matches</p>
              {matchedWords.map((w, index) => <VocabCard key={index} word={w} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
