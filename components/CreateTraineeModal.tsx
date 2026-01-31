
import React, { useState, useEffect } from 'react';
import { Trainee, Position, MBTI } from '../types/index';
import { TRANSLATIONS, COLORS } from '../data/constants';
import { X, Check, Edit3 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainee: Omit<Trainee, 'id' | 'fans' | 'status' | 'history'>) => void;
  initialData?: Trainee;
}

const TraineeFormModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState<Position>('Vocal');
  const [mbti, setMbti] = useState<MBTI>('ENFP');
  const [age, setAge] = useState(18);

  const rollStats = () => ({
    vocal: Math.floor(Math.random() * 20) + 10,
    dance: Math.floor(Math.random() * 20) + 10,
    rap: Math.floor(Math.random() * 20) + 10,
    visual: Math.floor(Math.random() * 40) + 30,
    leadership: Math.floor(Math.random() * 20) + 5,
  });

  const [stats, setStats] = useState(rollStats());

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPosition(initialData.position);
      setMbti(initialData.mbti);
      setAge(initialData.age);
      setStats(initialData.stats);
    } else {
      setName('');
      setPosition('Vocal');
      setMbti('ENFP');
      setAge(18);
      setStats(rollStats());
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      age,
      position,
      mbti,
      stats,
      stamina: initialData ? initialData.stamina : 100,
      mental: initialData ? initialData.mental : 100,
      scandalRisk: initialData ? initialData.scandalRisk : Math.floor(Math.random() * 30),
      imageColor: initialData ? initialData.imageColor : COLORS[Math.floor(Math.random() * COLORS.length)],
      sentiment: initialData ? initialData.sentiment : 50,
      relationships: initialData ? initialData.relationships : {}
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {initialData ? <><Edit3 size={20} className="text-pink-500" /> 정보 수정</> : '새 연습생 캐스팅'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">이름</label>
            <input 
              required
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              placeholder="예: 민지"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">포지션</label>
              <select 
                value={position}
                onChange={e => setPosition(e.target.value as Position)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              >
                {['Vocal', 'Dance', 'Rap', 'Visual', 'Leader'].map(p => (
                  <option key={p} value={p}>{TRANSLATIONS.positions[p as keyof typeof TRANSLATIONS.positions]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">MBTI</label>
              <select 
                value={mbti}
                onChange={e => setMbti(e.target.value as MBTI)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              >
                {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-zinc-400">능력치 {initialData ? '' : '(랜덤)'}</label>
                {!initialData && (
                  <button 
                    type="button" 
                    onClick={() => setStats(rollStats())}
                    className="text-xs text-pink-400 hover:text-pink-300 underline"
                  >
                    다시 굴리기
                  </button>
                )}
             </div>
             <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                {Object.entries(stats).map(([key, val]) => (
                  <div key={key} className="bg-zinc-800 p-2 rounded">
                    <div className="text-zinc-500 mb-1">{TRANSLATIONS.positions[key as keyof typeof TRANSLATIONS.positions] || key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    {initialData ? (
                      <input 
                        type="number" 
                        min="0" max="100"
                        value={val}
                        onChange={(e) => setStats(prev => ({ ...prev, [key]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded text-center font-bold text-white focus:outline-none focus:border-pink-500"
                      />
                    ) : (
                      <div className="font-bold text-white text-xs">{val}</div>
                    )}
                  </div>
                ))}
             </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition-all active:scale-95"
          >
            {initialData ? <><Check size={18} /> 변경사항 저장</> : <><Check size={18} /> 계약 체결</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TraineeFormModal;
