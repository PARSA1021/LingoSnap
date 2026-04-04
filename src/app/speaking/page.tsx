'use client';

import * as React from 'react';
import { SpeakingPractice } from '@/components/speaking/SpeakingPractice';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import sentencesData from '@/data/sentences.json';

export default function SpeakingPage() {
  const [index, setIndex] = React.useState(0);
  
  // Create a randomized array of sentences on mount to ensure fresh sessions
  const [shuffledSentences, setShuffledSentences] = React.useState<any[]>([]);

  React.useEffect(() => {
    setShuffledSentences([...sentencesData].sort(() => 0.5 - Math.random()));
  }, []);

  const handleContinue = () => {
    // Navigate completely through the randomized offline JSON block securely
    if (shuffledSentences.length > 0) {
      setIndex((prev) => (prev + 1) % shuffledSentences.length);
    }
  };

  if (shuffledSentences.length === 0) return null;

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col max-w-2xl mx-auto w-full space-y-8 mt-4 md:mt-10 overflow-hidden">
      <div className="flex flex-col gap-6">
        <Link href="/" className="inline-flex w-fit">
          <Button variant="ghost" size="sm" className="pl-0 text-slate-500">
            <ArrowLeft className="w-5 h-5 mr-1" /> 홈으로 가기
          </Button>
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">말하기 연습</h1>
          <p className="text-slate-500">주어진 문장을 소리 내어 읽고 발음 피드백을 받아보세요.</p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 pb-12 w-full">
        <SpeakingPractice 
          key={index}
          expectedSentence={shuffledSentences[index].text} 
          onContinue={handleContinue} 
        />
      </div>
    </div>
  );
}
