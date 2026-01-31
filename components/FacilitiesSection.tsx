
import React from 'react';
import { Building2, ArrowUpCircle, Mic2, Music, Zap, Dumbbell } from 'lucide-react';
import { FacilitiesState, FacilityType } from '../types/index';
import { FACILITY_UPGRADE_COSTS, TRANSLATIONS } from '../data/constants';

interface Props {
  facilities: FacilitiesState;
  funds: number;
  onUpgrade: (type: FacilityType) => void;
}

const FacilityIcon = ({ type, size = 20 }: { type: FacilityType; size?: number }) => {
  switch (type) {
    case 'vocal': return <Mic2 size={size} className="text-blue-400" />;
    case 'dance': return <Music size={size} className="text-purple-400" />;
    case 'rap': return <Zap size={size} className="text-yellow-400" />;
    case 'gym': return <Dumbbell size={size} className="text-emerald-400" />;
  }
};

const FacilitiesSection: React.FC<Props> = ({ facilities, funds, onUpgrade }) => {
  const facilityTypes: FacilityType[] = ['vocal', 'dance', 'rap', 'gym'];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Building2 className="text-emerald-500" /> 엔터테인먼트 시설 관리
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {facilityTypes.map(type => {
          const level = facilities[type];
          const nextLevel = level + 1;
          const upgradeCost = nextLevel <= 10 ? FACILITY_UPGRADE_COSTS[nextLevel] : null;
          const canAfford = upgradeCost ? funds >= upgradeCost : false;

          return (
            <div key={type} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 transition-all hover:border-zinc-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    <FacilityIcon type={type} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{TRANSLATIONS.facilities[type]}</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-black">Level {level}</div>
                  </div>
                </div>
              </div>

              {/* Level Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-zinc-500">
                   <span>효율 보너스: +{((level - 1) * 20)}%</span>
                   <span>MAX LV.10</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${(level / 10) * 100}%` }} 
                  />
                </div>
              </div>

              {upgradeCost ? (
                <button
                  onClick={() => onUpgrade(type)}
                  disabled={!canAfford}
                  className={`
                    mt-2 w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all
                    ${canAfford 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                  `}
                >
                  <ArrowUpCircle size={14} />
                  ₩{upgradeCost.toLocaleString()} 투자
                </button>
              ) : (
                <div className="mt-2 w-full py-2 rounded-lg text-xs font-black bg-zinc-800 text-emerald-500 text-center border border-emerald-900/30">
                  MAX LEVEL REACHED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FacilitiesSection;
