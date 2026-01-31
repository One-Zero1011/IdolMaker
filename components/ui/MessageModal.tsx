
import React from 'react';
import { X, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

export type MessageType = 'alert' | 'confirm' | 'success';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  type?: MessageType;
  onConfirm: () => void;
  onClose: () => void;
}

const MessageModal: React.FC<Props> = ({ isOpen, title, message, type = 'alert', onConfirm, onClose }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={32} />;
      case 'confirm': return <HelpCircle className="text-blue-500" size={32} />;
      default: return <AlertCircle className="text-pink-500" size={32} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 bg-zinc-800 p-3 rounded-full">
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 flex gap-2">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
            >
              취소
            </button>
          )}
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-lg shadow-pink-900/20 transition-all active:scale-95"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
