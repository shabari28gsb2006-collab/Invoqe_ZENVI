import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Trash2, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HighlightViewerModal: React.FC = () => {
  const { activeHighlight, setActiveHighlight, deleteHighlight, currentUser } = useApp();
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const items = activeHighlight?.items && activeHighlight.items.length > 0
    ? activeHighlight.items
    : activeHighlight
    ? [{ id: '1', mediaUrl: activeHighlight.coverImage, type: 'post' as const, title: activeHighlight.title }]
    : [];

  useEffect(() => {
    if (!activeHighlight) {
      setItemIndex(0);
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
        return prev + 2.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeHighlight, itemIndex]);

  if (!activeHighlight || items.length === 0) return null;

  const currentItem = items[itemIndex] || items[0];

  const handleNext = () => {
    if (itemIndex < items.length - 1) {
      setItemIndex((prev) => prev + 1);
    } else {
      setActiveHighlight(null);
    }
  };

  const handlePrev = () => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
    }
  };

  const handleDelete = () => {
    deleteHighlight(activeHighlight.id);
    setActiveHighlight(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={() => setActiveHighlight(null)}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-30"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {itemIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-30"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {itemIndex < items.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-30"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Card Player Container */}
      <div className="relative w-full max-w-sm h-[82vh] max-h-[720px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Progress bars for each item in highlight */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
          {items.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: idx === itemIndex ? `${progress}%` : idx < itemIndex ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header */}
        <div className="relative z-20 p-4 pt-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/50"
            />
            <div>
              <p className="text-sm font-bold text-white drop-shadow-sm leading-tight">
                {activeHighlight.title}
              </p>
              <p className="text-xs text-white/70">
                {currentItem.type.toUpperCase()} · Highlight
              </p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="p-1.5 text-white/70 hover:text-rose-400 transition-colors"
            title="Delete this highlight"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Media Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentItem.mediaUrl}
            alt="Highlight media"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Mobile touch tap zones */}
        <div className="absolute inset-y-16 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-16 right-0 w-1/3 z-10 cursor-pointer" onClick={handleNext} />

        {/* Footer info */}
        <div className="relative z-20 p-4 flex items-center justify-between text-white">
          <span className="text-xs text-white/90 font-medium drop-shadow-sm">
            {currentItem.title || activeHighlight.title}
          </span>
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full text-xs">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Highlight</span>
          </div>
        </div>
      </div>
    </div>
  );
};
