
import React from 'react';
import { X, Settings, Heart } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isRpsEnabled: boolean;
  onToggleRps: () => void;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, isRpsEnabled, onToggleRps }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <div className="flex items-center gap-2">
            <Settings className="text-zinc-400" size={20} />
            <h3 className="text-lg font-bold text-white">게임 설정</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                알페스(RPS) 반응 보기 <Heart size={12} className="text-purple-500 fill-purple-500" />
              </span>
              <span className="text-xs text-zinc-500 mt-1">
                SNS 피드에서 멤버 간 가상 커플(망상) 반응을 표시합니다.
              </span>
            </div>
            
            <button 
              onClick={onToggleRps}
              className={`
                w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex-shrink-0
                ${isRpsEnabled ? 'bg-purple-600' : 'bg-zinc-700'}
              `}
            >
              <div 
                className={`
                  w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out
                  ${isRpsEnabled ? 'translate-x-6' : 'translate-x-0'}
                `} 
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 text-center">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
