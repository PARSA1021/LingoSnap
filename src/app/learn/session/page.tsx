import { LearnClient } from '../LearnClient';

export default async function LearnSessionPage({
 searchParams,
}: {
 searchParams: Promise<{
 mode?: string;
 category?: string;
 wordCount?: string;
 isTurbo?: string;
 movie?: string;
 }>;
}) {
 const params = await searchParams;
 const mode = params.mode === 'review' ? 'review' : 'lesson';
 const category = params.category || 'all';
 const wc = Number(params.wordCount);
 const wordCount = (wc === 5 || wc === 10 || wc === 15 ? wc : 10) as 5 | 10 | 15;
 const isTurbo = params.isTurbo === 'true';
 const movieId = params.movie;

 return (
 <LearnClient
 mode={mode}
 category={category}
 wordCount={wordCount}
 isTurbo={isTurbo}
 movieId={movieId}
 />
 );
}
