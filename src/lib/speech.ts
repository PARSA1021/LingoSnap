// Declare the Web Speech API interfaces that might be missing in default TS DOM libs
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export type SpeechOptions = {
  lang?: string;
  onResult: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
};

export interface WordAnalysis {
  word: string;
  status: 'correct' | 'close' | 'missing';
  spokenWord?: string;
}

export interface SpeechEvaluationResult {
  score: number; // 0 to 100
  isPassed: boolean;
  words: WordAnalysis[];
  feedbackMessage: string;
}

// Levenshtein distance between two strings
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

const cleanToken = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

export function evaluateSpeechAccuracy(expected: string, transcript: string): SpeechEvaluationResult {
  const expectedTokens = expected.split(/\s+/).filter(Boolean);
  const spokenTokens = transcript.split(/\s+/).map(cleanToken).filter(Boolean);

  if (spokenTokens.length === 0) {
    return {
      score: 0,
      isPassed: false,
      words: expectedTokens.map(w => ({ word: w, status: 'missing' })),
      feedbackMessage: '음성이 인식되지 않았습니다. 다시 소리 내어 말씀해주세요.'
    };
  }

  let matchedCount = 0;
  const wordAnalyses: WordAnalysis[] = [];

  expectedTokens.forEach((exp) => {
    const cleanExp = cleanToken(exp);
    
    // 1. Exact match in spoken tokens
    const exactIndex = spokenTokens.indexOf(cleanExp);
    if (exactIndex !== -1) {
      matchedCount += 1.0;
      wordAnalyses.push({ word: exp, status: 'correct', spokenWord: spokenTokens[exactIndex] });
      spokenTokens.splice(exactIndex, 1);
      return;
    }

    // 2. Fuzzy close match
    let bestMatchIndex = -1;
    let minDistance = Infinity;

    spokenTokens.forEach((sp, idx) => {
      const dist = levenshtein(cleanExp, sp);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatchIndex = idx;
      }
    });

    if (bestMatchIndex !== -1 && minDistance <= Math.max(2, Math.floor(cleanExp.length * 0.4))) {
      matchedCount += 0.7;
      wordAnalyses.push({ word: exp, status: 'close', spokenWord: spokenTokens[bestMatchIndex] });
      spokenTokens.splice(bestMatchIndex, 1);
    } else {
      wordAnalyses.push({ word: exp, status: 'missing' });
    }
  });

  const rawScore = Math.round((matchedCount / Math.max(expectedTokens.length, 1)) * 100);
  const score = Math.min(100, Math.max(0, rawScore));
  const isPassed = score >= 70;

  let feedbackMessage = '훌륭합니다! 거의 완벽하게 발음하셨어요. 🎉';
  if (score < 50) {
    feedbackMessage = '천천히 한 단어씩 명확하게 발음해보세요! 👍';
  } else if (score < 70) {
    feedbackMessage = '아쉬워요! 노란색 단어를 조금 더 신경 써서 발음해보세요.';
  }

  return {
    score,
    isPassed,
    words: wordAnalyses,
    feedbackMessage
  };
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognitionLike | null = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isSupported = true;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
      }
    }
  }

  supported() {
    return this.isSupported && !!this.recognition;
  }

  start(options: SpeechOptions) {
    if (!this.isSupported || !this.recognition) {
      options.onError('Speech recognition not supported in this browser.');
      options.onEnd();
      return;
    }

    this.recognition.lang = options.lang || 'en-US';

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      options.onResult(finalTranscript);
    };

    this.recognition.onerror = (event) => {
      options.onError(event.error);
    };

    this.recognition.onend = () => {
      options.onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      options.onError(e instanceof Error ? e.message : 'Failed to start speech recognition.');
      options.onEnd();
    }
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const speechService =
  typeof window !== 'undefined' ? new SpeechRecognitionService() : null;
