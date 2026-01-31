
import React from 'react';
import { Group } from '../../types/index';
import { Users, Star, Music2, Heart } from 'lucide-react';

interface Props {
  groups: Group[];
  activeGroupId: string | null;
  onSelect: (id: string) => void;
  onOpenCreate: () => void;
}

const GroupSelector: React.FC<Props> = ({ groups, activeGroupId, onSelect, onOpenCreate }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      {groups.map((group) => {
        const isActive = group.id === activeGroupId;
        return (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className={`
              flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all shrink-0
              ${isActive 
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-105' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}
            `}
          >
            <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-500' : 'bg-zinc-800'}`}>
               {group.type === 'Boy Group' ? <Users size={16} /> : 
                group.type === 'Girl Group' ? <Heart size={16} /> : <Music2 size={16} />}
            </div>
            <div className="text-left">
               <div className="text-sm font-black tracking-tight">{group.name}</div>
               <div className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-indigo-200' : 'text-zinc-500'}`}>
                 {group.type}
               </div>
            </div>
          </button>
        );
      })}
      
      <button
        onClick={onOpenCreate}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 transition-all shrink-0"
      >
        <Star size={16} />
        <span className="text-sm font-bold">새 그룹 결성</span>
      </button>
    </div>
  );
};

export default GroupSelector;
