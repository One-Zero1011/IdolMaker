
import React from 'react';
import { ANNUAL_EVENTS } from '../../data/constants';
import { Calendar, Star, Trophy, Waves, Globe, Music, ChevronRight, Lock } from 'lucide-react';

interface Props {
  currentWeek: number;
  reputation: number;
}

const AnnualCalendar: React.FC<Props> = ({ currentWeek, reputation }) => {
  // 1년(52주) 단위로 현재 주차 계산
  const weekInYear = ((currentWeek - 1) % 52) + 1;
  const currentYear = Math.floor((currentWeek - 1) / 52) + 1;

  const sortedEvents = [...ANNUAL_EVENTS].sort((a, b) => a.week - b.week);

  const getIcon = (iconName: string, isLocked: boolean) => {
    if (isLocked) return <Lock size={16} className="text-zinc-600" />;
    switch (iconName) {
      case 'Star': return <Star size={16} />;
      case 'Trophy': return <Trophy size={16} />;
      case 'Waves': return <Waves size={16} />;
      case 'Globe': return <Globe size={16} />;
      case 'Music': return <Music size={16} />;
      default: return <Star size={16} />;
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Calendar size={18} className="text-yellow-500" /> {currentYear}년차 시즌 일정
          </h2>
          <span className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">Global Management Cycle</span>
        </div>
        <div className="text-xs text-zinc-500 font-mono bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
           Wk {weekInYear} / 52
        </div>
      </div>

      <div className="space-y-3">
        {sortedEvents.map((event) => {
          const isPassed = weekInYear > event.week;
          const isCurrent = weekInYear === event.week;
          const isUpcoming = weekInYear < event.week;
          const isLocked = reputation < event.minReputation;

          return (
            <div 
              key={event.id}
              className={`
                group relative flex items-center gap-4 p-3 rounded-xl border transition-all duration-300
                ${isCurrent ? 'bg-yellow-600/20 border-yellow-500 shadow-[0_0_15px_rgba(202,138,4,0.2)]' : 'bg-zinc-950/40 border-zinc-800'}
                ${isPassed ? 'opacity-30 grayscale' : ''}
                ${isLocked && isUpcoming ? 'border-dashed border-zinc-700' : ''}
              `}
            >
              {/* Week Badge */}
              <div className={`
                w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold shrink-0
                ${isCurrent ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-900/20' : isLocked ? 'bg-zinc-900 text-zinc-600' : 'bg-zinc-800 text-zinc-400'}
              `}>
                <span className="text-[8px] leading-none uppercase">Week</span>
                <span className="text-sm leading-none">{event.week}</span>
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`p-1 rounded bg-zinc-800 ${isLocked ? 'text-zinc-600' : isCurrent ? 'text-yellow-500' : 'text-zinc-500'}`}>
                    {getIcon(event.icon, isLocked)}
                  </span>
                  <h3 className={`text-sm font-bold truncate ${isLocked ? 'text-zinc-600' : isCurrent ? 'text-white' : 'text-zinc-300'}`}>
                    {isLocked ? '???' : event.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {isUpcoming && !isLocked && (
                    <p className="text-[10px] text-zinc-500 font-medium">
                      D-{event.week - weekInYear} 주 남음
                    </p>
                  )}
                  {isLocked && (
                    <p className="text-[9px] text-red-500/70 font-bold flex items-center gap-1">
                       <Lock size={8} /> 필요 평판: {event.minReputation}
                    </p>
                  )}
                  {!isLocked && !isPassed && !isCurrent && (
                     <p className="text-[9px] text-emerald-500 font-bold">참가 가능</p>
                  )}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="shrink-0">
                {isCurrent && (
                   <div className="flex items-center gap-1 text-[10px] font-black text-yellow-500 animate-pulse bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                      ON AIR <ChevronRight size={10} />
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-zinc-950/80 rounded-xl border border-zinc-800/50 flex flex-col gap-2">
         <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <span>시즌 진행도</span>
            <span>{Math.round((weekInYear / 52) * 100)}%</span>
         </div>
         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-600 transition-all duration-1000" style={{ width: `${(weekInYear / 52) * 100}%` }} />
         </div>
      </div>
    </div>
  );
};

export default AnnualCalendar;
