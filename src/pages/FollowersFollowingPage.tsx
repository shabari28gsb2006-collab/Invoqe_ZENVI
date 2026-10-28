import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

export const FollowersFollowingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users, currentUser, toggleFollowUser } = useApp();

  const isFollowingRoute = location.pathname.includes('/following');
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(
    isFollowingRoute ? 'following' : 'followers'
  );

  // Curate followers vs following list
  const followersList = users.filter((u) => u.id !== currentUser.id);
  const followingList = users.filter((u) => u.isFollowing);

  const displayedList = activeTab === 'followers' ? followersList : followingList;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Back button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#7667FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>
        <span className="text-xs font-bold text-slate-400">@{currentUser.username}&apos;s Network</span>
      </div>

      {/* Segmented Control */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('followers')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'followers'
              ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Followers ({currentUser.followersCount.toLocaleString()})
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'following'
              ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Following ({currentUser.followingCount.toLocaleString()})
        </button>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm overflow-hidden">
        {displayedList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {activeTab === 'following'
              ? 'You are not following anyone yet.'
              : 'No followers found.'}
          </div>
        ) : (
          displayedList.map((user) => (
            <div
              key={user.id}
              className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div
                onClick={() => navigate(`/profile/${user.username}`)}
                className="flex items-center gap-3 cursor-pointer min-w-0"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate hover:underline">
                      {user.name}
                    </span>
                    {user.isVerified && (
                      <VerifiedBadge className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">@{user.username}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-sm">
                    {user.bio}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollowUser(user.id)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  user.isFollowing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400'
                    : 'bg-[#7667FF] text-white hover:bg-[#6352ff] shadow-xs'
                }`}
              >
                {user.isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
