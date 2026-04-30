'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';

const buttonVariants = cva(
  // Base: always readable, clear interactive affordance
  "inline-flex items-center justify-center whitespace-nowrap font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-50 select-none transition-all duration-150 cursor-pointer rounded-xl",
  {
    variants: {
      variant: {
        // ── Filled / high-emphasis ──────────────────────────────────────────
        primary:
          "bg-primary text-white shadow-[0_2px_12px_rgba(99,102,241,0.4)] hover:bg-primary/90 hover:shadow-[0_4px_20px_rgba(99,102,241,0.5)] active:scale-[0.98] active:shadow-none",

        secondary:
          "bg-secondary text-white shadow-[0_2px_12px_rgba(139,92,246,0.35)] hover:bg-secondary/90 hover:shadow-[0_4px_20px_rgba(139,92,246,0.45)] active:scale-[0.98] active:shadow-none",

        danger:
          "bg-error text-white shadow-[0_2px_10px_rgba(239,68,68,0.35)] hover:bg-error/90 active:scale-[0.98]",

        success:
          "bg-success text-white shadow-[0_2px_10px_rgba(5,150,105,0.35)] hover:bg-success/90 active:scale-[0.98]",

        // ── Outlined / medium-emphasis ──────────────────────────────────────
        // Visible border + subtle bg — clearly a button on any background
        outline:
          "bg-white/90 dark:bg-white/10 text-foreground border-2 border-border hover:bg-primary/8 hover:border-primary/40 active:scale-[0.98] shadow-sm backdrop-blur",

        // ── Ghost / low-emphasis ────────────────────────────────────────────
        // Has a visible dashed border so it doesn't disappear against light bg
        ghost:
          "bg-white/60 dark:bg-white/5 text-foreground border border-dashed border-border/70 hover:bg-primary/8 hover:border-primary/40 hover:text-primary active:scale-[0.98] shadow-none",
      },
      size: {
        default: "h-11 sm:h-12 px-5 py-2 text-sm sm:text-base",
        sm:      "h-9 px-4 text-sm",
        lg:      "h-13 px-8 text-base sm:text-lg w-full",
        xl:      "h-14 sm:h-16 px-10 text-lg sm:text-xl w-full",
        icon:    "h-10 w-10",
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
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
