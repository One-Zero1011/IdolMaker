
import { MBTI, Trainee, WeeklyPlan, TraineeStatus, DailyLog, FacilitiesState, RankingEntry, Album, Group } from '../types/index';
import { MBTI_GROUPS, SCHEDULE_EFFECTS, DAYS, SCANDAL_EVENTS, RANDOM_EVENTS, NPC_GROUPS } from '../data/constants';
import { getRandomMbtiLog } from '../data/mbti/index';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const checkCompatibility = (mbti1: MBTI, mbti2: MBTI): boolean => {
  const getGroup = (m: MBTI) => Object.keys(MBTI_GROUPS).find(key => MBTI_GROUPS[key as keyof typeof MBTI_GROUPS].includes(m));
  const g1 = getGroup(mbti1);
  const g2 = getGroup(mbti2);
  if (g1 === g2) return false; 
  if ((g1 === 'Analysts' && g2 === 'Sentinels') || (g1 === 'Sentinels' && g2 === 'Analysts')) return true;
  if ((g1 === 'Diplomats' && g2 === 'Explorers') || (g1 === 'Explorers' && g2 === 'Diplomats')) return true;
  return false;
};

interface WeekResult {
  updatedTrainees: Trainee[];
  dailyLogs: DailyLog[];
  flatLogs: string[];
  fundChange: number;
  reputationChange: number;
}

export const processWeek = (
  trainees: Trainee[], 
  weeklyPlan: WeeklyPlan, 
  facilities: FacilitiesState, 
  currentReputation: number,
  activeMemberIds: string[]
): WeekResult => {
  const flatLogs: string[] = [];
  const dailyLogs: DailyLog[] = [];
  let updatedTrainees = JSON.parse(JSON.stringify(trainees)); 
  let totalFundChange = 0;
  let reputationPoints = 0;

  const reputationMultiplier = 1 + (currentReputation / 100);

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const activity = weeklyPlan[dayIndex];
    const dayName = DAYS[dayIndex];
    const currentDayEvents: string[] = [];
    const effects = SCHEDULE_EFFECTS[activity];
    const facilityLevel = effects.facilityAffinity ? facilities[effects.facilityAffinity] : 1;
    const efficiencyMultiplier = 1 + (facilityLevel - 1) * 0.2;

    if (activity === 'Street Performance') reputationPoints += 0.5;
    if (activity === 'Live Stream') reputationPoints += 0.3;

    updatedTrainees = updatedTrainees.map((trainee: Trainee) => {
      // 선택된 멤버가 아니면 활동하지 않음 (대신 체력 아주 조금 회복)
      if (!activeMemberIds.includes(trainee.id)) {
          return { ...trainee, stamina: Math.min(100, trainee.stamina + 2) };
      }
      if (trainee.status !== 'Active') return trainee;

      let isSuccess = true;
      if (activity !== 'Rest') {
        if (trainee.stamina <= 0) isSuccess = false;
        else {
          const relevantStatAvg = Object.values(effects.stats).length > 0 
            ? Object.values(effects.stats).reduce((a, b) => a + b, 0) / Object.values(effects.stats).length
            : 50;
          const successChance = (trainee.stamina * 0.7) + (relevantStatAvg * 0.3);
          isSuccess = Math.random() * 100 < successChance;
        }
      }

      let dailyPrice = effects.price;
      if (dailyPrice > 0) {
        const baseBonus = Math.floor(trainee.fans * 5); 
        let earned = Math.floor((dailyPrice + baseBonus) * reputationMultiplier);
        if (!isSuccess) earned = Math.floor(earned * 0.5);
        totalFundChange += earned;
      }

      const mbtiLog = getRandomMbtiLog(trainee.mbti);
      const statusIcon = activity === 'Rest' ? '💤' : isSuccess ? '✅ [성공]' : '❌ [실패]';
      const log1 = `${trainee.name}: ${statusIcon} ${mbtiLog}`;
      currentDayEvents.push(log1);
      flatLogs.push(`[${dayName}] ${log1}`);

      const newStats = { ...trainee.stats };
      const statBonusMultiplier = isSuccess ? 1.0 : 0.5;
      Object.entries(effects.stats).forEach(([stat, value]) => {
        // @ts-ignore
        newStats[stat] = Math.min(100, newStats[stat] + (value * efficiencyMultiplier * statBonusMultiplier));
      });

      if (!isSuccess && activity !== 'Rest') {
        reputationPoints -= 0.5;
        return {
          ...trainee,
          stats: newStats,
          stamina: Math.max(0, trainee.stamina + effects.stamina),
          mental: Math.max(0, trainee.mental - 10), 
          status: trainee.stamina <= 0 && Math.random() < 0.2 ? 'Hospitalized' : 'Active'
        };
      }

      const eventRoll = Math.random();
      if (isSuccess && eventRoll < 0.1) {
        const isPositive = Math.random() > 0.4;
        const pool = isPositive ? RANDOM_EVENTS.POSITIVE : RANDOM_EVENTS.NEGATIVE;
        const event = pool[Math.floor(Math.random() * pool.length)];
        currentDayEvents.push(`[이벤트] ${event.title}: ${event.text.replace('{name}', trainee.name)}`);
        const effect = event.effect as any;
        if (effect.fans) trainee.fans += Math.floor(effect.fans * reputationMultiplier);
        if (effect.mental) trainee.mental = Math.min(100, Math.max(0, trainee.mental + effect.mental));
        if (effect.stamina) trainee.stamina = Math.min(100, Math.max(0, trainee.stamina + effect.stamina));
        if (effect.funds) totalFundChange += effect.funds;
      }

      return {
        ...trainee,
        stats: newStats,
        stamina: Math.min(100, Math.max(0, trainee.stamina + effects.stamina)),
        mental: Math.min(100, Math.max(0, trainee.mental + effects.mental)),
        scandalRisk: trainee.scandalRisk + effects.risk
      };
    });

    dailyLogs.push({ dayIndex, dayLabel: `${dayName}요일`, logs: currentDayEvents });
  }

  return { updatedTrainees, dailyLogs, flatLogs, fundChange: totalFundChange, reputationChange: reputationPoints };
};

export const calculateGlobalRanking = (
  trainees: Trainee[], 
  albums: Album[], 
  reputation: number, 
  prevRanking: RankingEntry[],
  playerGroup: Group | null
): RankingEntry[] => {
  if (!playerGroup) return [];
  const groupMembers = trainees.filter(t => playerGroup.memberIds.includes(t.id));
  const totalFans = groupMembers.reduce((acc, t) => acc + t.fans, 0);
  const latestAlbum = albums.find(a => a.id); // Placeholder logic
  const playerScore = (totalFans * 0.5) + (reputation * 150);
  const entries: any[] = [{ groupName: playerGroup.name, songTitle: latestAlbum ? latestAlbum.title : '데뷔 준비 중', score: Math.floor(playerScore), isPlayer: true }];
  NPC_GROUPS.forEach(npc => entries.push({ groupName: npc.name, songTitle: npc.song, score: Math.floor(npc.basePower + (Math.random()-0.5)*500), isPlayer: false }));
  return entries.sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1, trend: 'new' as const, prevRank: 0 }));
};
