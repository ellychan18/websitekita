import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X, ArrowRight, History, Flame } from 'lucide-react';
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
    <div className="pb-24 pt-2 px-4">
      {/* Search Input Group */}
      <div className="relative z-[60] mb-6">
        <div className="relative group">
          <SearchIcon size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${query ? 'text-red-500' : 'text-zinc-500'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Cari drama favoritmu..."
            className="w-full pl-11 pr-12 py-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all backdrop-blur-sm"
            autoFocus
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setSuggestions([]); setResults([]); setShowSuggestions(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dynamic Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2">
            <div className="p-2 border-b border-zinc-800/50">
                <span className="text-[10px] font-bold text-zinc-500 px-3 uppercase tracking-widest">Saran Pencarian</span>
            </div>
            {suggestions.map((item) => (
              <button
                key={item.bookId}
                onClick={() => { setQuery(item.bookName); handleSearch(item.bookName); }}
                className="w-full text-left p-3 hover:bg-white/5 transition-colors flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img src={item.cover} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm truncate group-hover:text-red-500 transition-colors">
                    {item.bookName.trim()}
                  </h4>
                </div>
                <ArrowRight size={14} className="text-zinc-600 group-hover:text-red-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Mencari Drama...</p>
        </div>
      ) : (
        <>
          {/* Search Results Grid */}
          {results.length > 0 && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-zinc-400">Hasil untuk "{query}"</h2>
                <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">{results.length} Drama</span>
              </div>
              <div className="grid grid-cols-3 gap-x-3 gap-y-6">
                {results.map((drama) => (
                  <Link key={drama.bookId} to={`/watch/${drama.bookId}`} className="group block">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-2 bg-zinc-900 ring-1 ring-white/5 shadow-lg shadow-black/50">
                      <img 
                        src={drama.cover} 
                        alt={drama.bookName} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-[12px] font-bold line-clamp-2 leading-tight px-1 group-hover:text-red-500 transition-colors">
                      {drama.bookName.trim()}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - Popular Searches */}
          {!query && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-2 mb-5">
                <Flame size={18} className="text-red-500" />
                <h2 className="text-lg font-black tracking-tight">Lagi Rame Dicari</h2>
              </div>
              
              <div className="space-y-3">
                {popularDramas.map((drama, index) => (
                  <Link 
                    key={drama.bookId} 
                    to={`/watch/${drama.bookId}`} 
                    className="flex items-center gap-4 p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl hover:bg-zinc-800/60 transition-all group shadow-sm"
                  >
                    <div className="relative flex-shrink-0">
                      <img src={drama.cover} alt="" className="w-14 h-14 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform" />
                      <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shadow-lg ${index < 3 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate group-hover:text-red-500 transition-colors">
                        {drama.bookName.trim()}
                      </h3>
                      <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">{drama.playCount} penonton</p>
                    </div>
                    <div className="p-2 rounded-full bg-zinc-800/50 group-hover:bg-red-500 transition-all group-hover:rotate-45">
                        <ArrowRight size={14} className="text-zinc-500 group-hover:text-white" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Not Found State */}
          {query && results.length === 0 && !loading && (
            <div className="text-center py-24 px-10 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                 <SearchIcon size={32} className="text-zinc-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">Dramanya nggak ada, Bos</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Coba cari pakai judul lain atau cek penulisan judulnya ya.</p>
              <button 
                onClick={() => setQuery('')}
                className="mt-8 px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold hover:bg-zinc-800 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;