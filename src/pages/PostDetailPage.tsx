import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Send,
  Trash2,
  MoreHorizontal,
  Link,
  Edit,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    posts,
    currentUser,
    toggleLikePost,
    toggleSavePost,
    addComment,
    deleteComment,
    comments,
    setEditingPost,
    setDeletingPostId,
    setSharePostData,
    showToast,
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Post not found</h2>
        <p className="text-xs text-slate-500">The moment you are looking for may have been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7667FF] text-white"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isAuthor = post.authorId === currentUser.id;
  const postComments = comments.filter((c) => c.postId === post.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Post link copied to clipboard');
    }
    setMenuOpen(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 py-5 space-y-5">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#7667FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-semibold text-slate-400">Post Details</span>
      </div>

      <div className="bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div
            onClick={() => navigate(`/profile/${post.authorUsername}`)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#7667FF]/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#7667FF] transition-colors">
                  {post.authorName}
                </span>
                {post.authorVerified && (
                  <VerifiedBadge className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>@{post.authorUsername}</span>
                <span>·</span>
                <span>{post.timestamp}</span>
                {post.location && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {post.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-[#151D33] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-30">
                {isAuthor && (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setEditingPost(post);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit post</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setDeletingPostId(post.id);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete post</span>
                    </button>
                  </>
                )}
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Copy link</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Text */}
        <div className="p-4 sm:p-6 space-y-3">
          <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#7667FF]">
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

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="space-y-2 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
            {post.mediaUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Post attachment"
                className="w-full max-h-[600px] object-cover"
              />
            ))}
          </div>
        )}

        {/* Interaction Toolbar */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-5">
            <button
              onClick={() => toggleLikePost(post.id)}
              className={`flex items-center gap-1.5 transition-colors ${
                post.isLiked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  post.isLiked ? 'fill-rose-500 stroke-rose-500' : 'stroke-[1.8px]'
                }`}
              />
              <span className="font-mono tabular-nums">{post.likesCount} Likes</span>
            </button>

            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-5 h-5 stroke-[1.8px]" />
              <span className="font-mono tabular-nums">{post.commentsCount} Comments</span>
            </div>

            <button
              onClick={() => setSharePostData(post)}
              className="flex items-center gap-1.5 hover:text-[#7667FF] transition-colors"
            >
              <Share2 className="w-5 h-5 stroke-[1.8px]" />
              <span className="font-mono tabular-nums">{post.sharesCount} Shares</span>
            </button>
          </div>

          <button
            onClick={() => toggleSavePost(post.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              post.isSaved ? 'text-[#7667FF]' : 'hover:text-[#7667FF]'
            }`}
          >
            <Bookmark
              className={`w-5 h-5 ${
                post.isSaved ? 'fill-[#7667FF] stroke-[#7667FF]' : 'stroke-[1.8px]'
              }`}
            />
          </button>
        </div>

        {/* Comments Section */}
        <div className="p-4 sm:p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Discussion ({postComments.length})
          </h3>

          {/* New Comment Box */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a constructive response..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-[#7667FF] text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#7667FF] hover:bg-[#6352ff] disabled:opacity-40 rounded-xl transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comment list */}
          <div className="space-y-4 pt-2">
            {postComments.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3">
                  <img
                    src={c.userAvatar}
                    alt={c.userName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {c.userName}
                      </span>
                      <span className="text-[11px] text-slate-400">@{c.userUsername}</span>
                      <span className="text-[10px] text-slate-400">· {c.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                </div>

                {c.userId === currentUser.id && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1.5 transition-opacity"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
