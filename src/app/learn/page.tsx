import { LearnClient } from './LearnClient';

export default async function LearnPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ mode?: string; category?: string }> 
}) {
  const params = await searchParams;
  const mode = params.mode === 'review' ? 'review' : 'lesson';
  const category = params.category || 'all';
  return <LearnClient mode={mode} category={category} />;
}