
export const FAN_NICKNAMES = [
  '바라기', '영원히', '진심녀', '서포터', '빌보드맨', '월드투어', '지킴이', '박사', '감별사', '덕후',
  '공홈지기', '데이터', '연구소', '러버', '홀릭', '앰버서더', '가디언', '메이트', '팬즈', '스테이',
  '홈마', '직캠러', '아카이브', '실시간봇', '덕질계', '무명팬', '늦덕', '갓생포기', '전설'
];

export const RANDOM_HANDLES = [
  'global', 'star', 'official', 'news', 'update', 'daily', 'pics', 'fancam', 'support', 'world',
  'chart', 'awards', 'tour', 'heart', 'queen', 'king', 'best', 'always', 'forever', 'together'
];

export const NEWS_SOURCES = [
  { name: '글로벌 스타뉴스', handle: '@global_star_daily', isVerified: true },
  { name: 'K-POP 인사이더', handle: '@kpop_insider_official', isVerified: true },
  { name: '아이돌 디스패치', handle: '@idol_dispatch', isVerified: false },
  { name: '빌보드 소식통', handle: '@chart_watcher', isVerified: true },
  { name: '엔터 연예톡', handle: '@ent_talk_official', isVerified: false }
];

export const TWEET_TEMPLATES = {
  POSITIVE: [
    "오늘 {name} 비주얼 실화? 빌보드 씹어먹을 상이네 ㅠㅠ",
    "솔직히 {name} 실력은 전 세계가 알아줘야 함. 국보급이다.",
    "이번 월드투어 셋리스트 구성 미쳤음... 기획자 상 줘야 됨.",
    "와... {name} 이번 무대 의상 앰버서더 브랜드인가? 찰떡임.",
    "Best performance ever! {name} is literally the king/queen of K-POP. 🔥",
    "오늘 {name} 엔딩 요정 보고 기절함... 역시 클라스는 영원하다.",
    "{name} 실력 느는 게 눈에 보여서 너무 기특함 ㅠㅠ 월클 가자!",
    "우리 {name} 음원 차트 올킬 실화? 역시 믿고 듣는 아티스트.",
    "비주얼, 실력, 인성 다 갖춘 갓벽한 아이돌... {name} 사랑해!"
  ],
  NEGATIVE: [
    "{name} 이번 열애설 나만 불편함? 팬들 기만 아니냐;;",
    "솔직히 이번 타이틀곡 전작보다 별로임. 실망이다.",
    "초심 잃었네... {name} 무대에서 성의 없는 거 보임.",
    "기획사야 {name} 관리 안 하냐? 논란이 몇 번째야.",
    "Is it just me or the new album quality is decreasing? {name} needs a break.",
    "아니 {name} 안무 숙지도 제대로 안 된 거 같은데... 콘서트 가격이 얼만데.",
    "소속사 마케팅 진짜 못함. {name} 재능 썩히지 마라.",
    "{name} 이번 사건 때문에 그룹 이미지 다 망침... 하이틴 컨셉 끝났네."
  ],
  WORRIED: [
    "{name} 아까 표정 안 좋던데 부상 재발한 거 아니지? 걱정돼 ㅠㅠ",
    "월드투어 스케줄 누가 짰냐... {name} 얼굴 반쪽 됨;; 살려내.",
    "정병들 {name} 좀 내버려 둬라... 멘탈 나갈까 봐 무섭네.",
    "{name} 힘내! 우리가 항상 뒤에 있어! #AlwaysWith{name}",
    "Please let {name} rest. The schedule is inhumane... 😭",
    "오늘 {name} 라이브에서 멍하니 있는 거 보고 울컥함 ㅠㅠㅠ",
    "{name} 건강이 제일 중요해. 차트 성적보다 네가 우선이야..."
  ],
  NEWS_FLASH: [
    "[속보] {event}",
    "[단독] {event} #KPOP #WORLDSTAR",
    "[연예계 단신] {event}",
    "★실시간 핫이슈★ {event}",
    "[NEWS] {event} #BILLBOARD"
  ]
};
