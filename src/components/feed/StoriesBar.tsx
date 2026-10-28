import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';

export const StoriesBar: React.FC = () => {
  const { stories, currentUser, setActiveStory, addStory, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStoryClick = () => {
    // Fast mock photo selector or file upload
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      addStory(objectUrl);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#12182B]/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-3.5 backdrop-blur-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
        {/* Current User: Add Story */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group" onClick={handleAddStoryClick}>
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] bg-slate-200 dark:bg-slate-700 group-hover:scale-105 transition-transform">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#7667FF] text-white flex items-center justify-center ring-2 ring-white dark:ring-[#12182B] shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[64px]">
            Your story
          </span>
        </div>

        {/* Stories list */}
        {stories.map((story) => {
          const hasViewed = story.hasViewed;
          return (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div
                className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                  hasViewed
                    ? 'bg-slate-300 dark:bg-slate-700'
                    : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                }`}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-[#12182B]">
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[68px]">
                {story.userName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
