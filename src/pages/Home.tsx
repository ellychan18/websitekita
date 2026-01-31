import { Play, Users, TrendingUp, Sparkles, ChevronLeft, ChevronRight, MonitorPlay } from 'lucide-react';
import { useDramas, useInfiniteDramas, useForYou } from '../hooks/useDramas';
import { Link } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';

const Home = () => {
  const [forYouPage, setForYouPage] = useState(1);
  const [heroIndex, setHeroIndex] = useState(0);

  const { dramas: featuredDramas, loading: featuredLoading } = useDramas();
  const { dramas: forYouDramas, loading: forYouLoading } = useForYou(forYouPage);
  const { dramas: infiniteDramas, loading, loadingMore, hasMore, loadMore } = useInfiniteDramas();

  useEffect(() => {
    if (featuredDramas.length > 0) {
      const interval = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % 5);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredDramas]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 800) {
      if (hasMore && !loadingMore) loadMore();
    }
  }, [hasMore, loadingMore, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (featuredLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  const DramaCard = ({ drama, index, prefix }: { drama: any, index: number, prefix: string }) => (
    <Link 
      key={`${prefix}-${drama.bookId}-${index}`} 
      to={`/watch/${drama.bookId}`} 
      className="group flex flex-col gap-2"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 shadow-lg border border-white/5 transition-all duration-300 group-hover:border-red-600/50">
        <img 
          src={drama.cover} 
          alt={drama.bookName} 
          className="w-full h-full object-cover"
        />
        
        {/* Simple Bottom Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent" />
        
        {/* Badge Corner - Sharp Style */}
        {drama.corner && (
          <div className="absolute top-0 left-0 bg-red-600 text-[9px] font-bold px-2 py-1 rounded-br-lg text-white uppercase">
            {drama.corner.name}
          </div>
        )}

        {/* Play Count Float */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-white/80 border border-white/10">
           <Users size={10} className="text-red-500" />
           {drama.playCount}
        </div>
      </div>
      
      <div className="px-0.5">
        <h3 className="text-[13px] font-bold text-zinc-100 leading-[1.3] line-clamp-2 group-hover:text-red-500 transition-colors">
          {drama.bookName.trim()}
        </h3>
        <div className="flex items-center gap-1.5 text-zinc-500 mt-1">
          <MonitorPlay size={11} className="text-zinc-400" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            {drama.chapterCount || '??'} Eps
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 pb-20">
      
      {/* 1. HERO SLIDER (WIDE & SEMI-SHARP) */}
      {featuredDramas.length > 0 && (
        <section className="relative w-full pt-2 px-2">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/5">
            {featuredDramas.slice(0, 5).map((drama, idx) => (
              <Link 
                key={drama.bookId} 
                to={`/watch/${drama.bookId}`}
                className={`absolute inset-0 transition-opacity duration-700 ${idx === heroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <img src={drama.cover} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="inline-flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest text-white mb-2">
                    <Sparkles size={10} className="fill-white" /> Hot
                  </div>
                  <h1 className="text-2xl font-black mb-1 leading-tight text-white drop-shadow-md">
                    {drama.bookName}
                  </h1>
                  <p className="text-[11px] text-zinc-300 line-clamp-1 opacity-80 mb-4 font-medium">
                    {drama.introduction}
                  </p>
                  <div className="h-9 w-max px-6 bg-red-600 text-white rounded-lg font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-lg">
                    <Play size={14} className="fill-current" />
                    PLAY NOW
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 2. UNTUK KAMU */}
      <section className="px-3 mt-8">
        <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-2">
          <h2 className="text-lg font-black tracking-tight text-white">For You</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => setForYouPage(p => Math.max(1, p - 1))} className="p-1.5 text-zinc-400 hover:text-white transition-colors">
              <ChevronLeft size={22} />
            </button>
            <div className="bg-red-600/10 px-2 py-0.5 rounded border border-red-600/20">
              <span className="text-xs font-black text-red-500">{forYouPage}</span>
            </div>
            <button onClick={() => setForYouPage(p => p + 1)} className="p-1.5 text-zinc-400 hover:text-white transition-colors">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {forYouLoading ? (
          <div className="grid grid-cols-2 gap-3 animate-pulse">
            <div className="aspect-[3/4] bg-zinc-900 rounded-xl" />
            <div className="aspect-[3/4] bg-zinc-900 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {forYouDramas.map((drama, index) => (
              <DramaCard key={drama.bookId} drama={drama} prefix="foryou" index={index} />
            ))}
          </div>
        )}
      </section>

      {/* 3. BARU RILIS */}
      <section className="px-3 mt-10">
        <div className="mb-5 border-b border-white/5 pb-2">
          <h2 className="text-lg font-black tracking-tight text-white uppercase">New Release</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-x-3 gap-y-6">
          {infiniteDramas.map((drama, index) => (
            <DramaCard key={`${drama.bookId}-${index}`} drama={drama} prefix="new" index={index} />
          ))}
        </div>

        <div className="mt-12 mb-10 text-center">
          {loadingMore ? (
            <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          ) : hasMore ? (
            <button onClick={loadMore} className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase py-2 px-6 border border-zinc-800 rounded-lg">
              Load More
            </button>
          ) : (
            <div className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">End of Library</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;