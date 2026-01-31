import { Play, Star, Heart, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DramaCardProps {
  drama: any;
}

const DramaCard = ({ drama }: DramaCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const dramaId = drama.bookId || drama.series_id;
  const dramaTitle = drama.bookName || drama.title;
  const dramaCover = drama.bookCover || drama.cover;

  return (
    <div 
      onClick={() => navigate(`/watch/${dramaId}`)}
      className="group relative cursor-pointer"
    >
      {/* 1. Container Poster dengan Aspect Ratio 2:3 */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 transition-all duration-500 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
        
        {/* Placeholder Loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <Zap size={24} className="text-zinc-800" />
          </div>
        )}

        {/* Poster Image */}
        <img 
          src={dramaCover} 
          alt={dramaTitle}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        {/* Hover Icon Play (Center) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
          <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            <Play size={24} className="text-black ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Badge Rating (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
          <Star size={10} className="text-yellow-500 fill-current" />
          <span className="text-[10px] font-black text-white">{drama.score || '9.8'}</span>
        </div>

        {/* Tombol Like (Top Right) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/5 transition-all active:scale-75"
        >
          <Heart size={14} className={isLiked ? 'text-red-500 fill-current' : 'text-white'} />
        </button>
      </div>

      {/* 2. Info Detail (Di Luar Poster agar Bersih) */}
      <div className="mt-4 px-2">
        <h3 className="text-[11px] font-black uppercase tracking-tighter text-zinc-100 line-clamp-1 group-hover:text-yellow-500 transition-colors">
          {dramaTitle}
        </h3>
        <div className="flex items-center gap-2 mt-1 opacity-50">
          <span className="text-[9px] font-bold uppercase tracking-widest">{drama.tag || 'Romance'}</span>
          <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
          <span className="text-[9px] font-bold uppercase tracking-widest">{drama.year || '2026'}</span>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;