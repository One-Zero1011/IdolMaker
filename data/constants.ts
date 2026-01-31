
import { ScheduleType, FacilityType, SpecialEvent, AlbumConcept } from '../types/index';

export const INITIAL_FUNDS = 500000; 
export const BASE_ALBUM_PRICE = 20000; 

export const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export const NPC_GROUPS = [
  { name: 'NEO JEANS', song: 'Super Shy', basePower: 8500 },
  { name: 'BLACK VEIL', song: 'Shut Down', basePower: 9200 },
  { name: 'IVE-RY', song: 'I AM', basePower: 8800 },
  { name: 'AESPA-RE', song: 'Spicy', basePower: 8200 },
  { name: 'LE SSERAFIM-X', song: 'UNFORGIVEN', basePower: 8000 },
  { name: 'TWICE-AGAIN', song: 'SET ME FREE', basePower: 7500 },
  { name: 'STAY-C', song: 'Teddy Bear', basePower: 6800 },
  { name: 'N-MIX', song: 'Love Me Like This', basePower: 6500 },
  { name: 'BABY-MON', song: 'BATTER UP', basePower: 7200 },
  { name: 'KISS OF LIFE-R', song: 'Shhh', basePower: 6000 }
];

export const MBTI_GROUPS = {
  Analysts: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  Diplomats: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
  Sentinels: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  Explorers: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
};

export const CASTING_METHODS = [
  {
    id: 'street',
    name: '길거리 캐스팅',
    description: '원석을 직접 찾아나섭니다. 실력은 미지수입니다.',
    cost: 0,
    statRange: [10, 40],
    color: 'border-zinc-500 text-zinc-400',
    icon: 'Search'
  },
  {
    id: 'academy',
    name: '학원 오디션',
    description: '기초가 탄탄한 연습생들을 모집합니다.',
    cost: 50000,
    statRange: [30, 55],
    color: 'border-emerald-500 text-emerald-400',
    icon: 'School'
  },
  {
    id: 'public',
    name: '공개 채용',
    description: '전국 단위 오디션으로 유능한 인재를 뽑습니다.',
    cost: 200000,
    statRange: [50, 75],
    color: 'border-blue-500 text-blue-400',
    icon: 'Users'
  },
  {
    id: 'global',
    name: '글로벌 오디션',
    description: '해외파 실력자들이 대거 참여합니다.',
    cost: 1000000,
    statRange: [70, 88],
    color: 'border-purple-500 text-purple-400',
    icon: 'Globe'
  },
  {
    id: 'scout',
    name: '엘리트 스카우트',
    description: '검증된 타사 연습생을 거액에 영입합니다.',
    cost: 5000000,
    statRange: [85, 96],
    color: 'border-yellow-500 text-yellow-400',
    icon: 'Crown'
  }
];

export const ALBUM_CONCEPTS: Record<AlbumConcept, { 
  label: string, 
  color: string, 
  weights: Partial<Record<string, number>>,
  description: string 
}> = {
  'Refreshing': { 
    label: '청량', 
    color: 'bg-cyan-500', 
    weights: { vocal: 0.5, visual: 0.4, leadership: 0.1 },
    description: '청순하고 맑은 이미지. 보컬과 비주얼이 중요합니다.'
  },
  'Dark': { 
    label: '다크', 
    color: 'bg-zinc-800', 
    weights: { rap: 0.4, dance: 0.4, vocal: 0.2 },
    description: '강렬하고 어두운 카리스마. 랩과 퍼포먼스가 핵심입니다.'
  },
  'High-teen': { 
    label: '하이틴', 
    color: 'bg-pink-500', 
    weights: { visual: 0.5, leadership: 0.3, dance: 0.2 },
    description: '통통 튀는 매력. 비주얼과 리더십 시너지가 필요합니다.'
  },
  'Girl Crush': { 
    label: '걸크러시', 
    color: 'bg-red-600', 
    weights: { dance: 0.5, rap: 0.3, visual: 0.2 },
    description: '당당하고 멋진 여성상. 댄스 실력이 가장 중요합니다.'
  },
  'Retro': { 
    label: '레트로', 
    color: 'bg-amber-600', 
    weights: { vocal: 0.6, dance: 0.2, rap: 0.2 },
    description: '복고풍 감성. 뛰어난 가창력이 승부처입니다.'
  }
};

export const REPUTATION_TIERS = [
  { min: 0, label: '무명 (Nugu)', color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/30' },
  { min: 15, label: '루키 (Rookie)', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { min: 35, label: '라이징 스타', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { min: 60, label: '메이저 그룹', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { min: 85, label: '국민 아이돌', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  { min: 95, label: '글로벌 아이콘', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40' },
];

export const ANNUAL_EVENTS: SpecialEvent[] = [
  {
    id: 'rookie_showcase',
    week: 4,
    title: '루키 쇼케이스',
    description: '신인 아티스트들을 대중에게 정식으로 소개하는 무대입니다. 강렬한 인상을 남기세요.',
    minReputation: 0,
    rewards: { fans: 1000, reputation: 5 },
    costs: { stamina: 20, mental: 10, funds: 50000 },
    icon: 'Star',
    bannerColor: 'from-emerald-600 to-teal-900'
  },
  {
    id: 'isac_summer',
    week: 12,
    title: '아이돌 스타 선수권 대회 (여름)',
    description: '체력 소모가 극심하지만, 의외의 종목에서 활약하면 엄청난 바이럴 효과를 얻습니다.',
    minReputation: 15,
    rewards: { fans: 5000, reputation: 3 },
    costs: { stamina: 60, mental: 20 },
    icon: 'Trophy',
    bannerColor: 'from-blue-600 to-indigo-900'
  },
  {
    id: 'summer_festival',
    week: 26,
    title: '워터밤 & 썸머 페스티벌',
    description: '여름 축제의 주인공이 될 시간입니다! 행사비 수익이 높고 대중 인지도가 급상승합니다.',
    minReputation: 35,
    rewards: { fans: 3000, reputation: 4, funds: 200000 },
    costs: { stamina: 40, mental: 5 },
    icon: 'Waves',
    bannerColor: 'from-cyan-500 to-blue-700'
  },
  {
    id: 'world_tour_start',
    week: 38,
    title: '월드 투어 오프닝',
    description: '첫 단독 콘서트 투어를 시작합니다. 글로벌 팬덤을 확장할 절호의 기회입니다.',
    minReputation: 60,
    rewards: { fans: 15000, reputation: 10, funds: 1000000 },
    costs: { stamina: 80, mental: 40, funds: 300000 },
    icon: 'Globe',
    bannerColor: 'from-purple-600 to-pink-900'
  },
  {
    id: 'music_awards',
    week: 50,
    title: '연말 가요 대상 (MAMA)',
    description: '한 해를 마무리하는 최대 규모의 시상식입니다. 대상 수상을 목표로 화려한 무대를 준비하세요.',
    minReputation: 80,
    rewards: { fans: 20000, reputation: 15 },
    costs: { stamina: 50, mental: 30, funds: 100000 },
    icon: 'Music',
    bannerColor: 'from-yellow-600 to-orange-900'
  }
];

export const SCHEDULE_EFFECTS: Record<ScheduleType, { 
  stats: Partial<Record<string, number>>, 
  stamina: number, 
  mental: number, 
  risk: number,
  price: number,
  facilityAffinity?: FacilityType 
}> = {
  'Vocal Training': { stats: { vocal: 1.5 }, stamina: -10, mental: -10, risk: 0, price: 0, facilityAffinity: 'vocal' },
  'Dance Practice': { stats: { dance: 1.5, stamina: 0.5 }, stamina: -25, mental: -5, risk: 0.5, price: 0, facilityAffinity: 'dance' },
  'Rap Lesson': { stats: { rap: 1.5 }, stamina: -10, mental: -10, risk: 0, price: 0, facilityAffinity: 'rap' },
  'Gym': { stats: { stamina: 1, visual: 0.5 }, stamina: -20, mental: -5, risk: 0, price: 0, facilityAffinity: 'gym' },
  'Psychotherapy': { stats: { leadership: 0.5 }, stamina: 5, mental: +30, risk: 0, price: -30000 },
  'Street Performance': { stats: { visual: 1, dance: 1, vocal: 1 }, stamina: -40, mental: 10, risk: 5, price: 20000 }, 
  'Live Stream': { stats: { visual: 0.5, leadership: 0.5 }, stamina: -20, mental: 20, risk: 2, price: 10000 }, 
  'Rest': { stats: {}, stamina: 35, mental: 25, risk: 0, price: 0 }
};

export const FACILITY_UPGRADE_COSTS: Record<number, number> = {
  2: 100000, 
  3: 300000, 
  4: 700000, 
  5: 1500000,
  6: 3000000,
  7: 5500000,
  8: 9000000,
  9: 14000000,
  10: 20000000,
};

export const RANDOM_EVENTS = {
  POSITIVE: [
    { title: "🌟 바이럴 성공", text: "{name}의 연습 영상이 SNS에서 알고리즘의 선택을 받았습니다! (+팬 증가)", effect: { fans: 500, sentiment: 10 } },
    { title: "🍱 팬클럽 조공", text: "팬들이 연습실로 정성 가득한 도시락을 보냈습니다. (+멘탈/체력)", effect: { mental: 20, stamina: 15 } },
    { title: "💎 광고 섭외", text: "{name}에게 소규모 화장품 브랜드의 광고 제안이 들어외습니다. (+자금)", effect: { funds: 500000 } },
    { title: "🎤 실력 급성장", text: "갑자기 깨달음을 얻은 {name}의 실력이 눈에 띄게 좋아졌습니다. (+능력치)", effect: { stats: 3 } }
  ],
  NEGATIVE: [
    { title: "🤒 건강 악화", text: "{name}이 환절기 몸살 기운으로 고생하고 있습니다. (-체력)", effect: { stamina: -30 } },
    { title: "📉 안티 형성", text: "커뮤니티에 {name}에 대한 악의적인 편집 영상이 올라왔습니다. (-팬/감정)", effect: { fans: -200, sentiment: -15 } },
    { title: "🎙 장비 파손", text: "연습 도중 고가의 마이크가 파손되었습니다. (-자금)", effect: { funds: -200000 } }
  ],
  RELATIONSHIP: [
    { title: "⚔ 멤버 불화", text: "{name1}와 {name2}가 사소한 오해로 큰 말다툼을 벌였습니다. (-관계)", effect: { relationship: -20, mental: -10 } },
    { title: "🤝 끈끈한 우정", text: "{name1}와 {name2}가 밤늦게까지 고민을 나누며 서로를 이해하게 되었습니다. (+관계)", effect: { relationship: 20, mental: 10 } }
  ]
};

export const TRANSLATIONS = {
  positions: {
    'Main Vocal': '메인 보컬',
    'Main Dancer': '메인 댄서',
    'Main Rapper': '메인 래퍼',
    'Visual': '비주얼',
    'Leader': '리더'
  },
  schedules: {
    'Vocal Training': '보컬 트레이닝',
    'Dance Practice': '안무 연습',
    'Rap Lesson': '랩 레슨',
    'Gym': '체력 단련',
    'Psychotherapy': '심리 상담',
    'Street Performance': '길거리 공연',
    'Live Stream': '라이브 방송',
    'Rest': '휴식'
  },
  facilities: {
    vocal: '보컬 스튜디오',
    dance: '안무 연습실',
    rap: '녹음실',
    gym: '트레이닝 센터'
  }
};

export const SCANDAL_EVENTS = {
  MINOR: [
    "공항 패션이 커뮤니티에서 호불호 논쟁이 벌어졌습니다.",
    "과거 SNS에 올렸던 비공개 사진이 유출되었으나 해프닝으로 끝났습니다.",
    "예능에서의 발언이 오해를 불러일으켜 정정 기사가 떴습니다.",
    "라이브 방송 도중 타사 제품을 실수로 노출했습니다."
  ],
  MAJOR: [
    "유명 연예인과의 열애설이 파파라치 사진과 함께 보도되었습니다.",
    "뮤직비디오 컨셉이 표절 의혹에 휩싸여 팬덤이 들썩입니다.",
    "콘서트 도중 태도 지적을 하는 안티들의 글이 추천을 많이 받았습니다.",
    "스태프와의 불화설이 익명 커뮤니티를 통해 확산되었습니다."
  ],
  CRITICAL: [
    "탈세 및 불법 도박 의혹에 연루되어 뉴스 메인을 장식했습니다.",
    "멤버 간의 심각한 불화로 인해 팀 해체설이 기사화되었습니다.",
    "대중의 상식을 벗어난 실언으로 인해 전국민적인 비판을 받고 있습니다."
  ]
};

export const FLAVOR_TEXT = {
  mentalBreak: [
    "심각한 번아웃 증상을 보이며 활동 중단을 요청했습니다.",
    "과도한 스트레스로 인해 무대 직전 공황 증세를 보였습니다.",
    "악플로 인해 멘탈이 무너져 숙소 밖으로 나오지 않고 있습니다."
  ],
  success: [
    "빌보드 핫 100 차트인에 성공했습니다! 전 세계가 주목합니다.",
    "월드 투어 전 좌석이 1분 만에 매진되었습니다.",
    "명품 브랜드의 글로벌 앰버서더로 발탁되었습니다.",
    "유튜브 조회수가 하루 만에 5,000만 뷰를 돌파했습니다."
  ]
};

export const FAN_REACTIONS = {
  POSITIVE: [
    "[SNS] 이번 컴백 컨셉 미쳤다... 킹갓엠퍼러 그 자체.",
    "[SNS] 월드투어 티켓팅 성공한 사람? 나 지금 손 떨려 ㅠㅠ",
    "[SNS] 역시 K-POP의 기둥, 실력으로 압살하네.",
    "[SNS] 솔직히 이번 앨범은 전곡이 타이틀감임."
  ],
  NEGATIVE: [
    "[SNS] 소속사 일 안 하냐? 애들 코디가 이게 뭐야.",
    "[SNS] 이번 노래 솔직히 내 취향 아님... 실망이야.",
    "[SNS] 앨범 퀄리티 점점 떨어지는 거 나만 느껴?",
    "[SNS] 초심 잃었다는 소리 듣기 싫으면 연습 좀 더 해."
  ],
  WORRIED: [
    "[SNS] 애들 얼굴 반쪽 됐어... 제발 잠 좀 재워줘라.",
    "[SNS] 오늘 라이브에서 표정 안 좋던데 어디 아픈 거 아니지?",
    "[SNS] 건강이 제일 중요해. 무리하지 말고 쉬었으면 좋겠다."
  ],
  PRICE_PRAISE: [
    "[SNS] 기획사 미쳤나 봐... 이 퀄리티에 이 가격? 완전 혜자임 ㅠㅠ",
    "[SNS] 아티스트 생각하는 마음이 느껴짐. 가격 부담 없어서 너무 좋다.",
    "[SNS] 대중성 노린 가격 책정 굿굿! 이번에 입덕할 사람 많을 듯.",
    "[SNS] 앨범 한 장 더 산다... 가격 너무 착해서 감동받음."
  ],
  PRICE_RESISTANCE: [
    "[SNS] 앨범 가격 실화냐? 팬들이 호구로 보이나 봄.",
    "[SNS] 상술이 너무 심함... 기획사 돈독 오른 거 티 난다.",
    "[SNS] 애들 성적 깎아먹으려고 작정했나. 가격 때문에 선뜻 못 사겠음.",
    "[SNS] 비싸도 너무 비쌈. 차라리 그 돈으로 스트리밍 돌리는 게 나을 듯."
  ]
};

export const COLORS = [
  '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', 
  '#f43f5e', '#06b6d4', '#d946ef', '#6366f1', '#f97316'
];
