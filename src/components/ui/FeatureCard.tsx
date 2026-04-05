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
    <Link href={href} className="group">
      <Card 
        className={cn(
          "card-tactile bg-white hover:translate-y-[2px] active:translate-y-[6px] transition-all duration-150",
          className
        )}
        style={{ borderBottomColor: shadowColor }}
      >
        <CardContent className="p-6 flex items-center gap-6">
          <div className={cn(
            color,
            "text-white w-14 h-14 rounded-xl flex items-center justify-center shadow-tactile group-hover:scale-110 transition-transform"
          )}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-foreground">{title}</h3>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </CardContent>
      </Card>
    </Link>
  );
}
