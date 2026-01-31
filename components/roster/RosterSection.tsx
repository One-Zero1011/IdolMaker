
import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Trainee } from '../../types/index';
import TraineeCard from '../ui/TraineeCard';

interface Props {
  trainees: Trainee[];
  selectedTraineeId: string | null;
  onSelect: (id: string) => void;
  onEdit: (trainee: Trainee) => void;
  onDelete: (id: string) => void;
  onOpenCreateModal: () => void;
}

const RosterSection: React.FC<Props> = ({ trainees, selectedTraineeId, onSelect, onEdit, onDelete, onOpenCreateModal }) => {
  return (
    <section className="space-y-4 pt-4 border-t border-zinc-800/50">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="text-indigo-500" /> 연습생 명단
        </h2>
        <button 
        onClick={onOpenCreateModal}
        className="bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-zinc-700 shadow-sm"
      >
        <Plus size={16} /> 연습생 캐스팅
      </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {trainees.map(trainee => (
          <TraineeCard 
            key={trainee.id} 
            trainee={trainee} 
            allTrainees={trainees}
            onClick={() => onSelect(trainee.id)}
            onEdit={onEdit}
            onDelete={onDelete}
            selected={selectedTraineeId === trainee.id}
          />
        ))}
      </div>
    </section>
  );
};

export default RosterSection;
