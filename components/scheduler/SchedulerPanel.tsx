import React, { useState } from 'react';
import { CalendarDays, Play, Battery, BatteryCharging, X, Check, TrendingUp } from 'lucide-react';
import { Trainee, WeeklyPlan, ScheduleType } from '../../types/index';
import { TRANSLATIONS, DAYS, SCHEDULE_EFFECTS } from '../../data/constants';

interface Props {
  activeTrainees: Trainee[];
  weeklyPlan: WeeklyPlan;
  onScheduleChange: (dayIndex: number, type: ScheduleType) => void;
  onRunWeek: () => void;
}

const STAT_NAMES: Record<string, string> = {
  vocal: '보컬',
  dance: '댄스',
  rap: '랩',
  visual: '비주얼',
  leadership: '리더십'
};

const SchedulerPanel: React.FC<Props> = ({ activeTrainees, weeklyPlan, onScheduleChange, onRunWeek }) => {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  
  const scheduleOptions: ScheduleType[] = [
    'Vocal Training', 'Dance Practice', 'Rap Lesson', 'Gym', 
    'Psychotherapy', 'Street Performance', 'Live Stream', 'Rest'
  ];

  const getDayColor = (type: ScheduleType) => {
    if (type === 'Rest') return 'bg-emerald-900/30 border-emerald-800 text-emerald-300';
    if (type === 'Gym') return 'bg-blue-900/30 border-blue-800 text-blue-300';
    if (['Street Performance', 'Live Stream'].includes(type)) return 'bg-pink-900/30 border-pink-800 text-pink-300';
    if (type === 'Psychotherapy') return 'bg-purple-900/30 border-purple-800 text-purple-300';
    return 'bg-zinc-800 border-zinc-700 text-zinc-300';
  };

  const handleSelectSchedule = (type: ScheduleType) => {
    if (editingDay !== null) {
      onScheduleChange(editingDay, type);
      setEditingDay(null);
    }
  };

  return (
    <section className="space-y-6">
      
      {/* Header & Run Button */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="text-pink-500" /> 팀 스케줄 (주간)
          </h2>
          <p className="text-zinc-400 text-sm mt-1">모든 멤버가 함께 수행할 이번 주의 일정을 계획하세요.</p>
        </div>
        <button 
          onClick={onRunWeek}
          className="bg-white hover:bg-zinc-200 text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95"
        >
          <Play fill="black" size={18} /> 스케줄 실행
        </button>
      </div>

      {/* 7-Day Planner Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weeklyPlan.map((schedule, index) => (
          <button 
            key={index} 
            onClick={() => setEditingDay(index)}
            className={`relative rounded-xl border-2 flex flex-col overflow-hidden transition-all group hover:scale-[1.02] hover:shadow-lg hover:border-pink-500/50 cursor-pointer ${getDayColor(schedule)}`}
          >
            {/* Day Header */}
            <div className="w-full p-2 text-center text-sm font-bold border-b border-inherit bg-black/20">
              {DAYS[index]}요일
            </div>
            
            {/* Active Schedule Selection */}
            <div className="flex-1 w-full p-3 flex flex-col items-center justify-center gap-2 min-h-[100px]">
               <div className="text-center font-semibold text-sm leading-tight">
                 {TRANSLATIONS.schedules[schedule]}
               </div>
               
               {/* Effect Hint */}
               <div className="text-[10px] opacity-70 flex flex-col items-center gap-0.5">
                  {SCHEDULE_EFFECTS[schedule].stamina < 0 && <span className="text-red-300">HP {SCHEDULE_EFFECTS[schedule].stamina}</span>}
                  {SCHEDULE_EFFECTS[schedule].stamina > 0 && <span className="text-emerald-300">HP +{SCHEDULE_EFFECTS[schedule].stamina}</span>}
                  {SCHEDULE_EFFECTS[schedule].risk > 0 && <span className="text-orange-300">⚠ 위험 {SCHEDULE_EFFECTS[schedule].risk}%</span>}
               </div>
            </div>
          </button>
        ))}
      </div>

      {/* Schedule Selection Modal - UPSIZED */}
      {editingDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950">
                <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-pink-500">{DAYS[editingDay]}요일</span> 일정 선택
                </h3>
                <button onClick={() => setEditingDay(null)} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                  <X size={32} />
                </button>
             </div>
             
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto">
                {scheduleOptions.map(option => {
                  const effects = SCHEDULE_EFFECTS[option];
                  const isSelected = weeklyPlan[editingDay] === option;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelectSchedule(option)}
                      className={`
                        relative p-5 rounded-xl border-2 text-left transition-all flex flex-col gap-4 group h-full
                        ${isSelected 
                          ? 'bg-pink-600/20 border-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] scale-[1.02]' 
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750 hover:border-zinc-500 hover:scale-[1.02]'}
                      `}
                    >
                       <div className="flex justify-between items-start w-full border-b border-white/10 pb-3">
                         <div className="text-xl font-bold tracking-tight">{TRANSLATIONS.schedules[option]}</div>
                         {isSelected && <div className="bg-pink-500 rounded-full p-1"><Check size={16} className="text-white" /></div>}
                       </div>
                       
                       <div className="space-y-4 flex-1">
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
                          {Object.keys(effects.stats).length > 0 ? (
                            <div className="space-y-1">
                                <div className="text-xs text-zinc-500 font-bold uppercase flex items-center gap-1 mb-1">
                                  <TrendingUp size={12} /> 능력치 상승
                                </div>
                                {Object.entries(effects.stats).map(([stat, val]) => (
                                  <div key={stat} className="flex justify-between items-center text-sm px-1">
                                      <span className="text-zinc-300">{STAT_NAMES[stat] || stat}</span>
                                      <span className="font-bold text-white">+{val}</span>
                                  </div>
                                ))}
                            </div>
                          ) : (
                             <div className="text-sm text-zinc-500 italic py-2 text-center">능력치 변동 없음</div>
                          )}
                       </div>

                       {/* Risk */}
                       {effects.risk > 0 ? (
                         <div className="mt-2 text-base text-orange-400 font-bold flex items-center justify-center gap-2 bg-orange-950/30 p-3 rounded-lg border border-orange-900/50">
                            <span className="animate-pulse">⚠</span> 스캔들 {effects.risk}%
                         </div>
                       ) : (
                         <div className="mt-2 p-3 text-center text-sm text-emerald-500/50 font-medium">
                            안전한 활동
                         </div>
                       )}
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
           <h3 className="font-bold text-zinc-300 text-sm">멤버 컨디션 모니터링</h3>
           <div className="text-xs text-zinc-500 flex gap-3">
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>안전</span>
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>위험</span>
           </div>
         </div>
         
         <div className="divide-y divide-zinc-800">
            {activeTrainees.map(trainee => (
               <div key={trainee.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-zinc-800/30 transition-colors">
                  {/* Info */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner" style={{backgroundColor: trainee.imageColor}}>
                      {trainee.name.charAt(0)}
                    </div>
                    <div className="text-sm font-bold text-white">{trainee.name}</div>
                  </div>

                  {/* Bars */}
                  <div className="col-span-9 grid grid-cols-2 gap-6">
                     {/* Stamina */}
                     <div className="flex items-center gap-3">
                        <Battery className={`w-4 h-4 ${trainee.stamina < 30 ? 'text-red-500' : 'text-zinc-400'}`} />
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
                             <span>체력 (HP)</span>
                             <span className={trainee.stamina < 30 ? 'text-red-500 font-bold' : ''}>{Math.round(trainee.stamina)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-500 ${trainee.stamina < 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${trainee.stamina}%`}} />
                          </div>
                        </div>
                     </div>
                     
                     {/* Mental */}
                     <div className="flex items-center gap-3">
                        <BatteryCharging className={`w-4 h-4 ${trainee.mental < 30 ? 'text-red-500' : 'text-zinc-400'}`} />
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
                             <span>멘탈 (Mental)</span>
                             <span className={trainee.mental < 30 ? 'text-red-500 font-bold' : ''}>{Math.round(trainee.mental)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-500 ${trainee.mental < 30 ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${trainee.mental}%`}} />
                          </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
            {activeTrainees.length === 0 && (
               <div className="p-6 text-center text-zinc-500 text-sm">연습생이 없습니다.</div>
            )}
         </div>
      </div>

    </section>
  );
};

export default SchedulerPanel;