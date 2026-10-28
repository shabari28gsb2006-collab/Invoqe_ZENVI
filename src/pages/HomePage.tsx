import React, { useState, useEffect, useRef } from 'react';
import { StoriesBar } from '../components/feed/StoriesBar';
import { PostCard } from '../components/feed/PostCard';
import { useApp } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { posts } = useApp();
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll trigger when approaching bottom
  useEffect(() => {
    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < posts.length && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 10, posts.length));
            setIsLoadingMore(false);
          }, 400);
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [posts.length, visibleCount, isLoadingMore]);

  const displayedPosts = posts.slice(0, visibleCount);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Top Stories Bar directly at the top matching Instagram reference */}
      <StoriesBar />

      {/* Posts Stream */}
      <div className="space-y-4 sm:space-y-6">
        {displayedPosts.length === 0 ? (
          <div className="bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Your feed is currently empty.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create your first moment or explore trending creators.
            </p>
          </div>
        ) : (
          displayedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Infinite Scroll Sentinel & Loader */}
      <div ref={bottomSentinelRef} className="py-6 flex justify-center items-center">
        {visibleCount < posts.length ? (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-[#7667FF]" />
            <span>Loading more moments...</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400">You're all caught up with all {posts.length} moments ✨</p>
        )}
      </div>
    </div>
  );
};
