'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Mic,
  Play,
  RotateCcw,
  LayoutGrid,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { grammarContents } from '@/data/contents';

export default function HomePage() {
  // 문법 컨텐츠에서 3개 추출
  const featuredGrammar = React.useMemo(() => {
    return grammarContents.slice(0, 3);
  }, []);

  // 추천 코스 데이터 - 문법 + 상황별 학습 섞어서 (서버/클라이언트 일치 위해 무작위 정렬 안함)
  const recommendedCourses = React.useMemo(() => {
    return [
      // 상황별 학습
      { 
        type: 'situation',
        id: 'cafe', 
        emoji: '☕', 
        label: 'Daily Life',
        title: '카페에서 주문하기', 
        desc: '자연스러운 주문 표현',
        href: '/categories',
        stats: '15개 단어'
      },
      { 
        type: 'situation', 
        id: 'travel', 
        emoji: '✈️', 
        label: 'Travel',
        title: '여행 필수 표현', 
        desc: '공항·호텔에서 자신있게',
        href: '/categories',
        stats: '20개 단어'
      },
      // 문법 학습
      ...featuredGrammar.map(g => ({
        type: 'grammar',
        id: g.id,
        emoji: g.difficulty === 'easy' ? '🟢' : g.difficulty === 'medium' ? '🟡' : '🔴',
        label: g.category,
        title: g.title,
        desc: g.explanation.slice(0, 30) + '...',
        href: `/grammar-learn?grammar=${g.id}`,
        stats: `${g.examples?.length || 3}개 예문`
      })),
      // 더 많은 상황별 학습
      { 
        type: 'situation', 
        id: 'shopping', 
        emoji: '🛍️', 
        label: 'Shopping',
        title: '쇼핑 필수 표현', 
        desc: '사이즈·가격·교환까지',
        href: '/categories',
        stats: '12개 단어'
      },
      { 
        type: 'situation', 
        id: 'smalltalk', 
        emoji: '💬', 
        label: 'Small Talk',
        title: '스몰토크 마스터', 
        desc: '어색함을 깨는 대화법',
        href: '/categories',
        stats: '18개 표현'
      },
    ];
  }, [featuredGrammar]);

  // 빠른 액션 카드
  const quickActions = [
    {
      href: '/learn',
      title: '오늘의 학습',
      subtitle: '10분만 투자하세요',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-white/20'
    },
    {
      href: '/categories',
      title: '상황별 학습',
      subtitle: '실제 상황 대비',
      icon: LayoutGrid,
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-white/20'
    },
    {
      href: '/vocab',
      title: '단어 복습',
      subtitle: '나만의 단어장',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-white/20'
    },
    {
      href: '/contents',
      title: '문법 정복',
      subtitle: '핵심 문법 학습',
      icon: GraduationCap,
      color: 'from-green-500 to-emerald-500',
      iconBg: 'bg-white/20'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] pb-32 pt-6 sm:pt-8 md:pt-10 lg:pt-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-7 sm:gap-8 md:gap-10 lg:gap-12">

        {/* 헤더 영역 */}
        <div className="flex flex-col gap-4 mt-2 sm:mt-4 md:mt-6">
          <div className="inline-flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-full mb-2 shadow-sm w-fit">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">
              LingoSnap
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--color-foreground)] tracking-tight mb-1 sm:mb-2 break-keep">
            반가워요! 👋
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--color-muted-foreground)] font-medium max-w-md md:max-w-lg break-keep">
            오늘도 영어를 정복해 볼까요? 조금씩 꾸준히 하는 게 가장 좋아요.
          </p>
        </div>

        {/* 메인 CTA */}
        <div>
          <Link href="/learn" className="block w-full group active:scale-[0.98] transition-transform duration-300">
            <div className="relative w-full bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-pink-600 rounded-[28px] sm:rounded-[32px] md:rounded-[40px] p-5 sm:p-7 md:p-10 lg:p-12 shadow-[0_8px_40px_rgba(255,56,92,0.25)] hover:shadow-[0_15px_50px_rgba(255,56,92,0.35)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-400 overflow-hidden isolate">
              {/* 배경 장식 요소 */}
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/20 rounded-full blur-2xl sm:blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 sm:w-48 h-40 sm:h-48 bg-black/10 rounded-full blur-xl sm:blur-2xl translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-lg sm:blur-xl -translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 lg:gap-12">
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-white/25 backdrop-blur-md rounded-full">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
                      오늘의 목표 · 10분
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-3 break-keep">
                      필수 표현 <br className="hidden sm:block" />
                      마스터하기
                    </h2>
                    <p className="text-white/85 text-sm sm:text-base md:text-lg font-medium max-w-xs sm:max-w-sm md:max-w-md break-keep">
                      오늘 배운 표현으로 자신감 있게 대화해보세요
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 lg:flex-col lg:gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-white rounded-[20px] sm:rounded-[24px] flex items-center justify-center shadow-xl sm:shadow-2xl group-hover:scale-105 sm:group-hover:scale-110 group-hover:rotate-3 sm:group-hover:rotate-6 transition-all duration-400">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 text-[var(--color-primary)] fill-[var(--color-primary)] ml-0.5 sm:ml-1" />
                  </div>
                  <div className="hidden lg:flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5 text-white/90 font-medium text-sm">
                      <span>시작하기</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 빠른 액션 그리드 */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-[var(--color-muted-foreground)] uppercase tracking-widest pl-1">
            빠른 시작
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="h-full">
                  <Link href={item.href} className="block h-full group active:scale-[0.96] transition-transform duration-300">
                    <div className={`h-full bg-gradient-to-br ${item.color} rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 overflow-hidden relative isolate`}>
                      {/* 배경 효과 */}
                      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/20 rounded-full blur-xl sm:blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:translate-x-1/4 transition-transform duration-500" />
                      
                      <div className="relative z-10 flex flex-col h-full justify-between gap-4 sm:gap-5">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${item.iconBg}`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-white/85 font-medium">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* 추천 코스 */}
        <div className="mt-1 sm:mt-2">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[var(--color-foreground)] tracking-tight flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]" />
              추천 코스
            </h2>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/contents" className="text-[var(--color-muted-foreground)] text-xs sm:text-sm font-bold flex items-center hover:text-[var(--color-primary)] transition-colors">
                문법
              </Link>
              <Link href="/categories" className="text-[var(--color-primary)] text-xs sm:text-sm font-bold flex items-center hover:underline gap-1">
                모두 보기 
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
          
          <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-3 sm:pb-4 -mx-1 px-1">
            {recommendedCourses.map((course) => (
              <Link 
                key={course.id} 
                href={course.href} 
                className="block min-w-[240px] sm:min-w-[280px] md:min-w-[320px] shrink-0 active:scale-[0.98] transition-transform duration-300"
              >
                <div className={`bg-[var(--color-surface)] border-2 transition-all duration-300 rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 group h-full ${
                  course.type === 'grammar' 
                    ? 'border-[var(--color-primary)]/30 hover:border-[var(--color-primary)]' 
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}>
                  <div className="flex flex-col h-full gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        course.type === 'grammar' 
                          ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30' 
                          : 'bg-[var(--color-muted)] border-[var(--color-border)]'
                      }`}>
                        <span className="text-2xl sm:text-3xl md:text-4xl">{course.emoji}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] sm:text-xs font-extrabold tracking-wider uppercase ${
                            course.type === 'grammar' ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'
                          }`}>
                            {course.type === 'grammar' ? '문법' : course.label}
                          </span>
                          {course.type === 'grammar' && (
                            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-primary)]" />
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-[var(--color-foreground)] truncate leading-tight">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] mb-2 sm:mb-3 line-clamp-2 break-keep">
                        {course.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-bold text-[var(--color-muted-foreground)] flex items-center gap-1">
                          <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {course.stats}
                        </span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--color-muted)] flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                          <ChevronRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                            course.type === 'grammar' ? 'text-[var(--color-primary)] group-hover:text-white' : 'text-[var(--color-muted-foreground)] group-hover:text-white'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
