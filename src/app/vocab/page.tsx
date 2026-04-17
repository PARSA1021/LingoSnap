'use client';

import * as React from 'react';
import { Word } from '@/types';
import { VocabCard } from '@/components/vocab/VocabCard';
import { Button } from '@/components/ui/Button';
import { Search, Loader2, Sparkles, Star, History, ArrowRight, BookOpen, RefreshCw, X } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [apiWord, setApiWord] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const addRecentSearch = useLearningStore(state => state.addRecentSearch);
  const recentSearches = useLearningStore(state => state.recentSearches);
  const favorites = useLearningStore(state => state.favorites);

  // 1. [로직 수정] 중복 데이터를 합쳐 '학습 카드' 개수를 정확히 계산
  const processedCards = React.useMemo(() => {
    const map = new Map();
    vocabData.forEach((item: any) => {
      const key = item.word.toLowerCase().trim();
      const existing = map.get(key);
      const currentExamples = item.examples || [{ text: item.example, translation: item.exampleTranslation }];

      if (existing) {
        currentExamples.forEach((ex: any) => {
          if (ex.text && !existing.examples.some((e: any) => e.text === ex.text)) {
            existing.examples.push(ex);
          }
        });
      } else {
        map.set(key, {
          ...item,
          category: item.category || '기타',
          examples: currentExamples.filter((ex: any) => ex.text)
        });
      }
    });
    return Array.from(map.values());
  }, []);

  // 2. [통계 수정] 카테고리별 개수 계산
  const categoryStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    processedCards.forEach(card => {
      const cat = card.category || '기타';
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return stats;
  }, [processedCards]);

  const categories = Object.keys(categoryStats).sort();

  // 3. 추천 단어 관리
  const [recommendedWords, setRecommendedWords] = React.useState<any[]>([]);
  React.useEffect(() => {
    setRecommendedWords(getRandomElements(processedCards, 3));
  }, [processedCards]);

  // 4. 필터링 로직
  const matchedWords = React.useMemo(() => {
    return processedCards.filter(w => {
      const matchesQuery = query === '' ||
        w.word.toLowerCase().includes(query.toLowerCase()) ||
        (w.meaning && w.meaning.includes(query));
      const matchesCategory = !activeCategory || w.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory, processedCards]);

  // 사전 검색 핸들러 (TypeScript 에러 해결)
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setApiWord(null);
    try {
      const data = await getNormalizedWordData(query);
      if (data) {
        setApiWord(data);
        // 에러 해결: string 하나만 전달
        addRecentSearch(data.word);
      } else {
        setError('단어를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-background dot-pattern pb-20 pt-4 sm:pt-8">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">

        {/* 기존 헤더 디자인 복구 */}
        <header className="sticky top-4 sm:top-6 z-40 space-y-6 bg-surface/80 p-6 sm:p-8 rounded-[2rem] card-tactile border-b-border shadow-md backdrop-blur-xl transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-tight">표현 수집함</h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                총 {processedCards.length}개의 고유 표현
              </p>
            </div>
          </div>

          {/* 향상된 검색바 스타일 */}
          <div className="relative flex items-center group">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="표현이나 뜻 검색 (자동 필터링)..."
                className="w-full h-16 pl-14 pr-12 bg-white border-2 border-border rounded-2xl outline-none font-bold text-lg focus:border-primary transition-all shadow-tactile focus:shadow-none"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setApiWord(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query && matchedWords.length === 0 && !apiWord) {
                    handleSearch();
                  }
                }}
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setApiWord(null); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-all font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 카테고리 칩 (수치 포함) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "btn-tactile px-5 py-2.5 rounded-xl font-black text-sm whitespace-nowrap transition-all",
                !activeCategory ? "bg-primary text-white border-primary border-b-primary-shadow hover:translate-y-[2px]" : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary hover:translate-y-[2px]"
              )}
            >
              전체 ({processedCards.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "btn-tactile px-5 py-2.5 rounded-xl font-black text-sm whitespace-nowrap transition-all",
                  activeCategory === cat ? "bg-primary text-white border-primary border-b-primary-shadow hover:translate-y-[2px]" : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary hover:translate-y-[2px]"
                )}
              >
                {cat} ({categoryStats[cat]})
              </button>
            ))}
          </div>
        </header>

        {/* 기존 결과 영역 구조 복구 */}
        <div className="space-y-10">
          {!query && !activeCategory && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              
              {/* 즐겨찾기 & 최근검색 대시보드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 즐겨찾기 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <Star className="w-5 h-5 text-warning fill-warning" />
                    <h2 className="font-black text-xl tracking-tight text-foreground">즐겨찾기</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favorites.length > 0 ? favorites.slice(0, 5).map((w, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(w.word)}
                        className="px-4 py-2.5 bg-white card-tactile border-b-warning hover:border-warning/50 text-sm font-bold text-foreground hover:text-warning transition-all active:translate-y-[4px] active:border-b-0"
                      >
                         {w.word}
                      </button>
                    )) : (
                      <div className="p-4 bg-muted/30 rounded-2xl border-2 border-dashed border-border w-full flex flex-col items-center justify-center text-center">
                        <Star className="w-6 h-6 text-muted-foreground/30 mb-2" />
                        <p className="text-sm font-bold text-muted-foreground">즐겨찾는 단어가 없습니다.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 최근 검색 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <History className="w-5 h-5 text-primary" />
                    <h2 className="font-black text-xl tracking-tight text-foreground">최근 조회</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.length > 0 ? recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(s)}
                        className="px-4 py-2.5 bg-white card-tactile border-b-primary hover:border-primary/50 text-sm font-bold text-muted-foreground hover:text-primary transition-all active:translate-y-[4px] active:border-b-0"
                      >
                        {s}
                      </button>
                    )) : (
                      <div className="p-4 bg-muted/30 rounded-2xl border-2 border-dashed border-border w-full flex flex-col items-center justify-center text-center">
                        <History className="w-6 h-6 text-muted-foreground/30 mb-2" />
                        <p className="text-sm font-bold text-muted-foreground">최근 조회 기록이 없습니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 오늘의 추천 표현 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="font-black text-xl tracking-tight text-foreground">오늘의 추천 표현</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedWords.map((word, i) => (
                    <div
                      key={word.word + i}
                      className="card-tactile p-6 bg-white hover:translate-y-[2px] active:translate-y-[6px] cursor-pointer transition-all group border-b-primary-shadow"
                      onClick={() => setQuery(word.word)}
                    >
                      <p className="font-black text-lg text-primary group-hover:scale-105 transition-transform inline-block transform-origin-left">{word.word}</p>
                      <p className="text-sm font-bold text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{word.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {(query || activeCategory) && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <p className="font-black text-sm text-primary uppercase tracking-widest">
                  {activeCategory ? `#${activeCategory} 결과` : '검색 결과'} ({matchedWords.length + (apiWord ? 1 : 0)})
                </p>
                <button
                  onClick={() => { setQuery(''); setActiveCategory(null); setApiWord(null); }}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  지우기
                </button>
              </div>

              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {apiWord && (
                    <motion.div key="api" layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <VocabCard word={apiWord} />
                    </motion.div>
                  )}
                  {matchedWords.map((w, idx) => (
                    <motion.div key={w.word + idx} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <VocabCard word={w} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <div className="flex flex-col items-center justify-center py-20 bg-surface/50 rounded-3xl h-[300px]">
                    <Loader2 className="w-14 h-14 text-primary animate-spin mb-6" />
                    <p className="font-black text-lg text-primary animate-pulse tracking-tight">온라인 사전 탐색 중...</p>
                  </div>
                )}

                {matchedWords.length === 0 && !apiWord && !loading && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-16 bg-white card-tactile border-b-border px-6 mt-4">
                    <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner">
                      <Search className="w-12 h-12 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground tracking-tighter mb-3">수집함에 없는 표현입니다.</h3>
                    <p className="text-muted-foreground font-bold mb-10 max-w-sm text-lg leading-snug break-keep">
                      찾으시는 뜻이 없나요? 온라인 API를 통해 새로운 단어의 뜻을 탐색해보세요.
                    </p>
                    <Button onClick={handleSearch} disabled={loading} className="h-16 rounded-3xl font-black px-10 text-xl w-full sm:w-auto shadow-tactile hover:-translate-y-1 active:translate-y-1">
                       온라인 사전에서 찾아보기 <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}