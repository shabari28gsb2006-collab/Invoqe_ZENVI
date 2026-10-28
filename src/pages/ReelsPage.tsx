import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Play,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  X,
  Send,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Reel } from '../types';

export const ReelsPage: React.FC = () => {
  const navigate = useNavigate();
  const { reels, toggleLikeReel, toggleSaveReel, showToast, toggleFollowUser, users } = useApp();

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [displayedReels, setDisplayedReels] = useState<Reel[]>(() => reels.slice(0, 15));
  const [showHeartBurst, setShowHeartBurst] = useState<string | null>(null);

  // Comments Sheet state
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [reelComments, setReelComments] = useState<{ [reelId: string]: Array<{ id: string; user: string; text: string; time: string }> }>({
    reel_1: [
      { id: '1', user: 'sneha_art', text: 'This lighting is ethereal! 🌅', time: '2h ago' },
      { id: '2', user: 'shabari_28_gsb', text: 'Unreal composition brother!', time: '1h ago' },
    ],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Sync reels from context initially
  useEffect(() => {
    if (reels.length > 0 && displayedReels.length < 15) {
      setDisplayedReels(reels.slice(0, 20));
    }
  }, [reels]);

  // Infinite reels generator: append more when near the bottom
  const loadMoreReels = () => {
    setDisplayedReels((prev) => {
      const nextBatch = reels.slice(prev.length % reels.length, (prev.length % reels.length) + 15);
      // Give unique keys if repeating so react keys stay pristine
      const keyedBatch = nextBatch.map((r, i) => ({
        ...r,
        id: `${r.id}_inf_${prev.length + i}`,
      }));
      return [...prev, ...keyedBatch];
    });
  };

  // Observe active snap item
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const index = Math.round(scrollTop / height);
      if (index !== activeReelIndex && index >= 0 && index < displayedReels.length) {
        setActiveReelIndex(index);
        setIsPlaying(true);
      }

      // Check if near bottom to load more indefinitely
      if (scrollTop + height >= container.scrollHeight - height * 2) {
        loadMoreReels();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeReelIndex, displayedReels.length]);

  // Keyboard navigation (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        scrollToIndex(activeReelIndex + 1);
      } else if (e.key === 'ArrowUp') {
        scrollToIndex(activeReelIndex - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelIndex, displayedReels.length]);

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < displayedReels.length && containerRef.current) {
      containerRef.current.scrollTo({
        top: index * containerRef.current.clientHeight,
        behavior: 'smooth',
      });
      setActiveReelIndex(index);
      setIsPlaying(true);
    }
  };

  // Play/Pause active video
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, vid]) => {
      if (!vid) return;
      const currentActiveId = displayedReels[activeReelIndex]?.id;
      if (id === currentActiveId) {
        if (isPlaying) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      } else {
        vid.pause();
      }
    });
  }, [activeReelIndex, isPlaying, displayedReels]);

  const handleDoubleTap = (reelId: string) => {
    toggleLikeReel(reelId);
    setShowHeartBurst(reelId);
    setTimeout(() => setShowHeartBurst(null), 800);
  };

  const handleShareReel = (reel: Reel) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/reels`);
      showToast(`Reel link by @${reel.creatorUsername} copied to clipboard`);
    }
  };

  const handleAddComment = (reelId: string) => {
    if (!commentInput.trim()) return;
    const newComm = {
      id: Date.now().toString(),
      user: 'shabari_28_gsb',
      text: commentInput.trim(),
      time: 'Just now',
    };
    setReelComments((prev) => ({
      ...prev,
      [reelId]: [...(prev[reelId] || []), newComm],
    }));
    setCommentInput('');
    showToast('Comment posted');
  };

  if (displayedReels.length === 0) {
    return <div className="p-12 text-center text-xs">Loading infinite reels...</div>;
  }

  return (
    <div className="relative w-full h-[calc(100vh-65px)] md:h-[calc(100vh-10px)] flex items-center justify-center overflow-hidden py-1 sm:py-2">
      {/* Infinite Snap Container */}
      <div
        ref={containerRef}
        className="w-full max-w-sm sm:max-w-[420px] h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar relative rounded-3xl bg-black border border-slate-900 shadow-2xl"
      >
        {displayedReels.map((reel, index) => {
          const isActive = index === activeReelIndex;
          const creatorUser = users.find((u) => u.id === reel.creatorId || u.username === reel.creatorUsername);
          const isFollowing = creatorUser?.isFollowing;

          return (
            <div
              key={reel.id}
              className="w-full h-full snap-start shrink-0 relative flex flex-col justify-between overflow-hidden select-none"
            >
              {/* Media Layer (Video or High-Res Reel Canvas) */}
              <div
                className="absolute inset-0 z-0 cursor-pointer overflow-hidden bg-black"
                onClick={() => setIsPlaying(!isPlaying)}
                onDoubleClick={() => handleDoubleTap(reel.id)}
              >
                {reel.videoUrl ? (
                  <video
                    ref={(el) => { videoRefs.current[reel.id] = el; }}
                    src={reel.videoUrl}
                    poster={reel.mediaUrl}
                    loop
                    playsInline
                    muted={isMuted}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={reel.mediaUrl}
                    alt={reel.caption}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.01]"
                  />
                )}

                {/* Scrim Gradients for legible text */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

                {/* Pause Indicator */}
                {!isPlaying && isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <div className="p-4 rounded-full bg-black/60 text-white backdrop-blur-xs animate-in zoom-in-75">
                      <Play className="w-8 h-8 fill-white translate-x-0.5" />
                    </div>
                  </div>
                )}

                {/* Double Tap Heart Burst Animation */}
                {showHeartBurst === reel.id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-300">
                    <Heart className="w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-2xl animate-bounce" />
                  </div>
                )}
              </div>

              {/* Top Controls: Logo & Audio Mute Toggle */}
              <div className="relative z-10 p-4 flex items-center justify-between text-white">
                <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase drop-shadow-md text-white/95">
                  ZENVI Reels
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors shadow-sm"
                  aria-label="Toggle sound"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>

              {/* Right Floating Actions (Like, Comment, Share, Save) */}
              <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
                {/* Like */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLikeReel(reel.id);
                  }}
                  className="flex flex-col items-center gap-1 group/btn active:scale-125 transition-transform"
                >
                  <div
                    className={`p-3 rounded-full backdrop-blur-md transition-all ${
                      reel.isLiked ? 'bg-rose-500 text-white scale-110 shadow-lg' : 'bg-black/40 hover:bg-black/60'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${reel.isLiked ? 'fill-white stroke-white' : 'stroke-[2px]'}`} />
                  </div>
                  <span className="text-[11px] font-mono tabular-nums drop-shadow-md font-semibold">
                    {reel.likesCount.toLocaleString()}
                  </span>
                </button>

                {/* Comment */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCommentsReelId(reel.id);
                  }}
                  className="flex flex-col items-center gap-1 active:scale-110 transition-transform"
                >
                  <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors">
                    <MessageCircle className="w-6 h-6 stroke-[2px]" />
                  </div>
                  <span className="text-[11px] font-mono tabular-nums drop-shadow-md font-semibold">
                    {reel.commentsCount.toLocaleString()}
                  </span>
                </button>

                {/* Share */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareReel(reel);
                  }}
                  className="flex flex-col items-center gap-1 active:scale-110 transition-transform"
                >
                  <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors">
                    <Share2 className="w-6 h-6 stroke-[2px]" />
                  </div>
                  <span className="text-[11px] font-mono tabular-nums drop-shadow-md font-semibold">
                    {reel.sharesCount.toLocaleString()}
                  </span>
                </button>

                {/* Bookmark */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveReel(reel.id);
                  }}
                  className="flex flex-col items-center gap-1 active:scale-110 transition-transform"
                >
                  <div
                    className={`p-3 rounded-full backdrop-blur-md transition-all ${
                      reel.isSaved ? 'bg-[#7667FF] text-white scale-110' : 'bg-black/40 hover:bg-black/60'
                    }`}
                  >
                    <Bookmark className={`w-6 h-6 ${reel.isSaved ? 'fill-white stroke-white' : 'stroke-[2px]'}`} />
                  </div>
                </button>
              </div>

              {/* Bottom Creator Details & Audio */}
              <div className="relative z-10 p-4 sm:p-5 space-y-2 text-white max-w-[82%]">
                {/* Creator Header */}
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={() => navigate(`/profile/${reel.creatorUsername}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={reel.creatorAvatar}
                      alt={reel.creatorName}
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/80 shadow-md"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span
                      onClick={() => navigate(`/profile/${reel.creatorUsername}`)}
                      className="text-xs sm:text-sm font-bold drop-shadow-sm hover:underline cursor-pointer truncate max-w-[140px]"
                    >
                      {reel.creatorUsername}
                    </span>

                    {creatorUser && creatorUser.id !== 'user_current' && (
                      <button
                        onClick={() => toggleFollowUser(creatorUser.id)}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                          isFollowing
                            ? 'border-white/40 bg-white/20 text-white'
                            : 'border-[#7667FF] bg-[#7667FF] text-white'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Caption */}
                <p className="text-xs leading-relaxed text-white/95 drop-shadow-md line-clamp-3">
                  {reel.caption}
                </p>

                {/* Rotating Sound / Music Tag */}
                <div className="flex items-center gap-2 text-[11px] text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full w-fit max-w-full shadow-sm border border-white/10">
                  <Music className="w-3.5 h-3.5 text-[#A78BFA] shrink-0 animate-pulse" />
                  <span className="truncate">{reel.audioTrack}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Up / Down Controls */}
      <div className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
        <button
          onClick={() => scrollToIndex(activeReelIndex - 1)}
          disabled={activeReelIndex === 0}
          className="p-3 rounded-2xl bg-white dark:bg-[#12182B] text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-slate-800 hover:bg-[#7667FF] hover:text-white transition-all disabled:opacity-40"
          aria-label="Previous reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollToIndex(activeReelIndex + 1)}
          className="p-3 rounded-2xl bg-white dark:bg-[#12182B] text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-slate-800 hover:bg-[#7667FF] hover:text-white transition-all"
          aria-label="Next reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Slide-up Sheet */}
      {activeCommentsReelId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#12182B] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[70vh] h-[480px]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Comments</h3>
              <button
                onClick={() => setActiveCommentsReelId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {(reelComments[activeCommentsReelId] || [
                { id: '1', user: 'sneha_art', text: 'This lighting is ethereal! 🌅', time: '2h ago' },
                { id: '2', user: 'travel.mani', text: 'Where was this shot bro? Incredible frame!', time: '1h ago' },
              ]).map((c) => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#7667FF] to-pink-500 p-[1.5px] shrink-0">
                    <div className="w-full h-full rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                      {c.user[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white">{c.user}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddComment(activeCommentsReelId);
              }}
              className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment on this reel..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#7667FF]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#7667FF] text-white hover:bg-[#6352ff] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
