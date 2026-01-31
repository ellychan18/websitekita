import { Grid, Users, MonitorPlay, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../store/language';

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [dramas, setDramas] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/foryou/1?lang=${lang}`);
        const data = await response.json();
        if (data.success && data.data.list.length > 0) {
          const allTags = new Map<number, string>();
          // Ambil lebih banyak data untuk variasi kategori yang lengkap
          data.data.list.forEach((drama: any) => {
            drama.tagDetails?.forEach((tag: any) => {
              if (!allTags.has(tag.tagId)) {
                allTags.set(tag.tagId, tag.tagName);
              }
            });
          });
          
          const tagArray = Array.from(allTags, ([tagId, tagName]) => ({ tagId, tagName }));
          setCategories(tagArray);
          
          if (tagArray.length > 0 && !selectedCategory) {
            setSelectedCategory(tagArray[0].tagId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, [lang]);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchCategoryDramas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/classify?lang=${lang}&pageNo=1&pageSize=30&sort=1&tag=${selectedCategory}`);
        const data = await response.json();
        if (data.success) {
          setDramas(data.data.list);
        }
      } catch (error) {
        console.error('Failed to fetch category dramas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDramas();
  }, [selectedCategory, lang]);

  return (
    <div className="pb-24 bg-[#0a0a0a] min-h-screen">
      {/* Header Section - Melebar kepinggir */}
      <div className="px-3 pt-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-red-600 rounded-full" />
            <h1 className="text-xl font-black uppercase tracking-tight text-white">Explore Genre</h1>
          </div>
          <span className="text-[10px] font-black text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-white/5 uppercase tracking-widest">
            {dramas.length} Titles
          </span>
        </div>
      </div>

      {/* Category Tabs - Sticky & Sharp Design */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 mb-6 px-3 py-4 overflow-x-auto no-scrollbar flex gap-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.tagId}
              onClick={() => setSelectedCategory(category.tagId)}
              className={`flex-none px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all border ${
                selectedCategory === category.tagId
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20'
                  : 'bg-zinc-900/50 border-white/5 text-zinc-400'
              }`}
            >
              {category.tagName}
            </button>
          ))
        ) : (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-none w-20 h-8 bg-zinc-900 rounded-lg animate-pulse" />
          ))
        )}
      </div>

      {/* Content Area - Layout 2 Kolom Profesional */}
      <div className="px-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-zinc-900 rounded-xl" />
                <div className="h-3 bg-zinc-900 rounded w-3/4" />
                <div className="h-2 bg-zinc-900 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7">
            {dramas.map((drama, index) => (
              <Link 
                key={`${drama.bookId}-${index}`} 
                to={`/watch/${drama.bookId}`} 
                className="group flex flex-col gap-2"
              >
                {/* Poster Card - Sharp & Wide */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shadow-xl transition-all duration-300 group-hover:border-red-600/50">
                  <img 
                    src={drama.cover} 
                    alt={drama.bookName} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* Play Count Badge */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                    <Users size={10} className="text-red-500" />
                    {drama.playCount}
                  </div>
                </div>

                {/* Info Text - Full Title & Episode */}
                <div className="px-0.5 space-y-1">
                  <h3 className="text-[13px] font-bold text-zinc-100 leading-tight line-clamp-2 group-hover:text-red-500 transition-colors">
                    {drama.bookName.trim()}
                  </h3>
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <MonitorPlay size={11} className="text-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {drama.chapterCount || '??'} Episodes
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && dramas.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex p-5 bg-zinc-900 rounded-2xl mb-4 border border-white/5">
              <Grid size={32} className="text-zinc-700" />
            </div>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">No Content Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;