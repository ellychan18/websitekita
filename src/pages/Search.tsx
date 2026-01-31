import { useState, useEffect } from 'react';
import { Search as SearchIcon, X, ArrowRight, TrendingUp, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../store/language';

interface Drama {
  bookId: string;
  bookName: string;
  introduction: string;
  cover: string;
  playCount: string;
}

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Drama[]>([]);
  const [results, setResults] = useState<Drama[]>([]);
  const [popularDramas, setPopularDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await fetch(`/api/rank/2?lang=${lang}`);
        const data = await response.json();
        if (data.success) {
          setPopularDramas(data.data.list.slice(0, 10));
        }
      } catch (error) {
        console.error('Failed to fetch popular dramas:', error);
      }
    };
    fetchPopular();
  }, [lang]);

  const fetchSuggestions = async (q: string) => {
    if (!q.trim()) return;
    try {
      const response = await fetch(`/api/suggest/${encodeURIComponent(q)}?lang=${lang}`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data.suggestList.slice(0, 6));
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setShowSuggestions(false);
    try {
      const response = await fetch(`/api/search/${encodeURIComponent(q)}/1?lang=${lang}&pageSize=21`);
      const data = await response.json();
      if (data.success) {
        setResults(data.data.list);
      }
    } catch (error) {
      console.error('Failed to search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const timeoutId = setTimeout(() => fetchSuggestions(value), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setResults([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="pb-24 pt-6 px-6 bg-[#050505] min-h-screen text-zinc-100">
      
      {/* 1. Search Bar Group */}
      <div className="relative z-[60] mb-10">
        <div className="relative group">
          <SearchIcon size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${query ? 'text-red-500' : 'text-zinc-600'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search your favorite drama..."
            className="w-full pl-12 pr-12 py-4 bg-zinc-900/40 border border-white/[0.05] rounded-2xl text-sm placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-all backdrop-blur-md"
            autoFocus
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setSuggestions([]); setResults([]); setShowSuggestions(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Suggestions - Glassmorphism */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-zinc-900/90 backdrop-blur-2xl border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden z-[70]">
            {suggestions.map((item) => (
              <button
                key={item.bookId}
                onClick={() => { setQuery(item.bookName); handleSearch(item.bookName); }}
                className="w-full text-left p-4 hover:bg-white/[0.03] transition-colors flex items-center gap-4 border-b border-white/[0.02] last:border-0"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img src={item.cover} alt="" className="w-full h-full object-cover" />
                </div>
                <h4 className="flex-1 font-medium text-[13px] text-zinc-200 truncate group-hover:text-red-500">
                  {item.bookName.trim()}
                </h4>
                <ArrowRight size={14} className="text-zinc-700" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Main Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Searching</p>
        </div>
      ) : (
        <>
          {/* Results Grid */}
          {results.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-end justify-between mb-6 px-1">
                <h2 className="text-xl font-bold tracking-tight text-white">Results</h2>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{results.length} found</span>
              </div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-8">
                {results.map((drama) => (
                  <Link key={drama.bookId} to={`/watch/${drama.bookId}`} className="group block">
                    <div className="aspect-[3/4.5] rounded-xl overflow-hidden mb-3 bg-zinc-900 shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]">
                      <img 
                        src={drama.cover} 
                        alt={drama.bookName} 
                        className="w-full h-full object-cover shadow-inner"
                      />
                    </div>
                    {/* Judul Elegan - 2 Baris Maksimal */}
                    <h3 className="text-[12px] font-bold leading-tight text-zinc-200 group-hover:text-red-500 transition-colors line-clamp-2 px-0.5">
                      {drama.bookName.trim()}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches - Initial State */}
          {!query && (
            <div className="animate-in fade-in duration-700 px-1">
              <div className="flex items-center gap-2 mb-8">
                <Flame size={18} className="text-red-500" />
                <h2 className="text-lg font-bold tracking-tight italic">Trending Now</h2>
              </div>
              
              <div className="space-y-6">
                {popularDramas.map((drama, index) => (
                  <Link 
                    key={drama.bookId} 
                    to={`/watch/${drama.bookId}`} 
                    className="flex items-center gap-5 group"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xl">
                        <img src={drama.cover} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <span className="absolute -top-2 -left-2 w-5 h-5 bg-white text-black text-[10px] font-black rounded flex items-center justify-center shadow-lg">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 border-b border-white/[0.03] pb-4">
                      <h3 className="font-bold text-[14px] text-zinc-200 truncate group-hover:text-red-500 transition-colors">
                        {drama.bookName.trim()}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <TrendingUp size={10} className="text-zinc-600" />
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{drama.playCount} views</p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        <ArrowRight size={18} className="text-red-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Not Found */}
          {query && results.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 border border-white/[0.05]">
                 <SearchIcon size={24} className="text-zinc-700" />
              </div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em]">No results found</h3>
              <button 
                onClick={() => setQuery('')}
                className="mt-6 text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-red-500/30 pb-1"
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
