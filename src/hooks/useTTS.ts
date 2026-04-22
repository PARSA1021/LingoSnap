'use client';

import { useState, useCallback, useEffect } from 'react';
import { ttsManager, TTSOptions } from '@/lib/tts';

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playFallback = useCallback((text: string, options: TTSOptions = {}) => {
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
    
    audio.onplay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      options.onStart?.();
    };
    
    audio.onended = () => {
      setIsPlaying(false);
      options.onEnd?.();
    };
    
    audio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setError('Fallback TTS Error');
      options.onError?.('Fallback Error');
    };

    audio.play().catch(err => {
      setIsLoading(false);
      setError('Audio Playback Refused');
      console.error('[TTS Fallback] Play Error:', err);
    });
  }, []);

  const speak = useCallback((text: string, options: TTSOptions = {}) => {
    if (!ttsManager && !text) return;

    setError(null);
    setIsLoading(true);

    if (!ttsManager) {
      playFallback(text, options);
      return;
    }

    // Initial unlock on any speak call (if not already done)
    ttsManager.unlock();

    ttsManager.speak(text, {
      ...options,
      onStart: () => {
        setIsLoading(false);
        setIsPlaying(true);
        options.onStart?.();
      },
      onEnd: () => {
        setIsPlaying(false);
        options.onEnd?.();
      },
      onError: (err) => {
        // AUTOMATIC FALLBACK ON ERROR
        console.warn('[TTS] Web Speech API failed, trying fallback...', err);
        playFallback(text, options);
      },
    });
  }, [playFallback]);

  const stop = useCallback(() => {
    if (ttsManager) {
      ttsManager.cancel();
      setIsPlaying(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ttsManager) {
        ttsManager.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
    error,
    isSupported: !!ttsManager,
  };
}
