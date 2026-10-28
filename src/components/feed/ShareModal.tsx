import React from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShareModal: React.FC = () => {
  const { sharePostData, setSharePostData, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!sharePostData) return null;

  const postUrl = `${window.location.origin}/post/${sharePostData.id}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${sharePostData.authorName} on ZENVI`,
          text: sharePostData.content,
          url: postUrl,
        });
        showToast('Shared successfully');
        setSharePostData(null);
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#7667FF]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Share Post</h3>
          </div>
          <button
            onClick={() => setSharePostData(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post preview snippet */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-semibold text-slate-900 dark:text-white">
            {sharePostData.authorName}{' '}
            <span className="font-normal text-slate-400">@{sharePostData.authorUsername}</span>
          </p>
          <p className="text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
            {sharePostData.content}
          </p>
        </div>

        {/* Copy Link input */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80">
          <input
            type="text"
            readOnly
            value={postUrl}
            className="flex-1 px-2 text-xs bg-transparent text-slate-600 dark:text-slate-300 focus:outline-none truncate"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#7667FF] text-white hover:bg-[#6352ff]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* External quick share targets */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-[#7667FF]/10 hover:text-[#7667FF] transition-colors"
          >
            <Share2 className="w-4 h-4 text-[#7667FF]" />
            <span>Device Share</span>
          </button>

          <button
            onClick={() => {
              showToast('Direct message sent to Priya Sharma');
              setSharePostData(null);
            }}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-[#7667FF]/10 hover:text-[#7667FF] transition-colors"
          >
            <Send className="w-4 h-4 text-sky-500" />
            <span>Send in Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
