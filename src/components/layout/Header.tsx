import { Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage, languages } from '../../store/language'

export default function Header() {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const { lang, setLang } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 z-50">
      <div className="flex items-center justify-between h-full px-4 max-w-md mx-auto">
        <Link to="/" className="flex items-center group">
          <img 
            src="https://dracinku.app/media/logo.png" 
            alt="MyDracin Logo" 
            className="h-8 w-auto object-contain transition-transform duration-300 group-active:scale-90"
          />
        </Link>
        
        <div className="flex items-center gap-1">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2.5 hover:bg-zinc-800/50 rounded-xl transition-all text-base active:scale-90"
            >
              {languages.find(l => l.code === lang)?.flag || '🌐'}
            </button>
            
            {showLangMenu && (
              <>
                {/* Backdrop transparan buat nutup menu kalau klik di luar */}
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowLangMenu(false)} />
                
                <div className="absolute top-full right-0 mt-3 bg-zinc-900 border border-white/5 rounded-2xl w-48 max-h-80 overflow-y-auto z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 no-scrollbar">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLang(language.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3.5 hover:bg-zinc-800 transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-widest ${
                        lang === language.code ? 'bg-zinc-800 text-red-500' : 'text-zinc-300'
                      }`}
                    >
                      <span className="text-base">{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {!isSearchPage && (
            <Link to="/search" className="p-2.5 hover:bg-zinc-800/50 rounded-xl transition-all active:scale-90">
              <Search size={22} className="text-zinc-400" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}