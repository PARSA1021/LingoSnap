export async function fetchWordDefinition(word: string) {
  try {
    const res = await fetch(`/api/dictionary?word=${encodeURIComponent(word)}`);
    if (!res.ok) {
      throw new Error('Failed to fetch dictionary API');
    }
    const data: unknown = await res.json();
    const payload = data as { notFound?: boolean; data?: unknown };
    if (payload.notFound) return null;
    return payload.data ?? null;
  } catch (err) {
    console.warn('Dictionary API Warning:', err);
    return null;
  }
}

export async function fetchKoreanTranslation(text: string) {
  try {
    const res = await fetch(`/api/translate?q=${encodeURIComponent(text)}&source=en&target=ko`);
    const data: unknown = await res.json();
    const payload = data as { translatedText?: string | null };
    return payload.translatedText ?? null;
  } catch {
    return null;
  }
}

/**
 * Normalizes dictionary response to our Word type format
 */
export interface NormalizedWordData {
  word: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  phonetic: string;
  audioUrl: string;
  id?: string;
  level?: string;
  category?: string;
}

/**
 * In-memory cache for dictionary lookups to enable "instant" UI responses.
 */
const dictionaryCache = new Map<string, NormalizedWordData>();

type DictionaryPhonetic = { text?: string; audio?: string };
type DictionaryMeaning = { definitions?: Array<{ definition?: string; example?: string }> };
type DictionaryEntry = {
  phonetic?: string;
  phonetics?: DictionaryPhonetic[];
  meanings?: DictionaryMeaning[];
};

import vocabData from '@/data/vocabulary.json';

export async function getNormalizedWordData(
  wordText: string, 
  defaultMeaning: string = '', 
  defaultExample: string = ''
): Promise<NormalizedWordData> {
  const cleanWord = wordText.toLowerCase().trim();
  
  // 1. Check cache first
  if (dictionaryCache.has(cleanWord)) {
    return dictionaryCache.get(cleanWord)!;
  }

  // 2. Check local vocabulary.json first (Premium curated data)
  const localMatch = (vocabData as any[]).find(v => v.word.toLowerCase() === cleanWord);
  if (localMatch) {
    const result: NormalizedWordData = {
      word: localMatch.word,
      meaning: localMatch.meaning,
      example: localMatch.examples?.[0]?.text || localMatch.example || '',
      exampleTranslation: localMatch.examples?.[0]?.translation || localMatch.exampleTranslation || '',
      phonetic: localMatch.phonetic || '',
      audioUrl: localMatch.audioUrl || ''
    };
    dictionaryCache.set(cleanWord, result);
    return result;
  }

  const definition = await fetchWordDefinition(cleanWord);
  
  let phonetic = '';
  let audioUrl = '';
  let meaning = defaultMeaning;
  let example = defaultExample;

  if (Array.isArray(definition) && definition.length > 0) {
    const entry = definition[0] as DictionaryEntry;
    
    // Extract phonetic text
    if (entry.phonetics && entry.phonetics.length > 0) {
      const phoneticEntry = entry.phonetics.find((p) => p.text) || entry.phonetics[0];
      if (phoneticEntry && phoneticEntry.text) {
        phonetic = phoneticEntry.text;
      }
      
      const audioEntry =
        entry.phonetics.find((p) => p.audio && p.audio.length > 0) || entry.phonetics[0];
      if (audioEntry && audioEntry.audio) {
        audioUrl = audioEntry.audio;
      }
    } else if (entry.phonetic) {
      phonetic = entry.phonetic;
    }

    // Extract first meaning/example if default isn't provided
    if (entry.meanings && entry.meanings.length > 0) {
      const firstMeaning = entry.meanings[0];
      const enDef = firstMeaning.definitions?.[0]?.definition || '';
      
      if (!meaning || meaning === '검색된 의미 없음') {
          meaning = enDef;
      }
      
      if (!example || example === '') {
        example = firstMeaning.definitions?.[0]?.example || defaultExample;
      }
    }
  }

  // Fallback to Translation if meaning is still empty or English
  // (We prefer Korean meaning if available)
  const isEnglish = (text: string) => /^[a-zA-Z0-9\s.,!?'"]+$/.test(text);
  
  if (!meaning || isEnglish(meaning)) {
    const translated = await fetchKoreanTranslation(cleanWord);
    if (translated && !translated.toLowerCase().includes('mymemory')) {
      // If searching for a single word, avoid translations that look like long sentences
      const isSingleWord = !cleanWord.includes(' ');
      const transLength = translated.length;
      
      if (isSingleWord && transLength > 10 && translated.includes(' ')) {
        // Likely a phrase or sentence translation (e.g. "사랑은 오래 참는다")
        // We'll stick to English meaning or fallback to a simpler term if possible
      } else {
        meaning = translated;
      }
    }
  }

  // Final Translation Check for example
  let exampleTranslation = '';
  if (example && example !== defaultExample) {
     const exTrans = await fetchKoreanTranslation(example);
     if (exTrans && !exTrans.toLowerCase().includes('mymemory')) {
       exampleTranslation = exTrans;
     }
  }

  const result: NormalizedWordData = {
    word: cleanWord,
    meaning: meaning || '의미를 찾을 수 없습니다.',
    example,
    exampleTranslation,
    phonetic,
    audioUrl
  };

  // Save to cache
  dictionaryCache.set(cleanWord, result);
  return result;
}

/**
 * Utility to pre-warm the cache for a list of words.
 */
export async function prefetchWords(words: string[]) {
  const uniqueWords = [...new Set(words.map(w => w.toLowerCase().trim().replace(/[^a-z0-9]/g, '')))].filter(Boolean);
  
  for (const w of uniqueWords) {
    if (!dictionaryCache.has(w)) {
      try {
        await getNormalizedWordData(w);
      } catch {
        // ignore prefetch errors silently
      }
      // Polite throttling to prevent connection drops or rate limits
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }
}
