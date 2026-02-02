
import React, { useState } from 'react';
import { Trainee } from '../../types/index';
import { TRANSLATIONS } from '../../data/constants';
import { Heart, Activity, ShieldAlert, AlertTriangle, MessageCircleHeart, ChevronDown, ChevronUp, Users, Edit2, Trash2, FileText, Timer } from 'lucide-react';

interface Props {
  trainee: Trainee;
  allTrainees: Trainee[];
  onClick?: () => void;
  onEdit?: (trainee: Trainee) => void;
  onDelete?: (id: string) => void;
  onRenew?: (trainee: Trainee) => void; 
  selected?: boolean;
}

const StatBar = ({ label, value, color, max = 100 }: { label: string; value: number; color: string; max?: number }) => (
  <div className="flex items-center text-xs mb-1">
    <span className="w-16 text-zinc-400 font-medium">{label}</span>
    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${color}`} 
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
    <span className="ml-2 w-6 text-right text-zinc-300">{value}</span>
  </div>
);

const TraineeCard: React.FC<Props> = ({ trainee, allTrainees, onClick, onEdit, onDelete, onRenew, selected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isEliminated = trainee.status === 'Eliminated';
  const isTerminated = trainee.status === 'Contract Terminated';
  
  let sentimentColor = 'bg-zinc-500';
  let sentimentIconColor = 'text-zinc-500';
  
  if (trainee.sentiment >= 70) {
      sentimentColor = 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]';
      sentimentIconColor = 'text-pink-500';
  } else if (trainee.sentiment <= 30) {
      sentimentColor = 'bg-purple-800';
      sentimentIconColor = 'text-purple-500';
  } else {
      sentimentColor = 'bg-zinc-400';
      sentimentIconColor = 'text-zinc-400';
  }

  const contractWeeks = trainee.contractRemaining;
  let contractBadgeColor = 'bg-zinc-800 text-zinc-400';

  if (contractWeeks <= 4) {
    contractBadgeColor = 'bg-red-600 text-white animate-pulse';
  } else if (contractWeeks <= 12) {
    contractBadgeColor = 'bg-orange-600 text-white';
  }

  const getRelationLabel = (targetId: string, score: number) => {
      // 1. Check Special Relations first (Events)
      const special = trainee.specialRelations?.[targetId];
      if (special === 'SecretLover') return { text: '🤫 비밀 연인', color: 'text-purple-400' };
      if (special === 'PublicLover') return { text: '📸 공개 연인', color: 'text-red-500 animate-pulse' };

      // 2. Check Score Thresholds
      if (score >= 90) return { text: '💍 소울메이트', color: 'text-pink-500' };
      if (score >= 80) return { text: '절친', color: 'text-pink-400' };
      if (score >= 60) return { text: '우호', color: 'text-emerald-400' };
      if (score <= 10) return { text: '견원지간', color: 'text-red-600' };
      if (score <= 20) return { text: '앙숙', color: 'text-red-400' };
      if (score <= 40) return { text: '서먹', color: 'text-zinc-500' };
      return { text: '동료', color: 'text-zinc-400' };
  };

  const relations = Object.entries((trainee.relationships || {}) as Record<string, number>)
    .map(([id, score]) => {
      const target = allTrainees.find(t => t.id === id);
      return { target, score, id };
    })
    .filter(item => item.target && item.target.status === 'Active')
    .sort((a, b) => b.score - a.score);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      onClick={(!isEliminated && !isTerminated) ? onClick : undefined}
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer group flex flex-col
        ${selected ? 'border-pink-500 bg-zinc-900 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}
        ${(isEliminated || isTerminated) ? 'opacity-50 grayscale cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-center p-3 gap-3 border-b border-zinc-800 bg-zinc-950/20">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-inner"
          style={{ backgroundColor: trainee.imageColor }}
        >
          {trainee.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white truncate flex items-center gap-1.5">
               {trainee.name}
               <span className="text-[10px] text-zinc-600">{trainee.gender === 'Female' ? '♀' : '♂'}</span>
            </h3>
            <div className="flex items-center gap-1">
              {(!isEliminated && !isTerminated) && (
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={(e) => { e.stopPropagation(); onRenew?.(trainee); }}
                     className="p-1.5 text-zinc-500 hover:text-emerald-400 transition-colors"
                     title="재계약"
                   >
                     <FileText size={14} />
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onEdit?.(trainee); }}
                     className="p-1.5 text-zinc-500 hover:text-blue-400 transition-colors"
                     title="수정"
                   >
                     <Edit2 size={14} />
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); onDelete?.(trainee.id); }}
                     className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                     title="삭제"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold uppercase tracking-tight">
                {TRANSLATIONS.positions[trainee.position] || trainee.position}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black ${contractBadgeColor}`}>
               <Timer size={10} /> D-{contractWeeks}
            </div>
            <span>•</span>
            <span className="flex items-center gap-1 text-pink-400"><Heart size={10} fill="currentColor" /> {trainee.fans.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-zinc-950/30 space-y-1.5">
        <div className="flex items-center gap-2" title="체력 (Stamina)">
          <Activity size={12} className="text-red-500" />
          <div className="flex-1 h-1 bg-zinc-800 rounded-full">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, trainee.stamina))}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2" title="멘탈 (Mental)">
          <ShieldAlert size={12} className="text-blue-500" />
          <div className="flex-1 h-1 bg-zinc-800 rounded-full">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, trainee.mental))}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/50" title="여론/호감도 (Sentiment)">
          <MessageCircleHeart size={12} className={sentimentIconColor} />
          <div className="flex-1 h-1 bg-zinc-800 rounded-full relative overflow-hidden group-hover:bg-zinc-700 transition-colors">
             <div className="absolute top-0 left-1/2 w-0.5 h-full bg-black/50 z-10" />
             <div className={`h-full rounded-full transition-all duration-700 ${sentimentColor}`} style={{ width: `${Math.max(0, Math.min(100, trainee.sentiment))}%` }} />
          </div>
        </div>
      </div>

      <div className="p-3 grid grid-cols-2 gap-x-4">
        <div className="col-span-2 mb-1">
           <StatBar label="보컬" value={trainee.stats.vocal} color="bg-purple-500" />
           <StatBar label="댄스" value={trainee.stats.dance} color="bg-indigo-500" />
           <StatBar label="랩" value={trainee.stats.rap} color="bg-yellow-500" />
           <StatBar label="비주얼" value={trainee.stats.visual} color="bg-pink-500" />
           <StatBar label="리더십" value={trainee.stats.leadership} color="bg-emerald-500" />
        </div>
      </div>

      {(!isEliminated && !isTerminated) && relations.length > 0 && (
        <div className="border-t border-zinc-800 bg-black/20">
            <button 
                onClick={toggleExpand}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>관계 현황 ({relations.length})</span>
                </div>
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {isExpanded && (
                <div className="px-3 pb-3 space-y-1.5 animate-in slide-in-from-top-2 fade-in duration-200">
                    {relations.map(({ target, score, id }) => {
                        const { text, color } = getRelationLabel(id, score);
                        return (
                            <div key={target!.id} className="flex justify-between items-center text-[10px] p-1.5 rounded hover:bg-white/5 border border-transparent hover:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" 
                                        style={{ backgroundColor: target!.imageColor }}
                                    >
                                        {target!.name[0]}
                                    </div>
                                    <span className="text-zinc-300 font-medium">
                                        {target!.name}
                                        <span className={`ml-1 ${color}`}>({text})</span>
                                    </span>
                                </div>
                                <span className={`font-mono font-bold ${score >= 50 ? 'text-pink-400' : 'text-zinc-500'}`}>
                                    {score > 0 ? '+' : ''}{score}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      )}

      {isEliminated && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
          <div className="text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
            <span className="font-bold text-red-500 uppercase tracking-widest">퇴출됨</span>
          </div>
        </div>
      )}

      {isTerminated && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
          <div className="text-center">
            <Timer className="mx-auto text-zinc-500 mb-2" size={32} />
            <span className="font-bold text-zinc-300 uppercase tracking-widest">계약 만료</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraineeCard;
