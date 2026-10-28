import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Heart, MessageCircle, ArrowLeft, Grid, Folder } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SavedPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const { posts, toggleSavePost } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'collections'>('all');

  const savedPosts = posts.filter((p) => p.isSaved);

  const collections = [
    { title: 'Inspiration', count: savedPosts.length, cover: savedPosts[0]?.mediaUrls[0] },
    {
      title: 'Travel Wishlist',
      count: 2,
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'Design Systems',
      count: 1,
      cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bookmark className="w-5 h-5 text-[#7667FF]" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Saved Moments
          </h1>
          <span className="text-xs font-mono tabular-nums text-slate-400">
            ({savedPosts.length})
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>All Posts</span>
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'collections'
                ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Collections</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'all' ? (
        savedPosts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No saved posts yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save posts to revisit them later. Only you can see what you have saved.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7667FF] text-white hover:bg-[#6352ff]"
            >
              Explore Feed
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-xs border border-slate-200/50 dark:border-slate-800"
              >
                {post.mediaUrls && post.mediaUrls[0] ? (
                  <img
                    src={post.mediaUrls[0]}
                    alt="Saved post"
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="w-full h-full p-4 flex items-center justify-center text-xs text-center"
                  >
                    {post.content}
                  </div>
                )}

                {/* Unsave button quick action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSavePost(post.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-[#7667FF] hover:bg-black/90 transition-colors z-10"
                  aria-label="Remove from saved"
                >
                  <Bookmark className="w-4 h-4 fill-[#7667FF]" />
                </button>

                {/* Overlay details */}
                <div
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs"
                >
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div
              key={col.title}
              onClick={() => setActiveTab('all')}
              className="bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer group shadow-xs hover:border-[#7667FF]/50 transition-all"
            >
              <div className="h-32 bg-slate-100 dark:bg-slate-800 relative">
                {col.cover ? (
                  <img
                    src={col.cover}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Folder className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {col.title}
                </h4>
                <p className="text-[11px] text-slate-400">{col.count} items</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
