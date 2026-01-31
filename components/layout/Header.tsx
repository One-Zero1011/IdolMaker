
import React, { useRef } from 'react';
import { Music2, Trophy, Save, Download, RotateCcw, FileOutput, FileInput, CloudUpload, CloudDownload, Wallet, Star } from 'lucide-react';
import { Trainee } from '../../types/index';
import { REPUTATION_TIERS } from '../../data/constants';

interface HeaderProps {
  activeTrainees: Trainee[];
  funds?: number; 
  reputation?: number; // 평판 점수 추가
  onBrowserSave: () => void;
  onBrowserLoad: () => void;
  onFileExport: () => void;
  onFileImport: (file: File) => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTrainees, 
  funds = 0,
  reputation = 0,
  onBrowserSave, 
  onBrowserLoad, 
  onFileExport, 
  onFileImport, 
  onReset 
}) => {
  const totalFans = activeTrainees.reduce((acc, t) => acc + t.fans, 0).toLocaleString();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 현재 점수에 맞는 평판 티어 찾기
  const currentTier = REPUTATION_TIERS.slice().reverse().find(t => reputation >= t.min) || REPUTATION_TIERS[0];

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 lg:px-12 bg-black/50 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-600 p-1.5 rounded-lg text-white shadow-[0_0_10px_rgba(202,138,4,0.5)]">
          <Music2 size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
          K-아이돌 마스터
        </h1>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Group Reputation Tier Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentTier.bg} ${currentTier.border} transition-all`}>
          <Star size={14} className={`${currentTier.color} fill-current`} />
          <span className={`text-xs font-black uppercase tracking-widest ${currentTier.color}`}>
            {currentTier.label}
          </span>
          <div className="w-10 h-1 bg-zinc-800 rounded-full ml-1 overflow-hidden">
            <div className={`h-full ${currentTier.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${reputation}%` }} />
          </div>
        </div>

        {/* Wallet Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 text-sm">
          <Wallet size={14} className="text-emerald-500" />
          <span className={`font-bold ${funds < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
            ₩{funds.toLocaleString()}
          </span>
        </div>

        {/* Fan Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 text-sm">
          <Trophy size={14} className="text-yellow-500" />
          <span>총 팬덤: <span className="text-white font-bold">{totalFans}명</span></span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800">
            <button 
              onClick={onBrowserSave}
              title="저장"
              className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded-md transition-all"
            >
              <CloudUpload size={16} />
            </button>
            <button 
              onClick={onBrowserLoad}
              title="불러오기"
              className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-md transition-all"
            >
              <CloudDownload size={16} />
            </button>
          </div>

          <button 
            onClick={onReset}
            title="초기화"
            className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
