/**
 * 최적화 규칙에 따라 문장(Sentence)의 형식을 변환합니다.
 */
export function formatSentence(text: string): string {
  if (!text) return text;
  let processed = text.trim();

  // Rule: 불필요한 전체 대문자(ALL CAPS)는 제거
  if (processed === processed.toUpperCase() && processed !== processed.toLowerCase()) {
    processed = processed.toLowerCase();
  }

  // Rule: 문장의 첫 글자는 대문자
  processed = processed.charAt(0).toUpperCase() + processed.slice(1);

  // Rule: "I" 는 항상 대문자 유지
  processed = processed.replace(/\bi\b/g, 'I');

  // Rule: 축약형(I'm, don't 등) 처리 (i'm -> I'm 등)
  processed = processed.replace(/\bi'm\b/gi, "I'm");
  processed = processed.replace(/\bi'll\b/gi, "I'll");
  processed = processed.replace(/\bi've\b/gi, "I've");
  processed = processed.replace(/\bi'd\b/gi, "I'd");

  return processed;
}

/**
 * 최적화 규칙에 따라 단어(Word) 또는 구문(Phrase)의 형식을 변환합니다.
 */
export function formatWord(word: string): string {
  if (!word) return word;
  let processed = word.trim();

  const parts = processed.split(/\s+/);
  if (parts.length === 1) {
    // [단일 단어일 경우] 첫 글자만 대문자, 나머지는 소문자
    return processed.charAt(0).toUpperCase() + processed.slice(1).toLowerCase();
  } else {
    // [여러 단어(phrase)일 경우] 각 단어의 첫 글자를 대문자로 변환 (Title Case)
    return parts
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
}
