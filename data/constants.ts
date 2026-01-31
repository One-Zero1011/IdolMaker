import { ScheduleType } from '../types/index';

export const INITIAL_FUNDS = 50000;

export const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export const MBTI_GROUPS = {
  Analysts: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  Diplomats: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
  Sentinels: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  Explorers: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
};

// Effects are now applied PER DAY. Values are adjusted to be granular.
export const SCHEDULE_EFFECTS: Record<ScheduleType, { 
  stats: Partial<Record<string, number>>, 
  stamina: number, 
  mental: number, 
  risk: number 
}> = {
  'Vocal Training': { stats: { vocal: 1, rap: 0.2 }, stamina: -15, mental: -5, risk: 0 },
  'Dance Practice': { stats: { dance: 1, stamina: 0.5 }, stamina: -20, mental: -5, risk: 0.5 },
  'Rap Lesson': { stats: { rap: 1, vocal: 0.2 }, stamina: -10, mental: -5, risk: 0 },
  'Gym': { stats: { visual: 0.2 }, stamina: 15, mental: 5, risk: 0 }, 
  'Psychotherapy': { stats: { leadership: 0.2 }, stamina: -5, mental: +25, risk: 0 },
  'Street Performance': { stats: { dance: 0.5, vocal: 0.5, visual: 0.5 }, stamina: -25, mental: -10, risk: 3 }, 
  'Live Stream': { stats: { leadership: 0.5, visual: 0.5 }, stamina: -5, mental: -15, risk: 5 }, 
  'Rest': { stats: {}, stamina: 30, mental: 20, risk: 0 }
};

export const TRANSLATIONS = {
  positions: {
    'Vocal': '보컬',
    'Dance': '댄스',
    'Rap': '랩',
    'Visual': '비주얼',
    'Leader': '리더'
  },
  schedules: {
    'Vocal Training': '보컬 트레이닝',
    'Dance Practice': '댄스 연습',
    'Rap Lesson': '랩 레슨',
    'Gym': '체력 단련',
    'Psychotherapy': '심리 상담',
    'Street Performance': '버스킹',
    'Live Stream': '라이브 방송',
    'Rest': '휴식'
  }
};

export const SCANDAL_EVENTS = {
  MINOR: [
    "생방송 중 짓궂은 농담을 했다가 커뮤니티에서 갑론을박이 벌어졌습니다.",
    "과거 SNS에 올렸던 감성 글이 발굴되어 '흑역사'로 놀림감이 되었습니다.",
    "공항 패션이 너무 난해하다는 기사가 떴습니다.",
    "출근길에 팬의 인사를 보지 못하고 지나쳐 태도 지적을 받았습니다.",
    "다이어트 실패로 인해 관리가 부족하다는 악플이 달렸습니다.",
    "라이브 방송 중 경쟁 그룹의 노래를 실수로 흥얼거려 눈총을 샀습니다."
  ],
  MAJOR: [
    "비공개 SNS 계정에서 욕설을 사용한 정황이 포착되었습니다.",
    "유명 연예인과의 사적인 만남이 파파라치에 의해 공개되었습니다.",
    "스태프에게 짜증을 내는 영상이 유출되어 인성 논란이 일었습니다.",
    "팬이 준 선물을 지인에게 줬다는 의혹이 제기되었습니다.",
    "무대에서 안무를 대충 하는 모습이 '직캠'에 박제되었습니다.",
    "과거 학창 시절 흡연 의혹 사진이 인터넷에 유포되었습니다."
  ],
  CRITICAL: [
    "과거 학교 폭력 가해 사실을 주장하는 구체적인 폭로글이 올라왔습니다.",
    "음주 상태로 거리를 배회하다가 경찰에 적발되었습니다.",
    "경쟁 소속사로 이적하기 위해 계약 내용을 유출했다는 혐의를 받고 있습니다.",
    "그룹 내 특정 멤버를 주도적으로 따돌렸다는 내부 고발이 나왔습니다.",
    "팬들을 기만하는 발언이 담긴 녹취록이 공개되었습니다."
  ]
};

export const FLAVOR_TEXT = {
  mentalBreak: [
    "연습 도중 탈진하여 쓰러졌습니다.",
    "화장실 문을 잠그고 울고 있습니다.",
    "멤버와 주먹다짐을 벌였습니다.",
    "숙소 밖으로 나오기를 거부하고 있습니다."
  ],
  success: [
    "3초 엔딩 요정 영상이 바이럴 되었습니다!",
    "트레이너도 놀란 완벽한 고음을 소화했습니다.",
    "유명 선배 아이돌이 SNS에서 칭찬했습니다.",
    "하루만에 팔로워가 10,000명 늘었습니다."
  ]
};

export const FAN_REACTIONS = {
  POSITIVE: [
    "[SNS] 팬들이 무대를 보고 감동의 눈물을 흘립니다.",
    "[SNS] 커뮤니티에서 '입덕' 간증글이 쇄도합니다.",
    "[SNS] 해외 팬들이 응원 메시지를 보냈습니다.",
    "[SNS] 팬아트가 쏟아져 나오고 있습니다.",
    "[SNS] 와... 오늘 비주얼 무슨 일? 사람이 아님;;",
    "[SNS] 실력 늘은 거 봐, 연습 진짜 열심히 했나 봄 ㅠㅠ"
  ],
  NEGATIVE: [
    "[SNS] 실망한 팬들이 굿즈를 중고장터에 내놓고 있습니다.",
    "[SNS] 소속사 앞에서 트럭 시위를 하겠다는 팬들이 생겼습니다.",
    "[SNS] SNS 팔로워가 급격히 줄어들고 있습니다.",
    "[SNS] 공식 카페에 해명 요구글이 도배되었습니다.",
    "[SNS] 초심 잃었네. 표정 관리 안 하는 거 봐.",
    "[SNS] 실망이다 진짜. 탈덕합니다."
  ],
  WORRIED: [
    "[SNS] 팬들이 건강을 염려하여 영양제를 보내왔습니다.",
    "[SNS] 휴식이 필요해 보인다며 소속사를 비판하는 여론이 생겼습니다.",
    "[SNS] 제발 밥 좀 잘 챙겨 먹으라는 댓글이 달립니다.",
    "[SNS] 멘탈 터진 게 눈에 보인다 ㅠㅠ 힘내..."
  ]
};

export const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', 
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
];