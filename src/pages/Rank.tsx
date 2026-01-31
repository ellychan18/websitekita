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
      {/* 1. Header Ranking - Wide Style */}
      <div className="px-3 pt-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-red-600 rounded-full" />
          <h1 className="text-xl font-black uppercase tracking-tight text-white">Top Ranking</h1>
        </div>
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mt-1">Drama Paling Gacor Hari Ini</p>
      </div>

      {/* 2. Sharp Tabs Navigation */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md px-3 py-3 border-b border-white/5 mb-6">
        <div className="bg-zinc-900/50 p-1 rounded-xl flex gap-1 border border-white/5">
          {rankTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Rank List - Wide & Sharp */}
      {loading ? (
        <div className="px-3 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-900/50 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="px-3 space-y-3">
          {dramas.map((drama, index) => {
            const isTop3 = index < 3;
            return (
              <Link key={drama.bookId} to={`/watch/${drama.bookId}`} className="group block">
                <div className={`relative flex gap-4 p-2.5 rounded-xl border transition-all duration-300 ${
                  isTop3 
                  ? 'bg-zinc-900 border-red-600/20 shadow-lg' 
                  : 'bg-zinc-900/40 border-white/5'
                }`}>
                  
                  {/* Poster Area */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-28 rounded-lg overflow-hidden border border-white/5 shadow-xl">
                      <img 
                        src={drama.cover} 
                        alt={drama.bookName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Rank Number Badge - Sharp Style */}
                    <div className={`absolute -top-1.5 -left-1.5 w-7 h-7 rounded flex items-center justify-center font-black text-xs shadow-xl z-10 border ${
                      index === 0 ? 'bg-yellow-500 border-yellow-400 text-black' :
                      index === 1 ? 'bg-zinc-300 border-zinc-200 text-black' :
                      index === 2 ? 'bg-orange-600 border-orange-500 text-white' :
                      'bg-zinc-900 border-white/10 text-zinc-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Content Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      {/* Full Title - No Clamp (Biar Semua Muncul) */}
                      <h3 className="font-bold text-[13px] leading-snug text-zinc-100 group-hover:text-red-500 transition-colors">
                        {drama.bookName.trim()}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-normal italic">
                        {drama.introduction}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-red-500 font-bold text-[10px]">
                          <Users size={12} />
                          <span>{drama.playCount} views</span>
                        </div>
                        <div className="flex items-center gap-1 text-zinc-400 font-bold text-[10px] uppercase">
                          <MonitorPlay size={12} />
                          <span>{drama.chapterCount} Eps</span>
                        </div>
                      </div>
                      
                      {/* Tags - Sharp Style */}
                      {drama.tags.length > 0 && (
                        <div className="flex gap-1 overflow-hidden">
                          {drama.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-[8px] font-black bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded border border-white/5 uppercase tracking-tighter">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Icon Panah Kecil */}
                  <div className="flex items-center pr-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={18} className="text-zinc-500" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rank;