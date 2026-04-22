import { LearnClient } from './LearnClient';

export default function LearnPage({ searchParams }: { searchParams?: { mode?: string } }) {
  const mode = searchParams?.mode === 'review' ? 'review' : 'lesson';
  return <LearnClient mode={mode} />;
}