import React from 'react';
import { X, History } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
}

const HistoryModal: React.FC<Props> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        <div className="flex justify-between items-center p-5 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
             <div className="bg-zinc-800 p-2 rounded-lg">
                <History className="text-zinc-400" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">전체 활동 기록</h2>
                <p className="text-zinc-400 text-sm">누적된 모든 로그를 최신순으로 확인합니다.</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-0 overflow-y-auto flex-1 bg-zinc-950/30">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
               <History size={48} className="opacity-20" />
               <p>아직 기록된 활동이 없습니다.</p>
            </div>
          ) : (
             <div className="divide-y divide-zinc-800/50">
                {logs.map((log, idx) => {
                    const isNewWeek = log.includes('[월]'); // Simple heuristic helper if needed
                    return (
                        <div key={idx} className="p-4 hover:bg-zinc-800/30 transition-colors flex gap-3 text-sm text-zinc-300">
                            <span className="text-zinc-500 font-mono text-xs mt-1 w-6">{logs.length - idx}</span>
                            <span className="leading-relaxed">{log}</span>
                        </div>
                    );
                })}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;