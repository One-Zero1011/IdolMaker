
import React, { useState } from 'react';
import { useGame } from './hooks/useGame';
import { Trainee } from './types/index';

// Components
import Header from './components/layout/Header';
import DashboardSidebar from './components/dashboard/DashboardSidebar';
import SchedulerPanel from './components/scheduler/SchedulerPanel';
import RosterSection from './components/roster/RosterSection';
import TraineeFormModal from './components/CreateTraineeModal';
import WeeklyResultModal from './components/WeeklyResultModal';
import HistoryModal from './components/HistoryModal';
import MessageModal from './components/ui/MessageModal';

const App: React.FC = () => {
  // Game State Hook
  const {
    week,
    trainees,
    activeTrainees,
    weeklyPlan,
    gameLogs,
    historyLogs,
    notification,
    addNewTrainee,
    updateTrainee,
    removeTrainee,
    updateDailyPlan,
    nextWeek,
    closeLogs,
    saveToBrowser,
    loadFromBrowser,
    exportToFile,
    importFromFile,
    resetGame,
    closeMessage
  } = useGame();

  // UI State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState<Trainee | undefined>(undefined);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingTrainee(undefined);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (trainee: Trainee) => {
    setEditingTrainee(trainee);
    setIsFormModalOpen(true);
  };

  const handleSaveTrainee = (data: any) => {
    if (editingTrainee) {
      updateTrainee(editingTrainee.id, data);
    } else {
      addNewTrainee(data);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-pink-500/30">
      
      <Header 
        activeTrainees={activeTrainees} 
        onBrowserSave={saveToBrowser}
        onBrowserLoad={loadFromBrowser}
        onFileExport={exportToFile}
        onFileImport={importFromFile}
        onReset={resetGame}
      />

      {/* Main Content Layout */}
      <main className="p-6 lg:p-8 max-w-[1920px] mx-auto animate-in fade-in duration-500">
        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Dashboard & Stats (30%) */}
          <DashboardSidebar 
            week={week}
            activeTrainees={activeTrainees}
            trainees={trainees}
            selectedTraineeId={selectedTraineeId}
            onSelectTrainee={setSelectedTraineeId}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
          />

          {/* RIGHT COLUMN: Scheduler & Roster (70%) */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8">
            
            <SchedulerPanel 
              activeTrainees={activeTrainees}
              weeklyPlan={weeklyPlan}
              onScheduleChange={updateDailyPlan}
              onRunWeek={nextWeek}
            />

            <RosterSection 
              trainees={trainees}
              selectedTraineeId={selectedTraineeId}
              onSelect={setSelectedTraineeId}
              onEdit={handleOpenEdit}
              onDelete={removeTrainee}
              onOpenCreateModal={handleOpenCreate}
            />

          </div>

        </div>
      </main>

      {/* Modals */}
      <TraineeFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        onSave={handleSaveTrainee} 
        initialData={editingTrainee}
      />
      <WeeklyResultModal 
        results={gameLogs} 
        onClose={closeLogs} 
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        logs={historyLogs}
      />
      
      {/* System Notification Modal */}
      <MessageModal 
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onConfirm={notification.onConfirm || (() => {})}
        onClose={closeMessage}
      />
    </div>
  );
};

export default App;
