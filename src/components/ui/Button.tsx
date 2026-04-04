'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base sm:text-lg font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white border-b-4 border-blue-700 hover:bg-blue-400 active:border-b-0 active:translate-y-1 shadow-sm",
        secondary: "bg-slate-100 text-slate-700 border-b-4 border-slate-300 hover:bg-slate-200 active:border-b-0 active:translate-y-1",
        outline: "border-2 border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 border-b-4 active:border-b-2 active:translate-y-[2px] text-slate-700",
        ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600 rounded-xl",
        danger: "bg-red-500 text-white border-b-4 border-red-700 hover:bg-red-400 active:border-b-0 active:translate-y-1",
        success: "bg-green-500 text-white border-b-4 border-green-700 hover:bg-green-400 active:border-b-0 active:translate-y-1",
      },
      size: {
        default: "h-14 px-6 py-2",
        sm: "h-10 rounded-xl px-4 text-sm border-b-2 active:border-b-0",
        lg: "h-16 rounded-2xl sm:rounded-3xl px-8 text-xl w-full",
        xl: "h-20 sm:h-24 rounded-3xl sm:rounded-[2rem] px-10 text-2xl w-full",
        icon: "h-14 w-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
