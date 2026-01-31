
import React from 'react';
import { Trainee } from '../types/index';
import { X, FileText, TrendingUp, Users, Heart, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trainee: Trainee | null;
  funds: number;
  onRenew: (id: string, cost: number) => void;
  onRelease: (id: string) => void;
}

const ContractRenewalModal: React.FC<Props> = ({ isOpen, onClose, trainee, funds, onRenew, onRelease }) => {
  if (!isOpen || !trainee) return null;

  // 재계약 비용 계산 로직
  const avgStats = Object.values(trainee.stats).reduce((a, b) => a + b, 0) / 5;
  const renewalCost = Math.floor(50000 + (trainee.fans * 20) + (avgStats * 1000));
  const canAfford = funds >= renewalCost;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-600/20 rounded-lg">
                <FileText className="text-emerald-500" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">아티스트 전속 계약 갱신</h2>
                <p className="text-zinc-500 text-xs mt-0.5">계약 만료 전 파트너십 연장 여부를 결정하십시오.</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-6 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
             <div 
               className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-2xl"
               style={{ backgroundColor: trainee.imageColor }}
             >
               {trainee.name[0]}
             </div>
             <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{trainee.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                   <span className="flex items-center gap-1 text-pink-500 text-sm font-bold">
                      <Heart size={14} fill="currentColor" /> {trainee.fans.toLocaleString()}명
                   </span>
                   <span className="text-zinc-500 text-sm">남은 기간: <b className="text-white">{trainee.contractRemaining}주</b></span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">현재 가치 산정</div>
                <div className="text-xl font-bold text-white">₩{renewalCost.toLocaleString()}</div>
             </div>
             <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">연장 기간</div>
                <div className="text-xl font-bold text-emerald-500">+48주 (1년)</div>
             </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl flex gap-3">
             <TrendingUp className="text-blue-500 shrink-0" size={20} />
             <p className="text-xs text-blue-200/80 leading-relaxed">
               재계약 시 아티스트의 로열티와 멘탈이 상승하며, 팬덤 활동이 더욱 안정화됩니다. 미갱신 시 계약 만료 주차에 자동으로 활동이 종료됩니다.
             </p>
          </div>

          {!canAfford && (
            <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl flex gap-3">
               <AlertTriangle className="text-red-500 shrink-0" size={20} />
               <p className="text-xs text-red-200/80">현재 보유 자금이 부족하여 재계약을 진행할 수 없습니다.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex gap-4">
           <button 
             onClick={() => {
                if (window.confirm(`${trainee.name} 아티스트를 정말 방출하시겠습니까?`)) {
                    onRelease(trainee.id);
                    onClose();
                }
             }}
             className="flex-1 py-4 bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-400 font-bold rounded-xl transition-all"
           >
             방출 결정
           </button>
           <button 
             onClick={() => {
                onRenew(trainee.id, renewalCost);
                onClose();
             }}
             disabled={!canAfford}
             className={`
               flex-1 py-4 font-bold rounded-xl shadow-lg transition-all
               ${canAfford ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 active:scale-95' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
             `}
           >
             재계약 체결
           </button>
        </div>
      </div>
    </div>
  );
};

export default ContractRenewalModal;
