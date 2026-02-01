
import React, { useState } from 'react';
import { useGame } from './hooks/useGame';
import { Trainee, AlbumConcept, Album } from './types/index';
import { Smartphone, Disc, Timer, AlertCircle } from 'lucide-react';

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
import AlbumReleaseSimulationModal from './components/album/AlbumReleaseSimulationModal';
import GlobalRankingChart from './components/ranking/GlobalRankingChart';
import GroupCreationModal from './components/group/GroupCreationModal';
import GroupSelector from './components/group/GroupSelector';
import CompanyDashboard from './components/company/CompanyDashboard';

const App: React.FC = () => {
  const {
    week, funds, reputation, lastAlbumWeek, facilities, trainees, activeTrainees, activeGroupMembers, 
    weeklyPlan, gameLogs, historyLogs, notification, currentSpecialEvent, pendingDecision, albums, ranking, isChartOpen, 
    groups, activeGroupId, activeGroup, hqLevel, staff,
    addNewTrainee, removeTrainee, updateTrainee, upgradeFacility, updateDailyPlan, nextWeek, closeLogs, setIsChartOpen, setActiveGroupId,
    exportToFile, importFromFile, resetGame, closeMessage, handleEventDecision, produceAlbum, settleAlbumRevenue, formGroup,
    upgradeHQ, hireStaff, fireStaff, renewContract
  } = useGame();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTrainee, setEditingTrainee] = useState<Trainee | undefined>(undefined);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);
  const [isFanFeedOpen, setIsFanFeedOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<{ album: Album; revenue: number } | null>(null);
  
  // Contract Renewal State
  const [renewingTrainee, setRenewingTrainee] = useState<Trainee | null>(null);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);

  const canProduceAlbum = week - lastAlbumWeek >= 13;
  const weeksUntilNextAlbum = 13 - (week - lastAlbumWeek);

  const handleAlbumProduction = (title: string, concept: AlbumConcept, price: number) => {
    const result = produceAlbum(title, concept, price);
    if (result) {
      setIsAlbumModalOpen(false);
      setCurrentResult(result);
      setTimeout(() => setIsSimulationOpen(true), 500);
    }
  };

  const handleFinalSettlement = () => {
    if (currentResult) {
      settleAlbumRevenue(currentResult.album, currentResult.revenue);
      setCurrentResult(null);
    }
  };

  const handleTraineeSave = (data: any, cost: number) => {
    if (editingTrainee) {
      updateTrainee(editingTrainee.id, data);
    } else {
      addNewTrainee(data, cost);
    }
    setIsFormModalOpen(false);
    setEditingTrainee(undefined);
  };

  const handleRenewConfirm = (id: string, cost: number) => {
    const success = renewContract(id, cost);
    if (success) {
      setIsRenewalModalOpen(false);
      setRenewingTrainee(null);
      // Success message is handled via logic or UI update, but we can add explicit notification if needed
    } else {
      // Logic inside renewContract returns false if funds insufficient, handled by UI there or here
      // But standard way:
      // useGame notification state is shared.
    }
  };

  const handleReleaseConfirm = (id: string) => {
    removeTrainee(id);
    setIsRenewalModalOpen(false);
    setRenewingTrainee(null);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500/30">
      
      <Header 
        activeTrainees={activeTrainees} 
        group={activeGroup}
        funds={funds}
        reputation={reputation}
        onFileExport={exportToFile}
        onFileImport={importFromFile}
        onReset={resetGame}
        onOpenCompany={() => setIsCompanyModalOpen(true)}
      />

      <main className="p-6 lg:p-8 max-w-[1920px] mx-auto animate-in fade-in duration-500">
        
        {/* Group Selector Section */}
        <div className="mb-8 space-y-4">
           <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Group Management</h2>
           <GroupSelector 
             groups={groups} 
             activeGroupId={activeGroupId} 
             onSelect={setActiveGroupId} 
             onOpenCreate={() => setIsGroupModalOpen(true)}
           />
        </div>

        <div className="grid grid-cols-12 gap-6">
          
          <DashboardSidebar 
            week={week}
            activeTrainees={activeGroupMembers.length > 0 ? activeGroupMembers : activeTrainees}
            trainees={trainees}
            selectedTraineeId={selectedTraineeId}
            onSelectTrainee={setSelectedTraineeId}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
          />

          <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-10">
            
            {activeGroup ? (
              <>
                <div className="flex justify-end -mb-6 relative z-10 items-center gap-4">
                   {!canProduceAlbum && (
                     <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-500 animate-pulse">
                        <Timer size={14} /> 다음 컴백 준비 기간: <b>{weeksUntilNextAlbum}주 남음</b>
                     </div>
                   )}
                   <button 
                    disabled={activeGroupMembers.length === 0 || !canProduceAlbum}
                    onClick={() => setIsAlbumModalOpen(true)}
                    className={`
                      flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl
                      ${activeGroupMembers.length > 0 && canProduceAlbum
                        ? 'bg-pink-600 text-white hover:bg-pink-500 hover:scale-105 active:scale-95 shadow-pink-900/20' 
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                    `}
                   >
                     <Disc size={24} className={canProduceAlbum && activeGroupMembers.length > 0 ? "animate-spin-slow" : ""} /> {activeGroup.name} 앨범 프로듀싱
                   </button>
                </div>

                <SchedulerPanel 
                  week={week}
                  reputation={reputation}
                  activeTrainees={activeGroupMembers}
                  weeklyPlan={weeklyPlan}
                  onScheduleChange={updateDailyPlan}
                  onRunWeek={nextWeek}
                  onOpenRanking={() => setIsChartOpen(true)}
                />
              </>
            ) : (
              <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
                 <AlertCircle size={48} className="text-zinc-700" />
                 <h3 className="text-xl font-bold text-zinc-400">활동 중인 그룹이 없습니다.</h3>
                 <p className="text-sm text-zinc-600">하단의 연습생 명단에서 멤버를 조합하여 정식 그룹을 결성하세요.</p>
                 <button 
                   onClick={() => setIsGroupModalOpen(true)}
                   className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
                 >
                   첫 그룹 결성하기
                 </button>
              </div>
            )}

            <AlbumHistory albums={albums} />

            <FacilitiesSection 
              facilities={facilities}
              funds={funds}
              onUpgrade={upgradeFacility}
            />

            <RosterSection 
              trainees={trainees}
              hasGroup={groups.length > 0}
              selectedTraineeId={selectedTraineeId}
              onSelect={setSelectedTraineeId}
              onEdit={(t) => { setEditingTrainee(t); setIsFormModalOpen(true); }}
              onDelete={removeTrainee}
              onRenew={(t) => { setRenewingTrainee(t); setIsRenewalModalOpen(true); }} 
              onOpenCreateModal={() => { setEditingTrainee(undefined); setIsFormModalOpen(true); }}
              onOpenGroupModal={() => setIsGroupModalOpen(true)}
            />

          </div>

        </div>
      </main>

      {/* Fan Feed Toggle */}
      <div className="fixed bottom-6 left-6 z-50">
        <button 
          onClick={() => setIsFanFeedOpen(!isFanFeedOpen)}
          className="bg-yellow-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
        >
          <Smartphone size={28} />
        </button>
      </div>

      <TraineeFormModal isOpen={isFormModalOpen} onClose={() => { setIsFormModalOpen(false); setEditingTrainee(undefined); }} onSave={handleTraineeSave} funds={funds} initialData={editingTrainee} />
      <WeeklyResultModal results={gameLogs} onClose={closeLogs} />
      <GlobalRankingChart isOpen={isChartOpen} onClose={() => setIsChartOpen(false)} ranking={ranking} week={week - 1} />
      <HistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} logs={historyLogs} />
      <FanFeedMobile isOpen={isFanFeedOpen} onClose={() => setIsFanFeedOpen(false)} trainees={activeTrainees} historyLogs={historyLogs} albums={albums} />
      <SpecialEventModal isOpen={pendingDecision} event={currentSpecialEvent} funds={funds} onDecision={handleEventDecision} />
      <AlbumProductionModal isOpen={isAlbumModalOpen} onClose={() => setIsAlbumModalOpen(false)} activeTrainees={activeGroupMembers} funds={funds} onProduce={handleAlbumProduction} />
      <AlbumReleaseSimulationModal isOpen={isSimulationOpen} album={currentResult?.album || null} totalRevenue={currentResult?.revenue || 0} onClose={() => setIsSimulationOpen(false)} onSettle={handleFinalSettlement} />
      <GroupCreationModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} trainees={trainees} existingGroups={groups} onForm={formGroup} />
      <CompanyDashboard isOpen={isCompanyModalOpen} onClose={() => setIsCompanyModalOpen(false)} hqLevel={hqLevel} staff={staff} funds={funds} onUpgradeHQ={upgradeHQ} onHireStaff={hireStaff} onFireStaff={fireStaff} />
      <ContractRenewalModal isOpen={isRenewalModalOpen} onClose={() => setIsRenewalModalOpen(false)} trainee={renewingTrainee} funds={funds} onRenew={handleRenewConfirm} onRelease={handleReleaseConfirm} />
      <MessageModal isOpen={notification.isOpen} title={notification.title} message={notification.message} type={notification.type} onConfirm={notification.onConfirm || (() => {})} onClose={closeMessage} />
    </div>
  );
};

export default App;
