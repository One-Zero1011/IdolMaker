
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { X, Trophy, TrendingUp, Users, Wallet, Disc, Sparkles, Globe, ArrowUpRight, AlertCircle, ThumbsUp } from 'lucide-react';
import { Album } from '../../types/index';
import { FAN_REACTIONS, BASE_ALBUM_PRICE } from '../../data/constants';

interface Props {
  isOpen: boolean;
  album: Album | null;
  totalRevenue: number;
  onClose: () => void;
  onSettle: () => void;
}

const AlbumReleaseSimulationModal: React.FC<Props> = ({ isOpen, album, totalRevenue, onClose, onSettle }) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [accumulatedRevenue, setAccumulatedRevenue] = useState(0);
  const [accumulatedSales, setAccumulatedSales] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);

  // 시뮬레이션 데이터 생성
  const fullSimulationData = useMemo(() => {
    if (!album) return [];
    
    const data = [];
    const peak = album.peakChart;
    const totalSales = album.sales;
    
    // 7일간의 추이 생성
    for (let i = 1; i <= 7; i++) {
      // 순위 시뮬레이션
      let rank = 100;
      if (i === 1) rank = Math.min(100, peak + 40 + Math.random() * 20);
      else if (i === 2) rank = Math.min(100, peak + 15 + Math.random() * 15);
      else if (i === 3) rank = peak;
      else rank = Math.min(100, peak + (i - 3) * (4 + Math.random() * 6));
      
      // 판매량: 누적 그래프
      const dailyContribution = [0.45, 0.2, 0.12, 0.08, 0.06, 0.05, 0.04][i-1];
      const dailySales = Math.floor(totalSales * dailyContribution);
      
      data.push({
        day: `Day ${i}`,
        rank: Math.floor(rank),
        sales: dailySales,
        accSales: 0 
      });
    }
    
    let acc = 0;
    return data.map(d => {
      acc += d.sales;
      return { ...d, accSales: acc };
    });
  }, [album]);

  useEffect(() => {
    if (isOpen && album && !isFinished) {
      const interval = setInterval(() => {
        setCurrentDay(prev => {
          if (prev < 6) {
            const nextDay = prev + 1;
            const data = fullSimulationData[nextDay];
            setChartData(fullSimulationData.slice(0, nextDay + 1));
            setAccumulatedSales(data.accSales);
            setAccumulatedRevenue(Math.floor((data.accSales / album.sales) * totalRevenue));
            
            // 실시간 반응 로직 강화 (가격 기반)
            const priceRatio = album.price / BASE_ALBUM_PRICE;
            let reactionPool = [...FAN_REACTIONS.POSITIVE];

            if (priceRatio > 1.2 && Math.random() > 0.5) {
                reactionPool = FAN_REACTIONS.PRICE_RESISTANCE;
            } else if (priceRatio < 0.8 && Math.random() > 0.5) {
                reactionPool = FAN_REACTIONS.PRICE_PRAISE;
            } else if (Math.random() > 0.8) {
                reactionPool = [...FAN_REACTIONS.WORRIED, ...FAN_REACTIONS.NEGATIVE];
            }

            setReactions(prevR => [reactionPool[Math.floor(Math.random() * reactionPool.length)], ...prevR].slice(0, 3));
            
            return nextDay;
          } else {
            setIsFinished(true);
            clearInterval(interval);
            return prev;
          }
        });
      }, 1500); // 1.5초 간격

      return () => clearInterval(interval);
    }
  }, [isOpen, album, isFinished, fullSimulationData, totalRevenue]);

  if (!isOpen || !album) return null;

  const handleSettle = () => {
    onSettle();
    onClose();
    setCurrentDay(0);
    setChartData([]);
    setAccumulatedRevenue(0);
    setAccumulatedSales(0);
    setIsFinished(false);
    setReactions([]);
  };

  const isExpensive = album.price > BASE_ALBUM_PRICE;
  const isCheap = album.price < BASE_ALBUM_PRICE;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in duration-500">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-4xl rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-900/40 relative z-10">
                    <Disc className={`text-white ${!isFinished ? 'animate-spin-slow' : ''}`} size={32} />
                 </div>
                 <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center z-20 shadow-md">
                    <Sparkles size={14} className="text-black" />
                 </div>
              </div>
              <div>
                 <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    "{album.title}" <span className="text-zinc-600 text-sm font-medium italic">Release Simulation</span>
                 </h2>
                 <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12} className="text-blue-500" /> 글로벌 음원 차트 실시간 집계 중...
                 </p>
              </div>
           </div>
           {isFinished && (
             <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
             </button>
           )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Chart Section */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-zinc-950 rounded-[2rem] p-6 border border-zinc-800 h-[350px] relative overflow-hidden">
                 <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-black text-zinc-600 uppercase tracking-tighter z-10">
                    <TrendingUp size={14} className="text-pink-500" /> Chart Performance (Rank & Sales)
                 </div>
                 
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 40, right: 30, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#3f3f46', fontSize: 10 }} />
                       <YAxis yAxisId="left" hide />
                       <YAxis yAxisId="right" orientation="right" hide domain={[0, 100]} />
                       <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                       />
                       <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="accSales" 
                        stroke="#ec4899" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                        name="누적 판매량"
                       />
                       <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="rank" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#3b82f6' }}
                        name="차트 순위"
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              {/* Price Feedback Alert */}
              <div className="animate-in fade-in duration-500">
                {isExpensive && (
                   <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-2xl flex items-center gap-3">
                      <AlertCircle className="text-red-500 shrink-0" size={20} />
                      <p className="text-xs text-red-300"><b>가격 주의:</b> 높은 앨범 가격으로 인해 팬덤의 저항이 거셉니다. 평판 하락 리스크가 있습니다.</p>
                   </div>
                )}
                {isCheap && (
                   <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-2xl flex items-center gap-3">
                      <ThumbsUp className="text-emerald-500 shrink-0" size={20} />
                      <p className="text-xs text-emerald-300"><b>갓기획사 찬양:</b> 저렴한 가격 책정에 대중이 열광하고 있습니다. 평판 보너스가 예상됩니다.</p>
                   </div>
                )}
              </div>
           </div>

           {/* Revenue & Reactions Section */}
           <div className="space-y-6 flex flex-col">
              <div className="bg-zinc-950 p-6 rounded-[2rem] border-2 border-emerald-900/30 shadow-xl shadow-emerald-900/5 flex flex-col flex-1">
                 <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Wallet size={16} /> 실시간 활동 정산금
                 </div>
                 <div className="flex-1 flex flex-col justify-center">
                    <div className="text-4xl font-black text-white tracking-tighter mb-2 overflow-hidden text-ellipsis">
                       ₩{accumulatedRevenue.toLocaleString()}
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-emerald-500 transition-all duration-300" 
                        style={{ width: `${(accumulatedRevenue / totalRevenue) * 100}%` }} 
                       />
                    </div>
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-zinc-800 space-y-3">
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SNS 실시간 여론</div>
                    <div className="space-y-2 min-h-[120px]">
                       {reactions.length > 0 ? reactions.map((r, i) => (
                         <div key={i} className={`p-3 rounded-xl border text-[11px] italic animate-in fade-in slide-in-from-bottom-2 duration-300
                            ${r.includes('상술') || r.includes('호구') ? 'bg-red-900/10 border-red-800/30 text-red-300' : 
                              r.includes('혜자') || r.includes('착해서') ? 'bg-emerald-900/10 border-emerald-800/30 text-emerald-300' : 
                              'bg-zinc-900/50 border-zinc-800/50 text-zinc-300'}
                         `}>
                           {r}
                         </div>
                       )) : (
                         <div className="text-zinc-700 text-[10px] italic py-10 text-center">집계된 반응이 없습니다.</div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleSettle}
                disabled={!isFinished}
                className={`
                  w-full py-5 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3
                  ${isFinished 
                    ? 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-2xl shadow-white/10' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                `}
              >
                {isFinished ? (
                   <>최종 정산 완료 <ArrowUpRight size={24} /></>
                ) : (
                   <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin" /> 시뮬레이션 중...
                   </span>
                )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumReleaseSimulationModal;
