
import React from 'react';
import { RankingEntry } from '../../types/index';
import { Trophy, TrendingUp, TrendingDown, Minus, X, Star, Music, Award } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ranking: RankingEntry[];
  week: number;
}

const GlobalRankingChart: React.FC<Props> = ({ isOpen, onClose, ranking, week }) => {
  if (!isOpen || ranking.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center relative overflow-hidden">
           {/* Decor */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
           
           <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg">
                 <Music className="text-white" size={24} />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Global Top 10</h2>
                 <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">실시간 아티스트 통합 차트 • Week {week}</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-white transition-colors relative z-10">
              <X size={24} />
           </button>
        </div>

        {/* Chart List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-zinc-900/50 custom-scrollbar">
           {ranking.slice(0, 10).map((entry) => {
             const isTop3 = entry.rank <= 3;
             return (
               <div 
                 key={entry.groupName}
                 className={`
                   relative p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300
                   ${entry.isPlayer 
                      ? 'bg-pink-600/20 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)] scale-[1.02] z-10' 
                      : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'}
                 `}
               >
                  {/* Rank Number */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl italic shrink-0
                    ${entry.rank === 1 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-900/20' : 
                      entry.rank === 2 ? 'bg-zinc-300 text-black' : 
                      entry.rank === 3 ? 'bg-orange-400 text-black' : 'text-zinc-500'}
                  `}>
                    {entry.rank}
                  </div>

                  {/* Group Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h3 className={`font-black truncate ${entry.isPlayer ? 'text-pink-400' : 'text-zinc-200'}`}>
                         {entry.groupName}
                         {entry.isPlayer && <span className="ml-2 text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded italic">MY GROUP</span>}
                       </h3>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium truncate italic">"{entry.songTitle}"</p>
                  </div>

                  {/* Trend & Score */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                     <div className="flex items-center gap-1.5">
                        {entry.trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
                        {entry.trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
                        {entry.trend === 'same' && <Minus size={14} className="text-zinc-600" />}
                        {entry.trend === 'new' && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                        
                        <span className={`text-[10px] font-black uppercase tracking-tighter
                          ${entry.trend === 'up' ? 'text-emerald-500' : 
                            entry.trend === 'down' ? 'text-red-500' : 
                            entry.trend === 'new' ? 'text-yellow-500' : 'text-zinc-600'}
                        `}>
                          {entry.trend === 'new' ? 'NEW' : 
                           entry.trend === 'same' ? 'KEEP' : 
                           Math.abs(entry.rank - entry.prevRank)}
                        </span>
                     </div>
                     <div className="text-[10px] font-mono text-zinc-600">{entry.score.toLocaleString()} pts</div>
                  </div>

                  {/* Reward Icon for Top 1 */}
                  {entry.rank === 1 && (
                    <div className="absolute -top-1 -right-1">
                       <Award size={20} className="text-yellow-500 animate-bounce" />
                    </div>
                  )}
               </div>
             );
           })}
        </div>

        {/* Footer */}
        <div className="p-8 bg-zinc-950 border-t border-zinc-800 text-center">
           <button 
             onClick={onClose}
             className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 active:scale-95 shadow-xl transition-all"
           >
             차트 닫기
           </button>
           <p className="text-[10px] text-zinc-600 mt-4 italic">
             * 차트 점수는 앨범 성적, 팬덤 규모, 대중 평판을 종합하여 매주 월요일 0시에 갱신됩니다.
           </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalRankingChart;
