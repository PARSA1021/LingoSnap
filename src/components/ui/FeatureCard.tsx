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
        "h-full p-8 border-8 border-black transition-all duration-300 wobbly-slow hover:-translate-y-2 hover:-translate-x-2",
        color === 'bg-info' ? 'bg-secondary' : 'bg-success',
        "shadow-[10px_10px_0_#000] hover:shadow-[14px_14px_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
      )}>
        <div className="flex flex-col gap-4 text-white">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-black shadow-[4px_4px_0_#000] group-hover:scale-110 transition-transform">
             <div className="text-black">{icon}</div>
          </div>
          <h2 className="text-4xl font-black drop-shadow-[4px_4px_0_#000] tracking-tight">{title}</h2>
        </div>
      </div>
    </Link>
  );
}
