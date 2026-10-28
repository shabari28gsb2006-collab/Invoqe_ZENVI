import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Trash2,
  Edit,
  Link,
  UserCheck,
  UserPlus,
  Smile,
  Layers,
} from 'lucide-react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';
import { VerifiedBadge } from '../common/VerifiedBadge';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const {
    currentUser,
    users,
    toggleLikePost,
    toggleSavePost,
    addComment,
    deleteComment,
    comments,
    setEditingPost,
    setDeletingPostId,
    setSharePostData,
    toggleFollowUser,
    showToast,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const isAuthor = post.authorId === currentUser.id;
  const authorUser = users.find((u) => u.id === post.authorId);
  const isFollowingAuthor = authorUser?.isFollowing;

  // Filter comments for this post
  const postComments = comments.filter((c) => c.postId === post.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      addComment(post.id, commentInput);
      setCommentInput('');
      setShowComments(true);
    }
  };

  const copyPostLink = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Post link copied to clipboard');
    }
    setMenuOpen(false);
  };

  return (
    <article className="bg-white dark:bg-[#12182B] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden transition-all">
      {/* 1. Author Header Bar matching Instagram */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            onClick={() => navigate(`/profile/${post.authorUsername}`)}
            className="cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
              <div className="w-full h-full rounded-full p-[1.5px] bg-white dark:bg-[#12182B] overflow-hidden">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                onClick={() => navigate(`/profile/${post.authorUsername}`)}
                className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:underline max-w-[150px] sm:max-w-[220px]"
              >
                {post.authorUsername}
              </span>
              {post.authorVerified && (
                <VerifiedBadge className="w-3.5 h-3.5" />
              )}

              {/* Follow button if not own post and not already following */}
              {!isAuthor && authorUser && !isFollowingAuthor && (
                <>
                  <span className="text-slate-400 text-xs">·</span>
                  <button
                    onClick={() => toggleFollowUser(authorUser.id)}
                    className="text-xs font-bold text-[#7667FF] dark:text-[#A78BFA] hover:underline cursor-pointer shrink-0"
                  >
                    Follow
                  </button>
                </>
              )}
            </div>

            {post.location && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5 truncate max-w-[180px] sm:max-w-[280px]">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                {post.location}
              </span>
            )}
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#151D33] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              {isAuthor ? (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setEditingPost(post);
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-slate-400" />
                    <span>Edit Post</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setDeletingPostId(post.id);
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Post</span>
                  </button>
                </>
              ) : (
                authorUser && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      toggleFollowUser(authorUser.id);
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isFollowingAuthor ? (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span>Unfollow @{authorUser.username}</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-[#7667FF]" />
                        <span>Follow @{authorUser.username}</span>
                      </>
                    )}
                  </button>
                )
              )}

              <button
                onClick={copyPostLink}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Link className="w-4 h-4 text-slate-400" />
                <span>Copy link</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Media photo/carousel or video directly under header */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative overflow-hidden bg-black/90 w-full">
          {post.mediaType === 'video' || post.videoUrl || (post.mediaUrls[0] && (post.mediaUrls[0].endsWith('.mp4') || post.mediaUrls[0].includes('mixkit'))) ? (
            <video
              src={post.videoUrl || post.mediaUrls[0]}
              poster={post.mediaUrls[0]}
              controls
              playsInline
              loop
              className="w-full max-h-[580px] object-cover bg-black"
            />
          ) : (
            <div onClick={() => navigate(`/post/${post.id}`)} className="cursor-pointer">
              <img
                src={post.mediaUrls[0]}
                alt="Post media"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full max-h-[580px] object-cover transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          )}

          {post.mediaUrls.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm pointer-events-none">
              <Layers className="w-3.5 h-3.5" />
              <span>1/{post.mediaUrls.length}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Action toolbar directly under media */}
      <div className="px-3.5 pt-3 pb-1 flex items-center justify-between text-slate-900 dark:text-white">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            onClick={() => toggleLikePost(post.id)}
            className="transition-transform active:scale-125"
            aria-label="Like post"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                post.isLiked
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-slate-900 dark:text-white stroke-[2px] hover:text-rose-500'
              }`}
            />
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-slate-900 dark:text-white hover:text-[#7667FF] transition-colors"
            aria-label="Comment"
          >
            <MessageCircle className="w-6 h-6 stroke-[2px]" />
          </button>

          {/* Share Airplane */}
          <button
            onClick={() => setSharePostData(post)}
            className="text-slate-900 dark:text-white hover:text-[#7667FF] transition-colors -rotate-12"
            aria-label="Share"
          >
            <Send className="w-5 h-5 stroke-[2px]" />
          </button>
        </div>

        {/* Save Bookmark */}
        <button
          onClick={() => toggleSavePost(post.id)}
          className="hover:text-[#7667FF] transition-colors"
          aria-label="Save"
        >
          <Bookmark
            className={`w-6 h-6 ${
              post.isSaved
                ? 'fill-slate-900 text-slate-900 dark:fill-white dark:text-white'
                : 'stroke-[2px]'
            }`}
          />
        </button>
      </div>

      {/* 4. Likes Count text matching Instagram */}
      <div className="px-3.5 py-1">
        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          {post.likesCount.toLocaleString()} likes
        </span>
      </div>

      {/* 5. Author Caption */}
      <div className="px-3.5 pb-1 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed">
        <span
          onClick={() => navigate(`/profile/${post.authorUsername}`)}
          className="font-bold mr-1.5 cursor-pointer hover:underline"
        >
          {post.authorUsername}
        </span>
        <span className="text-slate-800 dark:text-slate-200">{post.content}</span>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1 text-xs font-semibold text-[#7667FF] dark:text-[#A78BFA]">
            {post.tags.map((tag) => (
              <span
                key={tag}
                onClick={() => navigate(`/explore?q=${encodeURIComponent(tag)}`)}
                className="cursor-pointer hover:underline"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 6. View all comments line */}
      <div className="px-3.5 py-1">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        >
          View all {post.commentsCount} comments
        </button>
      </div>

      {/* 7. Timestamp */}
      <div className="px-3.5 pb-2 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
        {post.timestamp}
      </div>

      {/* 8. Expandable Comments list */}
      {showComments && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 p-3.5 bg-slate-50/50 dark:bg-slate-900/40 space-y-2.5 animate-in fade-in duration-150">
          <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
            {postComments.map((comment) => (
              <div key={comment.id} className="flex items-start justify-between gap-2 text-xs group/c">
                <div className="flex items-start gap-2 min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white shrink-0">
                    {comment.userUsername || comment.userName}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 break-words">
                    {comment.text}
                  </span>
                </div>

                {comment.userId === currentUser.id && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="opacity-0 group-hover/c:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Inline comment submission form */}
      <form
        onSubmit={handleCommentSubmit}
        className="px-3.5 py-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => setCommentInput((prev) => prev + ' ❤️')}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Heart emoji"
        >
          <Smile className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!commentInput.trim()}
          className="text-xs font-bold text-[#7667FF] dark:text-[#A78BFA] disabled:opacity-30 hover:underline"
        >
          Post
        </button>
      </form>
    </article>
  );
};
