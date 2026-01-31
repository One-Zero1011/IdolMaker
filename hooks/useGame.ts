import { useState, useEffect } from 'react';
import { Trainee, WeeklyPlan, GameLog, ScheduleType } from '../types/index';
import { COLORS } from '../data/constants';
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
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>([
    'Vocal Training', 'Dance Practice', 'Vocal Training', 'Dance Practice', 'Gym', 'Street Performance', 'Rest'
  ]);
  const [gameLogs, setGameLogs] = useState<GameLog | null>(null);
  const [historyLogs, setHistoryLogs] = useState<string[]>([]);

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
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();
    const starters: Trainee[] = [
      {
        id: id1,
        name: "하나",
        age: 19,
        mbti: "ENTJ",
        position: "Leader",
        stats: { vocal: 40, dance: 30, rap: 10, visual: 60, leadership: 70 },
        stamina: 100, mental: 90, scandalRisk: 5, fans: 120, sentiment: 60, status: 'Active', history: [], imageColor: COLORS[0],
        relationships: { [id2]: 50, [id3]: 50 }
      },
      {
        id: id2,
        name: "유나",
        age: 17,
        mbti: "ISFP",
        position: "Dance",
        stats: { vocal: 20, dance: 75, rap: 10, visual: 50, leadership: 10 },
        stamina: 95, mental: 70, scandalRisk: 10, fans: 300, sentiment: 55, status: 'Active', history: [], imageColor: COLORS[3],
        relationships: { [id1]: 50, [id3]: 60 }
      },
      {
        id: id3,
        name: "지우",
        age: 20,
        mbti: "INTP",
        position: "Vocal",
        stats: { vocal: 80, dance: 20, rap: 5, visual: 40, leadership: 20 },
        stamina: 80, mental: 60, scandalRisk: 2, fans: 500, sentiment: 70, status: 'Active', history: [], imageColor: COLORS[6],
        relationships: { [id1]: 50, [id2]: 60 }
      }
    ];
    setTrainees(starters);
    setWeek(1);
    setHistoryLogs([]);
  };

  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setWeek(parsed.week || 1);
        setTrainees(parsed.trainees || []);
        setWeeklyPlan(parsed.weeklyPlan || []);
        setHistoryLogs(parsed.historyLogs || []);
      } catch (e) {
        initializeStarters();
      }
    } else {
      initializeStarters();
    }
  }, []);

  // --- Browser Storage Logic ---
  const saveToBrowser = () => {
    const dataToSave = { week, trainees, weeklyPlan, historyLogs, timestamp: new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(dataToSave));
    showMessage("브라우저 저장 완료", "현재 진행 상황이 브라우저 캐시에 저장되었습니다.", "success");
  };

  const loadFromBrowser = () => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) {
      showMessage("불러오기 실패", "브라우저에 저장된 데이터가 없습니다.", "alert");
      return;
    }
    try {
      const parsed = JSON.parse(savedData);
      setWeek(parsed.week);
      setTrainees(parsed.trainees);
      setWeeklyPlan(parsed.weeklyPlan);
      setHistoryLogs(parsed.historyLogs);
      showMessage("불러오기 성공", "브라우저 캐시에서 데이터를 성공적으로 불러왔습니다.", "success");
    } catch (e) {
      showMessage("오류", "데이터를 불러오는 중 문제가 발생했습니다.", "alert");
    }
  };

  // --- File Storage Logic ---
  const exportToFile = () => {
    const dataToSave = { week, trainees, weeklyPlan, historyLogs, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `k-idol-save-${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage("파일 내보내기", "게임 데이터 파일 다운로드가 시작되었습니다.", "success");
  };

  const importFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed.trainees || !parsed.week) throw new Error("Invalid Save File");
        setWeek(parsed.week);
        setTrainees(parsed.trainees);
        setWeeklyPlan(parsed.weeklyPlan);
        setHistoryLogs(parsed.historyLogs);
        localStorage.setItem(SAVE_KEY, content);
        showMessage("파일 불러오기 성공", "데이터를 성공적으로 복구했습니다.", "success");
      } catch (err) {
        showMessage("파일 오류", "올바르지 않은 세이브 파일입니다.", "alert");
      }
    };
    reader.readAsText(file);
  };

  const resetGame = () => {
    showMessage("게임 초기화", "정말 모든 데이터를 삭제하고 처음부터 다시 시작하시겠습니까?", "confirm", () => {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    });
  };

  const addNewTrainee = (newTraineeData: Omit<Trainee, 'id' | 'fans' | 'status' | 'history'>) => {
    const newId = generateId();
    const initialRelations: Record<string, number> = {};
    trainees.forEach(t => { initialRelations[t.id] = 50; });
    const newTrainee: Trainee = { ...newTraineeData, id: newId, fans: 0, status: 'Active', history: [], relationships: initialRelations };
    setTrainees(prev => prev.map(t => ({ ...t, relationships: { ...t.relationships, [newId]: 50 } })).concat(newTrainee));
  };

  const updateTrainee = (id: string, updatedData: Partial<Trainee>) => {
    setTrainees(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    showMessage("수정 완료", "연습생 정보가 성공적으로 업데이트되었습니다.", "success");
  };

  const removeTrainee = (id: string) => {
    const trainee = trainees.find(t => t.id === id);
    if (!trainee) return;
    showMessage("연습생 삭제", `정말 ${trainee.name} 연습생을 삭제하시겠습니까?`, "confirm", () => {
      setTrainees(prev => prev.filter(t => t.id !== id));
      showMessage("삭제 완료", "연습생이 명단에서 삭제되었습니다.", "alert");
    });
  };

  const updateDailyPlan = (dayIndex: number, type: ScheduleType) => {
    setWeeklyPlan(prev => {
      const newPlan = [...prev];
      newPlan[dayIndex] = type;
      return newPlan;
    });
  };

  const nextWeek = () => {
    const { updatedTrainees, dailyLogs, flatLogs } = processWeek(trainees, weeklyPlan);
    const nextWeekNum = week + 1;
    const newHistory = [...flatLogs.reverse(), ...historyLogs];
    setTrainees(updatedTrainees);
    setGameLogs({ week, dailyLogs, type: 'info' });
    setHistoryLogs(newHistory);
    setWeek(nextWeekNum);
    localStorage.setItem(SAVE_KEY, JSON.stringify({ week: nextWeekNum, trainees: updatedTrainees, weeklyPlan, historyLogs: newHistory, timestamp: new Date().toISOString() }));
  };

  const closeLogs = () => setGameLogs(null);
  const activeTrainees = trainees.filter(t => t.status === 'Active');

  return {
    week, trainees, activeTrainees, weeklyPlan, gameLogs, historyLogs, notification,
    addNewTrainee, updateTrainee, removeTrainee, updateDailyPlan, nextWeek, closeLogs, 
    saveToBrowser, loadFromBrowser, exportToFile, importFromFile, resetGame, closeMessage
  };
};