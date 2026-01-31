
import { useState, useEffect } from 'react';
import { Trainee, WeeklyPlan, GameLog, ScheduleType, FacilitiesState, FacilityType, TraineeStatus, SpecialEvent, Album, AlbumConcept } from '../types/index';
import { COLORS, INITIAL_FUNDS, FACILITY_UPGRADE_COSTS, ANNUAL_EVENTS, ALBUM_CONCEPTS, BASE_ALBUM_PRICE } from '../data/constants';
import { generateId, processWeek } from '../utils/gameLogic';

const SAVE_KEY = 'k_idol_producer_v1_save';

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
    vocal: 1,
    dance: 1,
    rap: 1,
    gym: 1
  });
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>([
    'Vocal Training', 'Dance Practice', 'Vocal Training', 'Dance Practice', 'Gym', 'Street Performance', 'Rest'
  ]);
  const [gameLogs, setGameLogs] = useState<GameLog | null>(null);
  const [historyLogs, setHistoryLogs] = useState<string[]>([]);
  
  const [currentSpecialEvent, setCurrentSpecialEvent] = useState<SpecialEvent | null>(null);
  const [lastParticipatedEvent, setLastParticipatedEvent] = useState<SpecialEvent | null>(null); 
  const [pendingDecision, setPendingDecision] = useState(false);

  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert'
  });

  const showMessage = (title: string, message: string, type: 'alert' | 'confirm' | 'success' = 'alert', onConfirm?: () => void) => {
    setNotification({ isOpen: true, title, message, type, onConfirm });
  };

  const closeMessage = () => setNotification(prev => ({ ...prev, isOpen: false }));

  const initializeStarters = () => {
    setTrainees([]);
    setWeek(1);
    setFunds(INITIAL_FUNDS);
    setReputation(10);
    setLastAlbumWeek(-13);
    setLastParticipatedEvent(null);
    setFacilities({ vocal: 1, dance: 1, rap: 1, gym: 1 });
    setHistoryLogs([]);
    setAlbums([]);
  };

  useEffect(() => {
    const weekInYear = ((week - 1) % 52) + 1;
    const event = ANNUAL_EVENTS.find(e => e.week === weekInYear);
    
    if (event) {
      if (reputation >= event.minReputation) {
        setCurrentSpecialEvent(event);
        setPendingDecision(true);
      } else {
        setHistoryLogs(prev => [`[시스템] 기획사 명성(Reputation) 부족으로 인해 '${event.title}' 참가가 무산되었습니다.`, ...prev]);
      }
    }
  }, [week]);

  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWeek(parsed.week || 1);
        setFunds(parsed.funds !== undefined ? parsed.funds : INITIAL_FUNDS);
        setReputation(parsed.reputation !== undefined ? parsed.reputation : 10);
        setLastAlbumWeek(parsed.lastAlbumWeek !== undefined ? parsed.lastAlbumWeek : -13);
        setFacilities(parsed.facilities || { vocal: 1, dance: 1, rap: 1, gym: 1 });
        setTrainees(parsed.trainees || []);
        setWeeklyPlan(parsed.weeklyPlan || []);
        setHistoryLogs(parsed.historyLogs || []);
        setAlbums(parsed.albums || []);
      } catch (e) {
        initializeStarters();
      }
    } else {
      initializeStarters();
    }
  }, []);

  const saveToBrowser = () => {
    const dataToSave = { week, funds, reputation, lastAlbumWeek, facilities, trainees, weeklyPlan, historyLogs, albums, timestamp: new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
    showMessage("브라우저 저장 완료", "현재 진행 상황이 브라우저 캐시에 저장되었습니다.", "success");
  };

  const loadFromBrowser = () => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWeek(parsed.week || 1);
        setFunds(parsed.funds !== undefined ? parsed.funds : INITIAL_FUNDS);
        setReputation(parsed.reputation !== undefined ? parsed.reputation : 10);
        setLastAlbumWeek(parsed.lastAlbumWeek !== undefined ? parsed.lastAlbumWeek : -13);
        setFacilities(parsed.facilities || { vocal: 1, dance: 1, rap: 1, gym: 1 });
        setTrainees(parsed.trainees || []);
        setWeeklyPlan(parsed.weeklyPlan || []);
        setHistoryLogs(parsed.historyLogs || []);
        setAlbums(parsed.albums || []);
        showMessage("불러오기 완료", "저장된 데이터를 성공적으로 불러왔습니다.", "success");
      } catch (e) {
        showMessage("불러오기 실패", "데이터 형식이 올바르지 않습니다.", "alert");
      }
    } else {
      showMessage("데이터 없음", "저장된 데이터가 없습니다.", "alert");
    }
  };

  const exportToFile = () => {
    const dataToSave = { week, funds, reputation, lastAlbumWeek, facilities, trainees, weeklyPlan, historyLogs, albums, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `k_idol_producer_save_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        setWeek(parsed.week || 1);
        setFunds(parsed.funds !== undefined ? parsed.funds : INITIAL_FUNDS);
        setReputation(parsed.reputation !== undefined ? parsed.reputation : 10);
        setLastAlbumWeek(parsed.lastAlbumWeek !== undefined ? parsed.lastAlbumWeek : -13);
        setFacilities(parsed.facilities || { vocal: 1, dance: 1, rap: 1, gym: 1 });
        setTrainees(parsed.trainees || []);
        setWeeklyPlan(parsed.weeklyPlan || []);
        setHistoryLogs(parsed.historyLogs || []);
        setAlbums(parsed.albums || []);
        showMessage("가져오기 완료", "파일에서 데이터를 성공적으로 가져왔습니다.", "success");
      } catch (err) {
        showMessage("가져오기 실패", "올바른 JSON 파일이 아닙니다.", "alert");
      }
    };
    reader.readAsText(file);
  };

  const resetGame = () => {
    showMessage("초기화 확인", "정말로 모든 진행 상황을 초기화하시겠습니까? 되돌릴 수 없습니다.", "confirm", () => {
      initializeStarters();
      localStorage.removeItem(SAVE_KEY);
      showMessage("초기화 완료", "모든 데이터가 초기화되었습니다.", "success");
    });
  };

  const produceAlbum = (title: string, concept: AlbumConcept, price: number) => {
    if (week - lastAlbumWeek < 13) {
      showMessage("제작 불가", `아직 다음 앨범을 준비하기에 이릅니다. (${13 - (week - lastAlbumWeek)}주 후 가능)`, "alert");
      return null;
    }

    const activeArtists = trainees.filter(t => t.status === 'Active');
    if (activeArtists.length === 0) {
      showMessage("활동 중단", "활동 가능한 아티스트가 없습니다.", "alert");
      return null;
    }

    const productionCost = 200000;
    if (funds < productionCost) {
      showMessage("자금 부족", "앨범 제작비(₩200,000)가 부족합니다.", "alert");
      return null;
    }

    const conceptConfig = ALBUM_CONCEPTS[concept];
    let totalQuality = 0;
    activeArtists.forEach(artist => {
      let artistScore = 0;
      Object.entries(conceptConfig.weights).forEach(([stat, weight]) => {
        artistScore += (artist.stats[stat as keyof typeof artist.stats] as number) * (weight as number);
      });
      totalQuality += artistScore;
    });
    
    const baseQuality = totalQuality / activeArtists.length;
    const randomFactor = 0.8 + Math.random() * 0.4;
    const finalQuality = Math.min(100, Math.floor(baseQuality * randomFactor));
    
    const priceElasticity = Math.pow(BASE_ALBUM_PRICE / price, 2.0); // 가격 탄력성 추가 강화
    
    // [밸런스 대폭 하향] 계수를 3 -> 0.8로 하향 조정. 평판이 낮으면 앨범 제작비를 건지기도 어려움.
    const baseSales = (finalQuality / 10) * Math.pow(reputation, 1.6) * 0.8;
    const finalSales = Math.floor(baseSales * priceElasticity + (Math.random() * reputation * 15));
    
    const chartRank = Math.max(1, Math.min(100, 101 - Math.floor(finalQuality * (reputation / 100) * (priceElasticity > 1 ? 1 : priceElasticity) + Math.random() * 10)));
    const isBillboard = finalQuality > 92 && reputation > 88 && priceElasticity >= 0.95;
    
    setFunds(prev => prev - productionCost);
    setLastAlbumWeek(week);

    const newAlbum: Album = {
      id: generateId(),
      title,
      concept,
      releaseWeek: week,
      quality: finalQuality,
      price: price,
      sales: finalSales,
      peakChart: chartRank,
      isBillboard
    };

    return { album: newAlbum, revenue: finalSales * price };
  };

  const settleAlbumRevenue = (album: Album, totalRevenue: number) => {
    setFunds(prev => prev + totalRevenue);
    setReputation(prev => Math.min(100, prev + (album.quality / 40))); 
    setAlbums(prev => [album, ...prev]);
    
    setTrainees(prev => prev.map(t => t.status === 'Active' ? { 
      ...t, 
      fans: t.fans + Math.floor(album.sales / 120), // 팬 유입 난이도 추가 상승
      stamina: Math.max(0, t.stamina - 45),
      mental: Math.max(0, t.mental - 35)
    } : t));

    const logText = `💿 [컴백 결과] '${album.title}' 활동 정산 완료. 수익: ₩${totalRevenue.toLocaleString()}`;
    setHistoryLogs(prev => [logText, ...prev]);
  };

  const addNewTrainee = (newTraineeData: Omit<Trainee, 'id' | 'fans' | 'status' | 'history' | 'contractRemaining'>, castingCost: number) => {
    if (funds < castingCost) {
      showMessage("자금 부족", "캐스팅 비용이 부족합니다.", "alert");
      return;
    }

    const newId = generateId();
    const newTrainee: Trainee = { 
      ...newTraineeData, 
      id: newId, 
      fans: 0, 
      status: 'Active', 
      history: [], 
      relationships: {},
      contractRemaining: 48 
    };

    setFunds(prev => prev - castingCost);
    setTrainees(prev => prev.concat(newTrainee));
    
    if (castingCost > 0) {
      setHistoryLogs(prev => [`[시스템] ₩${castingCost.toLocaleString()}을 투자하여 새로운 아티스트 '${newTrainee.name}'를 영입했습니다.`, ...prev]);
    }
  };

  const updateTrainee = (id: string, updatedData: Partial<Trainee>) => {
    setTrainees(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const removeTrainee = (id: string) => {
    setTrainees(prev => prev.filter(t => t.id !== id));
  };

  const renewContract = (id: string, cost: number) => {
    if (funds < cost) {
      showMessage("자금 부족", "재계약금을 지불할 자산이 부족합니다.", "alert");
      return;
    }
    setFunds(prev => prev - cost);
    setTrainees(prev => prev.map(t => t.id === id ? { ...t, contractRemaining: t.contractRemaining + 48, status: 'Active' } : t));
    showMessage("재계약 체결", "아티스트와 성공적으로 파트너십을 연장했습니다.", "success");
  };

  const releaseTrainee = (id: string) => {
    setTrainees(prev => prev.map(t => t.id === id ? { ...t, status: 'Contract Terminated', contractRemaining: 0 } : t));
    showMessage("계약 종료", "아티스트와의 전속 계약이 종료되었습니다.", "alert");
  };

  const upgradeFacility = (type: FacilityType) => {
    const currentLevel = facilities[type];
    if (currentLevel >= 10) {
      showMessage("최고 레벨", "이미 최대 레벨(10)에 도달했습니다.", "alert");
      return;
    }
    const cost = FACILITY_UPGRADE_COSTS[currentLevel + 1];
    if (funds < cost) {
      showMessage("자금 부족", "시설 업그레이드 비용이 부족합니다.", "alert");
      return;
    }

    setFunds(prev => prev - cost);
    setFacilities(prev => ({ ...prev, [type]: currentLevel + 1 }));
    setReputation(prev => Math.min(100, prev + 1)); 
    showMessage("업그레이드 완료", `${type.toUpperCase()} 시설 투자로 기획사 이미지가 개선되었습니다! (+평판)`, "success");
  };

  const updateDailyPlan = (dayIndex: number, type: ScheduleType) => {
    setWeeklyPlan(prev => {
      const newPlan = [...prev];
      newPlan[dayIndex] = type;
      return newPlan;
    });
  };

  const handleEventDecision = (participate: boolean) => {
    if (!currentSpecialEvent) return;

    if (participate) {
      const event = currentSpecialEvent;
      setLastParticipatedEvent(event); 
      
      if (event.costs.funds) setFunds(prev => prev - (event.costs.funds || 0));
      
      setTrainees(prev => prev.map(t => {
         if (t.status !== 'Active') return t;
         return {
            ...t,
            stamina: Math.max(0, t.stamina - (event.costs.stamina || 0)),
            mental: Math.max(0, t.mental - (event.costs.mental || 0)),
            fans: t.fans + (event.rewards.fans || 0),
         };
      }));

      if (event.rewards.reputation) setReputation(prev => Math.min(100, prev + (event.rewards.reputation || 0)));
      if (event.rewards.funds) setFunds(prev => prev + (event.rewards.funds || 0));

      const logText = `✨ [이벤트 참가] ${event.title}에 참가하여 커다란 성과를 거두었습니다!`;
      setHistoryLogs(prev => [logText, ...prev]);
    } else {
      const logText = `💤 [이벤트 패스] ${currentSpecialEvent.title} 참가를 포기하고 휴식을 선택했습니다.`;
      setHistoryLogs(prev => [logText, ...prev]);
      setReputation(prev => Math.max(0, prev - 1)); 
    }

    setPendingDecision(false);
    setCurrentSpecialEvent(null);
  };

  const nextWeek = () => {
    if (pendingDecision) {
      showMessage("이벤트 결정 필요", "이번 주의 특별 이벤트 참가 여부를 먼저 결정해야 합니다.", "alert");
      return;
    }

    const { updatedTrainees, dailyLogs, flatLogs, fundChange, reputationChange } = processWeek(trainees, weeklyPlan, facilities, reputation);
    
    if (lastParticipatedEvent) {
      const eventLog = `✨ [시즌 이벤트] '${lastParticipatedEvent.title}' 활동을 성공적으로 마쳤습니다! (+팬덤, +명성)`;
      dailyLogs[6].logs.push(eventLog);
      setLastParticipatedEvent(null); 
    }

    const finalizedTrainees: Trainee[] = updatedTrainees.map((t: Trainee) => {
      if (t.status === 'Active' || t.status === 'Hospitalized') {
        const nextContract = Math.max(0, t.contractRemaining - 1);
        const nextStatus: TraineeStatus = nextContract === 0 ? 'Contract Terminated' : t.status;
        return { ...t, contractRemaining: nextContract, status: nextStatus };
      }
      return t;
    });

    const nextWeekNum = week + 1;
    const newFunds = funds + fundChange;
    const newReputation = Math.min(100, Math.max(0, reputation + reputationChange));
    const newHistory = [...flatLogs.reverse(), ...historyLogs];
    
    setTrainees(finalizedTrainees);
    setFunds(newFunds);
    setReputation(newReputation);
    setGameLogs({ week, dailyLogs, type: 'info' });
    setHistoryLogs(newHistory);
    setWeek(nextWeekNum);

    const expiringSoon = finalizedTrainees.filter((t: Trainee) => t.contractRemaining <= 12 && t.contractRemaining > 0 && t.status === 'Active');
    if (expiringSoon.length > 0) {
      const names = expiringSoon.map((t: Trainee) => t.name).join(', ');
      showMessage("계약 만료 임박", `${names} 아티스트의 계약 만료가 3개월(12주) 앞으로 다가왔습니다. 재계약을 검토하세요.`, "alert");
    }

    if (newFunds < 0) {
      showMessage("경영 위기", "회사의 자금이 바닥났습니다! 수익 활동에 집중하세요.", "alert");
    }
  };

  const closeLogs = () => setGameLogs(null);
  const activeTrainees = trainees.filter(t => t.status === 'Active');

  return {
    week, funds, reputation, lastAlbumWeek, facilities, trainees, activeTrainees, weeklyPlan, gameLogs, historyLogs, notification, albums,
    currentSpecialEvent, pendingDecision,
    addNewTrainee, updateTrainee, removeTrainee, renewContract, releaseTrainee, upgradeFacility, updateDailyPlan, nextWeek, closeLogs, 
    saveToBrowser, loadFromBrowser, exportToFile, importFromFile, resetGame, closeMessage, handleEventDecision, produceAlbum, settleAlbumRevenue
  };
};
