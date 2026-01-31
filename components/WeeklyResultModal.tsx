import React, { useState, useEffect } from 'react';
import { GameLog } from '../types/index';
import { X, AlertOctagon, CheckCircle2, MessageSquare, ArrowRight, Check } from 'lucide-react';

interface Props {
  results: GameLog | null;
  onClose: () => void;
}

const WeeklyResultModal: React.FC<Props> = ({ results, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (results) setCurrentStep(0);
  }, [results]);

  if (!results) return null;

  const totalSteps = results.dailyLogs.length;
  const currentLog = results.dailyLogs[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[70vh]">
        
        {/* Header with Progress */}
        <div className="bg-zinc-950 border-b border-zinc-800 p-6 space-y-4">
          <div className="flex justify-between items-start">
             <div>
               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                 <span className="text-pink-500">Week {results.week}</span> 결과 리포트
               </h2>
               <p className="text-zinc-400 text-sm mt-1">
                 {currentLog.dayLabel} 활동 기록
               </p>
             </div>
             <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white transition-colors">
               <X size={20} />
             </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-1 h-1.5 w-full">
            {results.dailyLogs.map((_, idx) => (
              <div 
                key={idx} 
                className={`flex-1 rounded-full transition-all duration-300 ${idx <= currentStep ? 'bg-pink-500' : 'bg-zinc-800'}`}
              />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-900/50">
          <div className="space-y-3 animate-in slide-in-from-right-4 duration-300" key={currentStep}>
            {currentLog.logs.length === 0 ? (
              <div className="text-center text-zinc-500 py-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <MessageSquare className="text-zinc-600" size={32} />
                </div>
                <p>기록된 특이사항이 없습니다.</p>
              </div>
            ) : (
              currentLog.logs.map((log, idx) => {
                let type = 'normal';
                let bgColor = 'bg-zinc-800/50';
                let borderColor = 'border-zinc-700/50';
                let textColor = 'text-zinc-300';
                let Icon = MessageSquare;
                let iconColor = 'text-zinc-500';

                // CRITICAL / DANGER (Red)
                if (log.includes('[비보]') || log.includes('[충격]') || log.includes('퇴출') || log.includes('탈진') || log.includes('부상')) {
                  type = 'critical';
                  bgColor = 'bg-red-950/30';
                  borderColor = 'border-red-900/50';
                  textColor = 'text-red-200';
                  Icon = AlertOctagon;
                  iconColor = 'text-red-500';
                }
                // MAJOR WARNING (Orange/Red)
                else if (log.includes('[논란]') || log.includes('[경고]') || log.includes('갈등') || log.includes('불안정')) {
                  type = 'warning';
                  bgColor = 'bg-orange-950/40';
                  borderColor = 'border-orange-800/50';
                  textColor = 'text-orange-200';
                  Icon = AlertOctagon;
                  iconColor = 'text-orange-500';
                }
                // MINOR WARNING (Yellow/Orange)
                else if (log.includes('[구설수]') || log.includes('주의')) {
                  type = 'minor';
                  bgColor = 'bg-yellow-950/20';
                  borderColor = 'border-yellow-900/40';
                  textColor = 'text-yellow-200';
                  Icon = AlertOctagon;
                  iconColor = 'text-yellow-500';
                }
                // SUCCESS (Green)
                else if (log.includes('바이럴') || log.includes('완벽') || log.includes('칭찬')) {
                  type = 'success';
                  bgColor = 'bg-emerald-950/30';
                  borderColor = 'border-emerald-900/50';
                  textColor = 'text-emerald-200';
                  Icon = CheckCircle2;
                  iconColor = 'text-emerald-500';
                }

                return (
                  <div 
                    key={idx} 
                    className={`
                      p-4 rounded-xl border flex items-start gap-4 transition-all hover:scale-[1.01]
                      ${bgColor} ${borderColor} ${textColor}
                    `}
                  >
                    <div className={`mt-1 p-1.5 rounded-full bg-black/20 ${iconColor}`}>
                      <Icon size={18} />
                    </div>
                    <span className="leading-relaxed text-base">{log}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800">
           <button 
             onClick={handleNext}
             className={`
               w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
               ${isLastStep 
                 ? 'bg-white text-black hover:bg-zinc-200' 
                 : 'bg-pink-600 text-white hover:bg-pink-700 hover:shadow-pink-900/20'}
             `}
           >
             {isLastStep ? (
               <>다음 주차 준비 <Check size={20} /></>
             ) : (
               <>다음 날 <ArrowRight size={20} /></>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyResultModal;