'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from './Card';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FeatureCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  shadowColor?: string;
  className?: string;
}

export function FeatureCard({ href, icon, title, color, shadowColor, className }: FeatureCardProps) {
  return (
    <Link href={href} className="block group h-full">
      <div className={cn(
        "h-full p-4 sm:p-6 border-4 sm:border-8 border-black transition-all duration-300 wobbly-slow hover:-translate-y-1 hover:-translate-x-1",
        color === 'bg-info' ? 'bg-secondary' : 'bg-success',
        "shadow-[6px_6px_0_#000] sm:shadow-[10px_10px_0_#000] hover:shadow-[8px_8px_0_#000] sm:hover:shadow-[14px_14px_0_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
      )}>
        <div className="flex flex-col gap-3 sm:gap-4 text-white items-center sm:items-start">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center border-2 sm:border-4 border-black shadow-[3px_3px_0_#000] group-hover:scale-110 transition-transform">
             <div className="text-black scale-75 sm:scale-100">{icon}</div>
          </div>
          <h2 className="text-xl sm:text-3xl font-black drop-shadow-[2px_2px_0_#000] sm:drop-shadow-[4px_4px_0_#000] tracking-tight uppercase font-cartoon">{title}</h2>
        </div>
      </div>
    </Link>
  );
}
