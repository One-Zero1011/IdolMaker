
import React from 'react';
import { CalendarDays, Activity, TrendingUp, History, Users, Heart, HeartCrack, Minus, Camera } from 'lucide-react';
import { Trainee } from '../../types/index';
import StatRadar from '../common/StatRadar';

interface Props {
  week: number;
  activeTrainees: Trainee[];
  trainees: Trainee[];
  selectedTraineeId: string | null;
  onSelectTrainee: (id: string) => void;
  onOpenHistory: () => void;
}

const DashboardSidebar: React.FC<Props> = ({ 
  week, 
  activeTrainees, 
  trainees, 
  selectedTraineeId, 
  onSelectTrainee,
  onOpenHistory
}) => {
  const selectedTrainee = trainees.find(t => t.id === selectedTraineeId) || activeTrainees[0];

  const getRelationships = (trainee: Trainee) => {
    if (!trainee.relationships) return [];
    return Object.entries(trainee.relationships)
      .map(([id, score]) => {
        const target = trainees.find(t => t.id === id);
        return { target, score: score as number, id };
      })
      .filter(r => r.target && r.target.status === 'Active')
      .sort((a, b) => (b.score as number) - (a.score as number));
  };

  const relations = selectedTrainee ? getRelationships(selectedTrainee) : [];

  return (
    <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
      
      {/* Week Status */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-zinc-400 text-sm font-medium">현재 진행 상황</h3>
          <div className="text-3xl font-bold text-white mt-1">Week {week}</div>
        </div>
        <CalendarDays size={32} className="text-zinc-700" />
      </div>

      {/* Selected Trainee Analysis (Radar) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Activity size={18} className="text-pink-500" /> 능력치 분석
            </h2>
          </div>
          
          {activeTrainees.length > 0 ? (
            <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center relative bg-zinc-950/30 rounded-lg p-2">
              <select 
                className="absolute top-2 right-2 bg-zinc-800 border-zinc-700 rounded text-xs px-2 py-1 focus:outline-none z-10 text-white"
                onChange={(e) => onSelectTrainee(e.target.value)}
                value={selectedTraineeId || activeTrainees[0]?.id}
              >
                {activeTrainees.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              
              <StatRadar trainee={selectedTrainee} />
            </div>
          ) : (
            <div className="flex-1 min-h-[250px] flex items-center justify-center text-zinc-600">연습생이 없습니다.</div>
          )}
      </div>

      {/* Relationship Panel */}
      {selectedTrainee && relations.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
           <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
             <Users size={18} className="text-blue-500" /> 교우 관계
           </h2>
           <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
             {relations.map(({ target, score, id }) => {
                if (!target) return null;
                
                let icon = <Minus size={14} className="text-zinc-500" />;
                let color = "text-zinc-400";
                let text = "동료";
                
                const s = score as number;
                const special = selectedTrainee.specialRelations?.[id];

                if (special === 'SecretLover') {
                    icon = <Heart size={14} className="text-purple-500 fill-purple-500" />;
                    color = "text-purple-400";
                    text = "비밀 연인";
                } else if (special === 'PublicLover') {
                    icon = <Camera size={14} className="text-red-500" />;
                    color = "text-red-500 animate-pulse";
                    text = "공개 연인";
                } else if (s >= 90) {
                    icon = <Heart size={14} className="text-pink-500 fill-pink-500" />;
                    color = "text-pink-400";
                    text = "소울메이트";
                } else if (s >= 80) {
                    icon = <Heart size={14} className="text-pink-500" />;
                    color = "text-pink-400";
                    text = "절친";
                } else if (s <= 20) {
                    icon = <HeartCrack size={14} className="text-red-500" />;
                    color = "text-red-400";
                    text = "견원지간";
                }

                return (
                  <div key={target.id} className="flex items-center justify-between bg-black/20 p-2 rounded border border-zinc-800/50">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{backgroundColor: target.imageColor}}>
                            {target.name[0]}
                        </div>
                        <span className="text-sm font-medium text-zinc-300">{target.name}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${color}`}>{text} ({s})</span>
                        {icon}
                     </div>
                  </div>
                );
             })}
           </div>
        </div>
      )}

      {/* Ranking */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-yellow-500" /> 팬덤 랭킹 (Top 3)
          </h2>
          <div className="space-y-3">
            {activeTrainees.sort((a,b) => b.fans - a.fans).slice(0, 3).map((t, idx) => (
              <div key={t.id} className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-zinc-800/50">
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" style={{backgroundColor: t.imageColor}}>{idx+1}</div>
                <div className="w-8 h-8 rounded-full bg-zinc-800" style={{backgroundColor: t.imageColor}} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{t.name}</div>
                </div>
                <div className="font-mono text-xs text-pink-400 whitespace-nowrap">{t.fans.toLocaleString()}</div>
              </div>
            ))}
            {activeTrainees.length === 0 && <div className="text-sm text-zinc-600 text-center py-4">데이터 없음</div>}
          </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={onOpenHistory}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white py-3 rounded-xl border border-zinc-700 flex items-center justify-center gap-2 transition-all font-medium text-sm"
        >
          <History size={16} /> 전체 활동 기록 보기
        </button>
      </div>

    </div>
  );
};

export default DashboardSidebar;
