
import React from 'react';
import { X, ChevronRight, ChevronLeft, MessageSquareQuote } from 'lucide-react';

interface Props {
  isOpen: boolean;
  step: number;
  totalSteps: number;
  title: string;
  content: string;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const TutorialOverlay: React.FC<Props> = ({ 
  isOpen, step, totalSteps, title, content, onNext, onPrev, onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6 pointer-events-none flex justify-center items-end">
      <div className="pointer-events-auto w-full max-w-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 shadow-2xl rounded-2xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
        
        <div className="flex items-start gap-4">
          {/* Avatar / Icon */}
          <div className="hidden sm:flex w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shrink-0 shadow-lg shadow-indigo-900/30">
             <MessageSquareQuote size={28} className="text-white" />
          </div>

          <div className="flex-1 space-y-3">
             <div className="flex justify-between items-start">
                <div>
                   <span className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1 block">
                      Management Tutorial ({step + 1}/{totalSteps})
                   </span>
                   <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 text-zinc-500 hover:text-white transition-colors"
                  title="튜토리얼 종료"
                >
                   <X size={20} />
                </button>
             </div>
             
             <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {content}
             </p>

             <div className="flex justify-end items-center gap-2 pt-2">
                <button
                  onClick={onPrev}
                  disabled={step === 0}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors
                    ${step === 0 ? 'text-zinc-600 cursor-not-allowed' : 'bg-zinc-800 text-white hover:bg-zinc-700'}
                  `}
                >
                   <ChevronLeft size={16} /> 이전
                </button>
                <button
                  onClick={onNext}
                  className="px-6 py-2 rounded-lg text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-1 shadow-lg"
                >
                   {step === totalSteps - 1 ? '시작하기' : '다음'} <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
