'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap btn-tactile text-base sm:text-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-border disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground wobbly",
        secondary: "bg-secondary text-secondary-foreground wobbly-slow hover:bg-secondary/90",
        outline: "bg-surface text-black hover:bg-muted",
        ghost: "bg-transparent text-black border-transparent shadow-none translate-y-0 hover:bg-muted",
        danger: "bg-error text-error-foreground wobbly",
        success: "bg-success text-success-foreground wobbly",
      },
      size: {
        default: "h-14 px-6 py-2",
        sm: "h-10 px-4 text-sm",
        lg: "h-16 px-8 text-xl w-full",
        xl: "h-20 sm:h-24 px-10 text-2xl w-full",
        icon: "h-14 w-14",
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
