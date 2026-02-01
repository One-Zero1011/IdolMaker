import React, { useState } from 'react';
import { HQLevel, StaffState, StaffRole } from '../../types/index';
import { HQ_LEVELS, STAFF_ROLES } from '../../data/constants';
import { Building, Users, ArrowUpCircle, X, Wallet, Briefcase, Plus, Minus, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hqLevel: number;
  staff: StaffState;
  funds: number;
  onUpgradeHQ: () => void;
  onHireStaff: (role: StaffRole) => void;
  onFireStaff: (role: StaffRole) => void;
}

const CompanyDashboard: React.FC<Props> = ({ 
  isOpen, onClose, hqLevel, staff, funds, onUpgradeHQ, onHireStaff, onFireStaff 
}) => {
  const [activeTab, setActiveTab] = useState<'hq' | 'staff'>('hq');

  if (!isOpen) return null;

  const currentHQ = HQ_LEVELS.find(h => h.level === hqLevel) || HQ_LEVELS[0];
  const nextHQ = HQ_LEVELS.find(h => h.level === hqLevel + 1);
  const totalStaffCount = (Object.values(staff) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                 <Building className="text-white" size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white tracking-tight">기획사 경영 관리</h2>
                 <p className="text-zinc-500 text-xs">사옥을 확장하고 전문 인력을 확충하여 회사를 성장시키세요.</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
            <button 
                onClick={() => setActiveTab('hq')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'hq' ? 'bg-zinc-800 text-white border-b-2 border-blue-500' : 'text-zinc-500 hover:bg-zinc-900'}`}
            >
                🏢 사옥 이전 및 관리
            </button>
            <button 
                onClick={() => setActiveTab('staff')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'staff' ? 'bg-zinc-800 text-white border-b-2 border-blue-500' : 'text-zinc-500 hover:bg-zinc-900'}`}
            >
                👥 인사 관리 (Staff)
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-900">
            {activeTab === 'hq' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Current HQ Info */}
                    <div className={`p-8 rounded-3xl bg-gradient-to-br ${currentHQ.imgColor} border border-white/10 relative overflow-hidden flex flex-col justify-between min-h-[400px]`}>
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full bg-black/30 border border-white/20 text-xs font-black text-white mb-4">
                                CURRENT LEVEL {currentHQ.level}
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2">{currentHQ.name}</h3>
                            <p className="text-white/70">{currentHQ.description}</p>
                        </div>

                        <div className="space-y-4 mt-8">
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                                <span className="text-sm font-bold text-white/80 flex items-center gap-2">
                                    <Users size={16} /> 최대 스태프 수용
                                </span>
                                <span className="text-xl font-black text-white">{currentHQ.maxStaff}명</span>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                                <span className="text-sm font-bold text-white/80 flex items-center gap-2">
                                    <Wallet size={16} /> 주간 유지비
                                </span>
                                <span className="text-xl font-black text-red-300">-₩{currentHQ.maintenance.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade Option */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <ArrowUpCircle className="text-emerald-500" /> 다음 단계 사옥
                        </h4>
                        
                        {nextHQ ? (
                            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{nextHQ.name}</h3>
                                        <p className="text-sm text-zinc-500">{nextHQ.description}</p>
                                    </div>
                                    <span className="text-xs font-black bg-zinc-800 text-zinc-400 px-2 py-1 rounded">LV.{nextHQ.level}</span>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">수용 인원</span>
                                        <span className="text-emerald-400 font-bold">{currentHQ.maxStaff} → {nextHQ.maxStaff}명</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">주간 유지비</span>
                                        <span className="text-red-400 font-bold">₩{nextHQ.maintenance.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-zinc-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-zinc-500 uppercase">이전 비용</span>
                                        <span className={`text-xl font-black ${funds >= nextHQ.cost ? 'text-white' : 'text-red-500'}`}>
                                            ₩{nextHQ.cost.toLocaleString()}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={onUpgradeHQ}
                                        disabled={funds < nextHQ.cost}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all
                                            ${funds >= nextHQ.cost 
                                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                                        `}
                                    >
                                        사옥 확장 계약 체결
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-zinc-950/50 border border-zinc-800 rounded-3xl text-zinc-500 gap-4">
                                <Building size={48} className="opacity-20" />
                                <p>최고 레벨 사옥에 도달했습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'staff' && (
                <div className="space-y-6">
                     <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800">
                                <Briefcase className="text-zinc-400" size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-zinc-400">현재 고용 현황</div>
                                <div className="text-2xl font-black text-white">
                                    {totalStaffCount} <span className="text-lg text-zinc-600 font-medium">/ {currentHQ.maxStaff} 명</span>
                                </div>
                            </div>
                         </div>
                         <div className="text-right">
                             <div className="text-sm font-bold text-zinc-400">주간 총 인건비</div>
                             <div className="text-xl font-black text-red-400">
                                 -₩{STAFF_ROLES.reduce((acc, role) => acc + (staff[role.id] * role.salary), 0).toLocaleString()}
                             </div>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {STAFF_ROLES.map(role => {
                            const count = staff[role.id];
                            const canHire = funds >= role.hireCost && totalStaffCount < currentHQ.maxStaff;
                            
                            return (
                                <div key={role.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{role.name}</h4>
                                            <p className="text-xs text-zinc-500 mt-1">{role.description}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-[10px] font-bold rounded border border-blue-800/50">
                                            {role.effectDesc}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl">
                                        <div className="flex-1">
                                            <div className="text-[10px] text-zinc-500 uppercase font-bold">현재 고용</div>
                                            <div className="text-2xl font-black text-white">{count}명</div>
                                        </div>
                                        <div className="flex-1 border-l border-zinc-800 pl-4">
                                            <div className="text-[10px] text-zinc-500 uppercase font-bold">고용 비용</div>
                                            <div className="text-sm font-bold text-zinc-300">₩{role.hireCost.toLocaleString()}</div>
                                        </div>
                                        <div className="flex-1 border-l border-zinc-800 pl-4">
                                            <div className="text-[10px] text-zinc-500 uppercase font-bold">주급 (1인)</div>
                                            <div className="text-sm font-bold text-red-400">₩{role.salary.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onFireStaff(role.id)}
                                            disabled={count === 0}
                                            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-zinc-800 transition-all
                                                ${count > 0 ? 'bg-zinc-900 hover:bg-red-950 hover:text-red-400 hover:border-red-900 text-zinc-400' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'}
                                            `}
                                        >
                                            <Minus size={16} /> 해고
                                        </button>
                                        <button 
                                            onClick={() => onHireStaff(role.id)}
                                            disabled={!canHire}
                                            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                                ${canHire 
                                                    ? 'bg-white text-black hover:bg-zinc-200' 
                                                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                                            `}
                                        >
                                            <Plus size={16} /> 고용
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                     </div>
                     
                     <div className="flex items-start gap-3 bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-zinc-400 text-xs leading-relaxed">
                        <Info className="shrink-0 mt-0.5" size={16} />
                        <p>
                            스태프를 고용하면 매주 자동으로 효과가 적용됩니다. 
                            매니저는 체력 관리를, 트레이너는 능력치 상승을, 마케터는 팬 유입을, 스타일리스트는 비주얼과 매력을 담당합니다.
                            사옥 레벨에 따라 고용할 수 있는 최대 인원이 제한됩니다.
                        </p>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;