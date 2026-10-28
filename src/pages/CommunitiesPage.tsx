import React, { useState } from 'react';
import { Users, Search, Check, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommunitiesPage: React.FC = () => {
  const { communities, toggleJoinCommunity } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'joined'>('all');

  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    if (filter === 'joined') return matchesSearch && c.isJoined;
    return matchesSearch;
  });

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#7667FF]" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Communities & Spaces
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Join interest hubs, share dedicated knowledge, and connect around shared passions.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Spaces ({communities.length})
          </button>
          <button
            onClick={() => setFilter('joined')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'joined'
                ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Joined ({communities.filter((c) => c.isJoined).length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search spaces by topic, category, or title..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#7667FF] text-slate-900 dark:text-white shadow-xs"
        />
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCommunities.map((comm) => (
          <div
            key={comm.id}
            className="bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={comm.avatar}
                    alt={comm.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#7667FF]/20"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {comm.name}
                    </h3>
                    <p className="text-[11px] text-[#7667FF] dark:text-[#A78BFA] font-medium">
                      {comm.category}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoinCommunity(comm.id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                    comm.isJoined
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400'
                      : 'bg-[#7667FF] text-white hover:bg-[#6352ff] shadow-xs'
                  }`}
                >
                  {comm.isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Join Space</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {comm.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono tabular-nums">
                {comm.membersCount.toLocaleString()} members
              </span>
              <span className="text-[11px] text-slate-400">
                {comm.postsCount.toLocaleString()} moments shared
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
