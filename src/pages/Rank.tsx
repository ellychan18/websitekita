import { TrendingUp, Users, Play, Crown, Flame, Star, MonitorPlay, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../store/language';

interface Drama {
  bookId: string;
  bookName: string;
  introduction: string;
  cover: string;
  chapterCount: number;
  playCount: string;
  tags: string[];
}

const rankTabs = [
  { id: 1, name: 'Trending', label: 'Trending', icon: <Flame size={14} /> },
  { id: 2, name: 'Popular', label: 'Popular', icon: <Star size={14} /> },
  { id: 3, name: 'Latest', label: 'Latest', icon: <Crown size={14} /> }
];

const Rank = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const fetchRankDramas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/rank/${activeTab}?lang=${lang}`);
        const data = await response.json();
        if (data.success) {
          setDramas(data.data.list);
        }
      } catch (error) {
        console.error('Failed to fetch rank dramas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankDramas();
  }, [activeTab, lang]);

  return (
    <div className="pb-24 bg-[#0a0a0a] min-h-screen">
      {/* 1. Header Ranking */}
      <div className="px-4 pt-8 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">Top Ranking</h1>
        </div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black mt-1.5 ml-3.5">Drama Paling Gacor Hari Ini</p>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md px-3 py-4 border-b border-white/5 mb-6">
        <div className="bg-zinc-900/80 p-1.5 rounded-2xl flex gap-1.5 border border-white/5 shadow-2xl">
          {rankTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.4)] scale-[1.02]'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Rank List */}
      {loading ? (
        <div className="px-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-900/50 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      ) : (
        <div className="px-4 space-y-5">
          {dramas.map((drama, index) => {
            const isTop3 = index < 3;
            return (
              <Link key={drama.bookId} to={`/watch/${drama.bookId}`} className="group block">
                <div className={`relative flex gap-5 p-3.5 rounded-[2rem] border transition-all duration-500 ${
                  isTop3 
                  ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border-red-600/30 shadow-2xl' 
                  : 'bg-zinc-900/20 border-white/5'
                }`}>
                  
                  {/* Poster Area */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:border-red-600/50 transition-all duration-500">
                      <img 
                        src={drama.cover} 
                        alt={drama.bookName} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>
                    
                    {/* Rank Number Badge - Aggressive Style */}
                    <div className={`absolute -top-2.5 -left-2.5 w-9 h-9 rounded-xl flex items-center justify-center font-black text-[16px] shadow-2xl z-10 border-2 italic rotate-[-12deg] transition-transform group-hover:rotate-0 duration-500 ${
                      index === 0 ? 'bg-yellow-500 border-yellow-300 text-black shadow-yellow-500/20' :
                      index === 1 ? 'bg-zinc-300 border-zinc-100 text-black shadow-zinc-300/20' :
                      index === 2 ? 'bg-orange-600 border-orange-400 text-white shadow-orange-600/20' :
                      'bg-zinc-900 border-white/20 text-zinc-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Content Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-black text-[15px] leading-tight text-zinc-100 group-hover:text-red-500 transition-colors uppercase italic truncate tracking-tight">
                        {drama.bookName.trim()}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-2 line-clamp-2 leading-relaxed font-medium italic opacity-80">
                        {drama.introduction}
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      {/* Stats Badges */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="flex items-center gap-1.5 text-red-500 font-black text-[9px] uppercase tracking-wider bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                          <Flame size={11} fill="currentColor" />
                          <span>{drama.playCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 font-black text-[9px] uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                          <MonitorPlay size={11} />
                          <span>{drama.chapterCount} Eps</span>
                        </div>
                      </div>
                      
                      {/* Premium Hash Tags */}
                      {drama.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {drama.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span 
                              key={tagIndex} 
                              className="relative overflow-hidden flex items-center gap-1 text-[8px] font-black bg-zinc-800/50 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-white/5 uppercase tracking-[0.15em] shadow-inner group/tag hover:text-white transition-colors"
                            >
                              <span className="text-red-600 font-black opacity-100">#</span>
                              {tag}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/tag:animate-[shimmer_1.5s_infinite]" />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Icon */}
                  <div className="flex items-center pr-1">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-red-600 group-hover:border-red-500 group-hover:rotate-90 transition-all duration-500 shadow-xl">
                      <ChevronRight size={20} className="text-zinc-600 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      
      {/* CSS Animation for Shimmer (Optional, Tailwind handle via utility if configured) */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Rank;
