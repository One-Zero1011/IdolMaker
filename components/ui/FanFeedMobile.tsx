
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Smartphone, X, Heart, MessageCircle, Repeat2, Share, CheckCircle2, Newspaper, TrendingUp, Star, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Trainee as Idol } from '../../types/index';
import { FAN_NICKNAMES, RANDOM_HANDLES, NEWS_SOURCES, TWEET_TEMPLATES } from '../../data/fanData';

interface Tweet {
  id: string;
  user: string;
  handle: string;
  text: string;
  likes: number;
  retweets: number;
  time: string;
  isVerified: boolean;
  isNew?: boolean;
  type: 'news' | 'fan' | 'hater' | 'worried';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trainees: Idol[];
  historyLogs: string[];
}

const FanFeedMobile: React.FC<Props> = ({ isOpen, onClose, trainees, historyLogs }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const lastLogCount = useRef(historyLogs.length);

  // Analyze recent logs to find "Hot Topics"
  const hotTopic = useMemo(() => {
    const recentLogs = historyLogs.slice(0, 10);
    for (const log of recentLogs) {
      if (log.includes('[비보]') || log.includes('[충격]')) return { type: 'critical', text: log };
      if (log.includes('[논란]') || log.includes('[경고]')) return { type: 'scandal', text: log };
      if (log.includes('투어') || log.includes('빌보드')) return { type: 'performance', text: log };
      if (log.includes('탈진') || log.includes('부상')) return { type: 'health', text: log };
    }
    return null;
  }, [historyLogs]);

  const createSingleTweet = useCallback((isBatch: boolean = false): Tweet | null => {
    const activeArtists = trainees.filter(t => t.status === 'Active');
    if (activeArtists.length === 0) return null;

    const dice = Math.random();
    
    // News (Hot Topic Case)
    if (hotTopic && dice < 0.2) {
      const source = NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)];
      const eventText = hotTopic.text.replace(/\[.*?\]/g, '').trim();
      const template = TWEET_TEMPLATES.NEWS_FLASH[Math.floor(Math.random() * TWEET_TEMPLATES.NEWS_FLASH.length)];
      
      return {
        id: `news-${Date.now()}-${Math.random()}`,
        user: source.name,
        handle: source.handle,
        text: template.replace('{event}', eventText),
        likes: Math.floor(Math.random() * 10000 + 5000),
        retweets: Math.floor(Math.random() * 15000 + 8000),
        time: isBatch ? '방금 전' : '1분 전',
        isVerified: source.isVerified,
        isNew: isBatch,
        type: 'news'
      };
    }

    // Context Aware or General
    const artist = activeArtists[Math.floor(Math.random() * activeArtists.length)];
    let type: 'fan' | 'hater' | 'worried' = 'fan';
    let templates = TWEET_TEMPLATES.POSITIVE;

    if (hotTopic && dice < 0.6) {
        if (hotTopic.type === 'scandal' || hotTopic.type === 'critical') {
            const isHater = Math.random() > 0.4;
            type = isHater ? 'hater' : 'fan';
            templates = isHater ? TWEET_TEMPLATES.NEGATIVE : TWEET_TEMPLATES.POSITIVE;
        } else if (hotTopic.type === 'health') {
            type = 'worried';
            templates = TWEET_TEMPLATES.WORRIED;
        }
    }

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const nickname = FAN_NICKNAMES[Math.floor(Math.random() * FAN_NICKNAMES.length)];
    const handlePart = RANDOM_HANDLES[Math.floor(Math.random() * RANDOM_HANDLES.length)];

    return {
      id: `gen-${Date.now()}-${Math.random()}`,
      user: type === 'hater' ? '익명' : `${artist.name}${nickname}`,
      handle: `@${artist.name.toLowerCase()}_${handlePart}${Math.floor(Math.random()*999)}`,
      text: randomTemplate.replace(/{name}/g, artist.name),
      likes: Math.floor(Math.random() * 2000),
      retweets: Math.floor(Math.random() * 1000),
      time: isBatch ? '방금 전' : '수 분 전',
      isVerified: Math.random() > 0.95,
      isNew: isBatch,
      type
    };
  }, [trainees, hotTopic]);

  useEffect(() => {
    if (historyLogs.length > lastLogCount.current) {
        const totalFans = trainees.reduce((acc, t) => acc + t.fans, 0);
        const countToGenerate = Math.min(50, Math.max(1, Math.floor(totalFans / 100)));
        
        const newBatch: Tweet[] = [];
        for (let i = 0; i < countToGenerate; i++) {
            const t = createSingleTweet(true);
            if (t) newBatch.push(t);
        }

        if (newBatch.length > 0) {
            setTweets(prev => [...newBatch, ...prev].slice(0, 100));
        }
        lastLogCount.current = historyLogs.length;
    }
  }, [historyLogs, trainees, createSingleTweet]);

  useEffect(() => {
    if (tweets.length === 0 && trainees.length > 0) {
      const initial = [];
      for (let i = 0; i < 5; i++) {
        const t = createSingleTweet(false);
        if (t) initial.push(t);
      }
      setTweets(initial);
    }
  }, [trainees.length, tweets.length, createSingleTweet]);

  const getTypeStyle = (type: Tweet['type']) => {
    switch (type) {
      case 'news': return { icon: <Newspaper size={14} />, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'NEWS' };
      case 'fan': return { icon: <Heart size={14} className="fill-pink-500" />, color: 'text-pink-400', bg: 'bg-pink-500/10', label: 'FAN' };
      case 'hater': return { icon: <AlertCircle size={14} />, color: 'text-red-400', bg: 'bg-red-500/10', label: 'HATER' };
      case 'worried': return { icon: <AlertTriangle size={14} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'CAUTION' };
      default: return { icon: <Star size={14} />, color: 'text-zinc-400', bg: 'bg-zinc-500/10', label: 'POST' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-start p-6 pointer-events-none">
      <div className="relative w-full max-w-[320px] h-[600px] bg-zinc-950 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-10 duration-500 flex flex-col">
        
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20 flex items-center justify-center">
            <div className="w-10 h-1 bg-zinc-900 rounded-full" />
        </div>

        <div className="h-10 bg-zinc-900 flex items-end justify-between px-8 pb-1 text-[10px] font-bold text-zinc-400">
            <span>20:12</span>
            <div className="flex gap-1.5 items-center">
                <TrendingUp size={10} />
                <span>5G</span>
            </div>
        </div>

        {/* X Header */}
        <div className="bg-zinc-950/90 backdrop-blur border-b border-zinc-800 p-4 flex justify-between items-center z-10 sticky top-0">
            <div className="flex items-center gap-2">
               <span className="text-xl font-black italic text-white tracking-tighter">X</span>
               <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-full border border-yellow-500/30">
                  <Star size={8} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-tight">VIP</span>
               </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
                <X size={18} />
            </button>
        </div>

        {/* Feed Content */}
        <div className="flex-1 overflow-y-auto bg-black custom-scrollbar">
            {trainees.length === 0 ? (
                <div className="p-12 text-center text-zinc-600 space-y-4">
                    <Star size={48} className="mx-auto opacity-20 text-yellow-500" />
                    <p className="text-sm font-medium">아티스트와 전속 계약을 체결하고 스케줄을 진행하면 여론이 형성됩니다.</p>
                </div>
            ) : tweets.length === 0 ? (
                <div className="p-12 text-center text-zinc-600">
                    스케줄을 실행하여 아티스트의 소식을 전하세요.
                </div>
            ) : (
                <div className="flex flex-col">
                    {tweets.map((tweet) => {
                        const style = getTypeStyle(tweet.type);
                        return (
                          <div 
                            key={tweet.id} 
                            className={`
                              p-4 border-b border-zinc-900/50 transition-all duration-700
                              ${tweet.isNew ? 'bg-yellow-500/[0.05] animate-in slide-in-from-top-4' : ''}
                              ${tweet.type === 'news' ? 'bg-blue-900/10 border-l-4 border-l-blue-500/80 shadow-lg' : ''}
                              ${tweet.type === 'hater' ? 'bg-red-950/5 border-l-4 border-l-red-500/40' : ''}
                              ${tweet.type === 'worried' ? 'bg-yellow-900/5 border-l-4 border-l-yellow-500/40' : ''}
                            `}
                          >
                              <div className="flex gap-3">
                                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold overflow-hidden shadow-inner
                                    ${tweet.type === 'news' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-zinc-700 to-zinc-900 text-zinc-400'}
                                  `}>
                                      {tweet.type === 'news' ? <Newspaper size={18} /> : tweet.user[0]}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-0.5">
                                          <div className="flex items-center gap-1 min-w-0">
                                              <span className={`text-sm font-bold truncate ${tweet.type === 'news' ? 'text-blue-400' : 'text-zinc-200'}`}>
                                                  {tweet.user}
                                              </span>
                                              {tweet.isVerified && <CheckCircle2 size={12} className="text-blue-500 fill-blue-500 flex-shrink-0" />}
                                              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black ml-1 ${style.bg} ${style.color}`}>
                                                  {style.icon} {style.label}
                                              </div>
                                          </div>
                                          <span className="text-zinc-600 text-[10px] flex-shrink-0">{tweet.time}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1 mb-1">
                                         <span className="text-zinc-500 text-[11px] truncate">{tweet.handle}</span>
                                      </div>

                                      <p className={`text-sm leading-snug mb-3 whitespace-pre-wrap break-words
                                        ${tweet.type === 'news' ? 'font-bold text-zinc-100' : 'text-zinc-300'}
                                        ${tweet.type === 'hater' ? 'text-zinc-400 italic' : ''}
                                      `}>
                                          {tweet.text}
                                      </p>

                                      <div className="flex justify-between text-zinc-600 max-w-[220px]">
                                          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                                              <MessageCircle size={14} /> <span className="text-[10px]">{Math.floor(tweet.likes/12)}</span>
                                          </button>
                                          <button className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
                                              <Repeat2 size={14} /> <span className="text-[10px]">{tweet.retweets}</span>
                                          </button>
                                          <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                                              <Heart size={14} className={tweet.likes > 2000 || tweet.type === 'fan' ? 'fill-pink-500 text-pink-500' : ''} /> <span className="text-[10px]">{tweet.likes >= 1000 ? (tweet.likes/1000).toFixed(1)+'K' : tweet.likes}</span>
                                          </button>
                                          <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                                              <Share size={14} />
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Bottom Bar Decor */}
        <div className="h-14 bg-zinc-950 border-t border-zinc-900 flex items-center justify-around px-4">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            <div className="w-5 h-5 rounded bg-zinc-800" />
            <div className="w-5 h-5 rounded bg-zinc-800" />
            <div className="w-5 h-5 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
};

export default FanFeedMobile;
