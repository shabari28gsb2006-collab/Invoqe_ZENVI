import React from 'react';
import { Image, MapPin, Smile, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatePostComposer: React.FC = () => {
  const { currentUser, setCreatePostModalOpen } = useApp();

  return (
    <div
      onClick={() => setCreatePostModalOpen(true)}
      className="bg-white/80 dark:bg-[#12182B]/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm hover:border-[#7667FF]/40 transition-all cursor-pointer backdrop-blur-sm group"
    >
      <div className="flex items-center gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#7667FF]/20"
        />
        <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
          What is inspiring you today, {currentUser.name.split(' ')[0]}?
        </div>
        <button
          type="button"
          className="p-2.5 rounded-xl bg-[#7667FF] text-white hover:bg-[#6352ff] transition-transform active:scale-95 shrink-0 shadow-sm shadow-[#7667FF]/30"
          aria-label="New post"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
        <button
          type="button"
          className="flex items-center gap-2 hover:text-[#7667FF] transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Image className="w-4 h-4 text-emerald-500" />
          <span>Photo / Video</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 hover:text-[#7667FF] transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Location</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 hover:text-[#7667FF] transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Smile className="w-4 h-4 text-amber-500" />
          <span>Feeling / Activity</span>
        </button>
      </div>
    </div>
  );
};
