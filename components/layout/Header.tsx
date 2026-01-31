import React, { useRef } from 'react';
import { Music2, Trophy, RotateCcw, FileOutput, FileInput, CloudUpload, CloudDownload } from 'lucide-react';
import { Trainee } from '../../types/index';

interface HeaderProps {
  activeTrainees: Trainee[];
  onBrowserSave: () => void;
  onBrowserLoad: () => void;
  onFileExport: () => void;
  onFileImport: (file: File) => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTrainees, 
  onBrowserSave, 
  onBrowserLoad, 
  onFileExport, 
  onFileImport, 
  onReset 
}) => {
  const totalFans = activeTrainees.reduce((acc, t) => acc + t.fans, 0).toLocaleString();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileImport(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 lg:px-12 bg-black/50 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="bg-pink-600 p-1.5 rounded-lg text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]">
          <Music2 size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
          K-아이돌 프로듀서
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 text-sm">
          <Trophy size={14} className="text-yellow-500" />
          <span>총 팬덤: <span className="text-white font-bold">{totalFans}명</span></span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800">
            <button 
              onClick={onBrowserSave}
              title="브라우저 저장 (캐시)"
              className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 rounded-md transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              <CloudUpload size={16} />
              <span className="hidden lg:block">캐시 저장</span>
            </button>
            <button 
              onClick={onBrowserLoad}
              title="브라우저 불러오기 (캐시)"
              className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-md transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              <CloudDownload size={16} />
              <span className="hidden lg:block">캐시 로드</span>
            </button>
          </div>

          <div className="flex items-center bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800">
            <button 
              onClick={onFileExport}
              title="파일로 내보내기 (.json)"
              className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-800 rounded-md transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              <FileOutput size={16} />
              <span className="hidden lg:block">파일 저장</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="파일 불러오기 (.json)"
              className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-zinc-800 rounded-md transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              <FileInput size={16} />
              <span className="hidden lg:block">파일 로드</span>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
          </div>

          <div className="w-px h-6 bg-zinc-800 mx-1" />
          <button onClick={onReset} title="게임 초기화" className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;