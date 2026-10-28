import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { initialTrendingHashtags } from '../../data/mockData';
import { VerifiedBadge } from '../common/VerifiedBadge';

export const RightSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { users, currentUser, toggleFollowUser, addRecentSearch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Curate suggested users (exclude current user)
  const suggestedUsers = users.filter((u) => u.id !== currentUser.id).slice(0, 4);

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 px-5 py-5 border-l border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#0B1020]/60 backdrop-blur-md overflow-y-auto no-scrollbar shrink-0 space-y-6">
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, creators, #tags..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-transparent focus:border-[#7667FF] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
        />
      </form>

      {/* Trending Hashtags Section */}
      <div className="bg-slate-50/70 dark:bg-[#12182B]/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#7667FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Trending Topics
            </h3>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-[11px] font-semibold text-[#7667FF] hover:underline"
          >
            Explore
          </button>
        </div>

        <div className="space-y-3">
          {initialTrendingHashtags.slice(0, 5).map((item) => (
            <div
              key={item.tag}
              onClick={() => {
                addRecentSearch(`#${item.tag}`);
                navigate(`/explore?q=${encodeURIComponent(item.tag)}`);
              }}
              className="group cursor-pointer flex flex-col space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{item.category}</span>
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {item.postsCount}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#7667FF] transition-colors">
                #{item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested People Section */}
      <div className="bg-slate-50/70 dark:bg-[#12182B]/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Suggested for you
          </h3>
          <button
            onClick={() => navigate('/explore')}
            className="text-[11px] font-semibold text-[#7667FF] hover:underline"
          >
            See all
          </button>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-2">
              <div
                onClick={() => navigate(`/profile/${user.username}`)}
                className="flex items-center gap-2.5 cursor-pointer min-w-0"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate hover:underline">
                      {user.name}
                    </span>
                    {user.isVerified && (
                      <VerifiedBadge className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    @{user.username}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleFollowUser(user.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1 ${
                  user.isFollowing
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400'
                    : 'bg-[#7667FF] text-white hover:bg-[#6352ff] shadow-sm'
                }`}
              >
                {user.isFollowing ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Following</span>
                  </>
                ) : (
                  <span>Follow</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Refined Editorial Footer */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 space-y-2 pt-2 px-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-medium">
          <a href="#about" onClick={(e) => { e.preventDefault(); navigate('/settings'); }} className="hover:text-slate-600 dark:hover:text-slate-300">About</a>
          <a href="#help" onClick={(e) => { e.preventDefault(); navigate('/settings'); }} className="hover:text-slate-600 dark:hover:text-slate-300">Help Center</a>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); navigate('/settings'); }} className="hover:text-slate-600 dark:hover:text-slate-300">Privacy & Terms</a>
          <a href="#communities" onClick={(e) => { e.preventDefault(); navigate('/communities'); }} className="hover:text-slate-600 dark:hover:text-slate-300">Communities</a>
        </div>
        <p className="text-[10px] text-slate-400/80">
          ZENVI © 2026. Every moment connects.
        </p>
      </div>
    </aside>
  );
};
