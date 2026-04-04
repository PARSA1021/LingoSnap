// UUID 생성
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 로컬 스토리지에서 사용자 ID 가져오기 또는 생성
export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  
  const stored = localStorage.getItem('english_learning_user_id');
  if (stored) return stored;
  
  const newId = generateId();
  localStorage.setItem('english_learning_user_id', newId);
  return newId;
}

// 배열 셔플
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 날짜가 오늘인지 확인
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}