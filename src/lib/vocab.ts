import vocabData from '@/data/vocabulary.json';
import type { Word } from '@/types';

export type VocabExample = { text: string; translation?: string };

export type ProcessedVocabItem = Word & {
  examples?: VocabExample[];
};

const CATEGORY_MAP: Record<string, string> = {
  daily: '일상',
  business: '비즈니스',
  travel: '여행',
  emotion: '감정',
  sns: 'SNS',
  academic: '학술',
  general: '일반',
  일상: '일상',
  캐주얼: '캐주얼',
  비즈니스: '비즈니스',
  여행: '여행',
  숙어: '숙어',
  학술: '학술',
  감정: '감정',
};

export function normalizeCategory(raw?: string): string {
  if (!raw) return '기타';
  return CATEGORY_MAP[raw] ?? CATEGORY_MAP[raw.toLowerCase()] ?? raw;
}

let cachedProcessed: ProcessedVocabItem[] | null = null;

export function getProcessedVocabulary(): ProcessedVocabItem[] {
  if (cachedProcessed) return cachedProcessed;

  const map = new Map<string, ProcessedVocabItem>();

  (vocabData as Array<Partial<ProcessedVocabItem> & { word: string; meaning: string }>).forEach((item) => {
    const key = item.word.toLowerCase().trim();
    const currentExamples: VocabExample[] = (item.examples || [
      { text: item.example || '', translation: item.exampleTranslation },
    ]).filter((ex): ex is VocabExample => typeof ex.text === 'string' && ex.text.length > 0);

    const existing = map.get(key);
    if (existing) {
      currentExamples.forEach((ex) => {
        if (ex.text && !(existing.examples || []).some((e) => e.text === ex.text)) {
          existing.examples = existing.examples || [];
          existing.examples.push(ex);
        }
      });
    } else {
      map.set(key, {
        word: item.word,
        meaning: item.meaning,
        example: item.example || '',
        exampleTranslation: item.exampleTranslation,
        category: normalizeCategory(item.category),
        examples: currentExamples,
      });
    }
  });

  cachedProcessed = Array.from(map.values()).sort((a, b) =>
    a.word.localeCompare(b.word, 'en', { sensitivity: 'base' })
  );
  return cachedProcessed;
}

export function getVocabCategories(): string[] {
  const cats = new Set(getProcessedVocabulary().map((w) => w.category || '기타'));
  return ['전체', ...Array.from(cats).sort((a, b) => a.localeCompare(b, 'ko'))];
}

export function filterVocabulary(
  words: ProcessedVocabItem[],
  opts: { query?: string; category?: string; favoriteKeys?: Set<string> }
): ProcessedVocabItem[] {
  const q = opts.query?.trim().toLowerCase();
  const cat = opts.category && opts.category !== '전체' ? opts.category : null;

  return words.filter((w) => {
    if (opts.favoriteKeys && !opts.favoriteKeys.has(w.word.toLowerCase())) return false;
    if (cat && w.category !== cat) return false;
    if (!q) return true;
    return (
      w.word.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q) ||
      (w.example?.toLowerCase().includes(q) ?? false)
    );
  });
}

export function toWord(item: ProcessedVocabItem): Word & { examples?: VocabExample[] } {
  return {
    id: item.word,
    word: item.word,
    meaning: item.meaning,
    example: item.example,
    exampleTranslation: item.exampleTranslation,
    category: item.category,
    ...(item.examples ? { examples: item.examples } : {}),
  };
}
