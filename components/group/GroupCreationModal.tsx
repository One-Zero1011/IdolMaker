
import React, { useState, useMemo } from 'react';
import { X, Check, Users, Sparkles, Star, TrendingUp, ShieldCheck, Music2, Lock } from 'lucide-react';
import { Trainee, GroupType, Group } from '../../types/index';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trainees: Trainee[];
  existingGroups: Group[];
  onForm: (name: string, memberIds: string[], type: GroupType) => void;
}

const GroupCreationModal: React.FC<Props> = ({ isOpen, onClose, trainees, existingGroups, onForm }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const activeTrainees = useMemo(() => trainees.filter(t => t.status === 'Active'), [trainees]);

  const groupInfo = useMemo(() => {
    if (selectedIds.length === 0) return null;
    
    const selectedMembers = activeTrainees.filter(t => selectedIds.includes(t.id));
    const maleCount = selectedMembers.filter(t => t.gender === 'Male').length;
    const femaleCount = selectedMembers.filter(t => t.gender === 'Female').length;
    
    let type: GroupType = 'Co-ed Group';
    if (maleCount > 0 && femaleCount === 0) type = 'Boy Group';
    if (femaleCount > 0 && maleCount === 0) type = 'Girl Group';

    const avgVocal = selectedMembers.reduce((a, b) => a + b.stats.vocal, 0) / selectedMembers.length;
    const avgDance = selectedMembers.reduce((a, b) => a + b.stats.dance, 0) / selectedMembers.length;
    const avgVisual = selectedMembers.reduce((a, b) => a + b.stats.visual, 0) / selectedMembers.length;

    return { type, maleCount, femaleCount, avgVocal, avgDance, avgVisual };
  }, [selectedIds, activeTrainees]);

  // Map trainee ID to group name if they belong to one
  const traineeGroupMap = useMemo(() => {
    const map: Record<string, string> = {};
    existingGroups.forEach(g => {
        g.memberIds.forEach(id => {
            map[id] = g.name;
        });
    });
    return map;
  }, [existingGroups]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName && selectedIds.length > 0 && groupInfo) {
      onForm(groupName, selectedIds, groupInfo.type);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                 <Music2 className="text-white" size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white tracking-tight">정식 그룹 결성</h2>
                 <p className="text-zinc-500 text-xs">함께 데뷔할 멤버들을 조합하고 팀명을 결정하세요.</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
           </button>
        </div>

        <form onSubmit={handleForm} className="flex-1 overflow-hidden flex flex-col">
           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              
              {/* Group Name */}
              <div className="space-y-3">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={14} /> 정식 그룹명 설정
                </label>
                <input 
                  required
                  type="text"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-2xl px-6 py-4 text-2xl font-black text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-800"
                  placeholder="그룹 이름을 지어주세요"
                />
              </div>

              {/* Member Selection */}
              <div className="space-y-4">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                   <Users size={14} /> 멤버 선택 (현재 활동 중인 아티스트)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   {activeTrainees.map(trainee => {
                     const isSelected = selectedIds.includes(trainee.id);
                     const existingGroupName = traineeGroupMap[trainee.id];
                     const isOccupied = !!existingGroupName;

                     return (
                       <button
                         key={trainee.id}
                         type="button"
                         disabled={isOccupied}
                         onClick={() => !isOccupied && toggleSelect(trainee.id)}
                         className={`
                           relative p-4 rounded-2xl border-2 text-left transition-all flex flex-col items-center gap-3
                           ${isOccupied 
                             ? 'bg-zinc-900 border-zinc-800 opacity-60 cursor-not-allowed' 
                             : isSelected 
                               ? 'bg-indigo-600/20 border-indigo-500 scale-[1.02]' 
                               : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}
                         `}
                       >
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-xl relative"
                            style={{backgroundColor: isOccupied ? '#52525b' : trainee.imageColor}}
                          >
                            {trainee.name[0]}
                            {isOccupied && (
                                <div className="absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-1 border border-zinc-700">
                                    <Lock size={10} className="text-zinc-500" />
                                </div>
                            )}
                          </div>
                          <div className="text-center">
                             <div className={`text-sm font-bold ${isOccupied ? 'text-zinc-500' : 'text-white'}`}>{trainee.name}</div>
                             <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                                {isOccupied ? (
                                    <span className="text-indigo-400 truncate max-w-[80px] block">{existingGroupName}</span>
                                ) : (
                                    trainee.gender === 'Female' ? 'Female' : 'Male'
                                )}
                             </div>
                          </div>
                          {isSelected && <div className="absolute top-2 right-2 p-1 bg-indigo-500 rounded-full"><Check size={10} className="text-white" /></div>}
                       </button>
                     );
                   })}
                   {activeTrainees.length === 0 && (
                     <div className="col-span-full py-10 text-center text-zinc-600 italic border-2 border-dashed border-zinc-800 rounded-2xl">
                        영입된 아티스트가 없습니다.
                     </div>
                   )}
                </div>
              </div>

              {/* Preview Stats */}
              {groupInfo && (
                <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 animate-in slide-in-from-bottom-4">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">그룹 시너지 분석</span>
                        <h4 className="text-xl font-black text-white italic tracking-tight">{groupName || '...'}</h4>
                      </div>
                      <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${groupInfo.type === 'Boy Group' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 
                          groupInfo.type === 'Girl Group' ? 'bg-pink-600/20 text-pink-400 border border-pink-500/30' : 
                          'bg-purple-600/20 text-purple-400 border border-purple-500/30'}
                      `}>
                        {groupInfo.type}
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                         <div className="text-[9px] font-bold text-zinc-500 flex items-center gap-1"><Star size={10} /> 보컬 평균</div>
                         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{width: `${groupInfo.avgVocal}%`}} />
                         </div>
                      </div>
                      <div className="space-y-1">
                         <div className="text-[9px] font-bold text-zinc-500 flex items-center gap-1"><TrendingUp size={10} /> 댄스 평균</div>
                         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{width: `${groupInfo.avgDance}%`}} />
                         </div>
                      </div>
                      <div className="space-y-1">
                         <div className="text-[9px] font-bold text-zinc-500 flex items-center gap-1"><Sparkles size={10} /> 비주얼 평균</div>
                         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-500" style={{width: `${groupInfo.avgVisual}%`}} />
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* Footer */}
           <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex gap-4">
              <div className="flex-1 flex flex-col justify-center">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">선택된 멤버</span>
                 <span className="text-lg font-bold text-white">{selectedIds.length}명</span>
              </div>
              <button
                type="submit"
                disabled={!groupName || selectedIds.length === 0}
                className={`
                  px-12 rounded-2xl font-black text-lg transition-all
                  ${groupName && selectedIds.length > 0 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-xl shadow-indigo-900/20' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                `}
              >
                그룹 데뷔 확정
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default GroupCreationModal;
