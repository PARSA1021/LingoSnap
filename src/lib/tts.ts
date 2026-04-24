'use client';

/**
 * Robust Cross-Browser TTS Utility
 * Handles:
 * - Async voice loading (Chrome/Android)
 * - User gesture unlocking
 * - Chrome 'broken heart' engine freezes (resume loop)
 * - Samsung Internet quirks
 */

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class TTSManager {
  private static instance: TTSManager;
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private resumeInterval: any = null;
  private lastText: string = '';

  private constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  public static getInstance(): TTSManager {
    if (!TTSManager.instance) {
      TTSManager.instance = new TTSManager();
    }
    return TTSManager.instance;
  }

  private initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      this.voices = this.synth!.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Unlocks the audio engine on first user interaction.
   * Call this in a click handler.
   */
  public unlock(): void {
    if (this.isInitialized || !this.synth) return;
    
    // Silent utterance to 'unlock' browser restriction
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    this.synth.speak(utterance);
    this.isInitialized = true;
    console.log('[TTS] Engine Unlocked');
  }

  private getBestVoice(lang: string = 'en-US'): SpeechSynthesisVoice | null {
    const voices = this.synth?.getVoices() || this.voices;
    if (voices.length === 0) return null;

    // Preference: Google US -> Samantha (iOS) -> Microsoft (PC)
    const preferred = [
      'Google US English',
      'Samantha',
      'Karen',
      'Daniel',
      'Microsoft David'
    ];

    for (const name of preferred) {
      const v = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
      if (v) return v;
    }

    return voices.find(v => v.lang.startsWith(lang)) || 
           voices.find(v => v.lang.startsWith('en')) || 
           voices[0];
  }

  private startResumeLoop() {
    if (this.resumeInterval) clearInterval(this.resumeInterval);
    this.resumeInterval = setInterval(() => {
      if (this.synth?.speaking && !this.synth?.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 5000);
  }

  private stopResumeLoop() {
    if (this.resumeInterval) {
      clearInterval(this.resumeInterval);
      this.resumeInterval = null;
    }
  }

  public speak(text: string, options: TTSOptions = {}) {
    if (!this.synth || !text || text.trim() === '') {
      return;
    }

    // Samsung/Chrome optimization: Don't repeat identical text too fast
    if (this.synth.speaking && text === this.lastText) {
      return;
    }
    this.lastText = text;

    // 1. Cancel current
    try {
      this.synth.cancel();
    } catch (e) {
      console.warn('[TTS] Cancel failed:', e);
    }

    // 2. Unlock if not yet (for some browsers that allow it here)
    if (!this.isInitialized) this.unlock();

    // 3. Safari/Chrome Fix: Small delay after cancel
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voice = this.getBestVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      utterance.onstart = () => {
        this.startResumeLoop();
        options.onStart?.();
      };

      utterance.onend = () => {
        this.stopResumeLoop();
        options.onEnd?.();
      };

      utterance.onerror = (event: any) => {
        this.stopResumeLoop();
        
        // Skip logging for normal interruptions
        if (event.error === 'interrupted' || event.error === 'canceled') {
          return;
        }
        
        console.error('[TTS] Error Type:', event.error);
        console.error('[TTS] Full Event:', event);
        options.onError?.(event);
      };

      try {
        this.synth!.speak(utterance);
        
        // Chrome Fix: Ensure it's not paused
        if (this.synth!.paused) {
          this.synth!.resume();
        }
      } catch (e) {
        console.error('[TTS] Speak failed:', e);
        this.stopResumeLoop();
      }
    }, 150);
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.stopResumeLoop();
    }
  }

  public isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }
}

export const ttsManager = typeof window !== 'undefined' ? TTSManager.getInstance() : null;

// Kept for backward compatibility
export const playTTS = (text: string) => {
  if (ttsManager) {
    ttsManager.speak(text);
  }
};

export const canSpeak = () => !!ttsManager;
export const speak = playTTS;
