import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Play,
  Layers,
  Bookmark,
  Check,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initialTrendingHashtags } from '../data/mockData';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { posts, reels, users, toggleFollowUser, recentSearches, removeRecentSearch, clearRecentSearches, addRecentSearch } =
    useApp();

  const queryFromUrl = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (queryFromUrl !== searchTerm) {
      setSearchTerm(queryFromUrl);
    }
  }, [queryFromUrl]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm.trim());
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const normalizedQuery = searchTerm.toLowerCase().trim().replace(/^#/, '');

  // Filtered posts based on search and category
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory === 'reels') return [];
    if (activeCategory !== 'all') {
      result = result.filter(
        (p) =>
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(activeCategory))) ||
          p.content.toLowerCase().includes(activeCategory)
      );
    }
    if (normalizedQuery) {
      result = result.filter(
        (p) =>
          p.content.toLowerCase().includes(normalizedQuery) ||
          p.authorName.toLowerCase().includes(normalizedQuery) ||
          p.authorUsername.toLowerCase().includes(normalizedQuery) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(normalizedQuery))) ||
          (p.location && p.location.toLowerCase().includes(normalizedQuery))
      );
    }
    return result;
  }, [posts, activeCategory, normalizedQuery]);

  // Filtered reels based on search
  const filteredReels = useMemo(() => {
    if (activeCategory !== 'all' && activeCategory !== 'reels') return [];
    if (!normalizedQuery) return reels;
    return reels.filter(
      (r) =>
        r.caption.toLowerCase().includes(normalizedQuery) ||
        r.creatorName.toLowerCase().includes(normalizedQuery) ||
        r.creatorUsername.toLowerCase().includes(normalizedQuery) ||
        (r.tags && r.tags.some((t) => t.toLowerCase().includes(normalizedQuery)))
    );
  }, [reels, activeCategory, normalizedQuery]);

  // Filtered users matching search
  const filteredUsers = useMemo(() => {
    if (!normalizedQuery) return [];
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(normalizedQuery) ||
        u.username.toLowerCase().includes(normalizedQuery) ||
        u.bio.toLowerCase().includes(normalizedQuery)
    );
  }, [users, normalizedQuery]);

  // Suggested curated items for Instagram-style Bento explore grid
  const exploreItems = useMemo(() => {
    const items: Array<{
      id: string;
      type: 'reel' | 'post';
      mediaUrl: string;
      views?: string;
      isTall?: boolean;
      hasMulti?: boolean;
      caption: string;
      targetId: string;
    }> = [
      {
        id: 'ex-1',
        type: 'reel',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        views: '168K',
        isTall: false,
        caption: 'Receipt animation code walk',
        targetId: 'reel_3',
      },
      {
        id: 'ex-2',
        type: 'reel',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        views: '18.3M',
        isTall: true,
        caption: 'Luxury motorhome interior tour',
        targetId: 'reel_1',
      },
      {
        id: 'ex-3',
        type: 'post',
        mediaUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
        views: '618K',
        isTall: false,
        caption: 'World cup moment India',
        targetId: 'post_3',
      },
      {
        id: 'ex-4',
        type: 'post',
        mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        views: '7.1M',
        isTall: false,
        hasMulti: true,
        caption: 'Offroad skateboard trial',
        targetId: 'post_1',
      },
      {
        id: 'ex-5',
        type: 'reel',
        mediaUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
        views: '1.2M',
        isTall: false,
        caption: 'Cricket batting net session',
        targetId: 'reel_2',
      },
      {
        id: 'ex-6',
        type: 'post',
        mediaUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
        views: '16M',
        isTall: false,
        caption: 'High speed rail passing through',
        targetId: 'post_2',
      },
      {
        id: 'ex-7',
        type: 'reel',
        mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        views: '490K',
        isTall: false,
        caption: 'Motion design & workspace setup',
        targetId: 'reel_3',
      },
      {
        id: 'ex-8',
        type: 'post',
        mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        views: '1M',
        isTall: true,
        caption: 'Military radio device hardware inspection',
        targetId: 'post_4',
      },
      {
        id: 'ex-9',
        type: 'reel',
        mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        views: '126K',
        isTall: false,
        caption: 'Flutter mobile scooter app build',
        targetId: 'reel_2',
      },
    ];

    // Combine with current mock posts
    posts.forEach((p, index) => {
      if (p.mediaUrls && p.mediaUrls[0]) {
        items.push({
          id: `post-ex-${p.id}`,
          type: 'post',
          mediaUrl: p.mediaUrls[0],
          views: `${(p.likesCount * 2.8).toFixed(0)}K`,
          isTall: index % 4 === 1,
          hasMulti: p.mediaUrls.length > 1,
          caption: p.content,
          targetId: p.id,
        });
      }
    });

    return items;
  }, [posts]);

  const categories = [
    { id: 'all', label: 'For You' },
    { id: 'reels', label: 'Reels' },
    { id: 'tech', label: 'Tech & Code' },
    { id: 'travel', label: 'Travel' },
    { id: 'cricket', label: 'Sports' },
    { id: 'photography', label: 'Photography' },
    { id: 'food', label: 'Food' },
    { id: 'nature', label: 'Nature' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 space-y-3">
      {/* Top Search Input matching reference image 1 */}
      <div className="relative">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search creators, topics, #tags..."
            className="w-full pl-10 pr-12 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-transparent focus:border-[#7667FF] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSearchParams({});
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Bookmark className="w-4 h-4" />
            </div>
          )}
        </form>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* If Searching: Show Matching Users First */}
      {normalizedQuery && filteredUsers.length > 0 && (
        <div className="bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Suggested People
          </span>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="py-2 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div
                  onClick={() => navigate(`/profile/${user.username}`)}
                  className="flex items-center gap-2.5 min-w-0"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      {user.isVerified && (
                        <VerifiedBadge className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(user.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    user.isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-[#7667FF] text-white hover:bg-[#6352ff]'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Reels and Posts Discovery Grid (3-Column Layout from Screenshot) */}
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 auto-rows-[120px] sm:auto-rows-[180px] md:auto-rows-[220px]">
        {exploreItems.map((item) => {
          const isReel = item.type === 'reel';
          return (
            <div
              key={item.id}
              onClick={() => {
                if (isReel) {
                  navigate('/reels');
                } else {
                  navigate(`/post/${item.targetId}`);
                }
              }}
              className={`group relative overflow-hidden bg-slate-900 cursor-pointer ${
                item.isTall ? 'row-span-2' : 'row-span-1'
              }`}
            >
              <img
                src={item.mediaUrl}
                alt={item.caption}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

              {/* Reel view count overlay at bottom left */}
              {item.views && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white font-semibold text-xs drop-shadow-md">
                  <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                  <span className="font-mono tabular-nums text-[11px]">{item.views}</span>
                </div>
              )}

              {/* Multi photo indicator */}
              {item.hasMulti && (
                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                  <Layers className="w-4 h-4" />
                </div>
              )}

              {/* Reel play badge top right */}
              {isReel && (
                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                  <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
