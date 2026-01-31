import { Home, TrendingUp, Search, Grid, Crown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/rank', icon: TrendingUp, label: 'Rank' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/category', icon: Grid, label: 'Genre' },
    { to: '/vip', icon: Crown, label: 'VIP' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 z-[100] px-2 pb-safe">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({ isActive }) => 
              `relative flex flex-col items-center justify-center min-w-[60px] transition-all duration-300 ${
                isActive ? 'scale-110' : 'opacity-40 grayscale hover:opacity-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Indikator Cahaya Neon di Atas Icon yang Aktif */}
                {isActive && (
                  <div className={`absolute -top-4 w-6 h-1 rounded-full blur-[2px] animate-pulse ${
                    label === 'VIP' 
                      ? 'bg-yellow-500 shadow-[0_0_15px_#eab308]' 
                      : 'bg-red-600 shadow-[0_0_15px_#dc2626]'
                  }`} />
                )}

                <div className={`p-1.5 rounded-xl transition-all duration-500 ${
                  isActive && label === 'VIP' 
                    ? 'bg-yellow-500/10' 
                    : isActive ? 'bg-red-600/10' : ''
                }`}>
                  <Icon 
                    size={22} 
                    className={`transition-all ${
                      label === 'VIP'
                        ? (isActive ? 'text-yellow-500' : 'text-yellow-700') 
                        : isActive ? 'text-red-600' : 'text-zinc-400'
                    }`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                <span className={`text-[8px] font-black uppercase tracking-[0.1em] mt-1 transition-all ${
                  label === 'VIP'
                    ? 'text-yellow-500' 
                    : isActive ? 'text-red-600' : 'text-zinc-500'
                }`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}