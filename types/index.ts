
export type Position = 'Main Vocal' | 'Main Dancer' | 'Main Rapper' | 'Visual' | 'Leader';

export type Gender = 'Male' | 'Female';

export type MBTI = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' 
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' 
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' 
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type TraineeStatus = 'Active' | 'On Hiatus' | 'Legendary' | 'Contract Terminated' | 'Eliminated' | 'Hospitalized';

export interface Stats {
  vocal: number;
  dance: number;
  rap: number;
  visual: number;
  leadership: number;
}

export interface Trainee {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  mbti: MBTI;
  position: Position;
  stats: Stats;
  stamina: number; 
  mental: number; 
  scandalRisk: number; 
  fans: number;
  sentiment: number; 
  relationships: Record<string, number>; 
  status: TraineeStatus;
  history: string[]; 
  imageColor: string; 
  contractRemaining: number; 
}

export type AlbumConcept = 'Refreshing' | 'Dark' | 'High-teen' | 'Girl Crush' | 'Retro';

export interface Album {
  id: string;
  title: string;
  concept: AlbumConcept;
  releaseWeek: number;
  quality: number; // 0-100
  price: number; // 앨범 판매가 추가
  sales: number;
  peakChart: number; // 1-100
  isBillboard: boolean;
}

export type ScheduleType = 
  | 'Vocal Training' 
  | 'Dance Practice' 
  | 'Rap Lesson' 
  | 'Gym' 
  | 'Psychotherapy' 
  | 'Street Performance' 
  | 'Live Stream' 
  | 'Rest';

export type WeeklyPlan = ScheduleType[];

export interface DailyLog {
  dayIndex: number; 
  dayLabel: string;
  logs: string[];
}

export interface GameLog {
  week: number;
  dailyLogs: DailyLog[];
  type: 'info' | 'success' | 'warning' | 'danger';
}

export type FacilityType = 'vocal' | 'dance' | 'rap' | 'gym';

export interface FacilitiesState {
  vocal: number;
  dance: number;
  rap: number;
  gym: number;
}

export interface SpecialEvent {
  id: string;
  week: number; 
  title: string;
  description: string;
  minReputation: number; 
  rewards: {
    fans?: number;
    reputation?: number;
    funds?: number;
  };
  costs: {
    stamina?: number;
    mental?: number;
    funds?: number;
  };
  icon: string;
  bannerColor: string;
}
