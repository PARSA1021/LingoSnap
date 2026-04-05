export async function fetchWordDefinition(word: string) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch dictionary API');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Dictionary API Error:', err);
    return null;
  }
}

export async function fetchKoreanTranslation(text: string) {
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ko`);
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      if (!data.responseData.translatedText.includes('MYMEMORY') && !data.responseData.translatedText.includes('MEMORY')) {
         return data.responseData.translatedText;
      }
    }
    return null;
  } catch (err) {
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

export async function getNormalizedWordData(
  wordText: string, 
  defaultMeaning: string = '', 
  defaultExample: string = ''
): Promise<NormalizedWordData> {
  const cleanWord = wordText.toLowerCase().trim();
  
  // Check cache first
  if (dictionaryCache.has(cleanWord)) {
    return dictionaryCache.get(cleanWord)!;
  }

  const definition = await fetchWordDefinition(cleanWord);
  
  let phonetic = '';
  let audioUrl = '';
  let meaning = defaultMeaning;
  let example = defaultExample;

  if (definition && definition.length > 0) {
    const entry = definition[0];
    
    // Extract phonetic text
    if (entry.phonetics && entry.phonetics.length > 0) {
      const phoneticEntry = entry.phonetics.find((p: any) => p.text) || entry.phonetics[0];
      if (phoneticEntry && phoneticEntry.text) {
        phonetic = phoneticEntry.text;
      }
      
      const audioEntry = entry.phonetics.find((p: any) => p.audio && p.audio.length > 0) || entry.phonetics[0];
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
      meaning = translated;
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
  await Promise.all(uniqueWords.map(w => {
    if (!dictionaryCache.has(w)) {
      return getNormalizedWordData(w);
    }
    return Promise.resolve();
  }));
}
