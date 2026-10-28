import React, { useState } from 'react';
import { X, Check, Image as ImageIcon, Film, Clock, Bookmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HighlightItem } from '../../types';

export const CreateHighlightModal: React.FC = () => {
  const {
    isCreateHighlightModalOpen,
    setCreateHighlightModalOpen,
    posts,
    stories,
    reels,
    currentUser,
    createHighlight,
    showToast,
  } = useApp();

  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'stories' | 'posts' | 'reels'>('stories');
  const [selectedItems, setSelectedItems] = useState<HighlightItem[]>([]);
  const [selectedCover, setSelectedCover] = useState<string>('');

  if (!isCreateHighlightModalOpen) return null;

  // Curate available media items for the user
  const userStories = stories.filter((s) => s.userId === currentUser.id || s.userId === 'user_current');
  const allStoriesPool = userStories.length > 0 ? userStories : stories;
  const userPosts = posts.filter((p) => p.authorId === currentUser.id || p.authorId === 'user_current');
  const allPostsPool = userPosts.length > 0 ? userPosts : posts;
  const userReels = reels.filter((r) => r.creatorId === currentUser.id || r.creatorId === 'user_current');
  const allReelsPool = userReels.length > 0 ? userReels : reels;

  const toggleSelectItem = (item: HighlightItem) => {
    const exists = selectedItems.some((i) => i.id === item.id);
    if (exists) {
      setSelectedItems((prev) => prev.filter((i) => i.id !== item.id));
      if (selectedCover === item.mediaUrl) {
        setSelectedCover('');
      }
    } else {
      setSelectedItems((prev) => [...prev, item]);
      if (!selectedCover) {
        setSelectedCover(item.mediaUrl);
      }
    }
  };

  const isItemSelected = (id: string) => selectedItems.some((i) => i.id === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a highlight title', 'error');
      return;
    }
    if (selectedItems.length === 0) {
      showToast('Please select at least one story, post, or reel', 'error');
      return;
    }

    const cover = selectedCover || selectedItems[0]?.mediaUrl || currentUser.avatar;
    createHighlight(title.trim(), cover, selectedItems);

    // Reset
    setTitle('');
    setSelectedItems([]);
    setSelectedCover('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#12182B] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#7667FF]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              New Highlight
            </h2>
          </div>
          <button
            onClick={() => setCreateHighlightModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Cover & Title Row */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#7667FF] via-[#A78BFA] to-pink-500 overflow-hidden shadow-sm">
                <img
                  src={selectedCover || currentUser.avatar}
                  alt="Highlight Cover"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-[10px] text-center block text-slate-400 mt-1">Cover</span>
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Highlight Name
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vibes ✨, Travel ✈️, Match Day"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#7667FF] text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Section: Select from Stories, Posts, or Reels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose Content ({selectedItems.length} selected)
              </span>
            </div>

            {/* Source Selection Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('stories')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'stories'
                    ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Stories</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('posts')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'posts'
                    ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Posts</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reels')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'reels'
                    ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Reels</span>
              </button>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 no-scrollbar">
              {activeTab === 'stories' &&
                allStoriesPool.map((s) => {
                  const selected = isItemSelected(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() =>
                        toggleSelectItem({
                          id: s.id,
                          mediaUrl: s.mediaUrl,
                          type: 'story',
                          title: s.userName,
                        })
                      }
                      className={`relative aspect-[9/14] rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        selected
                          ? 'border-[#7667FF] ring-2 ring-[#7667FF]/30'
                          : 'border-transparent hover:opacity-90'
                      }`}
                    >
                      <img src={s.mediaUrl} alt="Story" className="w-full h-full object-cover" />
                      <div
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          selected
                            ? 'bg-[#7667FF] border-[#7667FF] text-white'
                            : 'bg-black/40 border-white/80'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                    </div>
                  );
                })}

              {activeTab === 'posts' &&
                allPostsPool.map((p) => {
                  const media = p.mediaUrls[0] || currentUser.avatar;
                  const selected = isItemSelected(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() =>
                        toggleSelectItem({
                          id: p.id,
                          mediaUrl: media,
                          type: 'post',
                          title: p.content.slice(0, 30),
                        })
                      }
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selected
                          ? 'border-[#7667FF] ring-2 ring-[#7667FF]/30'
                          : 'border-transparent hover:opacity-90'
                      }`}
                    >
                      <img src={media} alt="Post" className="w-full h-full object-cover" />
                      <div
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          selected
                            ? 'bg-[#7667FF] border-[#7667FF] text-white'
                            : 'bg-black/40 border-white/80'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                    </div>
                  );
                })}

              {activeTab === 'reels' &&
                allReelsPool.map((r) => {
                  const selected = isItemSelected(r.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() =>
                        toggleSelectItem({
                          id: r.id,
                          mediaUrl: r.mediaUrl,
                          type: 'reel',
                          title: r.caption.slice(0, 30),
                        })
                      }
                      className={`relative aspect-[9/14] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selected
                          ? 'border-[#7667FF] ring-2 ring-[#7667FF]/30'
                          : 'border-transparent hover:opacity-90'
                      }`}
                    >
                      <img src={r.mediaUrl} alt="Reel" className="w-full h-full object-cover" />
                      <div
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          selected
                            ? 'bg-[#7667FF] border-[#7667FF] text-white'
                            : 'bg-black/40 border-white/80'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCreateHighlightModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || selectedItems.length === 0}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#7667FF] hover:bg-[#6352ff] disabled:opacity-40 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Add to Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
