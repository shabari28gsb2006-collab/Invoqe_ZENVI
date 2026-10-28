import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoryViewerModal: React.FC = () => {
  const { activeStory, setActiveStory, stories } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!activeStory) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleNext();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory]);

  if (!activeStory) return null;

  const currentIndex = stories.findIndex((s) => s.id === activeStory.id);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setActiveStory(stories[currentIndex + 1]);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveStory(stories[currentIndex - 1]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <button
        onClick={() => setActiveStory(null)}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
        aria-label="Close story"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Mobile/Card Container */}
      <div className="relative w-full max-w-sm h-[80vh] max-h-[680px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Progress Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
          <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Story Header */}
        <div className="relative z-20 p-4 pt-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <img
              src={activeStory.userAvatar}
              alt={activeStory.userName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50"
            />
            <div>
              <p className="text-sm font-bold text-white drop-shadow-sm leading-tight">
                {activeStory.userName}
              </p>
              <p className="text-xs text-white/70">{activeStory.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Media Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeStory.mediaUrl}
            alt="Story media"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>

        {/* Tap areas for next/prev on mobile */}
        <div className="absolute inset-y-16 left-0 w-1/3 z-10" onClick={handlePrev} />
        <div className="absolute inset-y-16 right-0 w-1/3 z-10" onClick={handleNext} />

        {/* Footer simulation */}
        <div className="relative z-20 p-4 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Reply to ${activeStory.userName.split(' ')[0]}...`}
            className="flex-1 px-4 py-2 text-xs rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};
