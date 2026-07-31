import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LingoSnap — Talkie Talkie!',
    short_name: 'LingoSnap',
    description: '게임처럼 즐겁고 빠르게! 오프라인에서도 즐기는 스마트 영어 학습 플랫폼',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F7F7F9',
    theme_color: '#FF385C',
    categories: ['education', 'productivity', 'lifestyle'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
