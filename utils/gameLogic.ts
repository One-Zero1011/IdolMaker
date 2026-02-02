
// ... imports stay the same ...
import { MBTI, Trainee, WeeklyPlan, TraineeStatus, DailyLog, FacilitiesState, RankingEntry, Album, Group, Stats, StaffState, HQLevel } from '../types/index';
import { MBTI_GROUPS, SCHEDULE_EFFECTS, DAYS, SCANDAL_EVENTS, RANDOM_EVENTS, NPC_GROUPS, HQ_LEVELS, STAFF_ROLES } from '../data/constants';
import { getRandomMbtiLog } from '../data/mbti/index';
import { 
  SECRET_LOVER_EVENTS, PUBLIC_LOVER_EVENTS, SOULMATE_EVENTS, BEST_FRIEND_EVENTS, FRIENDLY_EVENTS, 
  AWKWARD_EVENTS, ENEMY_EVENTS, NEMESIS_EVENTS, RelationshipEvent 
} from '../data/events/relationships';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const checkCompatibility = (mbti1: MBTI, mbti2: MBTI): boolean => {
  // ... existing code ...
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
  activeMemberIds: string[],
  staff: StaffState,
  hqLevel: number
): WeekResult => {
  const flatLogs: string[] = [];
  const dailyLogs: DailyLog[] = [];
  let updatedTrainees = JSON.parse(JSON.stringify(trainees)); 
  let totalFundChange = 0;
  let reputationPoints = 0;

  const reputationMultiplier = 1 + (currentReputation / 100);

  // 1. Staff Salary & Maintenance Deduction
  const currentHQ = HQ_LEVELS.find(h => h.level === hqLevel) || HQ_LEVELS[0];
  totalFundChange -= currentHQ.maintenance;

  let totalSalary = 0;
  STAFF_ROLES.forEach(role => {
    totalSalary += (staff[role.id as keyof StaffState] || 0) * role.salary;
  });
  totalFundChange -= totalSalary;

  // 2. Staff Bonuses Calculation
  const managerBonus = (staff.manager || 0) * 0.1; // 10% reduction in fatigue per manager
  const vocalBonus = 1 + (staff.vocal_trainer || 0) * 0.2; // 20% boost
  const danceBonus = 1 + (staff.dance_trainer || 0) * 0.2;
  const marketerFanBonus = 1 + (staff.marketer || 0) * 0.15;
  const marketerFundBonus = 1 + (staff.marketer || 0) * 0.05;
  const stylistBonus = 1 + (staff.stylist || 0) * 0.2; // Visual boost

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
      // 0. Contract Management (Weekly Decrement on Day 0)
      let currentContract = trainee.contractRemaining;
      let currentStatus = trainee.status;

      if (dayIndex === 0 && 
          currentStatus !== 'Eliminated' && 
          currentStatus !== 'Contract Terminated' && 
          currentStatus !== 'Legendary') {
          
          currentContract -= 1;
          
          if (currentContract <= 0) {
              currentStatus = 'Contract Terminated';
              const expireLog = `[계약] 🛑 ${trainee.name}의 전속 계약이 만료되었습니다.`;
              currentDayEvents.push(expireLog);
              flatLogs.push(`[${dayName}] ${expireLog}`);
          } else if (currentContract === 4) {
              const warningLog = `[경고] ⚠️ ${trainee.name}의 계약 만료가 4주 남았습니다. 재계약을 서두르세요.`;
              currentDayEvents.push(warningLog);
              flatLogs.push(`[${dayName}] ${warningLog}`);
          }
      }

      // If terminated, just return updated contract state
      if (currentStatus === 'Contract Terminated' || currentStatus === 'Eliminated') {
          return { ...trainee, contractRemaining: currentContract, status: currentStatus };
      }

      // 1. Hospitalized Logic (Top Priority - Runs even if in active group)
      if (currentStatus === 'Hospitalized') {
         const recoveryAmount = 20;
         const newStamina = Math.min(100, trainee.stamina + recoveryAmount);
         const isRecovered = newStamina >= 80;
         
         const logMsg = isRecovered 
            ? `🏥 ${trainee.name}이(가) 건강을 회복하고 퇴원했습니다! (복귀 완료)`
            : `🏥 ${trainee.name}은(는) 입원 치료 중입니다. (체력: ${Math.floor(newStamina)}%)`;

         if (isRecovered) {
             if (dayIndex === 0) flatLogs.push(`[${dayName}] [회복] ${logMsg}`);
         }
         
         if (activeMemberIds.includes(trainee.id)) {
             currentDayEvents.push(logMsg);
         }

         return { 
            ...trainee, 
            stamina: newStamina,
            mental: Math.min(100, trainee.mental + 5),
            status: isRecovered ? 'Active' : 'Hospitalized',
            contractRemaining: currentContract // Apply decremented contract
         };
      }

      // 2. Inactive Logic (Members NOT in the active group)
      if (!activeMemberIds.includes(trainee.id)) {
          return { 
              ...trainee, 
              stamina: Math.min(100, trainee.stamina + 5),
              mental: Math.min(100, trainee.mental + 2),
              contractRemaining: currentContract,
              status: currentStatus
          };
      }
      
      // 3. Safety check for active group members with invalid status
      if (currentStatus !== 'Active') {
          return { ...trainee, contractRemaining: currentContract, status: currentStatus };
      }

      // 4. Normal Schedule Logic (Only for Active Members)
      let isSuccess = true;
      if (activity !== 'Rest') {
        if (trainee.stamina <= 0) isSuccess = false;
        else {
          const statsValues = Object.values(effects.stats).filter((v): v is number => v !== undefined);
          const relevantStatAvg = statsValues.length > 0 
            ? statsValues.reduce((a, b) => a + b, 0) / statsValues.length
            : 50;
          const successChance = (trainee.stamina * 0.7) + (relevantStatAvg * 0.3);
          isSuccess = Math.random() * 100 < successChance;
        }
      }

      let dailyPrice = effects.price;
      if (dailyPrice > 0) {
        const baseBonus = Math.floor(trainee.fans * 5); 
        // Apply Marketer Fund Bonus
        let earned = Math.floor((dailyPrice + baseBonus) * reputationMultiplier * marketerFundBonus);
        if (!isSuccess) earned = Math.floor(earned * 0.5);
        totalFundChange += earned;
      } else if (dailyPrice < 0) {
        // 비용 발생 (예: 심리상담)
        totalFundChange += dailyPrice;
      }

      const mbtiLog = getRandomMbtiLog(trainee.mbti);
      const statusIcon = activity === 'Rest' ? '💤' : isSuccess ? '✅ [성공]' : '❌ [실패]';
      const log1 = `${trainee.name}: ${statusIcon} ${mbtiLog}`;
      currentDayEvents.push(log1);
      flatLogs.push(`[${dayName}] ${log1}`);

      const newStats = { ...trainee.stats };
      const statBonusMultiplier = isSuccess ? 1.0 : 0.5;
      
      Object.entries(effects.stats).forEach(([stat, value]) => {
        const statKey = stat as keyof Stats;
        if (value !== undefined) {
          let staffMultiplier = 1.0;
          if (statKey === 'vocal') staffMultiplier = vocalBonus;
          if (statKey === 'dance') staffMultiplier = danceBonus;
          if (statKey === 'visual') staffMultiplier = stylistBonus;
          
          newStats[statKey] = Math.min(100, (newStats[statKey] ?? 0) + (value * efficiencyMultiplier * statBonusMultiplier * staffMultiplier));
        }
      });

      // Special Events: Confession & Scandal
      let mentalChange = 0;
      let staminaChange = 0;
      let fansChange = 0;
      let sentimentChange = 0;

      // Apply Stylist Sentiment Bonus
      if (staff.stylist > 0 && Math.random() < 0.1) {
          sentimentChange += 2;
      }

      let scandalTriggered = false;
      const specialRelations = trainee.specialRelations || {};
      
      // 0. Relationship Interactions
      if (Math.random() < 0.15) { 
        const relations = Object.entries(trainee.relationships || {});
        if (relations.length > 0) {
           const [targetId, score] = relations[Math.floor(Math.random() * relations.length)];
           const target = updatedTrainees.find((t: Trainee) => t.id === targetId);
           
           if (target && target.status === 'Active') {
              let eventPool: RelationshipEvent[] = AWKWARD_EVENTS; 
              const special = specialRelations[targetId];

              if (special === 'SecretLover') eventPool = SECRET_LOVER_EVENTS;
              else if (special === 'PublicLover') eventPool = PUBLIC_LOVER_EVENTS;
              else if (score >= 90) eventPool = SOULMATE_EVENTS;
              else if (score >= 80) eventPool = BEST_FRIEND_EVENTS;
              else if (score >= 60) eventPool = FRIENDLY_EVENTS;
              else if (score <= 10) eventPool = NEMESIS_EVENTS;
              else if (score <= 20) eventPool = ENEMY_EVENTS;
              else if (score <= 40) eventPool = AWKWARD_EVENTS;
              else eventPool = FRIENDLY_EVENTS;

              const event = eventPool[Math.floor(Math.random() * eventPool.length)];
              const formattedText = event.text.replace('{name1}', trainee.name).replace('{name2}', target.name);
              
              currentDayEvents.push(`[관계] ${formattedText}`);
              
              if (event.effect.mental) mentalChange += event.effect.mental;
              if (event.effect.stamina) staminaChange += event.effect.stamina;
              if (event.effect.fans) fansChange += Math.floor(event.effect.fans * reputationMultiplier);
              if (event.effect.reputation) reputationPoints += event.effect.reputation;
              if (event.effect.funds) totalFundChange += event.effect.funds;

              if (event.effect.relationship) {
                  trainee.relationships[targetId] = Math.max(0, Math.min(100, (trainee.relationships[targetId] || 50) + event.effect.relationship));
                  if (!target.relationships) target.relationships = {};
                  target.relationships[trainee.id] = Math.max(0, Math.min(100, (target.relationships[trainee.id] || 50) + event.effect.relationship));
              }
           }
        }
      }

      // 1. Confession Event
      Object.entries(trainee.relationships || {}).forEach(([targetId, score]) => {
         if (score >= 90 && !specialRelations[targetId] && !scandalTriggered) {
             const target = updatedTrainees.find((t: Trainee) => t.id === targetId);
             if (target && target.status === 'Active' && Math.random() < 0.05) {
                 trainee.specialRelations = { ...specialRelations, [targetId]: 'SecretLover' };
                 target.specialRelations = { ...(target.specialRelations || {}), [trainee.id]: 'SecretLover' };
                 
                 currentDayEvents.push(`[관계] 💘 핑크빛 기류: ${trainee.name}와(과) ${target.name}이(가) 서로의 마음을 확인하고 비밀 연애를 시작했습니다!`);
                 flatLogs.push(`[${dayName}] [관계] 💘 ${trainee.name} & ${target.name} 비밀 연애 시작`);
                 mentalChange += 30;
                 staminaChange += 20;
             }
         }
      });

      // 2. Scandal Event
      const secretLovers = Object.keys(specialRelations).filter(id => specialRelations[id] === 'SecretLover');
      if (secretLovers.length > 0 && Math.random() < 0.02 && !scandalTriggered) {
          const targetId = secretLovers[0];
          const target = updatedTrainees.find((t: Trainee) => t.id === targetId);
          if (target) {
              scandalTriggered = true;
              trainee.specialRelations = { ...specialRelations, [targetId]: 'PublicLover' };
              target.specialRelations = { ...(target.specialRelations || {}), [trainee.id]: 'PublicLover' };

              currentDayEvents.push(`[경고] 📸 [열애설] ${trainee.name}와(과) ${target.name}의 비밀 데이트 현장이 포착되었습니다! 공개 연인으로 전환됩니다.`);
              flatLogs.push(`[${dayName}] [논란] 📸 ${trainee.name} & ${target.name} 열애설 발각`);
              
              trainee.fans = Math.floor(trainee.fans * 0.8);
              target.fans = Math.floor(target.fans * 0.8);
              mentalChange -= 40;
              reputationPoints -= 5;
          }
      }

      // Apply Marketer Fan Bonus
      if (fansChange > 0) {
          fansChange = Math.floor(fansChange * marketerFanBonus);
      } else if (fansChange < 0) {
          // Marketer mitigates fan loss
          const mitigation = 1 - ((staff.marketer || 0) * 0.1); 
          fansChange = Math.floor(fansChange * Math.max(0.5, mitigation)); 
      }

      if (!isSuccess && activity !== 'Rest') {
        reputationPoints -= 0.5;
        // Apply Manager Stamina reduction bonus (less stamina lost)
        const staminaLoss = effects.stamina; // usually negative
        const mitigatedStaminaLoss = staminaLoss * (1 - managerBonus); // e.g. -10 * 0.9 = -9

        return {
          ...trainee,
          stats: newStats,
          stamina: Math.max(0, trainee.stamina + mitigatedStaminaLoss + staminaChange),
          mental: Math.max(0, trainee.mental - 10 + mentalChange), 
          fans: trainee.fans + fansChange,
          sentiment: Math.min(100, Math.max(0, trainee.sentiment + sentimentChange)),
          status: trainee.stamina <= 0 && Math.random() < 0.2 ? 'Hospitalized' : currentStatus,
          contractRemaining: currentContract
        };
      }

      const eventRoll = Math.random();
      if (isSuccess && eventRoll < 0.1) {
        const isPositive = Math.random() > 0.4;
        const pool = isPositive ? RANDOM_EVENTS.POSITIVE : RANDOM_EVENTS.NEGATIVE;
        const event = pool[Math.floor(Math.random() * pool.length)];
        currentDayEvents.push(`[이벤트] ${event.title}: ${event.text.replace('{name}', trainee.name)}`);
        const effect = event.effect as any;
        if (effect.fans) fansChange += Math.floor(effect.fans * reputationMultiplier);
        if (effect.mental) mentalChange += effect.mental;
        if (effect.stamina) staminaChange += effect.stamina;
        if (effect.funds) totalFundChange += effect.funds;
      }

      // Apply Manager Stamina reduction bonus (less stamina lost, or more gained if positive)
      let finalStaminaChange = effects.stamina;
      if (finalStaminaChange < 0) {
          finalStaminaChange = finalStaminaChange * (1 - managerBonus);
      } else if (finalStaminaChange > 0) {
          finalStaminaChange = finalStaminaChange * (1 + managerBonus * 0.5); // Boost recovery slightly
      }

      return {
        ...trainee,
        stats: newStats,
        stamina: Math.min(100, Math.max(0, trainee.stamina + finalStaminaChange + staminaChange)),
        mental: Math.min(100, Math.max(0, trainee.mental + effects.mental + mentalChange)),
        fans: trainee.fans + fansChange,
        sentiment: Math.min(100, Math.max(0, trainee.sentiment + sentimentChange)),
        scandalRisk: Math.max(0, trainee.scandalRisk + effects.risk), // Prevent negative risk
        contractRemaining: currentContract,
        status: currentStatus
      };
    });

    dailyLogs.push({ dayIndex, dayLabel: `${dayName}요일`, logs: currentDayEvents });
  }

  // Weekly salary notification in logs if significant
  if (totalSalary > 0) {
      dailyLogs[0].logs.push(`[경영] 💼 주간 스태프 급여 및 사옥 유지비 지출: ₩${(currentHQ.maintenance + totalSalary).toLocaleString()}`);
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
