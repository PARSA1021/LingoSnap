'use client';

/**
 * Master Stability TTS Utility
 * optimized for macOS Safari/Chrome.
 */

let isInitialized = false;
let voiceCache: SpeechSynthesisVoice | null = null;
let voicesReady = false;
let lastSpokenAt = 0;

const initializeEngine = () => {
  if (isInitialized) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Some browsers load voices asynchronously
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    voicesReady = voices.length > 0;
    if (!voiceCache && voicesReady) {
      voiceCache = getNaturalVoice() ?? null;
    }
  };

  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);

  // Priming the engine with a silent utterance to 'unlock' it
  const prime = new SpeechSynthesisUtterance('');
  prime.volume = 0;
  window.speechSynthesis.speak(prime);
  isInitialized = true;
};

const getNaturalVoice = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  
  // Preferred voices in order of quality/naturalness
  const preferred = [
    'Google US English', 
    'Samantha',
    'Karen',
    'Daniel',
    'Microsoft David'
  ];
  
  for (const name of preferred) {
    const voice = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
    if (voice) return voice;
  }
  
  // Fallback to any en-US voice
  return voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
};

export const canSpeak = () => {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
};

export const speak = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Initialize if first run
  if (!isInitialized) initializeEngine();

  const now = Date.now();
  if (now - lastSpokenAt < 120) {
    // Prevent rapid double taps from cancelling itself on mobile
    return;
  }
  lastSpokenAt = now;

  // Cancel previous to cut off current speech
  window.speechSynthesis.cancel();

  // Create new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Select best voice
  if (!voiceCache && voicesReady) {
    voiceCache = getNaturalVoice() ?? null;
  }
  const voice = voiceCache || getNaturalVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = 'en-US';
  }

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
  }, 80);
};

export const playTTS = speak;
