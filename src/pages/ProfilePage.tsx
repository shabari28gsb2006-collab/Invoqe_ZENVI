import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Share2,
  Check,
  MessageCircle,
  Grid,
  Bookmark,
  Heart,
  Plus,
  Film,
  UserCheck,
  UserPlus,
  Play,
  Layers,
  AtSign,
  Music,
  Settings,
  Tag,
  Link as LinkIcon,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    users,
    posts,
    reels,
    toggleFollowUser,
    setActiveHighlight,
    setCreateHighlightModalOpen,
    setCreatePostModalOpen,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'tagged'>('posts');

  // Identify targeted user
  const isSelf = !username || username === currentUser.username;
  const user = isSelf
    ? currentUser
    : users.find((u) => u.username.toLowerCase() === username?.toLowerCase()) || currentUser;

  // Filter posts and reels for this user
  const userPosts = posts.filter(
    (p) => p.authorId === user.id || (isSelf && p.authorId === 'user_current')
  );
  const userReels = reels.filter(
    (r) => r.creatorId === user.id || (isSelf && r.creatorId === 'user_current')
  );
  const savedPosts = posts.filter((p) => p.isSaved);

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Profile link for @${user.username} copied to clipboard`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Mobile Bar */}
      <div className="flex md:hidden items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
            {user.username}
          </h1>
          {user.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
        </div>
        <div className="flex items-center gap-1">
          {isSelf && (
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#7667FF] transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Info Section (Responsive: Split layout on Desktop, Stack on Mobile) */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
        {/* Avatar with Gradient Ring */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-[#7667FF] to-pink-500 shadow-md">
              <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-[#0B1020] overflow-hidden">
                <img
                  src={user.avatar}
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Quick Create Highlight Plus */}
            {isSelf && (
              <button
                onClick={() => setCreateHighlightModalOpen(true)}
                className="absolute bottom-1 right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#3B82F6] text-white flex items-center justify-center ring-2 ring-white dark:ring-[#0B1020] shadow-sm hover:scale-110 transition-transform"
                title="Add Highlight"
              >
                <Plus className="w-4 h-4 stroke-[3px]" />
              </button>
            )}
          </div>

          {/* Mobile-only Stats next to avatar */}
          <div className="flex md:hidden flex-1 justify-around text-center pl-4">
            <div>
              <span className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {userPosts.length}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">posts</span>
            </div>
            <div
              onClick={() => navigate('/followers')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {user.followersCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">followers</span>
            </div>
            <div
              onClick={() => navigate('/following')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {user.followingCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">following</span>
            </div>
          </div>
        </div>

        {/* Right Details: Username, Desktop Actions, Desktop Stats, Bio */}
        <div className="flex-1 w-full space-y-4">
          {/* Row 1: Username & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {user.username}
            </h2>
            {user.isVerified && <VerifiedBadge className="w-5 h-5" />}

            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-2.5 ml-2">
              {isSelf ? (
                <>
                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={handleShareProfile}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors"
                  >
                    Share profile
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleFollowUser(user.id)}
                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      user.isFollowing
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        : 'bg-[#7667FF] text-white hover:bg-[#6352ff]'
                    }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <span>Follow</span>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/messages')}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors"
                  >
                    Message
                  </button>
                  <button
                    onClick={handleShareProfile}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Desktop Stats Row */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <div>
              <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums mr-1">
                {userPosts.length}
              </span>
              <span className="text-slate-500 dark:text-slate-400">posts</span>
            </div>
            <div
              onClick={() => navigate('/followers')}
              className="cursor-pointer hover:underline"
            >
              <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums mr-1">
                {user.followersCount.toLocaleString()}
              </span>
              <span className="text-slate-500 dark:text-slate-400">followers</span>
            </div>
            <div
              onClick={() => navigate('/following')}
              className="cursor-pointer hover:underline"
            >
              <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums mr-1">
                {user.followingCount.toLocaleString()}
              </span>
              <span className="text-slate-500 dark:text-slate-400">following</span>
            </div>
          </div>

          {/* Name & Bio Details */}
          <div className="space-y-2 text-sm">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{user.name}</h3>
              {user.profession && (
                <span className="text-xs font-medium text-[#7667FF] dark:text-[#A78BFA]">
                  {user.profession}
                </span>
              )}
            </div>

            <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
              {user.bio}
            </p>

            {/* Tags & Music Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <Music className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span className="truncate max-w-[200px]">Nee Singam Dhan · AR Rahman</span>
              </div>

              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-[#7667FF] hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[180px]">{user.website.replace('https://', '')}</span>
                </a>
              )}
            </div>
          </div>

          {/* Mobile Action Buttons (Visible only on mobile) */}
          <div className="flex sm:hidden items-center gap-2 pt-2">
            {isSelf ? (
              <>
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors text-center"
                >
                  Edit profile
                </button>
                <button
                  onClick={handleShareProfile}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors text-center"
                >
                  Share profile
                </button>
                <button
                  onClick={() => navigate('/followers')}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => toggleFollowUser(user.id)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    user.isFollowing
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      : 'bg-[#7667FF] text-white hover:bg-[#6352ff]'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  onClick={() => navigate('/messages')}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 text-center"
                >
                  Message
                </button>
                <button
                  onClick={handleShareProfile}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Story Highlights Row */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2">
          {/* First Item: "+ New" Highlight */}
          {isSelf && (
            <div
              onClick={() => setCreateHighlightModalOpen(true)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-900 group-hover:border-[#7667FF] transition-all">
                <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-slate-600 dark:text-slate-400 group-hover:text-[#7667FF]" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">New</span>
            </div>
          )}

          {/* Highlights List */}
          {user.highlights &&
            user.highlights.map((hl) => (
              <div
                key={hl.id}
                onClick={() => setActiveHighlight(hl)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2.5px] border-2 border-slate-300 dark:border-slate-700 group-hover:border-[#7667FF] transition-all bg-white dark:bg-[#12182B] overflow-hidden shadow-xs">
                  <img
                    src={hl.coverImage}
                    alt={hl.title}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate max-w-[72px] text-center">
                  {hl.title}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Tabs Navigation (POSTS, REELS, SAVED, TAGGED) */}
      <div className="flex items-center justify-around border-t border-slate-200 dark:border-slate-800 text-xs font-bold tracking-wider">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3.5 flex items-center justify-center gap-2 border-t-2 -mt-[1px] transition-all ${
            activeTab === 'posts'
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Grid className="w-4 h-4 stroke-[2.2px]" />
          <span className="hidden sm:inline">POSTS</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-3.5 flex items-center justify-center gap-2 border-t-2 -mt-[1px] transition-all ${
            activeTab === 'reels'
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Film className="w-4 h-4 stroke-[2.2px]" />
          <span className="hidden sm:inline">REELS</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3.5 flex items-center justify-center gap-2 border-t-2 -mt-[1px] transition-all ${
            activeTab === 'saved'
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4 stroke-[2.2px]" />
          <span className="hidden sm:inline">SAVED</span>
        </button>

        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex-1 py-3.5 flex items-center justify-center gap-2 border-t-2 -mt-[1px] transition-all ${
            activeTab === 'tagged'
              ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Tag className="w-4 h-4 stroke-[2.2px]" />
          <span className="hidden sm:inline">TAGGED</span>
        </button>
      </div>

      {/* Grid Content */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No posts shared yet. Tap create to publish your first moment.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer"
                >
                  {post.mediaUrls && post.mediaUrls[0] ? (
                    <img
                      src={post.mediaUrls[0]}
                      alt="Post"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full p-3 flex items-center justify-center text-xs text-center text-slate-600 dark:text-slate-300">
                      {post.content.slice(0, 50)}
                    </div>
                  )}

                  {/* Multi-image icon */}
                  {post.mediaUrls && post.mediaUrls.length > 1 && (
                    <div className="absolute top-2 right-2 text-white drop-shadow-md">
                      <Layers className="w-4 h-4" />
                    </div>
                  )}

                  {/* Hover stats overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REELS TAB */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {(userReels.length > 0 ? userReels : reels.slice(0, 18)).map((reel) => (
            <div
              key={reel.id}
              onClick={() => navigate('/reels')}
              className="group relative aspect-[9/15] bg-slate-900 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer shadow-xs"
            >
              <img
                src={reel.mediaUrl}
                alt={reel.caption}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* View count at bottom */}
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-white font-semibold text-xs drop-shadow-sm">
                <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                <span className="font-mono tabular-nums text-[11px]">
                  {(reel.likesCount * 3.4).toFixed(0)}K
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SAVED TAB */}
      {activeTab === 'saved' && (
        <div>
          {savedPosts.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No saved posts yet. Bookmark posts in feed to view them here.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer"
                >
                  {post.mediaUrls && post.mediaUrls[0] ? (
                    <img
                      src={post.mediaUrls[0]}
                      alt="Saved"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full p-2 flex items-center justify-center text-xs">
                      {post.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAGGED TAB */}
      {activeTab === 'tagged' && (
        <div className="py-16 text-center text-xs text-slate-400">
          No photos or videos tagged with @{user.username} yet.
        </div>
      )}
    </div>
  );
};
