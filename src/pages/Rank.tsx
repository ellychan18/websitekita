import { TrendingUp, Users, Flame, Star, Crown, MonitorPlay, ChevronRight } from 'lucide-react';
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
    <div className="pb-24 bg-[#050505] min-h-screen font-sans text-zinc-100">
      {/* Header - Simple & Clean */}
      <div className="px-6 pt-10 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Top Ranking</h1>
        <p className="text-xs text-zinc-500 mt-1 font-medium uppercase tracking-widest opacity-70">
          The most watched dramas today
        </p>
      </div>

      {/* Tabs - Glass Style */}
      <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl px-4 py-4 border-b border-white/[0.03] mb-6">
        <div className="flex gap-2">
          {rankTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[11px] font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-zinc-900/50 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Area */}
      {loading ? (
        <div className="px-5 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-900/30 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="px-5 space-y-8">
          {dramas.map((drama, index) => {
            return (
              <Link key={drama.bookId} to={`/watch/${drama.bookId}`} className="group block">
                <div className="flex gap-5">
                  {/* Left: Poster with Minimalist Rank */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-32 rounded-xl overflow-hidden shadow-2xl">
                      <img 
                        src={drama.cover} 
                        alt={drama.bookName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Rank Indicator - Subtle Typography */}
                    <span className="absolute -top-3 -left-2 text-4xl font-black italic text-white/10 group-hover:text-white/20 transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Right: Content Info */}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    {/* Tags - Elegant Minimalist */}
                    {drama.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        {drama.tags.slice(0, 2).map((tag, tIndex) => (
                          <span key={tIndex} className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
                            {tag}
                          </span>
                        ))}
                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                          {drama.chapterCount} Eps
                        </span>
                      </div>
                    )}

                    {/* Judul: Tidak terpotong kaku, maksimal 2 baris agar rapi */}
                    <h3 className="text-[16px] font-bold leading-tight text-white group-hover:text-red-500 transition-colors line-clamp-2 mb-2">
                      {drama.bookName}
                    </h3>

                    {/* Intro: Soft & Subtle */}
                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                      {drama.introduction}
                    </p>

                    {/* Views Info */}
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <TrendingUp size={12} className="text-zinc-600" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{drama.playCount} total views</span>
                    </div>
                  </div>

                  {/* Arrow Subtle */}
                  <div className="flex items-center self-center pl-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <ChevronRight size={20} className="text-white" />
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
