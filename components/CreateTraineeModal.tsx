
import React, { useState, useEffect } from 'react';
import { Trainee, Position, MBTI, Gender } from '../types/index';
import { TRANSLATIONS, COLORS, CASTING_METHODS } from '../data/constants';
// Added TrendingUp to the lucide-react imports
import { X, Check, FileText, Search, School, Users, Globe, Crown, Wallet, Sparkles, User, Info, TrendingUp } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainee: Omit<Trainee, 'id' | 'fans' | 'status' | 'history' | 'contractRemaining'>, castingCost: number) => void;
  funds: number;
  initialData?: Trainee;
}

type ModalStep = 'SELECT_METHOD' | 'CUSTOMIZE';

const TraineeFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, funds, initialData }) => {
  const [step, setStep] = useState<ModalStep>(initialData ? 'CUSTOMIZE' : 'SELECT_METHOD');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Female');
  const [position, setPosition] = useState<Position>('Main Vocal');
  const [mbti, setMbti] = useState<MBTI>('ENFP');
  const [age, setAge] = useState(19);
  const [selectedCastingId, setSelectedCastingId] = useState('street');
  const [stats, setStats] = useState({ vocal: 0, dance: 0, rap: 0, visual: 0, leadership: 0 });

  const rollStatsByTier = (tierId: string) => {
    const tier = CASTING_METHODS.find(m => m.id === tierId) || CASTING_METHODS[0];
    const [min, max] = tier.statRange;
    const roll = () => Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      vocal: roll(),
      dance: roll(),
      rap: roll(),
      visual: roll(),
      leadership: Math.floor(Math.random() * (max / 2)) + (min / 4),
    };
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setGender(initialData.gender || 'Female');
      setPosition(initialData.position);
      setMbti(initialData.mbti);
      setAge(initialData.age);
      setStats(initialData.stats);
      setStep('CUSTOMIZE');
    } else {
      setName('');
      setGender('Female');
      setPosition('Main Vocal');
      setMbti('ENFP');
      setAge(19);
      setStep('SELECT_METHOD');
    }
  }, [initialData, isOpen]);

  const handleBeginContract = () => {
    const currentCasting = CASTING_METHODS.find(m => m.id === selectedCastingId)!;
    if (funds < currentCasting.cost) return;

    // 계약 버튼을 누르는 순간 능력치가 확정되지만, 
    // 사용자는 이제 막 "발탁"된 단계이므로 정보를 수정할 수 있게 됨
    setStats(rollStatsByTier(selectedCastingId));
    setStep('CUSTOMIZE');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCasting = CASTING_METHODS.find(m => m.id === selectedCastingId)!;

    onSave({
      name: name || (gender === 'Female' ? '지수' : '민수'),
      gender,
      age,
      position,
      mbti,
      stats,
      stamina: initialData ? initialData.stamina : 100,
      mental: initialData ? initialData.mental : 100,
      scandalRisk: initialData ? initialData.scandalRisk : Math.floor(Math.random() * 20),
      imageColor: initialData ? initialData.imageColor : COLORS[Math.floor(Math.random() * COLORS.length)],
      sentiment: initialData ? initialData.sentiment : 60,
      relationships: initialData ? initialData.relationships : {},
      specialRelations: initialData?.specialRelations || {}
    }, initialData ? 0 : currentCasting.cost);
    
    onClose();
  };

  if (!isOpen) return null;

  const currentCasting = CASTING_METHODS.find(m => m.id === selectedCastingId)!;
  const canAfford = funds >= currentCasting.cost;

  const getIcon = (iconName: string, size: number) => {
    switch (iconName) {
      case 'Search': return <Search size={size} />;
      case 'School': return <School size={size} />;
      case 'Users': return <Users size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'Crown': return <Crown size={size} />;
      default: return <Search size={size} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-yellow-600/20 rounded-lg text-yellow-500">
                <Sparkles size={20} />
             </div>
             <h2 className="text-xl font-bold text-white">
                {initialData ? '아티스트 프로필 수정' : step === 'SELECT_METHOD' ? '신규 아티스트 캐스팅' : '전속 계약서 작성'}
             </h2>
          </div>
          <div className="flex items-center gap-4">
             {step === 'SELECT_METHOD' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs">
                   <Wallet size={12} className="text-emerald-500" />
                   <span className="text-zinc-400">자산:</span>
                   <span className="text-white font-bold">₩{funds.toLocaleString()}</span>
                </div>
             )}
             <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
               <X size={24} />
             </button>
          </div>
        </div>

        {/* Step 1: Select Method */}
        {step === 'SELECT_METHOD' && (
          <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-300">
             <div className="grid grid-cols-1 gap-3">
                {CASTING_METHODS.map((method) => {
                  const isActive = selectedCastingId === method.id;
                  const isTooExpensive = funds < method.cost;
                  return (
                    <button
                      key={method.id}
                      disabled={isTooExpensive}
                      onClick={() => setSelectedCastingId(method.id)}
                      className={`
                        w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4
                        ${isActive ? 'bg-zinc-800 border-yellow-500 shadow-xl scale-[1.01]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}
                        ${isTooExpensive ? 'opacity-30 grayscale cursor-not-allowed' : ''}
                      `}
                    >
                       <div className={`p-3 rounded-xl bg-zinc-900 ${isActive ? method.color : 'text-zinc-600'}`}>
                         {getIcon(method.icon, 24)}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-lg font-black ${isActive ? 'text-white' : 'text-zinc-400'}`}>{method.name}</span>
                            <span className={`text-sm font-mono ${method.cost === 0 ? 'text-emerald-400' : isTooExpensive ? 'text-red-500' : 'text-zinc-300'}`}>
                              {method.cost === 0 ? 'FREE' : `₩${method.cost.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500">{method.description}</p>
                       </div>
                    </button>
                  );
                })}
             </div>

             <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex gap-3">
                <Info className="text-blue-500 shrink-0" size={18} />
                <p className="text-xs text-zinc-500 leading-relaxed">
                  캐스팅 방식을 선택하고 계약을 시작하면 아티스트의 잠재 능력치가 결정됩니다. 
                  고급 오디션일수록 높은 초기 능력치를 가진 인재가 발탁될 확률이 높습니다.
                </p>
             </div>

             <button 
                onClick={handleBeginContract}
                disabled={!canAfford}
                className={`
                  w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl
                  ${canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-900/20' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                `}
             >
                캐스팅 시작 (₩{currentCasting.cost.toLocaleString()})
             </button>
          </div>
        )}

        {/* Step 2: Customize */}
        {step === 'CUSTOMIZE' && (
          <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-300">
             <div className="space-y-6">
                <div className="flex flex-col gap-4 items-center mb-4">
                   <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl animate-pulse"
                    style={{ backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)] }}
                   >
                     {name ? name[0] : '?'}
                   </div>
                   <span className="text-xs font-black text-zinc-500 uppercase tracking-tighter">새로운 인재가 발탁되었습니다!</span>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">아티스트 성명</label>
                      <input 
                        required
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
                        placeholder="이름을 입력하세요"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">성별</label>
                        <div className="flex bg-zinc-950 rounded-xl p-1 border border-zinc-800">
                           <button 
                            type="button"
                            onClick={() => setGender('Female')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${gender === 'Female' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
                           >여성</button>
                           <button 
                            type="button"
                            onClick={() => setGender('Male')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${gender === 'Male' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
                           >남성</button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">활동 연령</label>
                        <input 
                          type="number" 
                          value={age}
                          onChange={e => setAge(parseInt(e.target.value))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none"
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">포지션</label>
                        <select 
                          value={position}
                          onChange={e => setPosition(e.target.value as Position)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none"
                        >
                          {['Main Vocal', 'Main Dancer', 'Main Rapper', 'Visual', 'Leader'].map(p => (
                            <option key={p} value={p}>{TRANSLATIONS.positions[p as keyof typeof TRANSLATIONS.positions]}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">MBTI</label>
                        <select 
                          value={mbti}
                          onChange={e => setMbti(e.target.value as MBTI)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none"
                        >
                          {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col">
                <div className="flex-1 bg-zinc-950 rounded-2xl p-6 border border-zinc-800">
                   <div className="flex items-center gap-2 text-xs font-black text-zinc-500 uppercase tracking-widest mb-6">
                      <TrendingUp size={14} /> 최종 발탁 능력치
                   </div>
                   
                   <div className="space-y-5">
                      {Object.entries(stats).map(([key, val]) => (
                        <div key={key}>
                           <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1">
                              <span>{TRANSLATIONS.positions[key as keyof typeof TRANSLATIONS.positions] || key.charAt(0).toUpperCase() + key.slice(1)}</span>
                              <span className="text-white font-mono">{val}</span>
                           </div>
                           <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${(val as number) > 80 ? 'bg-yellow-500' : (val as number) > 50 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                style={{ width: `${val}%` }} 
                              />
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="mt-10 pt-6 border-t border-zinc-800">
                      <button 
                        type="submit"
                        className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
                      >
                         {initialData ? '프로필 저장' : '최종 전속 계약 체결'}
                      </button>
                      <p className="text-[10px] text-center text-zinc-600 mt-3 italic">
                        * 계약 후에는 이름과 능력치를 제외한 일부 속성만 수정 가능합니다.
                      </p>
                   </div>
                </div>
             </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TraineeFormModal;
