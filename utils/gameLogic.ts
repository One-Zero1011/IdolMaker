
import { MBTI, Trainee, WeeklyPlan, TraineeStatus, DailyLog, FacilitiesState } from '../types/index';
import { MBTI_GROUPS, SCHEDULE_EFFECTS, FLAVOR_TEXT, DAYS, SCANDAL_EVENTS, FAN_REACTIONS, RANDOM_EVENTS } from '../data/constants';
import { getRandomMbtiLog } from '../data/mbti/index';

// --- Logic Helpers ---

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

// --- Core Engine ---

interface WeekResult {
  updatedTrainees: Trainee[];
  dailyLogs: DailyLog[];
  flatLogs: string[];
  fundChange: number;
  reputationChange: number;
}

export const processWeek = (trainees: Trainee[], weeklyPlan: WeeklyPlan, facilities: FacilitiesState, currentReputation: number): WeekResult => {
  const flatLogs: string[] = [];
  const dailyLogs: DailyLog[] = [];
  let updatedTrainees = JSON.parse(JSON.stringify(trainees)); 
  let totalFundChange = 0;
  let reputationPoints = 0;

  // 평판 보너스 배율 (0~100 기준 1.0~2.0배)
  const reputationMultiplier = 1 + (currentReputation / 100);

  // Iterate 7 Days
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const activity = weeklyPlan[dayIndex];
    const dayName = DAYS[dayIndex];
    const currentDayEvents: string[] = [];
    const effects = SCHEDULE_EFFECTS[activity];
    
    const facilityLevel = effects.facilityAffinity ? facilities[effects.facilityAffinity] : 1;
    const efficiencyMultiplier = 1 + (facilityLevel - 1) * 0.2;

    // 활동별 기본 평판 기여
    if (activity === 'Street Performance') reputationPoints += 0.5;
    if (activity === 'Live Stream') reputationPoints += 0.3;

    // Process each trainee for this day
    updatedTrainees = updatedTrainees.map((trainee: Trainee) => {
      if (trainee.status !== 'Active') return trainee;

      let dailyPrice = effects.price;
      if (dailyPrice > 0) {
        // [밸런스 조정] 팬 1명당 수익을 50원에서 5원으로 하향
        const baseBonus = Math.floor(trainee.fans * 5); 
        dailyPrice = Math.floor((dailyPrice + baseBonus) * reputationMultiplier);
      }
      totalFundChange += dailyPrice;

      const mbtiLog = getRandomMbtiLog(trainee.mbti);
      const log1 = `${trainee.name}: ${mbtiLog}`;
      currentDayEvents.push(log1);
      flatLogs.push(`[${dayName}] ${log1}`);

      if (trainee.stamina <= 0 && activity !== 'Rest') {
        const log2 = `🚑 ${trainee.name}: 탈진 상태에서 활동 강행. 평판이 하락합니다.`;
        currentDayEvents.push(log2);
        flatLogs.push(`[${dayName}] ${log2}`);
        reputationPoints -= 1; 
        return { 
            ...trainee, 
            mental: Math.max(0, trainee.mental - 15),
            sentiment: Math.max(0, trainee.sentiment - 10), 
            status: Math.random() < 0.15 ? 'Hospitalized' : 'Active' 
        };
      }

      const newStats = { ...trainee.stats };
      Object.entries(effects.stats).forEach(([stat, value]) => {
        // @ts-ignore
        const finalValue = value * efficiencyMultiplier;
        // @ts-ignore
        newStats[stat] = Math.min(100, newStats[stat] + finalValue);
      });

      const eventRoll = Math.random();
      if (eventRoll < 0.1) {
        const isPositive = Math.random() > 0.4;
        const pool = isPositive ? RANDOM_EVENTS.POSITIVE : RANDOM_EVENTS.NEGATIVE;
        const event = pool[Math.floor(Math.random() * pool.length)];
        
        let eventLog = `[이벤트] ${event.title}: ${event.text.replace('{name}', trainee.name)}`;
        currentDayEvents.push(eventLog);
        flatLogs.push(`[${dayName}] ${eventLog}`);

        const effect = event.effect as any;
        if (effect.fans) {
            const finalFanGain = Math.floor(effect.fans * reputationMultiplier);
            trainee.fans = Math.max(0, trainee.fans + finalFanGain);
            if (isPositive) reputationPoints += 0.5;
        }
        if (effect.mental) trainee.mental = Math.min(100, Math.max(0, trainee.mental + effect.mental));
        if (effect.stamina) trainee.stamina = Math.min(100, Math.max(0, trainee.stamina + effect.stamina));
        if (effect.sentiment) trainee.sentiment = Math.min(100, Math.max(0, trainee.sentiment + effect.sentiment));
        if (effect.funds) totalFundChange += effect.funds;
        if (effect.stats) {
          Object.keys(newStats).forEach(s => {
            // @ts-ignore
            newStats[s] = Math.min(100, newStats[s] + effect.stats);
          });
        }
      }

      // [버그 수정] 체력이 0일 때도 회복 수치(effects.stamina)가 적용되도록 조건문 제거
      const newStamina = Math.min(100, Math.max(0, trainee.stamina + effects.stamina));
      const newMental = Math.min(100, Math.max(0, trainee.mental + effects.mental));
      let newSentiment = trainee.sentiment;
      let newScandalRisk = trainee.scandalRisk + effects.risk;

      let newStatus: TraineeStatus = trainee.status;
      const roll = Math.random() * 100;
      const effectiveRisk = newScandalRisk + ((100 - newMental) / 20);
      
      if (roll < effectiveRisk && activity !== 'Rest') {
        const severityRoll = Math.random() * 100;
        if (severityRoll < 5) {
            const event = SCANDAL_EVENTS.CRITICAL[Math.floor(Math.random() * SCANDAL_EVENTS.CRITICAL.length)];
            const isEliminated = Math.random() < 0.5; 
            reputationPoints -= 10; 
            if (isEliminated) {
                newStatus = 'Eliminated';
                const log = `🚫 [비보] ${trainee.name}: ${event} (퇴출됨)`;
                currentDayEvents.push(log);
                flatLogs.push(`[${dayName}] ${log}`);
            } else {
                newSentiment = Math.max(0, newSentiment - 30);
                const log = `🚨 [충격] ${trainee.name}: ${event}`;
                currentDayEvents.push(log);
                flatLogs.push(`[${dayName}] ${log}`);
            }
        } else if (severityRoll < 25) {
            const event = SCANDAL_EVENTS.MAJOR[Math.floor(Math.random() * SCANDAL_EVENTS.MAJOR.length)];
            newSentiment = Math.max(0, newSentiment - 15);
            reputationPoints -= 3; 
            const log = `⚠ [논란] ${trainee.name}: ${event}`;
            currentDayEvents.push(log);
            flatLogs.push(`[${dayName}] ${log}`);
        }
      }

      return {
        ...trainee,
        stats: newStats,
        stamina: newStamina,
        mental: newMental,
        sentiment: newSentiment,
        scandalRisk: newScandalRisk,
        status: newStatus,
        fans: trainee.fans
      };
    });

    const activeTrainees = updatedTrainees.filter((t: Trainee) => t.status === 'Active');
    if (activeTrainees.length >= 2 && Math.random() < 0.05) {
      const idx1 = Math.floor(Math.random() * activeTrainees.length);
      let idx2 = Math.floor(Math.random() * activeTrainees.length);
      while (idx1 === idx2) idx2 = Math.floor(Math.random() * activeTrainees.length);

      const t1 = activeTrainees[idx1];
      const t2 = activeTrainees[idx2];
      const isCompatible = checkCompatibility(t1.mbti, t2.mbti);
      const isPositive = isCompatible ? Math.random() > 0.2 : Math.random() > 0.8;
      const event = isPositive ? RANDOM_EVENTS.RELATIONSHIP[1] : RANDOM_EVENTS.RELATIONSHIP[0];

      const eventLog = `[관계] ${event.title}: ${event.text.replace('{name1}', t1.name).replace('{name2}', t2.name)}`;
      currentDayEvents.push(eventLog);
      flatLogs.push(`[${dayName}] ${eventLog}`);
      
      if (!isPositive) reputationPoints -= 0.5; 

      if (!t1.relationships) t1.relationships = {};
      if (!t2.relationships) t2.relationships = {};
      const change = event.effect.relationship || 0;
      t1.relationships[t2.id] = Math.min(100, Math.max(0, (t1.relationships[t2.id] || 50) + change));
      t2.relationships[t1.id] = Math.min(100, Math.max(0, (t2.relationships[t1.id] || 50) + change));
      t1.mental = Math.min(100, Math.max(0, t1.mental + (event.effect.mental || 0)));
      t2.mental = Math.min(100, Math.max(0, t2.mental + (event.effect.mental || 0)));
    }

    dailyLogs.push({
      dayIndex,
      dayLabel: `${dayName}요일`,
      logs: currentDayEvents
    });
  }

  // 실력 향상에 따른 평판 소폭 보너스
  const avgVocal = updatedTrainees.reduce((acc: number, t: Trainee) => acc + t.stats.vocal, 0) / (updatedTrainees.length || 1);
  if (avgVocal > 70) reputationPoints += 1;

  return { updatedTrainees, dailyLogs, flatLogs, fundChange: totalFundChange, reputationChange: reputationPoints };
};
