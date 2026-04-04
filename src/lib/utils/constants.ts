// API URL 상수
export const API_URLS = {
  DICTIONARY: 'https://api.dictionaryapi.dev/api/v2/entries/en',
  GRAMMAR: 'https://api.languagetool.org/v2/check',
} as const;

// 학습 설정
export const LEARNING_CONFIG = {
  DAILY_VOCAB_COUNT: 5,
  DAILY_SENTENCE_COUNT: 3,
  QUIZ_OPTIONS_COUNT: 4,
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  USER_ID: 'english_learning_user_id',
  PROGRESS: 'english_learning_progress',
} as const;