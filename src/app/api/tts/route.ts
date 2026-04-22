import { NextResponse } from 'next/server';

/**
 * TTS Fallback API Route
 * This can be used when Web Speech API fails.
 * Connect it to Google Cloud TTS, Azure Speech, or Open AI TTS.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang') || 'en-US';

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    // Note: For a production app, use an official API like Google Cloud TTS.
    // This is a placeholder structure showing how to stream the audio back.
    
    // Example (Unofficial/Public Google TTS - stable for small personal projects but use cloud for prod)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch from TTS service');

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
