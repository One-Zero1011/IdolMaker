
import React, { useState } from 'react';
import { useGame } from './hooks/useGame';
import { Trainee, AlbumConcept } from './types/index';
import { Smartphone, Disc } from 'lucide-react';

// Components
import Header from './components/layout/Header';
import DashboardSidebar from './components/dashboard/DashboardSidebar';
import SchedulerPanel from './components/scheduler/SchedulerPanel';
import RosterSection from './components/roster/RosterSection';
import FacilitiesSection from './components/FacilitiesSection';
import TraineeFormModal from './components/CreateTraineeModal';
import WeeklyResultModal from './components/WeeklyResultModal';
import HistoryModal from './components/HistoryModal';
import MessageModal from './components/ui/MessageModal';
import FanFeedMobile from './components/ui/FanFeedMobile';
import ContractRenewalModal from './components/ContractRenewalModal';
import SpecialEventModal from './components/SpecialEventModal';
import AlbumProductionModal from './components/album/AlbumProductionModal';
import AlbumHistory from './components/album/AlbumHistory';

const App: React.FC = () => {
  const {
    week,
    funds,
    reputation,
    facilities,
    trainees,
    activeTrainees,
    weeklyPlan,
    gameLogs,
    historyLogs,
    notification,
    currentSpecialEvent,
    pendingDecision,
    albums,
    addNewTrainee,
    updateTrainee,
    removeTrainee,
    renewContract,
    releaseTrainee,
    upgradeFacility,
    updateDailyPlan,
    nextWeek,
    closeLogs,
    saveToBrowser,
    loadFromBrowser,
    exportToFile,
    importFromFile,
    resetGame,
    closeMessage,
    handleEventDecision,
    produceAlbum
  } = useGame();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState<Trainee | undefined>(undefined);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);
  const [isFanFeedOpen, setIsFanFeedOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [targetTrainee, setTargetTrainee] = useState<Trainee | null>(null);

  const handleOpenCreate = () => {
    setEditingTrainee(undefined);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (trainee: Trainee) => {
    setEditingTrainee(trainee);
    setIsFormModalOpen(true);
  };

  const handleOpenRenewal = (trainee: Trainee) => {
    setTargetTrainee(trainee);
    setIsRenewalModalOpen(true);
  };

  const handleSaveTrainee = (data: any, cost: number = 0) => {
    if (editingTrainee) {
      updateTrainee(editingTrainee.id, data);
    } else {
      addNewTrainee(data, cost);
    }
  };

  const handleAlbumProduction = (title: string, concept: AlbumConcept) => {
    const result = produceAlbum(title, concept);
    if (result) {
      setIsAlbumModalOpen(false);
      // 결과 알림
      const { album, revenue } = result;
      const billboardText = album.isBillboard ? "\n🌟 빌보드 차트 진입 성공!" : "";
      const message = `"${album.title}" 발매 결과\n차트 최고 순위: ${album.peakChart}위\n앨범 판매량: ${album.sales.toLocaleString()}장\n총 정산금: ₩${revenue.toLocaleString()}${billboardText}`;
      // 간단히 알림 (기존 모달 활용)
      setTimeout(() => {
         window.alert(message);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500/30">
      
      <Header 
        activeTrainees={activeTrainees} 
        funds={funds}
        reputation={reputation}
        onBrowserSave={saveToBrowser}
        onBrowserLoad={loadFromBrowser}
        onFileExport={exportToFile}
        onFileImport={importFromFile}
        onReset={resetGame}
      />

      <main className="p-6 lg:p-8 max-w-[1920px] mx-auto animate-in fade-in duration-500">
        <div className="grid grid-cols-12 gap-6">
          
          <DashboardSidebar 
            week={week}
            activeTrainees={activeTrainees}
            trainees={trainees}
            selectedTraineeId={selectedTraineeId}
            onSelectTrainee={setSelectedTraineeId}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
          />

          <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-10">
            
            <div className="flex justify-end -mb-6 relative z-10">
               <button 
                disabled={activeTrainees.length === 0}
                onClick={() => setIsAlbumModalOpen(true)}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl
                  ${activeTrainees.length > 0 
                    ? 'bg-pink-600 text-white hover:bg-pink-500 hover:scale-105 active:scale-95 shadow-pink-900/20' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                `}
               >
                 <Disc size={24} className="animate-spin-slow" /> 새로운 앨범 프로듀싱
               </button>
            </div>

            <SchedulerPanel 
              week={week}
              reputation={reputation}
              activeTrainees={activeTrainees}
              weeklyPlan={weeklyPlan}
              onScheduleChange={updateDailyPlan}
              onRunWeek={nextWeek}
            />

            <AlbumHistory albums={albums} />

            <FacilitiesSection 
              facilities={facilities}
              funds={funds}
              onUpgrade={upgradeFacility}
            />

            <RosterSection 
              trainees={trainees}
              selectedTraineeId={selectedTraineeId}
              onSelect={setSelectedTraineeId}
              onEdit={handleOpenEdit}
              onDelete={removeTrainee}
              onRenew={handleOpenRenewal}
              onOpenCreateModal={handleOpenCreate}
            />

          </div>

        </div>
      </main>

      <div className="fixed bottom-6 left-6 z-50">
        <button 
          onClick={() => setIsFanFeedOpen(!isFanFeedOpen)}
          className={`
            relative p-4 rounded-full shadow-2xl transition-all duration-300 group
            ${isFanFeedOpen ? 'bg-zinc-800 text-white rotate-12 scale-110' : 'bg-yellow-600 text-white hover:bg-yellow-500 hover:scale-110'}
          `}
        >
          <Smartphone size={28} />
          {!isFanFeedOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 border-2 border-black"></span>
            </span>
          )}
        </button>
      </div>

      <TraineeFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        onSave={handleSaveTrainee} 
        funds={funds}
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
      <FanFeedMobile 
        isOpen={isFanFeedOpen}
        onClose={() => setIsFanFeedOpen(false)}
        trainees={trainees}
        historyLogs={historyLogs}
      />
      <ContractRenewalModal 
        isOpen={isRenewalModalOpen}
        onClose={() => setIsRenewalModalOpen(false)}
        trainee={targetTrainee}
        funds={funds}
        onRenew={renewContract}
        onRelease={releaseTrainee}
      />
      <SpecialEventModal 
        isOpen={pendingDecision}
        event={currentSpecialEvent}
        funds={funds}
        onDecision={handleEventDecision}
      />
      <AlbumProductionModal 
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        activeTrainees={activeTrainees}
        funds={funds}
        onProduce={handleAlbumProduction}
      />
      
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
