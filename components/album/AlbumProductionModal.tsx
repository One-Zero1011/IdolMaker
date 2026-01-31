
import React, { useState, useMemo } from 'react';
import { X, Check, Disc, Music, Sparkles, TrendingUp, Info, Wallet, BarChart3 } from 'lucide-react';
import { AlbumConcept, Trainee } from '../../types/index';
import { ALBUM_CONCEPTS, BASE_ALBUM_PRICE } from '../../data/constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTrainees: Trainee[];
  funds: number;
  onProduce: (title: string, concept: AlbumConcept, price: number) => void;
}

const AlbumProductionModal: React.FC<Props> = ({ isOpen, onClose, activeTrainees, funds, onProduce }) => {
  const [title, setTitle] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<AlbumConcept>('Refreshing');
  const [price, setPrice] = useState(BASE_ALBUM_PRICE);
  const [isConfirming, setIsConfirming] = useState(false);

  // 가격 탄력성 시뮬레이션
  // React Rules of Hooks: 훅은 반드시 조건부 반환(return) 이전에 호출되어야 합니다.
  const priceElasticity = useMemo(() => {
    return Math.pow(BASE_ALBUM_PRICE / price, 1.5);
  }, [price]);

  if (!isOpen) return null;

  const cost = 200000;
  const canAfford = funds >= cost;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsConfirming(true);
  };

  const handleFinalProduce = () => {
    onProduce(title, selectedConcept, price);
    setTitle('');
    setPrice(BASE_ALBUM_PRICE);
    setIsConfirming(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-600 rounded-lg shadow-lg shadow-pink-900/20">
                 <Disc className="text-white animate-spin-slow" size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white tracking-tight">신규 앨범 프로듀싱</h2>
                 <p className="text-zinc-500 text-xs">앨범의 가치와 가격 전략을 결정하십시오.</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
           </button>
        </div>

        <form onSubmit={handleStart} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
           {/* Title Input */}
           <div className="space-y-3">
              <label className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                 <Music size={14} /> 앨범 제목
              </label>
              <input 
                required
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl px-6 py-4 text-xl font-bold text-white focus:outline-none focus:border-pink-500 transition-all placeholder:text-zinc-800"
                placeholder="컴백 타이틀곡 명을 입력하세요"
              />
           </div>

           {/* Concept Selection */}
           <div className="space-y-4">
              <label className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                 <Sparkles size={14} /> 앨범 컨셉 설정
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                 {(Object.keys(ALBUM_CONCEPTS) as AlbumConcept[]).map(concept => {
                   const config = ALBUM_CONCEPTS[concept];
                   const isSelected = selectedConcept === concept;
                   return (
                     <button
                       key={concept}
                       type="button"
                       onClick={() => setSelectedConcept(concept)}
                       className={`
                         relative p-4 rounded-2xl border-2 text-left transition-all
                         ${isSelected 
                           ? `bg-zinc-800 border-white shadow-xl scale-[1.02]` 
                           : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'}
                       `}
                     >
                        <div className="flex items-center gap-2 mb-2">
                           <div className={`w-3 h-3 rounded-full ${config.color}`} />
                           <span className="font-bold text-white">{config.label}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-tight">{config.description}</p>
                        {isSelected && <div className="absolute top-2 right-2"><Check size={14} className="text-white" /></div>}
                     </button>
                   );
                 })}
              </div>
           </div>

           {/* Price Selection Strategy */}
           <div className="space-y-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <div className="flex justify-between items-end mb-2">
                <label className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                   <Wallet size={14} /> 판매 가격 책정
                </label>
                <div className="text-right">
                   <span className="text-2xl font-black text-white">₩{price.toLocaleString()}</span>
                   <span className="text-[10px] text-zinc-500 block">적정가 ₩20,000 기준</span>
                </div>
              </div>

              <input 
                type="range"
                min="10000"
                max="50000"
                step="1000"
                value={price}
                onChange={e => setPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />

              <div className="grid grid-cols-2 gap-4 mt-6">
                 <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col gap-1">
                    <span className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1">
                      <BarChart3 size={10} /> 예상 판매량 지수
                    </span>
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${priceElasticity > 1 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(100, priceElasticity * 50)}%` }} 
                          />
                       </div>
                       <span className={`text-xs font-bold ${priceElasticity > 1 ? 'text-emerald-500' : 'text-red-500'}`}>
                         x{priceElasticity.toFixed(1)}
                       </span>
                    </div>
                 </div>
                 <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col gap-1">
                    <span className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-1">
                      <TrendingUp size={10} /> 예상 수익성 지수
                    </span>
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300" 
                            style={{ width: `${Math.min(100, (priceElasticity * (price / BASE_ALBUM_PRICE)) * 50)}%` }} 
                          />
                       </div>
                       <span className="text-xs font-bold text-blue-400">
                         x{(priceElasticity * (price / BASE_ALBUM_PRICE)).toFixed(1)}
                       </span>
                    </div>
                 </div>
              </div>
              <p className="text-[10px] text-zinc-600 mt-2 italic flex items-center gap-1">
                 <Info size={10} /> 인지도가 높을수록 고가 전략을 취해도 판매량이 덜 하락합니다.
              </p>
           </div>

           {/* Footer */}
           <div className="flex gap-4 pt-4 border-t border-zinc-800">
              <div className="flex-1 flex flex-col gap-1">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">기본 제작 비용</span>
                 <span className={`text-lg font-bold ${canAfford ? 'text-emerald-500' : 'text-red-500'}`}>₩{cost.toLocaleString()}</span>
              </div>
              <button
                type="submit"
                disabled={!canAfford || !title}
                className={`
                  px-12 rounded-2xl font-black text-lg transition-all
                  ${canAfford && title ? 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/10' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                `}
              >
                기획안 확정
              </button>
           </div>
        </form>

        {/* Confirmation Overlay */}
        {isConfirming && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-200">
             <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border-4 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                <Disc className="text-pink-500 animate-spin-slow" size={48} />
             </div>
             <h3 className="text-3xl font-black text-white mb-2">"{title}"</h3>
             <p className="text-zinc-400 mb-8">
               {selectedConcept} 컨셉, 장당 ₩{price.toLocaleString()} 가격으로<br/>앨범 제작을 시작하시겠습니까?
             </p>
             <div className="flex gap-4 w-full max-w-sm">
                <button onClick={() => setIsConfirming(false)} className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-bold rounded-2xl">취소</button>
                <button onClick={handleFinalProduce} className="flex-1 py-4 bg-pink-600 text-white font-black rounded-2xl shadow-xl shadow-pink-900/40">컴백 시작!</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumProductionModal;
