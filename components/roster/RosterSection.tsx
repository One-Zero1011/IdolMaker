
import React from 'react';
import { Users, Plus, Sparkles } from 'lucide-react';
import { Trainee } from '../../types/index';
import TraineeCard from '../ui/TraineeCard';

interface Props {
  title?: string;
  trainees: Trainee[];
  hasGroup: boolean;
  selectedTraineeId: string | null;
  onSelect: (id: string) => void;
  onEdit: (trainee: Trainee) => void;
  onDelete: (id: string) => void;
  onRenew: (trainee: Trainee) => void;
  onOpenCreateModal: () => void;
  onOpenGroupModal: () => void;
}

const RosterSection: React.FC<Props> = ({ 
  title = "연습생 명단",
  trainees, 
  hasGroup,
  selectedTraineeId, 
  onSelect, 
  onEdit, 
  onDelete, 
  onRenew, 
  onOpenCreateModal,
  onOpenGroupModal
}) => {
  const activeCount = trainees.filter(t => t.status === 'Active').length;

  return (
    <section className="space-y-4 pt-4 border-t border-zinc-800/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="text-indigo-500" /> {title}
        </h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!hasGroup && activeCount > 0 && (
            <button 
              onClick={onOpenGroupModal}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all border border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] animate-pulse"
            >
              <Sparkles size={16} /> 정식 그룹 결성
            </button>
          )}
          <button 
            onClick={onOpenCreateModal}
            className="flex-1 sm:flex-none bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-zinc-700 shadow-sm"
          >
            <Plus size={16} /> 연습생 캐스팅
          </button>
        </div>
      </div>
      
      {trainees.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-600 text-sm">표시할 아티스트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {trainees.map(trainee => (
            <TraineeCard 
                key={trainee.id} 
                trainee={trainee} 
                allTrainees={trainees}
                onClick={() => onSelect(trainee.id)}
                onEdit={onEdit}
                onDelete={onDelete}
                onRenew={onRenew}
                selected={selectedTraineeId === trainee.id}
            />
            ))}
        </div>
      )}
    </section>
  );
};

export default RosterSection;
