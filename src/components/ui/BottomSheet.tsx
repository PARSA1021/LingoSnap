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
            className="fixed inset-0 z-[60] bg-background/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-surface rounded-t-3xl shadow-elevated p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] max-h-[85vh] flex flex-col border-t border-border"
          >
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 shrink-0" />
            
            <div className="flex justify-between items-center mb-6 shrink-0">
              {title ? <h3 className="font-extrabold text-2xl text-foreground">{title}</h3> : <div />}
              <button
                onClick={onClose}
                className="p-2 bg-muted rounded-full text-muted-foreground hover:bg-border active:scale-95 transition-all outline-none touch-manipulation"
              >
                <X className="w-5 h-5" />
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
