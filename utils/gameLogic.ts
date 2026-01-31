
import { MBTI, Trainee, WeeklyPlan, TraineeStatus, DailyLog } from '../types/index';
import { MBTI_GROUPS, SCHEDULE_EFFECTS, FLAVOR_TEXT, DAYS, SCANDAL_EVENTS, FAN_REACTIONS } from '../data/constants';
import { getRandomMbtiLog } from '../data/mbti/index';

// --- Logic Helpers ---

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const checkCompatibility = (mbti1: MBTI, mbti2: MBTI): boolean => {
  const getGroup = (m: MBTI) => Object.keys(MBTI_GROUPS).find(key => MBTI_GROUPS[key as keyof typeof MBTI_GROUPS].includes(m));
  
  const g1 = getGroup(mbti1);
  const g2 = getGroup(mbti2);

  if (g1 === g2) return false; // Same group usually clashes or is neutral
  if ((g1 === 'Analysts' && g2 === 'Sentinels') || (g1 === 'Sentinels' && g2 === 'Analysts')) return true;
  if ((g1 === 'Diplomats' && g2 === 'Explorers') || (g1 === 'Explorers' && g2 === 'Diplomats')) return true;
  
  return false;
};

// --- Core Engine ---

interface WeekResult {
  updatedTrainees: Trainee[];
  dailyLogs: DailyLog[];
  flatLogs: string[];
}

export const processWeek = (trainees: Trainee[], weeklyPlan: WeeklyPlan): WeekResult => {
  const flatLogs: string[] = [];
  const dailyLogs: DailyLog[] = [];
  let updatedTrainees = JSON.parse(JSON.stringify(trainees)); // Deep copy

  // Iterate 7 Days
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const activity = weeklyPlan[dayIndex];
    const dayName = DAYS[dayIndex];
    const currentDayEvents: string[] = [];
    
    // Process each trainee for this day
    updatedTrainees = updatedTrainees.map((trainee: Trainee) => {
      if (trainee.status !== 'Active') return trainee;

      // Ensure relationships object exists
      if (!trainee.relationships) trainee.relationships = {};

      // 0. Base MBTI Log
      const mbtiLog = getRandomMbtiLog(trainee.mbti);
      const log1 = `${trainee.name}: ${mbtiLog}`;
      currentDayEvents.push(log1);
      flatLogs.push(`[${dayName}] ${log1}`);

      const effects = SCHEDULE_EFFECTS[activity];

      // 1. Check if already exhausted
      if (trainee.stamina <= 0 && activity !== 'Rest') {
        const log2 = `🚑 ${trainee.name}: 탈진 상태에서 활동을 강행하여 부상이 악화되었습니다.`;
        currentDayEvents.push(log2);
        flatLogs.push(`[${dayName}] ${log2}`);
        return { 
            ...trainee, 
            mental: Math.max(0, trainee.mental - 10),
            sentiment: Math.max(0, trainee.sentiment - 5), 
            status: Math.random() < 0.1 ? 'Hospitalized' : 'Active' 
        };
      }

      // 2. Apply Stats
      const newStats = { ...trainee.stats };
      Object.entries(effects.stats).forEach(([stat, value]) => {
        // @ts-ignore
        newStats[stat] = Math.min(100, newStats[stat] + value);
      });

      // 3. Update Condition
      const newStamina = Math.min(100, Math.max(0, trainee.stamina + effects.stamina));
      const newMental = Math.min(100, Math.max(0, trainee.mental + effects.mental));
      let newSentiment = trainee.sentiment;
      let newScandalRisk = trainee.scandalRisk + effects.risk;

      // 4. Calculate Risk (Scandal/Events)
      let newStatus: TraineeStatus = trainee.status;
      
      // Exhaustion Check
      if (newStamina <= 0 && trainee.stamina > 0) {
        const log3 = `💔 ${trainee.name}: ${FLAVOR_TEXT.mentalBreak[Math.floor(Math.random() * FLAVOR_TEXT.mentalBreak.length)]}`;
        currentDayEvents.push(log3);
        flatLogs.push(`[${dayName}] ${log3}`);
        newSentiment = Math.max(0, newSentiment - 5);
        if (Math.random() < 0.5) currentDayEvents.push(FAN_REACTIONS.WORRIED[0]);
      }

      // Scandal Check System
      const roll = Math.random() * 100;
      const effectiveRisk = newScandalRisk + ((100 - newMental) / 20);
      
      if (roll < effectiveRisk && activity !== 'Rest') {
        const severityRoll = Math.random() * 100;
        const criticalThreshold = 5 + (trainee.scandalRisk / 2); 
        const majorThreshold = 30 + (trainee.scandalRisk / 2);

        if (severityRoll < criticalThreshold) {
            // CRITICAL
            const event = SCANDAL_EVENTS.CRITICAL[Math.floor(Math.random() * SCANDAL_EVENTS.CRITICAL.length)];
            const isEliminated = Math.random() < 0.7; 
            
            if (isEliminated) {
                newStatus = 'Eliminated';
                const log = `🚫 [비보] ${trainee.name}: ${event} (소속사 방출 결정)`;
                currentDayEvents.push(log);
                flatLogs.push(`[${dayName}] ${log}`);
            } else {
                newSentiment = Math.max(0, newSentiment - 40);
                const log = `🚨 [충격] ${trainee.name}: ${event} (팬덤 붕괴)`;
                currentDayEvents.push(log);
                flatLogs.push(`[${dayName}] ${log}`);
                currentDayEvents.push(FAN_REACTIONS.NEGATIVE[Math.floor(Math.random() * FAN_REACTIONS.NEGATIVE.length)]);
            }
        } else if (severityRoll < majorThreshold) {
            // MAJOR
            const event = SCANDAL_EVENTS.MAJOR[Math.floor(Math.random() * SCANDAL_EVENTS.MAJOR.length)];
            newSentiment = Math.max(0, newSentiment - 20);
            const log = `⚠ [논란] ${trainee.name}: ${event} (팬덤 이탈)`;
            currentDayEvents.push(log);
            flatLogs.push(`[${dayName}] ${log}`);
            currentDayEvents.push(FAN_REACTIONS.NEGATIVE[Math.floor(Math.random() * FAN_REACTIONS.NEGATIVE.length)]);
        } else {
            // MINOR
            const event = SCANDAL_EVENTS.MINOR[Math.floor(Math.random() * SCANDAL_EVENTS.MINOR.length)];
            newSentiment = Math.max(0, newSentiment - 5);
            const log = `💬 [구설수] ${trainee.name}: ${event} (이미지 타격)`;
            currentDayEvents.push(log);
            flatLogs.push(`[${dayName}] ${log}`);
        }
      }

      // 5. Fan Gain Logic
      let fanChange = 0;
      if (activity === 'Street Performance' || activity === 'Live Stream') {
        const performanceScore = (trainee.stats.visual + trainee.stats.dance + trainee.stats.vocal) / 3;
        
        if (performanceScore > 60 && newMental > 40) {
            newSentiment = Math.min(100, newSentiment + 2);
            if (Math.random() < 0.3) {
                currentDayEvents.push(FAN_REACTIONS.POSITIVE[Math.floor(Math.random() * FAN_REACTIONS.POSITIVE.length)]);
            }
        }
        let baseGain = Math.floor(Math.random() * 15) + Math.floor(performanceScore / 4);
        const sentimentMultiplier = (newSentiment - 20) / 30; 
        fanChange = Math.floor(baseGain * sentimentMultiplier);
        
        if (newMental < 30) {
             fanChange = -30; 
             newSentiment = Math.max(0, newSentiment - 5);
             const log6 = `📉 ${trainee.name}가 방송에서 불안정한 모습을 보였습니다.`;
             currentDayEvents.push(log6);
             flatLogs.push(`[${dayName}] ${log6}`);
             if (Math.random() < 0.5) currentDayEvents.push(FAN_REACTIONS.WORRIED[0]);
        }
      } 
      else if (activity === 'Rest') {
        if (Math.random() < 0.3) {
          const snsGain = Math.floor(Math.random() * 10) + 5;
          fanChange = snsGain;
          const snsLog = `📱 ${trainee.name}가 SNS에 올린 일상 사진이 반응이 좋습니다. (+${snsGain}명)`;
          currentDayEvents.push(snsLog);
          flatLogs.push(`[${dayName}] ${snsLog}`);
          newSentiment = Math.min(100, newSentiment + 1);
        }
      }
      
      if (trainee.fans > 1000 && newSentiment < 30) {
          const bleed = -Math.floor(trainee.fans * 0.01);
          fanChange += bleed; 
          if (Math.random() < 0.1) currentDayEvents.push("📉 팬들이 실망하여 팬클럽을 탈퇴하고 있습니다.");
      }

      return {
        ...trainee,
        stats: newStats,
        stamina: newStamina,
        mental: newMental,
        sentiment: newSentiment,
        scandalRisk: newScandalRisk,
        status: newStatus,
        fans: Math.max(0, trainee.fans + fanChange)
      };
    });

    dailyLogs.push({
      dayIndex,
      dayLabel: `${dayName}요일`,
      logs: currentDayEvents
    });
  }

  // --- Weekly Relationship Logic ---
  const activeTrainees = updatedTrainees.filter((t: Trainee) => t.status === 'Active');
  const weeklyEvents: string[] = [];
  
  // Create a map to easily update trainees in the array
  const traineeMap = new Map();
  activeTrainees.forEach((t: Trainee, idx: number) => traineeMap.set(t.id, idx));

  for (let i = 0; i < activeTrainees.length; i++) {
    const t1 = activeTrainees[i];
    // Ensure relations object
    if (!t1.relationships) t1.relationships = {};

    for (let j = i + 1; j < activeTrainees.length; j++) {
      const t2 = activeTrainees[j];
      if (!t2.relationships) t2.relationships = {};

      const isCompatible = checkCompatibility(t1.mbti, t2.mbti);
      
      // Init affinity if not exists (Default 50)
      if (t1.relationships[t2.id] === undefined) t1.relationships[t2.id] = 50;
      if (t2.relationships[t1.id] === undefined) t2.relationships[t1.id] = 50;

      // Affinity Change
      let change = 0;
      const roll = Math.random();

      // Logic: Compatibility + Random Events
      if (isCompatible) {
          if (roll > 0.4) change += Math.floor(Math.random() * 5); // 60% chance to increase
      } else {
          if (roll > 0.6) change -= Math.floor(Math.random() * 5); // 40% chance to decrease
      }

      // Shared Suffering/Success
      if (t1.mental < 30 && t2.mental < 30) change += 2; // Trauma bond
      if (t1.stamina < 20 && t2.stamina < 20) change -= 2; // Irritable

      // Apply Change
      const newAffinity1 = Math.min(100, Math.max(0, t1.relationships[t2.id] + change));
      const newAffinity2 = Math.min(100, Math.max(0, t2.relationships[t1.id] + change));
      
      // Sync affinity (make them feel the same for simplicity, or keep slight diff)
      const avgAffinity = Math.floor((newAffinity1 + newAffinity2) / 2);
      t1.relationships[t2.id] = avgAffinity;
      t2.relationships[t1.id] = avgAffinity;

      // Update in main array
      // We are mutating the objects inside `updatedTrainees` directly via reference since `activeTrainees` are refs
      
      // --- RELATIONSHIP EVENTS ---

      // 1. High Affinity (> 80): Romance / Besties
      if (avgAffinity > 80) {
          // Bonus: Mental Recovery
          t1.mental = Math.min(100, t1.mental + 5);
          t2.mental = Math.min(100, t2.mental + 5);
          
          if (Math.random() < 0.15) {
             const isDating = avgAffinity > 90;
             if (isDating) {
                 // DATING RISK
                 t1.scandalRisk += 10;
                 t2.scandalRisk += 10;
                 if (Math.random() < 0.2) {
                     const log = `💕 [목격] ${t1.name}와 ${t2.name}가 숙소 근처에서 몰래 만나는 모습이 포착되었습니다. (스캔들 위험 급증)`;
                     weeklyEvents.push(log);
                     flatLogs.push(`[주간] ${log}`);
                 } else {
                     const log = `💖 ${t1.name}와 ${t2.name}의 사이가 심상치 않습니다. 묘한 기류가 흐릅니다.`;
                     weeklyEvents.push(log);
                 }
             } else {
                 weeklyEvents.push(`✨ ${t1.name}와 ${t2.name}는 서로를 의지하며 힘든 연습생 생활을 버티고 있습니다. (멘탈 회복)`);
             }
          }
      }

      // 2. Low Affinity (< 20): Discord / Fight
      if (avgAffinity < 20) {
          // Penalty: Mental Drop
          t1.mental = Math.max(0, t1.mental - 5);
          t2.mental = Math.max(0, t2.mental - 5);

          if (Math.random() < 0.2) {
              if (avgAffinity < 10) {
                  // Fight
                  const log = `⚡ [불화] ${t1.name}와 ${t2.name}가 주먹 다짐을 벌였습니다! (멘탈 대폭 하락)`;
                  weeklyEvents.push(log);
                  flatLogs.push(`[주간] ${log}`);
                  t1.mental -= 15; t2.mental -= 15;
              } else {
                  // Cold War
                  const log = `🧊 ${t1.name}와 ${t2.name} 사이에 냉기류가 흐릅니다. 서로 말도 섞지 않습니다.`;
                  weeklyEvents.push(log);
                  flatLogs.push(`[주간] ${log}`);
              }
          }
      }
    }
  }

  if (weeklyEvents.length > 0) {
    dailyLogs.push({
      dayIndex: 7,
      dayLabel: '관계 및 이슈',
      logs: weeklyEvents
    });
  }

  return { updatedTrainees, dailyLogs, flatLogs };
};
