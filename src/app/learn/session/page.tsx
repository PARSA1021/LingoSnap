import { LearnClient } from '../LearnClient';

export default async function LearnSessionPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string;
    category?: string;
    wordCount?: string;
    isTurbo?: string;
  }>;
}) {
  const params = await searchParams;
  const mode = params.mode === 'review' ? 'review' : 'lesson';
  const category = params.category || 'all';
  const wordCount = (Number(params.wordCount) === 10 ? 10 : 5) as 5 | 10;
  const isTurbo = params.isTurbo === 'true';

  return (
    <LearnClient
      mode={mode}
      category={category}
      wordCount={wordCount}
      isTurbo={isTurbo}
    />
  );
}
