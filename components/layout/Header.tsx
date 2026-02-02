
import React, { useRef } from 'react';
import { Music2, Trophy, RotateCcw, FileOutput, FileInput, Wallet, Star, Sparkles, Building, Settings } from 'lucide-react';
import { Trainee, Group } from '../../types/index';
import { REPUTATION_TIERS } from '../../data/constants';

interface HeaderProps {
  activeTrainees: Trainee[];
  group: Group | null;
  funds?: number; 
  reputation?: number; 
  onFileExport: () => void;
  onFileImport: (file: File) => void;
  onReset: () => void;
  onOpenCompany?: () => void;
  onOpenSettings?: () => void; // Added prop
}

const Header: React.FC<HeaderProps> = ({ 
  activeTrainees, 
  group,
  funds = 0,
  reputation = 0,
  onFileExport, 
  onFileImport, 
  onReset,
  onOpenCompany,
  onOpenSettings
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalFans = activeTrainees.reduce((acc, t) => acc + t.fans, 0).toLocaleString();
  const currentTier = REPUTATION_TIERS.slice().reverse().find(t => reputation >= t.min) || REPUTATION_TIERS[0];

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileImport(file);
  };

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 lg:px-12 bg-black/50 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="bg-yellow-600 p-1.5 rounded-lg text-white shadow-[0_0_10px_rgba(202,138,4,0.5)]">
          <Music2 size={20} />
        </div>
        <div className="flex flex-col">
           <h1 className="text-lg font-black tracking-tight text-white hidden sm:flex items-center gap-2">
             {group ? group.name : 'K-아이돌 프로듀서'}
             {group && <Sparkles size={14} className="text-yellow-500 animate-pulse" />}
           </h1>
           {group && (
             <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{group.type}</span>
           )}
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentTier.bg} ${currentTier.border}`}>
          <Star size={14} className={`${currentTier.color} fill-current`} />
          <span className={`text-xs font-black uppercase tracking-widest hidden lg:inline ${currentTier.color}`}>
            {currentTier.label}
          </span>
          <div className="w-10 h-1 bg-zinc-800 rounded-full ml-1 overflow-hidden">
            <div className={`h-full ${currentTier.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${reputation}%` }} />
          </div>
        </div>
        
        {onOpenCompany && (
            <button 
                onClick={onOpenCompany}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-full border border-zinc-800 transition-colors group"
                title="사옥 및 인사 관리"
            >
                <Building size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-zinc-400 group-hover:text-white hidden xl:inline">Management</span>
            </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 text-sm">
          <Wallet size={14} className="text-emerald-500" />
          <span className={`font-bold ${funds < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
            ₩{funds.toLocaleString()}
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 text-sm">
          <Trophy size={14} className="text-yellow-500" />
          <span className="text-zinc-400">Total Fans: <span className="text-white font-bold">{totalFans}</span></span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings}
              title="설정"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
            >
              <Settings size={16} />
            </button>
          )}

          <div className="flex items-center bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800">
            <button 
              onClick={onFileExport}
              title="파일로 내보내기"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
            >
              <FileOutput size={16} />
            </button>
            <button 
              onClick={handleImportClick}
              title="파일 불러오기"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
            >
              <FileInput size={16} />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".json"
              />
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
