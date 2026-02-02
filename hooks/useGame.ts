
import { useState, useEffect, useRef } from 'react';
import { Trainee, WeeklyPlan, GameLog, ScheduleType, FacilitiesState, FacilityType, TraineeStatus, SpecialEvent, Album, AlbumConcept, RankingEntry, Group, StaffState, HQLevel, StaffRole } from '../types/index';
import { INITIAL_FUNDS, FACILITY_UPGRADE_COSTS, ANNUAL_EVENTS, ALBUM_CONCEPTS, BASE_ALBUM_PRICE, HQ_LEVELS, STAFF_ROLES } from '../data/constants';
import { generateId, processWeek, calculateGlobalRanking } from '../utils/gameLogic';

const SAVE_KEY = 'k_idol_producer_v2_save';
const TUTORIAL_KEY = 'k_idol_producer_tutorial_done';

interface NotificationState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'alert' | 'confirm' | 'success';
  onConfirm?: () => void;
}

export const useGame = () => {
  const [week, setWeek] = useState(1);
  const [funds, setFunds] = useState(INITIAL_FUNDS);
  const [reputation, setReputation] = useState(10); 
  const [lastAlbumWeek, setLastAlbumWeek] = useState(-13); 
  const [facilities, setFacilities] = useState<FacilitiesState>({
    vocal: 1, dance: 1, rap: 1, gym: 1
  });
  const [hqLevel, setHqLevel] = useState(1);
  const [staff, setStaff] = useState<StaffState>({
    manager: 0, vocal_trainer: 0, dance_trainer: 0, marketer: 0, stylist: 0
  });
  const [isRpsEnabled, setIsRpsEnabled] = useState(true); // New State for RPS toggle

  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>([
    'Vocal Training', 'Dance Practice', 'Vocal Training', 'Dance Practice', 'Gym', 'Street Performance', 'Rest'
  ]);
  const [gameLogs, setGameLogs] = useState<GameLog | null>(null);
  const [historyLogs, setHistoryLogs] = useState<string[]>([]);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [currentSpecialEvent, setCurrentSpecialEvent] = useState<SpecialEvent | null>(null);
  const [pendingDecision, setPendingDecision] = useState(false);
  const [lastEventDecisionWeek, setLastEventDecisionWeek] = useState(-1);

  // Tutorial State
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false, title: '', message: '', type: 'alert'
  });

  const showMessage = (title: string, message: string, type: 'alert' | 'confirm' | 'success' = 'alert', onConfirm?: () => void) => {
    setNotification({ isOpen: true, title, message, type, onConfirm });
  };

  const closeMessage = () => setNotification(prev => ({ ...prev, isOpen: false }));

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;
  const activeTrainees = trainees.filter(t => t.status === 'Active');
  const activeGroupMembers = trainees.filter(t => activeGroup?.memberIds.includes(t.id) && t.status === 'Active');

  // 초기화 함수
  const initializeStarters = () => {
    setWeek(1);
    setFunds(INITIAL_FUNDS);
    setReputation(10);
    setLastAlbumWeek(-13);
    setFacilities({ vocal: 1, dance: 1, rap: 1, gym: 1 });
    setHqLevel(1);
    setStaff({ manager: 0, vocal_trainer: 0, dance_trainer: 0, marketer: 0, stylist: 0 });
    setIsRpsEnabled(true);
    setTrainees([]);
    setGroups([]);
    setActiveGroupId(null);
    setAlbums([]);
    setHistoryLogs([]);
    setRanking([]);
    setGameLogs(null);
    setLastEventDecisionWeek(-1);
    setPendingDecision(false);
    setCurrentSpecialEvent(null);
    // 튜토리얼 다시 활성화
    setIsTutorialActive(true);
    setTutorialStep(0);
  };

  // 브라우저 캐시 자동 저장 (Debounced Save)
  useEffect(() => {
    const dataToSave = {
      week, funds, reputation, lastAlbumWeek, facilities, hqLevel, staff, isRpsEnabled, trainees, groups, activeGroupId, weeklyPlan, historyLogs, albums, ranking, lastEventDecisionWeek
    };
    const timeoutId = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [week, funds, reputation, trainees, groups, activeGroupId, weeklyPlan, albums, ranking, hqLevel, staff, isRpsEnabled]);

  // 첫 로드 시 브라우저 캐시에서 복원 & 튜토리얼 체크
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.week) setWeek(parsed.week);
        if (parsed.funds !== undefined) setFunds(parsed.funds);
        if (parsed.reputation !== undefined) setReputation(parsed.reputation);
        if (parsed.facilities) setFacilities(parsed.facilities);
        if (parsed.hqLevel) setHqLevel(parsed.hqLevel);
        if (parsed.staff) setStaff(parsed.staff);
        if (parsed.isRpsEnabled !== undefined) setIsRpsEnabled(parsed.isRpsEnabled);
        if (parsed.trainees) setTrainees(parsed.trainees);
        if (parsed.groups) setGroups(parsed.groups);
        if (parsed.activeGroupId) setActiveGroupId(parsed.activeGroupId);
        if (parsed.albums) setAlbums(parsed.albums);
        if (parsed.historyLogs) setHistoryLogs(parsed.historyLogs);
        if (parsed.ranking) setRanking(parsed.ranking);
        if (parsed.weeklyPlan) setWeeklyPlan(parsed.weeklyPlan);
      } catch (e) {
        console.error("Save data corruption detected.", e);
      }
    }

    // Check Tutorial Status
    const tutorialDone = localStorage.getItem(TUTORIAL_KEY);
    if (!tutorialDone) {
        setIsTutorialActive(true);
    }
  }, []);

  // 파일로 내보내기 (Export)
  const exportToFile = () => {
    const dataToSave = { week, funds, reputation, lastAlbumWeek, facilities, hqLevel, staff, isRpsEnabled, trainees, groups, activeGroupId, weeklyPlan, historyLogs, albums, ranking, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `k_idol_producer_save_week${week}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage("데이터 내보내기", "게임 진행 상황이 파일로 저장되었습니다.", "success");
  };

  // 파일에서 가져오기 (Import)
  const importFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        setWeek(parsed.week || 1);
        setFunds(parsed.funds !== undefined ? parsed.funds : INITIAL_FUNDS);
        setReputation(parsed.reputation !== undefined ? parsed.reputation : 10);
        setTrainees(parsed.trainees || []);
        setGroups(parsed.groups || []);
        setActiveGroupId(parsed.activeGroupId || (parsed.groups?.[0]?.id || null));
        setAlbums(parsed.albums || []);
        setHistoryLogs(parsed.historyLogs || []);
        setRanking(parsed.ranking || []);
        setFacilities(parsed.facilities || { vocal: 1, dance: 1, rap: 1, gym: 1 });
        setHqLevel(parsed.hqLevel || 1);
        setStaff(parsed.staff || { manager: 0, vocal_trainer: 0, dance_trainer: 0, marketer: 0, stylist: 0 });
        if (parsed.isRpsEnabled !== undefined) setIsRpsEnabled(parsed.isRpsEnabled);
        showMessage("불러오기 완료", "파일로부터 데이터를 성공적으로 복원했습니다.", "success");
      } catch (err) {
        showMessage("오류", "파일 형식이 올바르지 않습니다.", "alert");
      }
    };
    reader.readAsText(file);
  };

  const resetGame = () => {
    showMessage(
      "경고: 초기화", 
      "정말로 모든 데이터를 삭제하고 처음부터 시작하시겠습니까?", 
      "confirm", 
      () => {
        localStorage.removeItem(SAVE_KEY);
        // localStorage.removeItem(TUTORIAL_KEY); // Optional: Reset tutorial too
        initializeStarters();
        window.location.reload(); // 리셋 후 완전한 상태 전환을 위해 새로고침 (안정성 최우선)
      }
    );
  };

  const upgradeFacility = (type: FacilityType) => {
    const nextLevel = facilities[type] + 1;
    const cost = FACILITY_UPGRADE_COSTS[nextLevel];
    if (!cost) return;
    if (funds >= cost) {
      setFunds(prev => prev - cost);
      setFacilities(prev => ({ ...prev, [type]: nextLevel }));
    } else {
      showMessage("자금 부족", "시설 투자를 위한 자금이 부족합니다.", "alert");
    }
  };

  const updateDailyPlan = (dayIndex: number, type: ScheduleType) => {
    setWeeklyPlan(prev => {
      const next = [...prev];
      next[dayIndex] = type;
      return next as WeeklyPlan;
    });
  };

  const nextWeek = () => {
    if (pendingDecision) return;
    if (!activeGroup) {
      showMessage("활동 그룹 없음", "주간 스케줄을 실행할 활동 그룹을 선택해주세요.", "alert");
      return;
    }

    const weekInYear = ((week - 1) % 52) + 1;
    const annualEvent = ANNUAL_EVENTS.find(e => e.week === weekInYear && reputation >= e.minReputation);
    if (annualEvent && lastEventDecisionWeek !== week) {
       setCurrentSpecialEvent(annualEvent);
       setPendingDecision(true);
       return;
    }

    const { updatedTrainees, dailyLogs, flatLogs, fundChange, reputationChange } = processWeek(trainees, weeklyPlan, facilities, reputation, activeGroup.memberIds, staff, hqLevel);
    const newRanking = calculateGlobalRanking(updatedTrainees, albums, reputation, ranking, activeGroup);
    
    setTrainees(updatedTrainees);
    setFunds(prev => prev + fundChange);
    setReputation(prev => Math.min(100, Math.max(0, prev + reputationChange)));
    setRanking(newRanking);
    setGameLogs({ week, dailyLogs, type: 'info' });
    setHistoryLogs(prev => [...flatLogs.reverse(), ...prev]);
    setWeek(prev => prev + 1);
  };

  const handleEventDecision = (participate: boolean) => {
    if (!currentSpecialEvent) return;
    if (participate) {
      const event = currentSpecialEvent;
      if (funds < (event.costs.funds || 0)) {
        showMessage("자금 부족", "이벤트 참가 자금이 부족합니다.", "alert");
        return;
      }
      setFunds(prev => prev - (event.costs.funds || 0));
      setReputation(prev => Math.min(100, prev + (event.rewards.reputation || 0)));
      setTrainees(prev => prev.map(t => activeGroup?.memberIds.includes(t.id) ? { ...t, fans: t.fans + (event.rewards.fans || 0) } : t));
      setHistoryLogs(prev => [`[이벤트] ${event.title} 완료`, ...prev]);

      // Result Message
      const rewardsText = [
        event.rewards.fans ? `✨ 팬 유입: +${event.rewards.fans.toLocaleString()}명` : '',
        event.rewards.reputation ? `🏆 평판 상승: +${event.rewards.reputation}` : '',
        event.rewards.funds ? `💰 수익: +₩${event.rewards.funds.toLocaleString()}` : ''
      ].filter(Boolean).join('\n');

      showMessage(
        "이벤트 결과", 
        `${event.title}에 성공적으로 참가했습니다!\n\n[획득 보상]\n${rewardsText}`,
        "success"
      );
    }
    setPendingDecision(false);
    setCurrentSpecialEvent(null);
    setLastEventDecisionWeek(week);
  };

  const produceAlbum = (title: string, concept: AlbumConcept, price: number) => {
    if (!activeGroup || activeGroupMembers.length === 0) return null;
    const productionCost = 200000;
    if (funds < productionCost) return null;

    const conceptConfig = ALBUM_CONCEPTS[concept];
    let totalQuality = 0;
    activeGroupMembers.forEach(artist => {
      let score = 0;
      Object.entries(conceptConfig.weights).forEach(([stat, weight]) => {
        score += (artist.stats[stat as keyof typeof artist.stats] || 0) * (weight as number);
      });
      totalQuality += score;
    });

    const quality = Math.min(100, Math.floor((totalQuality / activeGroupMembers.length) * (0.8 + Math.random() * 0.4)));
    const priceRatio = price / BASE_ALBUM_PRICE;
    const elasticity = Math.pow(1 / priceRatio, 2.0);
    const sales = Math.floor((quality / 10) * Math.pow(reputation, 1.6) * elasticity * 0.8 + Math.random() * 500);
    const peak = Math.max(1, 101 - Math.floor(quality * (reputation/100) + Math.random() * 10));

    setFunds(prev => prev - productionCost);
    setLastAlbumWeek(week);

    return { album: { id: generateId(), title, concept, releaseWeek: week, quality, price, sales, peakChart: peak, isBillboard: quality > 92 && reputation > 88 }, revenue: sales * price };
  };

  const settleAlbumRevenue = (album: Album, totalRevenue: number) => {
    const priceRatio = album.price / BASE_ALBUM_PRICE;
    let repChange = album.quality / 40;
    let fanMult = 1.0;
    if (priceRatio > 1) { repChange -= (priceRatio - 1) * 12; fanMult = 0.6; }
    else if (priceRatio < 1) { repChange += (1 - priceRatio) * 6; fanMult = 1.4; }

    setFunds(prev => prev + totalRevenue);
    setReputation(prev => Math.min(100, Math.max(0, prev + repChange)));
    setAlbums(prev => [album, ...prev]);
    setTrainees(prev => prev.map(t => activeGroup?.memberIds.includes(t.id) ? { ...t, fans: t.fans + Math.floor((album.sales/100) * fanMult) } : t));
    setHistoryLogs(prev => [`💿 ${activeGroup?.name}의 '${album.title}' 정산 완료 (수익: ₩${totalRevenue.toLocaleString()})`, ...prev]);
  };

  const updateTrainee = (id: string, data: Partial<Trainee>) => {
    setTrainees(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  // --- HQ & Staff Functions ---

  const upgradeHQ = () => {
    const nextLevel = HQ_LEVELS.find(h => h.level === hqLevel + 1);
    if (!nextLevel) return;
    
    if (funds >= nextLevel.cost) {
      setFunds(prev => prev - nextLevel.cost);
      setHqLevel(nextLevel.level);
      showMessage("사옥 확장 완료", `${nextLevel.name}(으)로 사옥을 이전했습니다! 이제 더 많은 스태프를 고용할 수 있습니다.`, "success");
    } else {
      showMessage("자금 부족", "사옥 확장에 필요한 자금이 부족합니다.", "alert");
    }
  };

  const hireStaff = (roleId: StaffRole) => {
    const role = STAFF_ROLES.find(r => r.id === roleId);
    if (!role) return;

    const currentTotalStaff = (Object.values(staff) as number[]).reduce((a, b) => a + b, 0);
    const hq = HQ_LEVELS.find(h => h.level === hqLevel)!;

    if (currentTotalStaff >= hq.maxStaff) {
      showMessage("정원 초과", "사옥의 최대 스태프 수용 인원을 초과했습니다. 사옥을 확장하세요.", "alert");
      return;
    }

    if (funds >= role.hireCost) {
      setFunds(prev => prev - role.hireCost);
      setStaff(prev => ({ ...prev, [roleId]: prev[roleId] + 1 }));
      showMessage("채용 완료", `${role.name}을(를) 고용했습니다. 매주 급여가 지급됩니다.`, "success");
    } else {
      showMessage("자금 부족", "고용 계약금이 부족합니다.", "alert");
    }
  };

  const fireStaff = (roleId: StaffRole) => {
    if (staff[roleId] > 0) {
      setStaff(prev => ({ ...prev, [roleId]: prev[roleId] - 1 }));
    }
  };

  const renewContract = (id: string, cost: number) => {
    if (funds < cost) return false;
    setFunds(prev => prev - cost);
    setTrainees(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        contractRemaining: t.contractRemaining + 48,
        mental: Math.min(100, t.mental + 20),
        sentiment: Math.min(100, t.sentiment + 10)
      } : t
    ));
    return true;
  };

  // Tutorial Controls
  const tutorialControls = {
    isActive: isTutorialActive,
    step: tutorialStep,
    next: () => setTutorialStep(prev => prev + 1),
    prev: () => setTutorialStep(prev => prev - 1),
    close: () => {
        setIsTutorialActive(false);
        localStorage.setItem(TUTORIAL_KEY, 'true');
    },
    start: () => {
        setIsTutorialActive(true);
        setTutorialStep(0);
    }
  };

  return {
    week, funds, reputation, lastAlbumWeek, facilities, trainees, activeTrainees, activeGroupMembers, 
    weeklyPlan, gameLogs, historyLogs, notification, albums, ranking, isChartOpen, groups, activeGroupId, activeGroup,
    currentSpecialEvent, pendingDecision, hqLevel, staff, isRpsEnabled,
    tutorialControls,
    addNewTrainee: (data: any, cost: number) => { setFunds(prev => prev - cost); setTrainees(prev => [...prev, { ...data, id: generateId(), fans: 0, status: 'Active', contractRemaining: 48, history: [], relationships: {}, specialRelations: {} }]); },
    removeTrainee: (id: string) => setTrainees(prev => prev.filter(t => t.id !== id)),
    updateTrainee,
    upgradeFacility, updateDailyPlan, nextWeek, closeLogs: () => setGameLogs(null), setIsChartOpen, setActiveGroupId,
    exportToFile, importFromFile, resetGame, closeMessage, handleEventDecision, produceAlbum, settleAlbumRevenue,
    formGroup: (name: string, memberIds: string[], type: any) => { setGroups(prev => [...prev, { id: generateId(), name, memberIds, type, formedWeek: week }]); showMessage("그룹 결성", `${name}가 데뷔했습니다!`, "success"); },
    upgradeHQ, hireStaff, fireStaff, renewContract,
    toggleRps: () => setIsRpsEnabled(prev => !prev)
  };
};
