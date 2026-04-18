'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-foreground/20"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white p-8 pb-[calc(env(safe-area-inset-bottom)+2rem)] max-h-[85vh] flex flex-col border-t-8 border-black shadow-[0_-12px_0_0_#000]"
          >
            <div className="w-16 h-2 bg-border rounded-full mx-auto mb-6 shrink-0" />
            
            <div className="flex justify-between items-center mb-6 shrink-0">
              {title ? <h3 className="font-black text-4xl text-black font-cartoon uppercase tracking-tighter drop-shadow-[2px_2px_0_#fff]">{title}</h3> : <div />}
              <button
                onClick={onClose}
                className="p-3 bg-surface border-4 border-border rounded-xl text-foreground shadow-[2px_2px_0_#111] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto overscroll-contain flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
