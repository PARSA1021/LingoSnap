'use client';

import * as React from 'react';
import { Word } from '@/types';
import { VocabCard } from '@/components/vocab/VocabCard';
import { Button } from '@/components/ui/Button';
import { Search, Loader2, Sparkles, Star, History, ArrowRight, BookOpen, X, Filter, Grid3x3, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/store/useLearningStore';
import vocabData from '@/data/vocabulary.json';
import { getNormalizedWordData } from '@/lib/dictionary';
import { cn } from '@/lib/utils/cn';

// 랜덤 요소 추출 함수
const getRandomElements = (arr: any[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 헬퍼 컴포넌트: 데이터가 없는 상태 표시
function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="p-12 bg-white border-8 border-black shadow-[12px_12px_0_#000] w-full flex flex-col items-center justify-center text-center wobbly-slow">
      <div className="mb-4 text-black">{icon}</div>
      <p className="text-xl font-black text-black uppercase tracking-[0.2em] font-cartoon">{text}</p>
    </div>
  );
}

type ViewMode = 'grid' | 'list';

export default function VocabSearchPage() {
  const [query, setQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [apiWord, setApiWord] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showCategoryFilter, setShowCategoryFilter] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');

  const addRecentSearch = useLearningStore(state => state.addRecentSearch);
  const recentSearches = useLearningStore(state => state.recentSearches);
  const favorites = useLearningStore(state => state.favorites);

  // 1. 데이터 가공 로직: 중복 제거 및 예시 통합
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

  // 2. 카테고리 통계 계산
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
    setRecommendedWords(getRandomElements(processedCards, 6));
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

  // 5. 온라인 사전 검색 핸들러
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setApiWord(null);
    try {
      const data = await getNormalizedWordData(query);
      if (data) {
        setApiWord(data);
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

  // 즐겨찾기 필터링
  const favoriteWords = React.useMemo(() => {
    if (favorites.length === 0) return [];
    return processedCards.filter(w => 
      favorites.some(fav => fav.word.toLowerCase() === w.word.toLowerCase())
    );
  }, [favorites, processedCards]);

  return (
    <div className="flex-1 w-full min-h-screen bg-background dot-pattern pb-6 sm:pb-24 pt-4 sm:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">

        {/* Header - Premium Navigation */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md pt-4 pb-2 px-1">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center text-white border-4 border-black shadow-[3px_3px_0_#000] rotate-3 shrink-0">
                <BookOpen className="w-5 h-5 fill-white" />
              </div>
              <h1 className="text-2xl font-black text-black font-cartoon uppercase tracking-tighter">ARCHIVE</h1>
            </div>
          </div>

          {/* Search Integration */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input
              type="text"
              placeholder="Search expressions..."
              className="w-full h-12 pl-10 pr-10 bg-white border-4 border-black text-black font-black outline-none shadow-[4px_4px_0_#000] focus:shadow-none focus:translate-y-1 focus:translate-x-1 transition-all placeholder:text-black/20 font-cartoon text-sm"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value.toUpperCase());
                setApiWord(null);
              }}
            />
            {query && (
              <button 
                onClick={() => { setQuery(''); setApiWord(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-black/5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Genre Scroller - Mobile Optimized */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 mask-fade-right">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "px-4 py-2 border-4 border-black font-black text-[10px] whitespace-nowrap transition-all uppercase font-cartoon",
                !activeCategory ? "bg-primary text-white shadow-[3px_3px_0_#000]" : "bg-white text-black"
              )}
            >
              # ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 border-4 border-black font-black text-[10px] whitespace-nowrap transition-all uppercase font-cartoon",
                  activeCategory === cat ? "bg-primary text-white shadow-[3px_3px_0_#000]" : "bg-white text-black shadow-[2px_2px_0_#000]"
                )}
              >
                # {cat}
              </button>
            ))}
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <div className="space-y-8 sm:space-y-12">
          
          {/* 초기 상태: 대시보드 */}
          {!query && !activeCategory && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 sm:space-y-12">
              
              {/* 즐겨찾기 & 최근검색 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* 즐겨찾기 섹션 */}
                <section className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-warning fill-warning" />
                    <h2 className="font-black text-lg sm:text-xl tracking-tight">즐겨찾기</h2>
                    <span className="text-xs font-bold text-muted-foreground">({favorites.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favoriteWords.length > 0 ? favoriteWords.slice(0, 8).map((w, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(w.word)}
                        className="px-3 sm:px-4 py-2 sm:py-3 bg-white card-tactile border-b-warning rounded-xl text-xs sm:text-sm font-bold active:translate-y-1 transition-all"
                      >
                        {w.word}
                      </button>
                    )) : (
                      <EmptyState icon={<Star className="w-6 h-6 text-muted-foreground/20" />} text="즐겨찾는 단어가 없습니다." />
                    )}
                  </div>
                </section>

                {/* 최근 검색 섹션 */}
                <section className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <h2 className="font-black text-lg sm:text-xl tracking-tight">최근 조회</h2>
                    <span className="text-xs font-bold text-muted-foreground">({recentSearches.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.length > 0 ? recentSearches.slice(0, 8).map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(s)}
                        className="px-3 sm:px-4 py-2 sm:py-3 bg-white card-tactile border-b-primary rounded-xl text-xs sm:text-sm font-bold active:translate-y-1 transition-all text-muted-foreground hover:text-primary"
                      >
                        {s}
                      </button>
                    )) : (
                      <EmptyState icon={<History className="w-6 h-6 text-muted-foreground/20" />} text="최근 기록이 없습니다." />
                    )}
                  </div>
                </section>
              </div>

              {/* 오늘의 추천 표현 - 반응형 그리드 */}
              <section className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-2 px-1">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <h2 className="font-black text-lg sm:text-xl tracking-tight">오늘의 추천 표현</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {recommendedWords.map((word, i) => (
                    <motion.div
                      key={word.word + i}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.97 }}
                      className="card-tactile p-4 sm:p-6 bg-white cursor-pointer transition-all group border-b-primary-shadow rounded-2xl"
                      onClick={() => setQuery(word.word)}
                    >
                      <p className="font-black text-base sm:text-lg text-primary group-hover:scale-105 transition-transform origin-left">{word.word}</p>
                      <p className="text-xs sm:text-sm font-bold text-muted-foreground mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed">{word.meaning}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* 검색 결과 영역 */}
          {(query || activeCategory) && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center px-2">
                <p className="font-black text-xs sm:text-sm text-primary uppercase tracking-widest">
                  {activeCategory ? `#${activeCategory}` : 'SEARCH'} ({matchedWords.length + (apiWord ? 1 : 0)})
                </p>
                <button
                  onClick={() => { setQuery(''); setActiveCategory(null); setApiWord(null); }}
                  className="text-xs font-black text-muted-foreground hover:text-foreground underline underline-offset-4 p-2"
                >
                  초기화
                </button>
              </div>

              {/* 결과 그리드 - 반응형 */}
              <div className={cn(
                "grid gap-4 sm:gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-1 lg:grid-cols-2" 
                  : "grid-cols-1"
              )}>
                <AnimatePresence mode="popLayout">
                  {/* API 검색 결과 */}
                  {apiWord && (
                    <motion.div 
                      key="api" 
                      layout 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className={viewMode === 'grid' ? "lg:col-span-2" : ""}
                    >
                      <VocabCard word={apiWord} />
                    </motion.div>
                  )}
                  {/* 내부 데이터 검색 결과 */}
                  {matchedWords.map((w, idx) => (
                    <motion.div 
                      key={w.word + idx} 
                      layout 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <VocabCard word={w} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 로딩 상태 */}
                {loading && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24 bg-surface/50 rounded-2xl sm:rounded-[3rem] border-2 border-dashed border-border/50">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-spin mb-3 sm:mb-4" />
                    <p className="font-black text-base sm:text-lg text-primary animate-pulse">사전 데이터를 가져오는 중...</p>
                  </div>
                )}

                {/* 결과 없음 */}
                {matchedWords.length === 0 && !apiWord && !loading && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="col-span-full flex flex-col items-center justify-center text-center py-12 sm:py-16 bg-white card-tactile border-b-border px-6 sm:px-8 rounded-2xl sm:rounded-[2.5rem]"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                      <Search className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3">단어를 찾을 수 없습니다.</h3>
                    <p className="text-muted-foreground font-bold mb-8 sm:mb-10 max-w-xs text-sm sm:text-base leading-snug">
                      수집함에 없는 표현인가요? <br/>온라인 사전에서 검색해볼 수 있습니다.
                    </p>
                    <Button 
                      onClick={handleSearch} 
                      disabled={loading} 
                      className="h-12 sm:h-16 rounded-xl sm:rounded-[2rem] font-black px-8 sm:px-10 text-base sm:text-xl w-full sm:w-auto shadow-tactile active:translate-y-1"
                    >
                      온라인 사전 검색 <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
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