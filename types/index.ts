
export type Position = 'Main Vocal' | 'Main Dancer' | 'Main Rapper' | 'Visual' | 'Leader';

export type Gender = 'Male' | 'Female';

export type GroupType = 'Boy Group' | 'Girl Group' | 'Co-ed Group';

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

export type RelationType = 'SecretLover' | 'PublicLover';

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
  specialRelations: Record<string, RelationType>; // Added field for Lover status
  status: TraineeStatus;
  history: string[]; 
  imageColor: string; 
  contractRemaining: number; 
}

export interface Group {
  id: string;
  name: string;
  memberIds: string[];
  type: GroupType;
  formedWeek: number;
}

export type AlbumConcept = 'Refreshing' | 'Dark' | 'High-teen' | 'Girl Crush' | 'Retro';

export interface Album {
  id: string;
  title: string;
  concept: AlbumConcept;
  releaseWeek: number;
  quality: number; 
  price: number; 
  sales: number;
  peakChart: number; 
  isBillboard: boolean;
}

export interface RankingEntry {
  rank: number;
  prevRank: number;
  groupName: string;
  songTitle: string;
  score: number;
  isPlayer: boolean;
  trend: 'up' | 'down' | 'same' | 'new';
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

// --- New Types for HQ & Staff ---

export type StaffRole = 'manager' | 'vocal_trainer' | 'dance_trainer' | 'marketer' | 'stylist';

export interface StaffState {
  manager: number; // Count/Level of hired managers
  vocal_trainer: number;
  dance_trainer: number;
  marketer: number;
  stylist: number;
}

export interface HQLevel {
  level: number;
  name: string;
  description: string;
  cost: number;
  maxStaff: number;
  maintenance: number; // Weekly cost
  imgColor: string;
}
