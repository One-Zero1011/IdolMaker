
import React, { useState } from 'react';
import { CalendarDays, Play, Battery, BatteryCharging, X, Check, TrendingUp, Wallet, Calendar, Trophy } from 'lucide-react';
import { Trainee, WeeklyPlan, ScheduleType } from '../../types/index';
import { TRANSLATIONS, DAYS, SCHEDULE_EFFECTS } from '../../data/constants';
import AnnualCalendar from '../calendar/AnnualCalendar';

interface Props {
  week: number;
  reputation: number;
  activeTrainees: Trainee[];
  weeklyPlan: WeeklyPlan;
  onScheduleChange: (dayIndex: number, type: ScheduleType) => void;
  onRunWeek: () => void;
  onOpenRanking: () => void;
}

const STAT_NAMES: Record<string, string> = {
  vocal: '보컬',
  dance: '댄스',
  rap: '랩',
  visual: '비주얼',
  leadership: '리더십'
};

const SchedulerPanel: React.FC<Props> = ({ week, reputation, activeTrainees, weeklyPlan, onScheduleChange, onRunWeek, onOpenRanking }) => {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const scheduleOptions: ScheduleType[] = [
    'Vocal Training', 'Dance Practice', 'Rap Lesson', 'Gym', 
    'Psychotherapy', 'Street Performance', 'Live Stream', 'Rest'
  ];

  const getDayColor = (type: ScheduleType) => {
    if (type === 'Rest') return 'bg-emerald-900/30 border-emerald-800 text-emerald-300';
    if (type === 'Gym') return 'bg-blue-900/30 border-blue-800 text-blue-300';
    if (['Street Performance', 'Live Stream'].includes(type)) return 'bg-yellow-900/30 border-yellow-800 text-yellow-300';
    if (type === 'Psychotherapy') return 'bg-purple-900/30 border-purple-800 text-purple-300';
    return 'bg-zinc-800 border-zinc-700 text-zinc-300';
  };

  const handleSelectSchedule = (type: ScheduleType) => {
    if (editingDay !== null) {
      onScheduleChange(editingDay, type);
      setEditingDay(null);
    }
  };

  const estimatedBalance = weeklyPlan.reduce((acc, type) => acc + (SCHEDULE_EFFECTS[type].price * activeTrainees.length), 0);

  return (
    <section className="space-y-6">
      
      {/* Header & Run Button */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="text-yellow-500" /> 팀 스케줄 관리
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-zinc-400 text-sm">이번 주 예상 정산: </p>
            <span className={`text-sm font-bold ${estimatedBalance < 0 ? 'text-red-400' : 'text-blue-400'}`}>
              ₩{estimatedBalance.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenRanking}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-lg font-bold flex items-center gap-2 border border-zinc-700 transition-all hover:scale-105 active:scale-95"
            title="랭킹 차트 보기"
          >
            <Trophy size={18} className="text-pink-500" />
            <span className="hidden sm:inline">랭킹 차트</span>
          </button>
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-lg font-bold flex items-center gap-2 border border-zinc-700 transition-all hover:scale-105 active:scale-95"
            title="연간 일정 보기"
          >
            <Calendar size={18} className="text-yellow-500" />
            <span className="hidden sm:inline">시즌 일정</span>
          </button>
          <button 
            onClick={onRunWeek}
            className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95"
          >
            <Play fill="black" size={18} /> 스케줄 실행
          </button>
        </div>
      </div>

      {/* 7-Day Planner Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weeklyPlan.map((schedule, index) => (
          <button 
            key={index} 
            onClick={() => setEditingDay(index)}
            className={`relative rounded-xl border-2 flex flex-col overflow-hidden transition-all group hover:scale-[1.02] hover:shadow-lg hover:border-yellow-500/50 cursor-pointer ${getDayColor(schedule)}`}
          >
            <div className="w-full p-2 text-center text-sm font-bold border-b border-inherit bg-black/20">
              {DAYS[index]}요일
            </div>
            
            <div className="flex-1 w-full p-3 flex flex-col items-center justify-center gap-2 min-h-[100px]">
               <div className="text-center font-semibold text-sm leading-tight">
                 {TRANSLATIONS.schedules[schedule]}
               </div>
               
               <div className="text-[10px] opacity-70 flex flex-col items-center gap-0.5">
                  <span className={SCHEDULE_EFFECTS[schedule].price < 0 ? 'text-red-300' : 'text-blue-300'}>
                    {SCHEDULE_EFFECTS[schedule].price === 0 ? 'FREE' : `₩${Math.abs(SCHEDULE_EFFECTS[schedule].price).toLocaleString()}`}
                  </span>
               </div>
            </div>
          </button>
        ))}
      </div>

      {/* Annual Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in fade-in duration-200">
           <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Calendar className="text-yellow-500" /> 월드 시즌 스케줄러
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">기획사의 명성에 따라 더 큰 무대가 열립니다.</p>
                </div>
                <button onClick={() => setIsCalendarOpen(false)} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto p-4 bg-zinc-950/20">
                <AnnualCalendar currentWeek={week} reputation={reputation} />
              </div>
              <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-center">
                 <button 
                  onClick={() => setIsCalendarOpen(false)}
                  className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all border border-zinc-700"
                 >
                   닫기
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Schedule Selection Modal */}
      {editingDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950">
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-yellow-500">{DAYS[editingDay]}요일</span> 활동 결정
                </h3>
                <button onClick={() => setEditingDay(null)} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                  <X size={32} />
                </button>
             </div>
             
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto">
                {scheduleOptions.map(option => {
                  const effects = SCHEDULE_EFFECTS[option];
                  const isSelected = weeklyPlan[editingDay] === option;
                  const isEarning = effects.price > 0;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectSchedule(option)}
                      className={`
                        relative p-5 rounded-xl border-2 text-left transition-all flex flex-col gap-4 group h-full
                        ${isSelected 
                          ? 'bg-yellow-600/20 border-yellow-500 text-white shadow-[0_0_20px_rgba(202,138,4,0.3)] scale-[1.02]' 
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750 hover:border-zinc-500 hover:scale-[1.02]'}
                      `}
                    >
                       <div className="flex justify-between items-start w-full border-b border-white/10 pb-3">
                         <div className="text-xl font-bold tracking-tight">{TRANSLATIONS.schedules[option]}</div>
                         {isSelected && <div className="bg-yellow-500 rounded-full p-1"><Check size={16} className="text-white" /></div>}
                       </div>
                       
                       <div className="space-y-4 flex-1">
                          {/* Financial Info */}
                          <div className={`flex items-center gap-2 p-3 rounded-lg border ${isEarning ? 'bg-blue-900/20 border-blue-800 text-blue-400' : effects.price < 0 ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
                             <Wallet size={18} />
                             <span className="font-bold">
                               {effects.price === 0 ? '무료 활동' : `₩${Math.abs(effects.price).toLocaleString()} / 인`}
                               {isEarning && <span className="text-[10px] ml-1 opacity-70">(팬 비례 보너스+)</span>}
                             </span>
                          </div>

                          {/* Condition Effects */}
                          <div className="flex flex-col gap-2 bg-black/20 p-3 rounded-lg">
                             <div className={`flex items-center justify-between text-sm font-bold ${effects.stamina >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                               <div className="flex items-center gap-2"><Battery size={18} /> 체력</div>
                               <span>{effects.stamina > 0 ? '+' : ''}{effects.stamina}</span>
                             </div>
                             <div className={`flex items-center justify-between text-sm font-bold ${effects.mental >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                               <div className="flex items-center gap-2"><BatteryCharging size={18} /> 멘탈</div>
                               <span>{effects.mental > 0 ? '+' : ''}{effects.mental}</span>
                             </div>
                          </div>

                          {/* Stat Gains */}
                          {Object.keys(effects.stats).length > 0 && (
                            <div className="space-y-1">
                                <div className="text-xs text-zinc-500 font-bold uppercase flex items-center gap-1 mb-1">
                                  <TrendingUp size={12} /> 능력치 변동
                                </div>
                                {Object.entries(effects.stats).map(([stat, val]) => (
                                  <div key={stat} className="flex justify-between items-center text-sm px-1">
                                      <span className="text-zinc-300">{STAT_NAMES[stat] || stat}</span>
                                      <span className="font-bold text-white">+{val}</span>
                                  </div>
                                ))}
                            </div>
                          )}
                       </div>
                    </button>
                  );
                })}
             </div>
          </div>
        </div>
      )}

      {/* Trainee Condition Monitor */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg mt-6">
         <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
           <h3 className="font-bold text-zinc-300 text-sm">아티스트 실시간 모니터링</h3>
           <div className="text-xs text-zinc-500 flex gap-3">
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>정상</span>
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>경고</span>
           </div>
         </div>
         
         <div className="divide-y divide-zinc-800">
            {activeTrainees.map(trainee => (
               <div key={trainee.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-zinc-800/30 transition-colors">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner" style={{backgroundColor: trainee.imageColor}}>
                      {trainee.name.charAt(0)}
                    </div>
                    <div className="text-sm font-bold text-white">{trainee.name}</div>
                  </div>

                  <div className="col-span-9 grid grid-cols-2 gap-6">
                     <div className="flex items-center gap-3">
                        <Battery className={`w-4 h-4 ${trainee.stamina < 30 ? 'text-red-500' : 'text-zinc-400'}`} />
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-500 ${trainee.stamina < 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${trainee.stamina}%`}} />
                          </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <BatteryCharging className={`w-4 h-4 ${trainee.mental < 30 ? 'text-red-500' : 'text-zinc-400'}`} />
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-500 ${trainee.mental < 30 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${trainee.mental}%`}} />
                          </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </section>
  );
};

export default SchedulerPanel;
