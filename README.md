이 프로젝트는 Next.js(App Router) 기반의 영어 학습 웹앱입니다.

## 운영 관점에서 적용한 개선

- **보안/운영 안정성**: 클라이언트가 외부 사전/번역 API를 직접 호출하던 구조를 **서버 라우트(`/api/*`)로 이동**했습니다. (CORS/레이트리밋/키 노출 위험 감소, 캐시 적용 용이)
- **성능**: 사전/번역 응답은 **CDN 캐시 친화적인 헤더**와 `revalidate` 기반 캐싱을 적용했습니다.
- **정리**: 미사용이던 Supabase 의존성을 제거했습니다.
- **중복 제거**: 랜덤 추출 로직을 `src/lib/utils/random.ts`로 공용화했습니다.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API 라우트

- **`GET /api/dictionary?word=...`**: `dictionaryapi.dev`를 서버에서 호출해 반환합니다. 404는 `notFound: true`로 정규화합니다.
- **`GET /api/translate?q=...&source=en&target=ko`**: MyMemory 번역을 서버에서 호출해 `translatedText`를 반환합니다.

> MyMemory는 무료 서비스라 품질/레이트리밋이 불안정할 수 있습니다. 실제 운영에서는 DeepL/Google 같은 유료 번역 API로 교체하는 것을 권장합니다.

## 프로덕션 빌드

```bash
npm run build
npm run start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
