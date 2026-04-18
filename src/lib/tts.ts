'use client';

/**
 * Master Stability TTS Utility
 * optimized for macOS Safari/Chrome.
 */

let isInitialized = false;

const initializeEngine = () => {
  if (isInitialized) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Priming the engine with a silent utterance to 'unlock' it
  const prime = new SpeechSynthesisUtterance('');
  prime.volume = 0;
  window.speechSynthesis.speak(prime);
  isInitialized = true;
  console.log('TTS Engine Primed');
};

export const speak = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Initialize if first run
  if (!isInitialized) initializeEngine();

  // Cancel previous to cut off current speech
  window.speechSynthesis.cancel();

  // Create new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Safari/Chrome Fix: Some versions need a tiny delay after cancel() before speak()
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
    
    // Resume in case the engine is stuck (Chrome specific)
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, 50);
};

export const playTTS = speak;
