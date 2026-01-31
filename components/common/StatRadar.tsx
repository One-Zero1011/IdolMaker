
import React from 'react';
import { 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { Trainee } from '../../types/index';
import { TRANSLATIONS } from '../../data/constants';

interface Props {
  trainee?: Trainee | null;
}

const StatRadar: React.FC<Props> = ({ trainee }) => {
  if (!trainee || !trainee.stats) return (
    <div className="flex items-center justify-center h-full text-zinc-600 italic text-xs">
      데이터를 분석할 연습생이 없습니다.
    </div>
  );

  const radarData = [
    { subject: '보컬', A: trainee.stats.vocal, fullMark: 100 },
    { subject: '댄스', A: trainee.stats.dance, fullMark: 100 },
    { subject: '랩', A: trainee.stats.rap, fullMark: 100 },
    { subject: '비주얼', A: trainee.stats.visual, fullMark: 100 },
    { subject: '리더십', A: trainee.stats.leadership, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name={trainee.name} dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff', fontSize: '12px' }}
            itemStyle={{ color: '#ec4899' }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center">
        <div className="text-lg font-bold text-white">{trainee.name}</div>
        <div className="text-xs text-zinc-500">
          {TRANSLATIONS.positions[trainee.position] || trainee.position} • {trainee.mbti}
        </div>
      </div>
    </div>
  );
};

export default StatRadar;
