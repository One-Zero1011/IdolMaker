
export type Position = 'Vocal' | 'Dance' | 'Rap' | 'Visual' | 'Leader';

export type MBTI = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' // Analysts
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' // Diplomats
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' // Sentinels
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'; // Explorers

export type TraineeStatus = 'Active' | 'Eliminated' | 'Debuted' | 'Hospitalized';

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
  age: number;
  mbti: MBTI;
  position: Position;
  stats: Stats;
  stamina: number; // 0-100
  mental: number; // 0-100
  scandalRisk: number; // 0-100, hidden factor
  fans: number;
  sentiment: number; // 0-100, fan sentiment
  relationships: Record<string, number>; // Key: TraineeID, Value: 0-100 (Affinity)
  status: TraineeStatus;
  history: string[]; // Log of major events
  imageColor: string; // To differentiate avatars without external images
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

// 7 items, index 0 = Mon, 6 = Sun
export type WeeklyPlan = ScheduleType[]; 

export interface DailyLog {
  dayIndex: number; // 0-6, 7 for weekly
  dayLabel: string;
  logs: string[];
}

export interface GameLog {
  week: number;
  dailyLogs: DailyLog[];
  type: 'info' | 'success' | 'warning' | 'danger';
}
