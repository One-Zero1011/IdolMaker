
import React from 'react';
import { SpecialEvent, Trainee } from '../types/index';
import { X, Check, Star, Trophy, Waves, Globe, Music, AlertTriangle, TrendingUp, Battery, Wallet } from 'lucide-react';

interface Props {
  isOpen: boolean;
  event: SpecialEvent | null;
  funds: number;
  onDecision: (participate: boolean) => void;
}

const SpecialEventModal: React.FC<Props> = ({ isOpen, event, funds, onDecision }) => {
  if (!isOpen || !event) return null;

  const canAfford = !event.costs.funds || funds >= event.costs.funds;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Star': return <Star size={48} />;
      case 'Trophy': return <Trophy size={48} />;
      case 'Waves': return <Waves size={48} />;
      case 'Globe': return <Globe size={48} />;
      case 'Music': return <Music size={48} />;
      default: return <Star size={48} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Banner Section */}
        <div className={`relative h-48 bg-gradient-to-br ${event.bannerColor} flex flex-col items-center justify-center p-8 text-white overflow-hidden`}>
           {/* Abstract BG Decorations */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-3xl" />
           
           <div className="relative z-10 p-4 bg-black/20 rounded-full backdrop-blur-md border border-white/20 mb-4 scale-110 shadow-xl">
             {getIcon(event.icon)}
           </div>
           <div className="relative z-10 text-center">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Weekly Special Event</div>
             <h2 className="text-3xl font-black tracking-tight drop-shadow-lg">{event.title}</h2>
           </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8">
           <div className="space-y-3">
              <h3 className="text-zinc-100 font-bold flex items-center gap-2">
                 <AlertTriangle size={16} className="text-yellow-500" /> 이벤트 개요
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                {event.description}
              </p>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {/* Requirements / Costs */}
              <div className="space-y-3">
                 <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">요구 사항 & 비용</h4>
                 <div className="space-y-2">
                    {event.costs.funds && (
                      <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-lg border border-zinc-800">
                         <div className="flex items-center gap-2 text-zinc-400 text-xs"><Wallet size={14} /> 자금</div>
                         <span className={`text-sm font-bold ${canAfford ? 'text-zinc-200' : 'text-red-500'}`}>-₩{event.costs.funds.toLocaleString()}</span>
                      </div>
                    )}
                    {event.costs.stamina && (
                      <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-lg border border-zinc-800">
                         <div className="flex items-center gap-2 text-zinc-400 text-xs"><Battery size={14} /> 평균 체력</div>
                         <span className="text-sm font-bold text-orange-400">-{event.costs.stamina}</span>
                      </div>
                    )}
                 </div>
              </div>

              {/* Rewards */}
              <div className="space-y-3">
                 <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest">예상 기대 보상</h4>
                 <div className="space-y-2">
                    {event.rewards.reputation && (
                      <div className="flex items-center justify-between bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
                         <div className="flex items-center gap-2 text-emerald-400/80 text-xs"><TrendingUp size={14} /> 평판</div>
                         <span className="text-sm font-black text-emerald-400">+{event.rewards.reputation}</span>
                      </div>
                    )}
                    {event.rewards.fans && (
                      <div className="flex items-center justify-between bg-pink-950/20 p-2.5 rounded-lg border border-pink-900/30">
                         <div className="flex items-center gap-2 text-pink-400/80 text-xs"><Star size={14} /> 신규 팬덤</div>
                         <span className="text-sm font-black text-pink-400">+{event.rewards.fans.toLocaleString()}</span>
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {!canAfford && (
             <div className="p-3 bg-red-900/10 border border-red-900/30 rounded-lg text-center">
                <p className="text-[11px] text-red-400 font-bold italic">자금이 부족하여 참가가 불가능합니다.</p>
             </div>
           )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex gap-4">
           <button 
             onClick={() => onDecision(false)}
             className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-750 text-zinc-400 font-bold rounded-2xl transition-all active:scale-95"
           >
             이번엔 패스하기
           </button>
           <button 
             disabled={!canAfford}
             onClick={() => onDecision(true)}
             className={`
               flex-1 py-4 font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2
               ${canAfford 
                 ? 'bg-white text-black hover:bg-zinc-200 active:scale-95' 
                 : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
             `}
           >
             이벤트 참가 확정 <Check size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialEventModal;
