# ⚡ LingoSnap (Talkie Talkie!)

> **"게임처럼 즐겁게, 스냅처럼 빠르게!"**  
> LingoSnap은 네오-브루탈리즘(Neo-Brutalism) 디자인 철학을 담은 현대적인 감각의 영어 학습 플랫폼입니다. 지루한 학습에서 벗어나 시각적으로 즐겁고 인터랙티브한 학습 경험을 선사합니다.

---

## 🎨 Design Philosophy: Neo-Brutalism
LingoSnap은 단순한 학습 도구를 넘어 하나의 디자인 작품입니다.
- **Bold Colors**: 활기차고 에너지가 넘치는 비비드한 컬러 팔레트 사용
- **Thick Borders**: 뚜렷한 검정색 테두리와 그림자로 강렬한 시각적 대비 구현
- **Playful Animations**: Framer Motion을 활용한 쫀득하고 리드미컬한 UI 피드백
- **Mobile First**: 스마트폰에서도 완벽하게 동작하는 반응형 레이아웃

---

## 🚀 Key Features

### 1. 📅 데일리 레슨 (Daily Lesson)
매일 새로운 문장과 단어를 4단계의 과학적인 흐름으로 학습합니다.
- **Step 1. Word Reveal**: 새로운 단어와 문장의 의미를 직관적으로 파악합니다.
- **Step 2. Choice Quiz**: 문맥에 맞는 표현을 객관식 퀴즈로 확인합니다.
- **Step 3. Listening**: 원어민 발음을 듣고 문장을 조합하며 청취력을 기릅니다.
- **Step 4. Typing Practice**: 직접 문장을 입력하며 정확한 철자와 문법을 익힙니다.

### 2. 🎙️ 말하기 연습 (Speaking Practice)
Web Speech API(STT)를 활용한 실시간 발음 교정 서비스입니다.
- **음성 인식**: 사용자의 발음을 실시간으로 텍스트로 변환합니다.
- **문법 체크**: 인식된 텍스트를 분석하여 문법적 오류를 찾아내고 피드백을 제공합니다.
- **직접 입력 모드**: 마이크 사용이 어려운 환경에서도 학습이 가능하도록 키보드 입력 모드를 병행 지원합니다.

### 3. 🔄 복습 스테이션 (Review Station)
학습 중 틀린 문제나 헷갈리는 표현들을 따로 모아 집중적으로 복습할 수 있는 공간입니다. 망각 곡선을 고려한 반복 학습으로 장기 기억 전환을 돕습니다.

### 4. 📚 나만의 단어장 (Vocabulary)
레슨 중 마음에 드는 문장이나 꼭 외워야 할 단어를 저장하고 관리할 수 있습니다. 주제별(비즈니스, 여행, 일상 등)로 구분된 방대한 데이터를 제공합니다.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 (with Neo-Brutalist System)
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Voice**: Web Speech API (TTS/STT)

---

## 🏗 Project Structure

```text
src/
├── app/            # Next.js App Router (페이지 및 API 라우트)
├── components/     # UI, 레이아웃 및 각 학습 단계별 컴포넌트
│   ├── learn/      # 데일리 레슨 관련 핵심 컴포넌트
│   ├── speaking/   # 말하기 연습 관련 컴포넌트
│   └── ui/         # 디자인 시스템 기반 공용 컴포넌트
├── data/           # 레슨용 JSON 데이터 (단어, 문장)
├── hooks/          # 커스텀 훅 (TTS, 스토어 연동 등)
├── lib/            # 유틸리티 및 핵심 비즈니스 로직 (TTS Manager, Speech Service)
├── store/          # Zustand 전역 상태 저장소
└── types/          # TypeScript 타입 정의
```

---

## 💡 Technical Highlights

- **Robust TTS Manager**: 브라우저별(Chrome, Safari, Samsung Internet 등) 음성 합성 엔진의 버그와 제약을 해결한 전용 매니저 클래스 구현.
- **Secure API Routes**: 외부 사전 및 번역 API 호출을 서버 측(`/api/*`)으로 캡슐화하여 API 키 노출 방지 및 CORS 문제 해결.
- **Advanced Grammar Evaluation**: 단순히 텍스트를 비교하는 것을 넘어, 문법 분석 엔진을 연동하여 보다 정교한 학습 피드백 제공.

---

## 🏁 Getting Started

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 학습을 시작하세요!

