import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Film, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { currentUser, setCreatePostModalOpen } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-3 py-2 flex items-center justify-around">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isActive
              ? 'text-[#7667FF] dark:text-[#A78BFA]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`
        }
        aria-label="Home Feed"
      >
        <Home className={`w-6 h-6 ${location.pathname === '/' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isActive
              ? 'text-[#7667FF] dark:text-[#A78BFA]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`
        }
        aria-label="Explore"
      >
        <Search className={`w-6 h-6 ${location.pathname === '/explore' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
      </NavLink>

      {/* Central Create Button */}
      <button
        onClick={() => setCreatePostModalOpen(true)}
        type="button"
        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#7667FF] hover:bg-[#6352ff] text-white shadow-md shadow-[#7667FF]/30 active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <Plus className="w-6 h-6 stroke-[2.5px]" />
      </button>

      <NavLink
        to="/reels"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isActive
              ? 'text-[#7667FF] dark:text-[#A78BFA]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`
        }
        aria-label="Reels"
      >
        <Film className={`w-6 h-6 ${location.pathname === '/reels' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
            isActive
              ? 'text-[#7667FF] dark:text-[#A78BFA]'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`
        }
        aria-label="My Profile"
      >
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className={`w-6 h-6 rounded-full object-cover ${
              location.pathname === '/profile'
                ? 'ring-2 ring-[#7667FF]'
                : 'ring-1 ring-slate-300 dark:ring-slate-700'
            }`}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
            }}
          />
        </div>
      </NavLink>
    </nav>
  );
};
