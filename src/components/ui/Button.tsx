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
 "bg-[var(--color-primary)] text-white shadow-[0_4px_14px_rgba(255,56,92,0.3)] hover:bg-[var(--color-primary-light)] hover:shadow-[0_6px_20px_rgba(255,56,92,0.4)] active:scale-[0.98] active:shadow-none",

 secondary:
 "bg-[var(--color-secondary)] text-white shadow-[0_4px_14px_rgba(0,166,153,0.3)] hover:bg-[#00B8A9] hover:shadow-[0_6px_20px_rgba(0,166,153,0.4)] active:scale-[0.98] active:shadow-none",

 danger:
 "bg-[var(--color-error)] text-white shadow-[0_4px_14px_rgba(226,28,61,0.3)] hover:bg-[#F02849] active:scale-[0.98]",

 success:
 "bg-[var(--color-success)] text-white shadow-[0_4px_14px_rgba(0,166,153,0.3)] hover:bg-[#00B8A9] active:scale-[0.98]",

 // ── Outlined / medium-emphasis ──────────────────────────────────────
 // Visible border + subtle bg — clearly a button on any background
 outline:
 "bg-[var(--color-surface)] text-[var(--color-foreground)] border-2 border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] active:scale-[0.98] shadow-sm",

 // ── Ghost / low-emphasis ────────────────────────────────────────────
 // Has a visible dashed border so it doesn't disappear against light bg
 ghost:
 "bg-transparent text-[var(--color-foreground)] border border-dashed border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-primary)] active:scale-[0.98] shadow-none",
 },
 size: {
 default: "h-11 sm:h-12 px-5 py-2 text-sm sm:text-base",
 sm: "h-9 px-4 text-sm",
 lg: "h-13 px-8 text-base sm:text-lg w-full",
 xl: "h-14 sm:h-16 px-10 text-lg sm:text-xl w-full",
 icon: "h-10 w-10",
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
