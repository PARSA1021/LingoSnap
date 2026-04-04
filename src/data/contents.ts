export type ContentLine = {
  id: string;
  category: "movie" | "drama";
  title: string;
  scene: string;
  line_en: string;
  line_ko: string;
};

export const mediaContents: ContentLine[] = [
  // Movies
  {
    id: "m1",
    category: "movie",
    title: "About Time (어바웃 타임)",
    scene: "팀이 하루를 다시 살며 느끼는 깨달음",
    line_en: "We're all traveling through time together, every day of our lives.",
    line_ko: "우리는 모두 함께 시간 여행을 하고 있다, 우리 삶의 매일매일."
  },
  {
    id: "m2",
    category: "movie",
    title: "Forrest Gump (포레스트 검프)",
    scene: "포레스트가 어머니의 인생 조언을 회상할 때",
    line_en: "Life was like a box of chocolates. You never know what you're gonna get.",
    line_ko: "인생은 초콜릿 상자 같은 거야. 네가 무엇을 고를지 결코 알 수 없단다."
  },
  {
    id: "m3",
    category: "movie",
    title: "The Pursuit of Happyness (행복을 찾아서)",
    scene: "크리스가 농구하는 아들에게 조언하는 장면",
    line_en: "Don't ever let somebody tell you you can't do something.",
    line_ko: "누군가 너에게 넌 할 수 없다고 말하게 내버려두지 마라."
  },
  {
    id: "m4",
    category: "movie",
    title: "The Truman Show (트루먼 쇼)",
    scene: "트루먼이 평소처럼 이웃들에게 아침 인사를 할 때",
    line_en: "In case I don't see you, good afternoon, good evening, and good night!",
    line_ko: "나중에 혹시 못 볼지도 모르니까, 좋은 오후, 좋은 저녁, 좋은 밤 보내세요!"
  },
  {
    id: "m5",
    category: "movie",
    title: "Titanic (타이타닉)",
    scene: "잭이 저녁 식사 자리에서 자신의 삶의 방식을 말할 때",
    line_en: "To make each day count.",
    line_ko: "하루하루를 의미 있게 만드는 것."
  },
  {
    id: "m6",
    category: "movie",
    title: "Spider-Man (스파이더맨)",
    scene: "벤 삼촌이 피터에게 남긴 마지막 조언",
    line_en: "With great power comes great responsibility.",
    line_ko: "큰 힘에는 큰 책임이 따른다."
  },
  {
    id: "m7",
    category: "movie",
    title: "The Dark Knight (다크 나이트)",
    scene: "하비 덴트가 부패하기 전 영웅의 숙명에 대해 말할 때",
    line_en: "You either die a hero, or you live long enough to see yourself become the villain.",
    line_ko: "영웅으로 죽거나, 아니면 끝까지 살아남아 악당이 된 자신을 보게 되거나 둘 중 하나지."
  },
  {
    id: "m8",
    category: "movie",
    title: "Dead Poets Society (죽은 시인의 사회)",
    scene: "키팅 선생님이 학생들에게 현재를 즐기라고 조언할 때",
    line_en: "Carpe Diem. Seize the day, boys. Make your lives extraordinary.",
    line_ko: "카르페 디엠. 현재를 즐겨라, 소년들이여. 너희들의 인생을 특별하게 만들어라."
  },
  {
    id: "m9",
    category: "movie",
    title: "La La Land (라라랜드)",
    scene: "미아가 오디션에서 꿈꾸는 사람들에 대해 노래할 때",
    line_en: "Here's to the ones who dream, foolish as they may seem.",
    line_ko: "꿈꾸는 사람들을 위하여, 비록 바보 같아 보일지라도."
  },
  {
    id: "m10",
    category: "movie",
    title: "Iron Man (아이언맨)",
    scene: "토니 스타크가 기자회견에서 자신의 정체를 밝힐 때",
    line_en: "I am Iron Man.",
    line_ko: "내가 아이언맨입니다."
  },
  {
    id: "m11",
    category: "movie",
    title: "Star Wars (스타워즈)",
    scene: "요다가 루크에게 포스를 가르치며 시도는 없다고 말할 때",
    line_en: "Do, or do not. There is no try.",
    line_ko: "하든지, 하지 않든지 둘 중 하나야. '시도'란 건 없다."
  },
  {
    id: "m12",
    category: "movie",
    title: "The Lion King (라이온 킹)",
    scene: "라피키가 심바에게 과거를 마주하라고 조언할 때",
    line_en: "Oh yes, the past can hurt. But you can either run from it or learn from it.",
    line_ko: "그래, 과거는 아플 수 있지. 하지만 거기서 도망칠 수도 있고, 배울 수도 있단다."
  },
  {
    id: "m13",
    category: "movie",
    title: "Notting Hill (노팅 힐)",
    scene: "애나가 윌리엄에게 자신의 마음을 솔직하게 고백할 때",
    line_en: "I'm also just a girl, standing in front of a boy, asking him to love her.",
    line_ko: "저도 그저 한 남자 앞에 서서 자신을 사랑해 달라고 부탁하는 한 명의 여자일 뿐이에요."
  },
  {
    id: "m14",
    category: "movie",
    title: "Love Actually (러브 액츄얼리)",
    scene: "오프닝 내레이션, 사랑의 흔함에 대해 이야기할 때",
    line_en: "If you look for it, I've got a sneaky feeling you'll find that love actually is all around.",
    line_ko: "당신이 찾으려고만 한다면, 사실 사랑은 우리 주변 어디에나 있다는 것을 알게 될 거예요."
  },
  {
    id: "m15",
    category: "movie",
    title: "The Matrix (매트릭스)",
    scene: "모피어스가 네오에게 진실을 보여주기 전 제안할 때",
    line_en: "I can only show you the door. You're the one that has to walk through it.",
    line_ko: "나는 문을 보여줄 수만 있다. 그 문을 걸어 들어가는 것은 너 자신이다."
  },

  // Dramas
  {
    id: "d1",
    category: "drama",
    title: "Breaking Bad (브레이킹 배드)",
    scene: "월트가 아내에게 자신이 위험한 인물임을 선언할 때",
    line_en: "I am not in danger, Skyler. I am the danger.",
    line_ko: "나는 위험에 처한 게 아니야, 스카일러. 내가 바로 위험 그 자체야."
  },
  {
    id: "d2",
    category: "drama",
    title: "Friends (프렌즈)",
    scene: "로스가 자신과 레이첼이 잠시 헤어졌던 상태였음을 주장할 때",
    line_en: "We were on a break!",
    line_ko: "우린 잠시 헤어진 상태였잖아!"
  },
  {
    id: "d3",
    category: "drama",
    title: "Game of Thrones (왕좌의 게임)",
    scene: "네드 스타크가 다가올 혹독한 시련을 경고할 때",
    line_en: "Winter is coming.",
    line_ko: "겨울이 다가오고 있다."
  },
  {
    id: "d4",
    category: "drama",
    title: "Sherlock (셜록)",
    scene: "셜록이 존에게 사건이 시작되었음을 알릴 때",
    line_en: "The game is on.",
    line_ko: "게임이 시작됐어."
  },
  {
    id: "d5",
    category: "drama",
    title: "Stranger Things (기묘한 이야기)",
    scene: "일레븐이 마이크에게 친구는 거짓말을 하지 않는다고 말할 때",
    line_en: "Friends don't lie.",
    line_ko: "친구는 거짓말을 하지 않아."
  },
  {
    id: "d6",
    category: "drama",
    title: "The Office (오피스)",
    scene: "마이클 스콧이 부적절한 농담의 펀치라인으로 자주 쓰는 말",
    line_en: "That's what she said.",
    line_ko: "그녀가 그렇게 말했지. (야한 농담의 펀치라인)"
  },
  {
    id: "d7",
    category: "drama",
    title: "The Crown (더 크라운)",
    scene: "여왕이 자신의 감정을 억누르고 왕관의 무게를 견딜 때",
    line_en: "To hide emotion is to survive.",
    line_ko: "감정을 숨기는 것이 곧 생존이다."
  },
  {
    id: "d8",
    category: "drama",
    title: "Squid Game (오징어 게임 - 영어더빙)",
    scene: "오일남이 게임의 본질에 대해 묻는 장면",
    line_en: "Do you know what someone with no money has in common with someone with too much money? Living is no fun for either of them.",
    line_ko: "돈이 하나도 없는 사람과 돈이 너무 많은 사람의 공통점이 뭔지 아나? 둘 다 사는 게 재미가 없다는 거야."
  },
  {
    id: "d9",
    category: "drama",
    title: "Suits (슈츠)",
    scene: "하비 스펙터가 승리에 대한 자신의 변호사 철학을 말할 때",
    line_en: "I don't play the odds, I play the man.",
    line_ko: "나는 확률 게임을 하지 않아, 사람을 상대하지."
  },
  {
    id: "d10",
    category: "drama",
    title: "House of Cards (하우스 오브 카드)",
    scene: "프랭크 언더우드가 권력과 돈의 차이를 설명할 때",
    line_en: "Power is a lot like real estate. It's all about location, location, location.",
    line_ko: "권력은 부동산과 비슷해. 입지, 입지, 그리고 첫째도 둘째도 입지일 뿐이지."
  },
  {
    id: "d11",
    category: "drama",
    title: "Better Call Saul (베터 콜 사울)",
    scene: "지미가 자신을 변호하며 세상에 억울함을 토로할 때",
    line_en: "I know what stopped me. And you know what? It's never stopping me again.",
    line_ko: "무엇이 나를 막았는지 알아. 그리고 이젠 알아? 다시는 날 막지 못할 거란 걸."
  },
  {
    id: "d12",
    category: "drama",
    title: "The Queen's Gambit (퀸스 갬빗)",
    scene: "베스가 체스판에서의 통제감을 설명할 때",
    line_en: "It's an entire world of just 64 squares. I feel safe in it.",
    line_ko: "그건 고작 64칸으로 이루어진 완전한 세계야. 난 그 안에서 안전함을 느껴."
  },
  {
    id: "d13",
    category: "drama",
    title: "Doctor Who (닥터 후)",
    scene: "닥터가 인간의 삶이 가지는 찰나의 중요성을 설명할 때",
    line_en: "We're all stories, in the end. Just make it a good one, eh?",
    line_ko: "결국 우리는 모두 하나의 이야기일 뿐이야. 그러니 이왕이면 좋은 이야기로 만들자고."
  },
  {
    id: "d14",
    category: "drama",
    title: "Peaky Blinders (피키 블라인더스)",
    scene: "토미 쉘비가 가족 회의 중 규칙을 어기는 형제를 질책할 때",
    line_en: "No fighting! By order of the Peaky Blinders!",
    line_ko: "싸움 금지! 피키 블라인더스의 명령이다!"
  },
  {
    id: "d15",
    category: "drama",
    title: "Succession (석세션)",
    scene: "로건 로이가 자식들과 체스 퍼즐을 풀 듯 비즈니스 전략을 정할 때",
    line_en: "You have to be a killer. Because if you're not, they'll eat you alive.",
    line_ko: "넌 킬러가 돼야 해. 그렇지 않으면 그들이 널 산 채로 잡아먹을 테니까."
  }
];
