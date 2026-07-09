'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { categories, grammarContents } from '@/data/contents';
import sentencesData from '@/data/sentences.json';
import { Sparkles, RotateCcw, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CommonMistake {
  wrong: string;
  correct: string;
  explanation: string;
}

interface SentenceItem {
  translation?: string;
  ko?: string;
  text?: string;
  en?: string;
  category?: string;
  distractors?: string[];
}

interface QuestionSource {
  category?: string;
  id?: string;
  title?: string;
}

interface Question {
  id: string;
  question: string;
  correctAnswers: string[];
  commonMistakes: CommonMistake[];
  source: QuestionSource;
  type: 'sentence' | 'grammar';
}

const normalizeText = (text: string): string => 
  text.toLowerCase().trim().replace(/[.,!?;:'"()]/g, '').replace(/\s+/g, ' ');

export default function WritingPracticePage() {
  const [mode, setMode] = useState<'sentence' | 'grammar'>('sentence');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<string | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'partial' | 'wrong' | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mistakeFound, setMistakeFound] = useState<CommonMistake | null>(null);
  
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 높이 조절
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 280)}px`;
    }
  };

  // Sentence Questions
  const sentenceQuestions = useMemo<Question[]>(() => {
    if (!Array.isArray(sentencesData)) return [];
    
    return sentencesData.map((s: SentenceItem, index: number) => ({
      id: `sent-${index}`,
      question: s.translation || s.ko || '',
      correctAnswers: [s.text || s.en || ''],
      commonMistakes: (s.distractors || []).map((d: string) => ({
        wrong: d,
        correct: s.text || s.en || '',
        explanation: "이 문장의 더 자연스러운 표현입니다."
      })),
      source: {
        category: s.category,
      },
      type: 'sentence' as const
    }));
  }, []);

  // Grammar Questions
  const grammarQuestions = useMemo<Question[]>(() => {
    const questions: Question[] = [];
    
    grammarContents.forEach(g => {
      g.examples.forEach((ex, idx) => {
        questions.push({
          id: `${g.id}-ex${idx}`,
          question: ex.ko,
          correctAnswers: [ex.en],
          commonMistakes: g.commonMistakes || [],
          source: {
            id: g.id,
            title: g.title,
            category: g.category,
          },
          type: 'grammar' as const
        });
      });
    });
    
    return questions;
  }, []);

  const filteredQuestions = useMemo<Question[]>(() => {
    let questions = mode === 'sentence' ? sentenceQuestions : grammarQuestions;

    if (mode === 'sentence' && selectedCategory) {
      const target = selectedCategory.toLowerCase();
      questions = questions.filter(q => {
        const cat = (q.source.category || '').toLowerCase();
        return cat.includes(target) || 
               (target === 'daily' && cat.includes('일상')) ||
               (target === 'business' && (cat.includes('비즈니스') || cat.includes('business')));
      });
    }

    if (mode === 'grammar' && selectedGrammar) {
      questions = questions.filter(q => q.source.id === selectedGrammar);
    }

    return questions;
  }, [mode, selectedCategory, selectedGrammar, sentenceQuestions, grammarQuestions]);

  const getNewQuestion = useCallback(() => {
    if (filteredQuestions.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const newQ = filteredQuestions[randomIndex];

    setCurrentQuestion(newQ);
    setUserInput('');
    setFeedback(null);
    setShowAnswer(false);
    setMistakeFound(null);
  }, [filteredQuestions]);

  const checkAnswer = () => {
    if (!currentQuestion || !userInput.trim()) return;

    const userNorm = normalizeText(userInput);
    const correctNorm = normalizeText(currentQuestion.correctAnswers[0]);

    const isCorrect = userNorm === correctNorm;

    let foundMistake: CommonMistake | null = null;
    if (currentQuestion.commonMistakes.length > 0) {
      for (const cm of currentQuestion.commonMistakes) {
        if (normalizeText(cm.wrong) === userNorm) {
          foundMistake = cm;
          break;
        }
      }
    }

    setMistakeFound(foundMistake);
    setTotalAttempts(prev => prev + 1);

    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 10);
    } else if (foundMistake) {
      setFeedback('wrong');
    } else {
      setFeedback('partial');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // 입력 시 자동 높이 조절
  useEffect(() => {
    adjustTextareaHeight();
  }, [userInput]);

  useEffect(() => {
    if (currentQuestion) {
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) textarea.focus();
      }, 100);
    }
  }, [currentQuestion]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24 pt-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tighter">문장 작문 연습</h1>
          <p className="text-muted-foreground mt-2">한국어 생각을 자연스러운 영어로 표현해보세요</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-2xl w-fit">
          <button
            onClick={() => { 
              setMode('sentence'); 
              setSelectedCategory(null); 
              setCurrentQuestion(null); 
            }}
            className={cn(
              "px-6 py-2.5 rounded-xl font-semibold transition-all",
              mode === 'sentence' ? "bg-background shadow" : "hover:bg-background/50"
            )}
          >
            상황별 연습
          </button>
          <button
            onClick={() => { 
              setMode('grammar'); 
              setSelectedGrammar(null); 
              setCurrentQuestion(null); 
            }}
            className={cn(
              "px-6 py-2.5 rounded-xl font-semibold transition-all",
              mode === 'grammar' ? "bg-background shadow" : "hover:bg-background/50"
            )}
          >
            문법 패턴 연습
          </button>
        </div>

        {/* Category Selection */}
        {mode === 'sentence' && (
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  selectedCategory === cat.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "border-border hover:border-primary/50"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Grammar Selection */}
        {mode === 'grammar' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {grammarContents.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGrammar(selectedGrammar === g.id ? null : g.id)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all hover:border-primary",
                  selectedGrammar === g.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "border-border"
                )}
              >
                <div className="font-semibold">{g.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{g.category}</div>
              </button>
            ))}
          </div>
        )}

        {/* Main Question Area */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8">
          {!currentQuestion ? (
            <button
              onClick={getNewQuestion}
              className="w-full py-12 rounded-2xl bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-6 h-6" />
              문제 시작하기
            </button>
          ) : (
            <div className="space-y-8">
              <div>
                <div className="uppercase text-xs tracking-widest text-muted-foreground mb-2">
                  {currentQuestion.type === 'sentence' ? '상황' : '문법'} 문제
                </div>
                <p className="text-2xl md:text-3xl font-semibold leading-tight">
                  {currentQuestion.question}
                </p>
              </div>

              {/* 자동 높이 조절 Textarea */}
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="영어로 작성해보세요..."
                className="w-full min-h-[120px] p-5 text-lg rounded-2xl border bg-background focus:ring-2 focus:ring-primary/30 resize-none font-medium overflow-hidden"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    checkAnswer();
                  }
                }}
              />

              <div className="flex gap-3">
                <button
                  onClick={checkAnswer}
                  disabled={!userInput.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-white font-bold py-4 rounded-2xl transition-all"
                >
                  답변 확인하기
                </button>
                
                <button
                  onClick={getNewQuestion}
                  className="px-6 border border-border hover:bg-muted rounded-2xl transition-all"
                  title="새 문제"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="pt-6 border-t border-border space-y-6">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "font-bold text-lg",
                      feedback === 'correct' && "text-green-600",
                      feedback === 'partial' && "text-amber-600",
                      feedback === 'wrong' && "text-red-600"
                    )}>
                      {feedback === 'correct' && "🎉 완벽합니다!"}
                      {feedback === 'partial' && "👍 거의 맞았어요!"}
                      {feedback === 'wrong' && "다시 도전해보세요"}
                    </span>
                    
                    <button 
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {showAnswer ? "정답 숨기기" : "정답 보기"}
                    </button>
                  </div>

                  {showAnswer && (
                    <div className="bg-muted/50 p-5 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">정답</span>
                        <button 
                          onClick={() => speak(currentQuestion.correctAnswers[0])} 
                          className="text-primary hover:text-primary/80"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xl font-semibold text-primary">
                        {currentQuestion.correctAnswers[0]}
                      </p>
                    </div>
                  )}

                  {mistakeFound && (
                    <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
                      <p className="font-medium text-amber-800">자주 하는 실수입니다</p>
                      <p className="line-through text-amber-700 mt-2">{mistakeFound.wrong}</p>
                      <p className="text-emerald-700 font-medium mt-1">{mistakeFound.correct}</p>
                      <p className="text-sm text-amber-600 mt-3">{mistakeFound.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {totalAttempts > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            현재 점수: {score}점 • {totalAttempts}문제 시도
          </div>
        )}
      </div>
    </div>
  );
}