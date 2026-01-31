
import React, { useState } from 'react';
import { X, Check, Disc, Music, Sparkles, TrendingUp, Info } from 'lucide-react';
import { AlbumConcept, Trainee } from '../../types/index';
import { ALBUM_CONCEPTS } from '../../data/constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTrainees: Trainee[];
  funds: number;
  onProduce: (title: string, concept: AlbumConcept) => void;
}

const AlbumProductionModal: React.FC<Props> = ({ isOpen, onClose, activeTrainees, funds, onProduce }) => {
  const [title, setTitle] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<AlbumConcept>('Refreshing');
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const cost = 200000;
  const canAfford = funds >= cost;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsConfirming(true);
  };

  const handleFinalProduce = () => {
    onProduce(title, selectedConcept);
    setTitle('');
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
                 <p className="text-zinc-500 text-xs">아티스트의 색깔을 결정하고 시장을 공략하십시오.</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
           </button>
        </div>

        <form onSubmit={handleStart} className="p-8 space-y-8">
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

           {/* Summary / Stats Impact */}
           <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold mb-3 uppercase tracking-wider">
                 <TrendingUp size={14} /> 주요 영향 스탯
              </div>
              <div className="flex gap-4">
                 {Object.entries(ALBUM_CONCEPTS[selectedConcept].weights).map(([stat, weight]) => (
                   <div key={stat} className="px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-[10px] text-zinc-300 font-bold">
                     {stat.toUpperCase()} ({Math.floor((weight ?? 0) * 100)}%)
                   </div>
                 ))}
              </div>
           </div>

           {/* Footer */}
           <div className="flex gap-4 pt-4">
              <div className="flex-1 flex flex-col gap-1">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">예상 제작 비용</span>
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
             <p className="text-zinc-400 mb-8">선택하신 컨셉으로 앨범 제작을 시작하시겠습니까?<br/>제작 즉시 결과가 발표됩니다.</p>
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
