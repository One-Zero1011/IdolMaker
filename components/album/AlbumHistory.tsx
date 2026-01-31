
import React from 'react';
import { Album } from '../../types/index';
import { Disc, TrendingUp, Users, Award, Trophy, Globe } from 'lucide-react';
import { ALBUM_CONCEPTS } from '../../data/constants';

interface Props {
  albums: Album[];
}

const AlbumHistory: React.FC<Props> = ({ albums }) => {
  if (albums.length === 0) return (
    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-12 text-center space-y-4">
       <Disc className="mx-auto text-zinc-800" size={48} />
       <p className="text-zinc-600 font-medium">아직 발매된 앨범이 없습니다.<br/>새로운 앨범을 제작하여 글로벌 차트에 도전하세요!</p>
    </div>
  );

  return (
    <section className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="text-pink-500" /> 디스코그래피
          </h2>
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Total {albums.length} Releases</span>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albums.map((album) => {
            const concept = ALBUM_CONCEPTS[album.concept];
            return (
              <div key={album.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex gap-4 hover:border-zinc-600 transition-all group overflow-hidden relative">
                 {/* Decorative Circle */}
                 <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-5 blur-2xl ${concept.color}`} />
                 
                 <div className={`w-20 h-20 rounded-xl ${concept.color} flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden`}>
                    <Disc className="text-white/30 group-hover:animate-spin-slow" size={40} />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-white text-xs text-center p-1 break-words">
                       {album.title.charAt(0)}
                    </div>
                 </div>

                 <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase text-white ${concept.color}`}>
                             {concept.label}
                          </span>
                          <span className="text-zinc-500 text-[10px] font-mono">WK {album.releaseWeek}</span>
                       </div>
                       <h3 className="text-lg font-bold text-white truncate mb-1">{album.title}</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                       <div className="bg-black/40 p-1.5 rounded-lg border border-zinc-800/50 flex flex-col">
                          <span className="text-[8px] text-zinc-500 font-black uppercase mb-0.5">Peak</span>
                          <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">
                             <TrendingUp size={10} /> {album.peakChart}위
                          </span>
                       </div>
                       <div className="bg-black/40 p-1.5 rounded-lg border border-zinc-800/50 flex flex-col">
                          <span className="text-[8px] text-zinc-500 font-black uppercase mb-0.5">Sales</span>
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                             <Users size={10} /> {(album.sales / 1000).toFixed(1)}k
                          </span>
                       </div>
                       {album.isBillboard && (
                         <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/30 flex flex-col items-center justify-center">
                            <Globe size={14} className="text-blue-400" />
                            <span className="text-[8px] text-blue-400 font-black uppercase mt-0.5">Billboard</span>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            );
          })}
       </div>
    </section>
  );
};

export default AlbumHistory;
