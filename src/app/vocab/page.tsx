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

        {/* 헤더 */}
        <header className="sticky top-2 sm:top-6 z-40 space-y-6 bg-white p-6 sm:p-10 border-8 border-black shadow-[12px_12px_0_#000] wobbly-slow">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary flex items-center justify-center text-white border-8 border-black shadow-[4px_4px_0_#000] shrink-0 wobbly">
                <BookOpen className="w-6 h-6 sm:w-10 sm:h-10 fill-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-5xl font-black tracking-tighter leading-tight drop-shadow-[4px_4px_0_#000] text-black font-cartoon uppercase truncate">Arcade</h1>
                <p className="text-[8px] sm:text-xs font-black text-primary uppercase tracking-[0.2em] mt-0.5 sm:mt-1 truncate">
                  Total {processedCards.length} Cards
                </p>
              </div>
            </div>

            {/* 뷰 모드 토글 - 태블릿 이상에서만 표시 */}
            {(query || activeCategory) && (
              <div className="hidden sm:flex items-center gap-2 bg-white rounded-xl p-1 border-2 border-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === 'grid' ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === 'list' ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 검색바 */}
          <div className="relative group">
            <div className="relative flex-1">
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-12 lg:h-20 pl-12 pr-10 bg-white text-black font-black border-4 sm:border-8 border-black outline-none text-base lg:text-2xl focus:border-primary transition-all shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000] focus:translate-y-1 focus:translate-x-1 focus:shadow-none placeholder:text-black/30 font-cartoon"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value.toUpperCase());
                  setApiWord(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (query && !apiWord) {
                      // If local match exists, it's already shown in grid, but if user specifically hits enter,
                      // we can still optionally search API if they force it, but generally if no local match, definitely search.
                      if (matchedWords.length === 0) {
                        handleSearch();
                      }
                    }
                  }
                }}
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setApiWord(null); }}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-muted rounded-full text-muted-foreground active:scale-90 transition-transform"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 카테고리 필터 - 반응형 */}
          <div className="space-y-3">
            {/* 모바일: 필터 버튼 */}
            <div className="sm:hidden">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 bg-white border-4 border-black shadow-[4px_4px_0_#000] font-black text-xs transition-all",
                  activeCategory ? "bg-primary text-white" : "text-black/60"
                )}
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {activeCategory || 'ALL GENRES'}
                </span>
              </button>
            </div>

            {/* 모바일: 카테고리 드롭다운 */}
            <AnimatePresence>
              {showCategoryFilter && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="sm:hidden overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 p-2 bg-white border-4 border-black">
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        setShowCategoryFilter(false);
                      }}
                      className={cn(
                        "px-3 py-2 border-2 border-black font-black text-[10px] transition-all",
                        !activeCategory ? "bg-primary text-white" : "bg-white text-black"
                      )}
                    >
                      ALL
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setShowCategoryFilter(false);
                        }}
                        className={cn(
                          "px-3 py-2 border-2 border-black font-black text-[10px] transition-all",
                          activeCategory === cat ? "bg-primary text-white" : "bg-white text-black"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 태블릿 이상: 가로 스크롤 */}
            <div className="hidden sm:flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "px-4 py-2 border-4 border-black font-black text-xs whitespace-nowrap transition-all active:scale-95 shadow-[3px_3px_0_#000]",
                  !activeCategory ? "bg-primary text-white" : "bg-white text-black"
                )}
              >
                ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 border-4 border-black font-black text-xs whitespace-nowrap transition-all active:scale-95 shadow-[3px_3px_0_#000]",
                    activeCategory === cat ? "bg-primary text-white" : "bg-white text-black"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
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