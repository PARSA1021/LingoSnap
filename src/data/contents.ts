export type Difficulty = "easy" | "medium" | "hard";

export type Example = {
 en: string;
 ko: string;
};

export type CommonMistake = {
 wrong: string;
 correct: string;
 explanation: string;
};

export type PracticeQuestion = {
 question: string;
 options: string[];
 correctAnswer: number;
 explanation: string;
};

export type ContentLine = {
 id: string;
 category: string;
 title: string;
 difficulty: Difficulty;
 explanation: string;
 examples: Example[];
 commonMistakes: CommonMistake[];
 practiceQuestions: PracticeQuestion[];
 tags: string[];
};

export const grammarContents: ContentLine[] = [
 // ========== 기초 문법 ==========
 {
 id: "g1",
 category: "Tenses",
 title: "Present Simple (현재 단순형)",
 difficulty: "easy",
 explanation: "습관, 반복적인 행동, 일반적인 진실을 표현할 때 사용합니다. I/you/we/they 뒤에는 동사 원형을, he/she/it 뒤에는 동사에 -s/-es를 붙입니다.",
 examples: [
 { en: "I drink coffee every morning.", ko: "나는 매일 아침 커피를 마신다." },
 { en: "She works in an office.", ko: "그녀는 사무실에서 일한다." },
 { en: "The sun rises in the east.", ko: "태양은 동쪽에서 뜬다." },
 { en: "They play football on weekends.", ko: "그들은 주말에 축구를 한다." }
 ],
 commonMistakes: [
 { wrong: "He go to school.", correct: "He goes to school.", explanation: "3인칭 단수 주어 뒤에는 동사에 -s/-es를 붙여야 합니다." },
 { wrong: "She don't like pizza.", correct: "She doesn't like pizza.", explanation: "3인칭 단수일 때 don't 대신 doesn't를 사용합니다." }
 ],
 practiceQuestions: [
 {
 question: "She ____ (study) English every day.",
 options: ["study", "studies", "studying", "studied"],
 correctAnswer: 1,
 explanation: "3인칭 단수 주어 'she' 뒤에는 동사에 -s를 붙여 studies로 사용합니다."
 },
 {
 question: "I ____ (not like) spicy food.",
 options: ["don't like", "doesn't like", "not like", "am not like"],
 correctAnswer: 0,
 explanation: "1인칭 주어 'I' 뒤에는 don't를 사용합니다."
 }
 ],
 tags: ["기초", "시제", "현재"]
 },
 {
 id: "g2",
 category: "Tenses",
 title: "Present Continuous (현재 진행형)",
 difficulty: "easy",
 explanation: "지금 이 순간 일어나고 있는 행동을 표현할 때 사용합니다. am/is/are + 동사-ing 형태로 사용합니다.",
 examples: [
 { en: "I am eating dinner now.", ko: "나는 지금 저녁을 먹고 있다." },
 { en: "They are watching TV.", ko: "그들은 TV를 보고 있다." },
 { en: "Is she working today?", ko: "그녀는 오늘 일하고 있나요?" },
 { en: "We aren't going to the party.", ko: "우리는 파티에 안 간다." }
 ],
 commonMistakes: [
 { wrong: "I eating now.", correct: "I am eating now.", explanation: "주어 뒤에 be동사(am/is/are)를 반드시 넣어야 합니다." },
 { wrong: "He is eat.", correct: "He is eating.", explanation: "be동사 뒤에는 동사에 -ing를 붙여야 합니다." }
 ],
 practiceQuestions: [
 {
 question: "Look! The cat ____ (chase) the mouse.",
 options: ["chases", "is chasing", "chasing", "chase"],
 correctAnswer: 1,
 explanation: "지금 일어나는 행동이므로 현재 진행형을 사용합니다."
 },
 {
 question: "What ____ you ____ (do) right now?",
 options: ["do / do", "are / doing", "is / doing", "did / do"],
 correctAnswer: 1,
 explanation: "you와 함께 쓰이는 be동사는 are이고, 뒤에는 doing이 옵니다."
 }
 ],
 tags: ["기초", "시제", "현재", "진행형"]
 },
 {
 id: "g3",
 category: "Articles",
 title: "A / An (부정관사)",
 difficulty: "easy",
 explanation: "단수 가산 명사 앞에 사용하며, '하나의'라는 의미를 가집니다. 모음 소리로 시작하는 단어 앞에는 an, 자음 소리로 시작하는 단어 앞에는 a를 사용합니다.",
 examples: [
 { en: "I have a book.", ko: "나는 책이 하나 있다." },
 { en: "She is an engineer.", ko: "그녀는 엔지니어다." },
 { en: "A dog is barking.", ko: "개 한 마리가 짖고 있다." },
 { en: "He ate an apple.", ko: "그는 사과를 하나 먹었다." }
 ],
 commonMistakes: [
 { wrong: "an university", correct: "a university", explanation: "university는 'y' 소리로 시작하므로 a를 사용합니다." },
 { wrong: "a hour", correct: "an hour", explanation: "hour는 'h'가 묵음이므로 모음 소리로 시작해 an을 사용합니다." }
 ],
 practiceQuestions: [
 {
 question: "I need ____ umbrella.",
 options: ["a", "an", "the", "X"],
 correctAnswer: 1,
 explanation: "umbrella는 모음 소리로 시작하므로 an을 사용합니다."
 },
 {
 question: "She bought ____ new car.",
 options: ["a", "an", "the", "X"],
 correctAnswer: 0,
 explanation: "new는 자음 소리로 시작하므로 a를 사용합니다."
 }
 ],
 tags: ["기초", "관사"]
 },
 {
 id: "g4",
 category: "Articles",
 title: "The (정관사)",
 difficulty: "easy",
 explanation: "특정한 것을 가리킬 때 사용합니다. 이미 언급된 것, 유일한 것, 특정한 것 등에 사용합니다.",
 examples: [
 { en: "The sky is blue.", ko: "하늘은 파랗다." },
 { en: "I saw a cat. The cat was black.", ko: "나는 고양이를 보았다. 그 고양이는 검았다." },
 { en: "The sun is shining.", ko: "태양이 빛나고 있다." },
 { en: "She is in the kitchen.", ko: "그녀는 부엌에 있다." }
 ],
 commonMistakes: [
 { wrong: "I go to the school every day.", correct: "I go to school every day.", explanation: "학교에 '공부하러' 가는 경우 the를 붙이지 않습니다." },
 { wrong: "The my book is on the table.", correct: "My book is on the table.", explanation: "소유격(my, your 등)과 the는 함께 쓰지 않습니다." }
 ],
 practiceQuestions: [
 {
 question: "____ moon is beautiful tonight.",
 options: ["A", "An", "The", "X"],
 correctAnswer: 2,
 explanation: "달은 유일한 것이므로 the를 사용합니다."
 },
 {
 question: "Can you pass ____ salt?",
 options: ["a", "an", "the", "X"],
 correctAnswer: 2,
 explanation: "특정한 소금(테이블에 있는 소금)을 가리키므로 the를 사용합니다."
 }
 ],
 tags: ["기초", "관사"]
 },
 {
 id: "g5",
 category: "Prepositions",
 title: "Prepositions of Time (시간 전치사: in/on/at)",
 difficulty: "easy",
 explanation: "시간을 나타낼 때 사용하는 전치사입니다. in은 연도/월/계절, on은 날짜/요일, at은 구체적인 시간에 사용합니다.",
 examples: [
 { en: "I was born in 1990.", ko: "나는 1990년에 태어났다." },
 { en: "We have a meeting on Monday.", ko: "우리는 월요일에 회의가 있다." },
 { en: "The movie starts at 7 PM.", ko: "영화는 저녁 7시에 시작한다." },
 { en: "It snows in winter.", ko: "겨울에는 눈이 온다." }
 ],
 commonMistakes: [
 { wrong: "See you in Friday.", correct: "See you on Friday.", explanation: "요일 앞에는 on을 사용합니다." },
 { wrong: "I wake up at 7.", correct: "I wake up at 7.", explanation: "구체적인 시간 앞에는 at이 맞습니다!" }
 ],
 practiceQuestions: [
 {
 question: "My birthday is ____ May 5th.",
 options: ["in", "on", "at", "for"],
 correctAnswer: 1,
 explanation: "구체적인 날짜 앞에는 on을 사용합니다."
 },
 {
 question: "We usually eat lunch ____ noon.",
 options: ["in", "on", "at", "to"],
 correctAnswer: 2,
 explanation: "noon(정오)과 같은 구체적인 시간 앞에는 at을 사용합니다."
 }
 ],
 tags: ["기초", "전치사", "시간"]
 },

 // ========== 중급 문법 ==========
 {
 id: "g6",
 category: "Tenses",
 title: "Present Perfect (현재 완료형)",
 difficulty: "medium",
 explanation: "과거에 시작된 행동이 현재와 관련이 있을 때 사용합니다. have/has + 과거분사 형태로 사용하며, 경험, 완료, 지속 등의 의미를 가집니다.",
 examples: [
 { en: "I have visited Paris twice.", ko: "나는 파리를 두 번 방문한 적이 있다." },
 { en: "She has finished her homework.", ko: "그녀는 숙제를 끝냈다." },
 { en: "We have lived here for 5 years.", ko: "우리는 여기 5년 동안 살고 있다." },
 { en: "Have you ever eaten sushi?", ko: "스시를 먹어본 적이 있나요?" }
 ],
 commonMistakes: [
 { wrong: "I have seen him yesterday.", correct: "I saw him yesterday.", explanation: "구체적인 과거 시간(yesterday)이 나오면 현재 완료가 아니라 과거 시제를 사용합니다." },
 { wrong: "She has go to the store.", correct: "She has gone to the store.", explanation: "have/has 뒤에는 과거분사(gone)를 사용해야 합니다." }
 ],
 practiceQuestions: [
 {
 question: "I ____ (never / be) to Japan.",
 options: ["never was", "have never been", "am never", "never be"],
 correctAnswer: 1,
 explanation: "경험을 물을 때는 현재 완료형을 사용합니다."
 },
 {
 question: "How long ____ you ____ (study) English?",
 options: ["did / study", "do / study", "have / studied", "are / studying"],
 correctAnswer: 2,
 explanation: "기간을 물을 때는 현재 완료형을 사용합니다."
 }
 ],
 tags: ["중급", "시제", "완료형"]
 },
 {
 id: "g7",
 category: "Conditionals",
 title: "First Conditional (1차 조건문)",
 difficulty: "medium",
 explanation: "미래에 일어날 가능성이 있는 상황과 그 결과를 표현합니다. If + 현재 시제, 주절 + will/shall/can/may + 동사원형 구조입니다.",
 examples: [
 { en: "If it rains tomorrow, we will stay home.", ko: "만약 내일 비가 오면, 우리는 집에 있을 것이다." },
 { en: "If you study hard, you will pass the exam.", ko: "만약 열심히 공부하면, 시험에 합격할 것이다." },
 { en: "She will be late if she doesn't hurry.", ko: "만약 그녀가 서두르지 않으면, 늦을 것이다." },
 { en: "What will you do if you have free time?", ko: "만약 시간이 나면 무엇을 할 건가요?" }
 ],
 commonMistakes: [
 { wrong: "If it will rain, I will stay.", correct: "If it rains, I will stay.", explanation: "If절에는 현재 시제를 사용하고 미래 시제(will)를 사용하지 않습니다." },
 { wrong: "If you will study, you pass.", correct: "If you study, you will pass.", explanation: "주절에는 will을 사용해야 합니다." }
 ],
 practiceQuestions: [
 {
 question: "If I ____ (have) enough money, I ____ (buy) a new phone.",
 options: ["have / buy", "will have / will buy", "have / will buy", "will have / buy"],
 correctAnswer: 2,
 explanation: "If절은 현재 시제, 주절은 미래 시제를 사용합니다."
 },
 {
 question: "What ____ (happen) if we ____ (miss) the train?",
 options: ["happens / miss", "will happen / miss", "will happen / will miss", "happens / will miss"],
 correctAnswer: 1,
 explanation: "의문문에서도 If절은 현재 시제, 주절은 미래 시제입니다."
 }
 ],
 tags: ["중급", "조건문"]
 },
 {
 id: "g8",
 category: "Modal Verbs",
 title: "Should / Must / Have to",
 difficulty: "medium",
 explanation: "의무, 권유, 강제를 표현하는 조동사입니다. should는 권유(해야 한다), must는 강한 의무(반드시 해야 한다), have to는 외적인 의무(해야만 한다)를 나타냅니다.",
 examples: [
 { en: "You should eat more vegetables.", ko: "채소를 더 많이 먹어야 해요." },
 { en: "I must finish this report today.", ko: "오늘 이 보고서를 끝내야만 해요." },
 { en: "She has to work on Saturday.", ko: "그녀는 토요일에 일해야 해요." },
 { en: "Should I call him?", ko: "그에게 전화해야 할까요?" }
 ],
 commonMistakes: [
 { wrong: "You should to go now.", correct: "You should go now.", explanation: "조동사 뒤에는 to 없이 동사 원형을 사용합니다." },
 { wrong: "She musts study.", correct: "She must study.", explanation: "must는 인칭이나 수에 따라 변하지 않습니다." }
 ],
 practiceQuestions: [
 {
 question: "You ____ (should / stop) smoking. It's bad for you.",
 options: ["should stop", "should to stop", "stops", "stopping"],
 correctAnswer: 0,
 explanation: "should 뒤에는 동사 원형이 옵니다."
 },
 {
 question: "We ____ (have to / leave) early tomorrow.",
 options: ["have leave", "have to leave", "has to leave", "having to leave"],
 correctAnswer: 1,
 explanation: "have to 뒤에는 동사 원형이 옵니다."
 }
 ],
 tags: ["중급", "조동사", "의무"]
 },
 {
 id: "g9",
 category: "Pronouns",
 title: "Reflexive Pronouns (재귀대명사)",
 difficulty: "medium",
 explanation: "myself, yourself, himself, herself, itself, ourselves, yourselves, themselves로 주어가 행위의 대상이 될 때 사용합니다.",
 examples: [
 { en: "I taught myself to play the guitar.", ko: "나는 스스로 기타 치는 법을 배웠다." },
 { en: "She looked at herself in the mirror.", ko: "그녀는 거울에 비친 자신을 보았다." },
 { en: "We should be proud of ourselves.", ko: "우리는 스스로 자랑스러워해야 한다." },
 { en: "Help yourself to some coffee.", ko: "커피 마음껏 드세요." }
 ],
 commonMistakes: [
 { wrong: "I did it by me.", correct: "I did it by myself.", explanation: "혼자 했다는 의미로 by myself를 사용합니다." },
 { wrong: "He enjoyed him.", correct: "He enjoyed himself.", explanation: "즐거웠다는 의미로 enjoy oneself를 사용합니다." }
 ],
 practiceQuestions: [
 {
 question: "She cooked dinner by ____.",
 options: ["her", "hers", "herself", "she"],
 correctAnswer: 2,
 explanation: "혼자 요리했다는 의미로 by herself를 사용합니다."
 },
 {
 question: "Don't worry about us. We can take care of ____.",
 options: ["us", "our", "ours", "ourselves"],
 correctAnswer: 3,
 explanation: "우리 스스로 돌볼 수 있다는 의미로 ourselves를 사용합니다."
 }
 ],
 tags: ["중급", "대명사"]
 },
 {
 id: "g10",
 category: "Adjectives/Adverbs",
 title: "Comparatives and Superlatives (비교급과 최상급)",
 difficulty: "medium",
 explanation: "둘 이상을 비교할 때 비교급(-er, more), 셋 이상에서 가장~을 나타낼 때 최상급(-est, most)을 사용합니다.",
 examples: [
 { en: "My house is bigger than yours.", ko: "내 집이 네 집보다 크다." },
 { en: "She is more intelligent than her brother.", ko: "그녀는 오빠보다 더 똑똑하다." },
 { en: "This is the best book I've ever read.", ko: "이것은 내가 읽은 책 중 가장 좋은 책이다." },
 { en: "It was the most exciting movie ever.", ko: "그것은 역대 가장 흥미진진한 영화였다." }
 ],
 commonMistakes: [
 { wrong: "He is more tall than me.", correct: "He is taller than me.", explanation: "짧은 단어는 -er를 붙입니다." },
 { wrong: "She is beautifuler.", correct: "She is more beautiful.", explanation: "긴 단어는 more를 앞에 붙입니다." }
 ],
 practiceQuestions: [
 {
 question: "This test is ____ (difficult) than the last one.",
 options: ["difficult", "difficulter", "more difficult", "most difficult"],
 correctAnswer: 2,
 explanation: "3음절 이상의 형용사는 more를 사용해 비교급을 만듭니다."
 },
 {
 question: "That was the ____ (bad) movie I've ever seen.",
 options: ["bad", "worse", "worst", "baddest"],
 correctAnswer: 2,
 explanation: "bad의 최상급은 worst입니다."
 }
 ],
 tags: ["중급", "형용사", "부사", "비교"]
 },

 // ========== 고급 문법 ==========
 {
 id: "g11",
 category: "Conditionals",
 title: "Second Conditional (2차 조건문)",
 difficulty: "hard",
 explanation: "현재와는 다른 가상의 상황과 그 결과를 표현합니다. If + 과거 시제, 주절 + would/could/might + 동사원형 구조입니다. be동사는 were를 사용합니다.",
 examples: [
 { en: "If I won the lottery, I would buy a big house.", ko: "만약 복권에 당첨된다면, 큰 집을 살 것이다." },
 { en: "If I were you, I would apologize.", ko: "만약 내가 너라면, 사과할 것이다." },
 { en: "She could travel if she had more money.", ko: "만약 돈이 더 많다면, 여행할 수 있을 것이다." },
 { en: "What would you do if you could fly?", ko: "만약 날 수 있다면 무엇을 할 건가요?" }
 ],
 commonMistakes: [
 { wrong: "If I was you, I would go.", correct: "If I were you, I would go.", explanation: "가정법에서 be동사는 인칭에 관계없이 were를 사용합니다." },
 { wrong: "If I have money, I would buy.", correct: "If I had money, I would buy.", explanation: "If절은 과거 시제를 사용해야 합니다." }
 ],
 practiceQuestions: [
 {
 question: "If I ____ (be) younger, I ____ (travel) more.",
 options: ["am / will travel", "were / would travel", "was / will travel", "were / travel"],
 correctAnswer: 1,
 explanation: "가정법 2차에서 be동사는 were, 주절은 would + 동사원형을 사용합니다."
 },
 {
 question: "What ____ you ____ (do) if you ____ (find) a wallet?",
 options: ["would / do / found", "will / do / find", "do / do / find", "did / do / found"],
 correctAnswer: 0,
 explanation: "가상의 상황이므로 2차 조건문을 사용합니다."
 }
 ],
 tags: ["고급", "조건문", "가정법"]
 },
 {
 id: "g12",
 category: "Tenses",
 title: "Past Perfect (과거 완료형)",
 difficulty: "hard",
 explanation: "과거의 어떤 시점보다 더 이전에 일어난 행동을 표현합니다. had + 과거분사 형태로 사용하며, '과거의 과거'를 나타냅니다.",
 examples: [
 { en: "I had already eaten when he arrived.", ko: "그가 도착했을 때 나는 이미 먹었었다." },
 { en: "She had lived in Paris for 10 years before moving to London.", ko: "런던으로 이사하기 전에 그녀는 파리에서 10년 동안 살았었다." },
 { en: "Had you finished your work before the meeting?", ko: "회의 전에 작업을 끝냈었나요?" },
 { en: "They didn't get the job because they hadn't prepared.", ko: "준비하지 않았었기 때문에 그들은 직업을 얻지 못했다." }
 ],
 commonMistakes: [
 { wrong: "I finished when he arrived.", correct: "I had finished when he arrived.", explanation: "두 과거 행동 중 먼저 일어난 것에 과거 완료를 사용합니다." },
 { wrong: "I had eat before.", correct: "I had eaten before.", explanation: "had 뒤에는 과거분사(eaten)를 사용해야 합니다." }
 ],
 practiceQuestions: [
 {
 question: "The movie ____ (already / start) when we ____ (get) to the theater.",
 options: ["already started / got", "had already started / got", "already starts / get", "had already start / got"],
 correctAnswer: 1,
 explanation: "영화가 시작된 것이 더 먼저 일어났으므로 과거 완료를 사용합니다."
 },
 {
 question: "She ____ (not / see) him before they ____ (meet) at the party.",
 options: ["didn't see / met", "hadn't seen / met", "didn't see / meet", "hadn't saw / met"],
 correctAnswer: 1,
 explanation: "파티에서 만나기 전까지 못 봤었으므로 과거 완료를 사용합니다."
 }
 ],
 tags: ["고급", "시제", "완료형"]
 },
 {
 id: "g13",
 category: "Clauses",
 title: "Relative Clauses (관계대명사절)",
 difficulty: "hard",
 explanation: "명사를 수식하는 절로, who(사람), which(사물), that(사람/사물), whose(소유), where(장소), when(시간) 등을 사용합니다.",
 examples: [
 { en: "The woman who is standing there is my teacher.", ko: "거기 서 있는 여자는 내 선생님이다." },
 { en: "The book which I bought yesterday is very interesting.", ko: "어제 산 책이 매우 재미있다." },
 { en: "That's the house where I grew up.", ko: "그곳이 내가 자란 집이다." },
 { en: "Do you know the boy whose bike was stolen?", ko: "자전거를 도난당한 그 소년을 아나요?" }
 ],
 commonMistakes: [
 { wrong: "The man which called you is here.", correct: "The man who called you is here.", explanation: "사람은 who를, 사물은 which를 사용합니다." },
 { wrong: "I know a girl where lives in Seoul.", correct: "I know a girl who lives in Seoul.", explanation: "사람은 who, 장소는 where를 사용합니다." }
 ],
 practiceQuestions: [
 {
 question: "The café ____ we met last time is closed now.",
 options: ["who", "which", "where", "when"],
 correctAnswer: 2,
 explanation: "장소를 나타내므로 where를 사용합니다."
 },
 {
 question: "Is this the book ____ you recommended?",
 options: ["who", "which", "where", "whose"],
 correctAnswer: 1,
 explanation: "사물(책)을 나타내므로 which를 사용합니다."
 }
 ],
 tags: ["고급", "절", "관계대명사"]
 },
 {
 id: "g14",
 category: "Modal Verbs",
 title: "Modal Perfects (완료형 조동사)",
 difficulty: "hard",
 explanation: "과거에 대해 추측, 후회, 비판 등을 표현할 때 사용합니다. should have(했어야 했다), could have(할 수 있었을 텐데), must have(틀림없이 했을 것이다), might have(아마 했을지도) 등이 있습니다.",
 examples: [
 { en: "You should have called me yesterday.", ko: "어제 나에게 전화했어야 했어요." },
 { en: "She must have forgotten about the meeting.", ko: "그녀는 회의에 대해 잊었음에 틀림없다." },
 { en: "We could have won the game if we had tried harder.", ko: "더 열심히 노력했다면 경기에 이길 수 있었을 것이다." },
 { en: "They might have missed the bus.", ko: "그들은 버스를 놓쳤을지도 모른다." }
 ],
 commonMistakes: [
 { wrong: "You should called me.", correct: "You should have called me.", explanation: "완료형 조동사는 must/should/could 등 + have + 과거분사로 사용합니다." },
 { wrong: "She must be forgot.", correct: "She must have forgotten.", explanation: "have 뒤에는 과거분사를 사용해야 합니다." }
 ],
 practiceQuestions: [
 {
 question: "I ____ (should / study) more for the exam.",
 options: ["should study", "should have studied", "should studied", "should be study"],
 correctAnswer: 1,
 explanation: "과거에 했어야 했는데 안 한 것을 후회할 때 should have + 과거분사를 사용합니다."
 },
 {
 question: "The ground is wet. It ____ (must / rain) last night.",
 options: ["must rain", "must be rain", "must have rained", "must rained"],
 correctAnswer: 2,
 explanation: "과거에 대한 강한 추측은 must have + 과거분사를 사용합니다."
 }
 ],
 tags: ["고급", "조동사", "완료형"]
 },
 {
 id: "g15",
 category: "Inversion",
 title: "Inversion (도치 구문)",
 difficulty: "hard",
 explanation: "부사나 부사구가 문장 앞에 오면 주어와 동사의 위치를 바꾸는 구문입니다. 강조, 부정어 시작 문장, only로 시작하는 문장 등에서 사용합니다.",
 examples: [
 { en: "Never have I seen such a beautiful sunset.", ko: "이렇게 아름다운 석양을 본 적이 없다." },
 { en: "Only then did I understand what he meant.", ko: "그때서야 그가 무슨 뜻인지 이해했다." },
 { en: "Rarely do we get this opportunity.", ko: "우리는 이런 기회를 거의 얻지 못한다." },
 { en: "Not only did he forget his keys, but he also missed the bus.", ko: "그는 열쇠를 잊었을 뿐만 아니라 버스도 놓쳤다." }
 ],
 commonMistakes: [
 { wrong: "Never I have seen that.", correct: "Never have I seen that.", explanation: "부정어로 시작하면 주어와 조동사를 도치시켜야 합니다." },
 { wrong: "Only then I understood.", correct: "Only then did I understand.", explanation: "only로 시작하면 도치가 필요하며, 일반동사는 do/does/did를 앞에 놓습니다." }
 ],
 practiceQuestions: [
 {
 question: "Hardly ever ____ (she / go) to the movies.",
 options: ["she goes", "does she go", "she does go", "goes she"],
 correctAnswer: 1,
 explanation: "Hardly ever로 시작하므로 도치 구문을 사용합니다."
 },
 {
 question: "Not until midnight ____ (they / arrive).",
 options: ["they arrived", "did they arrive", "they did arrive", "arrived they"],
 correctAnswer: 1,
 explanation: "Not until로 시작하므로 도치 구문을 사용합니다."
 }
 ],
 tags: ["고급", "도치", "강조"]
 }
  ,
  // ========== 실전 회화 (Daily Life) ==========
  {
    id: "g16",
    category: "Daily Life",
    title: "카페/식당 필수 표현 (Ordering)",
    difficulty: "easy",
    explanation: "식당이나 카페에서 가장 많이 쓰이는 실전 표현들입니다. 'I would like~' 또는 'Can I get~' 패턴을 사용하면 아주 자연스럽습니다.",
    examples: [
      { en: "Can I get an iced Americano?", ko: "아이스 아메리카노 한 잔 주시겠어요?" },
      { en: "For here or to go?", ko: "드시고 가시나요, 포장이신가요?" },
      { en: "Could we get the bill, please?", ko: "계산서 좀 주시겠어요?" },
      { en: "I would like the steak, medium rare.", ko: "스테이크 미디엄 레어로 부탁드립니다." }
    ],
    commonMistakes: [
      { wrong: "I want a coffee.", correct: "Can I get a coffee?", explanation: "I want는 다소 무례하게 들릴 수 있습니다. Can I get 또는 I'd like를 사용하세요." },
      { wrong: "Give me the bill.", correct: "Could we get the bill?", explanation: "명령문보다 Could we get~ 패턴이 정중하고 자연스럽습니다." }
    ],
    practiceQuestions: [
      {
        question: "카페에서 주문할 때 가장 자연스러운 표현은? ____ an iced latte?",
        options: ["Can I get", "I want", "Give me", "Make me"],
        correctAnswer: 0,
        explanation: "주문할 때는 'Can I get~' 이나 'I would like~' 를 주로 사용합니다."
      },
      {
        question: "식사를 마치고 계산서를 요청할 때 쓰는 표현은? Could we get the ____, please?",
        options: ["paper", "bill", "money", "receipt"],
        correctAnswer: 1,
        explanation: "식당 계산서는 bill 또는 check라고 합니다."
      }
    ],
    tags: ["실전", "카페", "주문"]
  },
  {
    id: "g17",
    category: "Daily Life",
    title: "여행 필수 표현 (Travel)",
    difficulty: "easy",
    explanation: "공항, 호텔, 길 찾기 등 여행지에서 당황하지 않고 쓸 수 있는 핵심 문장들입니다.",
    examples: [
      { en: "I'd like to check out, please.", ko: "체크아웃 하고 싶습니다." },
      { en: "Can you keep my luggage?", ko: "제 짐 좀 맡아주실 수 있나요?" },
      { en: "Do you have any recommendations?", ko: "추천해주실 만한 게 있나요?" },
      { en: "How do I get to the train station?", ko: "기차역에는 어떻게 가나요?" }
    ],
    commonMistakes: [
      { wrong: "Where is the station?", correct: "How do I get to the station?", explanation: "어디냐고 묻기보다 가는 방법을 묻는 How do I get to~ 패턴이 더 유용합니다." },
      { wrong: "Take my bag.", correct: "Can you keep my luggage?", explanation: "짐을 잠시 보관해달라고 할 때는 keep이나 hold my luggage라고 합니다." }
    ],
    practiceQuestions: [
      {
        question: "호텔에서 짐을 맡기고 싶을 때 쓰는 표현은? Can you ____ my luggage?",
        options: ["save", "keep", "take", "put"],
        correctAnswer: 1,
        explanation: "수하물을 보관하다 라고 할 때는 keep을 사용합니다."
      },
      {
        question: "식당 종업원에게 메뉴를 추천받고 싶을 때? Do you have any ____?",
        options: ["thinks", "recommendations", "good foods", "choices"],
        correctAnswer: 1,
        explanation: "추천은 recommendations 입니다."
      }
    ],
    tags: ["실전", "여행", "호텔"]
  },
  {
    id: "g18",
    category: "Daily Life",
    title: "쇼핑 필수 표현 (Shopping)",
    difficulty: "easy",
    explanation: "마트, 옷가게, 면세점 등에서 실제로 가장 많이 쓰이는 표현들입니다. 사이즈 확인, 가격 물어보기, 교환/환불 요청까지 다룹니다.",
    examples: [
      { en: "Do you have this in a smaller size?", ko: "이거 더 작은 사이즈 있나요?" },
      { en: "How much is this?", ko: "이거 얼마예요?" },
      { en: "Can I try this on?", ko: "이거 입어봐도 되나요?" },
      { en: "I'd like to return this.", ko: "이거 반품하고 싶습니다." }
    ],
    commonMistakes: [
      { wrong: "How much does it cost?", correct: "How much is this?", explanation: "일상 쇼핑에서는 간결한 How much is this?가 더 자연스럽습니다." },
      { wrong: "I want to change this.", correct: "I'd like to exchange this.", explanation: "교환은 change가 아니라 exchange를 사용합니다." }
    ],
    practiceQuestions: [
      {
        question: "옷을 입어보고 싶을 때? Can I ____ this on?",
        options: ["put", "try", "wear", "take"],
        correctAnswer: 1,
        explanation: "옷을 입어보다는 try on이라고 합니다."
      },
      {
        question: "이 물건의 가격을 물어볼 때? How ____ is this?",
        options: ["many", "much", "price", "cost"],
        correctAnswer: 1,
        explanation: "가격을 물을 때는 How much를 사용합니다."
      }
    ],
    tags: ["실전", "쇼핑", "일상"]
  },
  {
    id: "g19",
    category: "Daily Life",
    title: "공항 필수 표현 (Airport)",
    difficulty: "medium",
    explanation: "체크인부터 입국심사, 수하물 찾기까지 공항에서 꼭 필요한 표현들입니다. 긴장되는 입국심사도 이 표현만 알면 자신 있게 통과할 수 있습니다.",
    examples: [
      { en: "I'd like a window seat, please.", ko: "창가 좌석으로 부탁드립니다." },
      { en: "What's the purpose of your visit?", ko: "방문 목적이 무엇인가요?" },
      { en: "I'm here on vacation.", ko: "휴가 차 왔습니다." },
      { en: "Where can I pick up my luggage?", ko: "짐은 어디서 찾을 수 있나요?" }
    ],
    commonMistakes: [
      { wrong: "I come for tour.", correct: "I'm here on vacation.", explanation: "방문 목적을 말할 때는 I'm here for/on~ 패턴을 사용합니다." },
      { wrong: "Where is my bag?", correct: "Where can I pick up my luggage?", explanation: "수하물 찾는 곳을 물을 때는 pick up my luggage라고 합니다." }
    ],
    practiceQuestions: [
      {
        question: "입국심사에서 관광 목적을 말할 때? I'm here on ____.",
        options: ["tour", "vacation", "play", "travel"],
        correctAnswer: 1,
        explanation: "관광 목적은 I'm here on vacation 또는 sightseeing이라고 합니다."
      },
      {
        question: "비행기 좌석을 요청할 때? I'd like a ____ seat, please.",
        options: ["side", "window", "glass", "wall"],
        correctAnswer: 1,
        explanation: "창가석은 window seat, 통로석은 aisle seat입니다."
      }
    ],
    tags: ["실전", "공항", "여행"]
  },
  {
    id: "g20",
    category: "Daily Life",
    title: "병원/약국 표현 (Medical)",
    difficulty: "medium",
    explanation: "해외에서 아플 때 증상을 설명하고 도움을 요청하는 필수 표현들입니다. 몸이 아프면 영어가 더 안 나오기 때문에 미리 익혀두는 것이 중요합니다.",
    examples: [
      { en: "I have a headache.", ko: "두통이 있어요." },
      { en: "I think I have a fever.", ko: "열이 있는 것 같아요." },
      { en: "Do I need a prescription for this?", ko: "이거 처방전이 필요한가요?" },
      { en: "I'm allergic to penicillin.", ko: "저는 페니실린 알레르기가 있어요." }
    ],
    commonMistakes: [
      { wrong: "My head is pain.", correct: "I have a headache.", explanation: "두통은 pain이 아니라 headache라는 하나의 단어로 표현합니다." },
      { wrong: "I am allergy.", correct: "I'm allergic to~", explanation: "알레르기가 있다는 I'm allergic to + 물질명 으로 표현합니다." }
    ],
    practiceQuestions: [
      {
        question: "두통이 있다고 말할 때? I have a ____.",
        options: ["head pain", "headache", "head hurt", "head sick"],
        correctAnswer: 1,
        explanation: "두통은 headache라는 한 단어로 표현합니다."
      },
      {
        question: "알레르기가 있다고 말할 때? I'm ____ to peanuts.",
        options: ["allergy", "allergic", "allergen", "allergies"],
        correctAnswer: 1,
        explanation: "~에 알레르기가 있다는 I'm allergic to~로 표현합니다."
      }
    ],
    tags: ["실전", "병원", "건강"]
  },
  {
    id: "g21",
    category: "Daily Life",
    title: "스몰토크 마스터 (Small Talk)",
    difficulty: "easy",
    explanation: "외국인과의 첫 만남, 파티, 엘리베이터에서 나누는 가벼운 대화법입니다. 어색한 침묵을 깨는 마법의 표현들을 익혀보세요.",
    examples: [
      { en: "Nice weather today, isn't it?", ko: "오늘 날씨 좋네요, 그죠?" },
      { en: "What do you do for a living?", ko: "직업이 무엇인가요?" },
      { en: "Have you been here before?", ko: "여기 와보신 적 있으세요?" },
      { en: "It was nice meeting you.", ko: "만나서 반가웠어요." }
    ],
    commonMistakes: [
      { wrong: "What is your job?", correct: "What do you do for a living?", explanation: "직업을 묻는 자연스러운 표현은 What do you do (for a living)?입니다." },
      { wrong: "Nice to meet you. (헤어질 때)", correct: "It was nice meeting you.", explanation: "헤어질 때는 과거형을 써서 It was nice meeting you.라고 합니다." }
    ],
    practiceQuestions: [
      {
        question: "처음 만난 사람에게 직업을 물어볼 때? What do you do ____?",
        options: ["at work", "for a living", "your job", "in life"],
        correctAnswer: 1,
        explanation: "직업을 물을 때는 What do you do for a living?이 자연스럽습니다."
      },
      {
        question: "헤어질 때 인사는? It was nice ____ you.",
        options: ["meet", "to meet", "meeting", "met"],
        correctAnswer: 2,
        explanation: "헤어질 때는 It was nice meeting you.를 사용합니다."
      }
    ],
    tags: ["실전", "대화", "인사"]
  },
  {
    id: "g22",
    category: "Daily Life",
    title: "전화/영상통화 표현 (Phone Calls)",
    difficulty: "medium",
    explanation: "전화를 걸고 받을 때, 목적을 밝히고 메시지를 남기는 등의 비즈니스/일상 전화 표현입니다.",
    examples: [
      { en: "May I speak to Mr. Kim, please?", ko: "김 씨와 통화할 수 있을까요?" },
      { en: "I'm calling about the reservation.", ko: "예약 건으로 전화했습니다." },
      { en: "Could you hold on a moment?", ko: "잠시만 기다려주시겠어요?" },
      { en: "Can I leave a message?", ko: "메시지를 남겨도 될까요?" }
    ],
    commonMistakes: [
      { wrong: "I am calling to Mr. Kim.", correct: "May I speak to Mr. Kim?", explanation: "전화에서 누군가와 통화하고 싶을 때는 May I speak to~를 사용합니다." },
      { wrong: "Wait a moment.", correct: "Could you hold on a moment?", explanation: "전화에서 기다려달라고 할 때는 hold on이 더 자연스럽습니다." }
    ],
    practiceQuestions: [
      {
        question: "전화에서 누군가를 바꿔달라고 할 때? May I ____ to Jane?",
        options: ["talk", "speak", "call", "say"],
        correctAnswer: 1,
        explanation: "전화에서는 May I speak to~가 정중한 표현입니다."
      },
      {
        question: "잠시 기다려 달라고 할 때? Could you ____ on a moment?",
        options: ["wait", "hold", "stay", "keep"],
        correctAnswer: 1,
        explanation: "전화에서 기다리다는 hold on을 사용합니다."
      }
    ],
    tags: ["실전", "전화", "비즈니스"]
  },
  {
    id: "g23",
    category: "Daily Life",
    title: "불만/요청 표현 (Complaints & Requests)",
    difficulty: "medium",
    explanation: "제품 불량, 서비스 불만, 정중한 요청 등 실생활에서 내 권리를 지키면서도 예의 바르게 말하는 법을 배웁니다.",
    examples: [
      { en: "I'm afraid there's a problem with my order.", ko: "죄송한데 주문에 문제가 있는 것 같아요." },
      { en: "Would you mind turning down the music?", ko: "음악 소리를 좀 줄여주시겠어요?" },
      { en: "I'd appreciate it if you could fix this.", ko: "이걸 고쳐주시면 감사하겠습니다." },
      { en: "Is there anything you can do about this?", ko: "이 문제에 대해 해결할 수 있는 방법이 있나요?" }
    ],
    commonMistakes: [
      { wrong: "My order is wrong! Fix it!", correct: "I'm afraid there's a problem with my order.", explanation: "불만을 표현할 때 I'm afraid~ 를 앞에 붙이면 정중하면서도 확실하게 전달됩니다." },
      { wrong: "Turn down the music.", correct: "Would you mind turning down the music?", explanation: "명령문보다 Would you mind ~ing? 패턴이 훨씬 정중합니다." }
    ],
    practiceQuestions: [
      {
        question: "정중하게 불만을 전달할 때 쓰는 앞말은? ____ there's a problem with my room.",
        options: ["I think", "I'm afraid", "I know", "I feel"],
        correctAnswer: 1,
        explanation: "I'm afraid는 안 좋은 소식이나 불만을 정중하게 전할 때 사용합니다."
      },
      {
        question: "정중하게 요청할 때? Would you ____ helping me?",
        options: ["like", "want", "mind", "please"],
        correctAnswer: 2,
        explanation: "Would you mind ~ing?는 매우 정중한 요청 표현입니다."
      }
    ],
    tags: ["실전", "불만", "요청"]
  },

  // ========== 추가 문법 ==========
  {
    id: "g24",
    category: "Tenses",
    title: "Future Tenses (미래 시제: will vs be going to)",
    difficulty: "easy",
    explanation: "미래를 표현하는 두 가지 방법을 배웁니다. will은 즉흥적 결정/예측에, be going to는 이미 계획된 일에 사용합니다.",
    examples: [
      { en: "I'll help you with that.", ko: "내가 도와줄게. (즉석 결정)" },
      { en: "I'm going to study abroad next year.", ko: "나는 내년에 유학 갈 거야. (계획)" },
      { en: "It will rain tomorrow.", ko: "내일 비가 올 거야. (예측)" },
      { en: "We're going to have a meeting at 3.", ko: "우리 3시에 회의할 거야. (예정)" }
    ],
    commonMistakes: [
      { wrong: "I will go to the dentist tomorrow. (예약된 일)", correct: "I'm going to go to the dentist tomorrow.", explanation: "이미 예약/계획된 일에는 be going to가 더 적절합니다." },
      { wrong: "I'm going to answer the phone. (전화가 울릴 때)", correct: "I'll answer the phone.", explanation: "즉흥적으로 결정한 행동에는 will이 더 자연스럽습니다." }
    ],
    practiceQuestions: [
      {
        question: "전화벨이 울리고 있다. I ____ answer the phone.",
        options: ["am going to", "'ll", "going", "do"],
        correctAnswer: 1,
        explanation: "즉흥적 결정에는 will(I'll)을 사용합니다."
      },
      {
        question: "내년 여름에 이미 계획된 여행을 말할 때? We ____ visit Japan next summer.",
        options: ["will", "are going to", "shall", "do"],
        correctAnswer: 1,
        explanation: "이미 계획된 미래 행동에는 be going to를 사용합니다."
      }
    ],
    tags: ["기초", "시제", "미래"]
  },
  {
    id: "g25",
    category: "Phrasal Verbs",
    title: "필수 구동사 (Essential Phrasal Verbs)",
    difficulty: "medium",
    explanation: "구동사(Phrasal Verbs)는 영어 회화의 핵심입니다. 동사 + 전치사/부사 조합으로 전혀 다른 의미가 되며, 원어민들이 일상에서 가장 많이 사용합니다.",
    examples: [
      { en: "I need to figure out this problem.", ko: "이 문제를 해결해야 해." },
      { en: "Can you pick me up at 7?", ko: "7시에 데리러 와줄 수 있어?" },
      { en: "We ran out of milk.", ko: "우유가 다 떨어졌어." },
      { en: "I look forward to hearing from you.", ko: "답변 기다리겠습니다." }
    ],
    commonMistakes: [
      { wrong: "I need to solve out.", correct: "I need to figure out.", explanation: "'알아내다/해결하다'는 figure out입니다. solve out은 틀린 표현입니다." },
      { wrong: "The milk finished.", correct: "We ran out of milk.", explanation: "'다 떨어지다'는 run out of를 사용합니다." }
    ],
    practiceQuestions: [
      {
        question: "누군가를 차로 데리러 갈 때? I'll ____ you up at the airport.",
        options: ["take", "bring", "pick", "get"],
        correctAnswer: 2,
        explanation: "데리러 가다는 pick up입니다."
      },
      {
        question: "무언가가 다 떨어졌을 때? We ____ out of coffee.",
        options: ["ran", "went", "got", "came"],
        correctAnswer: 0,
        explanation: "다 떨어지다는 run out of (과거: ran out of)입니다."
      }
    ],
    tags: ["중급", "구동사", "회화"]
  },
  {
    id: "g26",
    category: "Passive Voice",
    title: "수동태 (Passive Voice)",
    difficulty: "hard",
    explanation: "행위를 받는 대상을 주어로 강조할 때 수동태를 사용합니다. be동사 + 과거분사(p.p.) 형태이며, 뉴스, 공식 문서, 학술 글에서 자주 사용됩니다.",
    examples: [
      { en: "The report was written by Sarah.", ko: "그 보고서는 사라가 작성했다." },
      { en: "English is spoken all over the world.", ko: "영어는 전 세계에서 사용된다." },
      { en: "The meeting has been postponed.", ko: "회의가 연기되었습니다." },
      { en: "A new bridge is being built downtown.", ko: "시내에 새 다리가 건설되고 있다." }
    ],
    commonMistakes: [
      { wrong: "The book was wrote by him.", correct: "The book was written by him.", explanation: "수동태에서 write의 과거분사는 written입니다." },
      { wrong: "English is speak everywhere.", correct: "English is spoken everywhere.", explanation: "be동사 뒤에는 반드시 과거분사 형태를 사용해야 합니다." }
    ],
    practiceQuestions: [
      {
        question: "수동태: The cake ____ (make) by my mom.",
        options: ["made", "was made", "is make", "has make"],
        correctAnswer: 1,
        explanation: "수동태는 be동사 + 과거분사입니다. was made가 맞습니다."
      },
      {
        question: "진행형 수동태: A new hospital ____ (build) right now.",
        options: ["is building", "is being built", "is built", "being built"],
        correctAnswer: 1,
        explanation: "진행형 수동태는 be being + 과거분사입니다."
      }
    ],
    tags: ["고급", "수동태", "문법"]
  }
];