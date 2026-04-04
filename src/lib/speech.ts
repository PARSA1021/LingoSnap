// Declare the Web Speech API interfaces that might be missing in default TS DOM libs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type SpeechOptions = {
  lang?: string;
  onResult: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
};

export class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isSupported = true;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  start(options: SpeechOptions) {
    if (!this.isSupported || !this.recognition) {
      options.onError('Speech recognition not supported in this browser.');
      options.onEnd();
      return;
    }

    this.recognition.lang = options.lang || 'en-US';

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      options.onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      options.onError(event.error);
    };

    this.recognition.onend = () => {
      options.onEnd();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      options.onError(e.message);
      options.onEnd();
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const speechService = new SpeechRecognitionService();
