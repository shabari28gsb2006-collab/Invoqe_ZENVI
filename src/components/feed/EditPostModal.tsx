import React, { useState, useEffect } from 'react';
import { X, MapPin, Tag, Trash2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EditPostModal: React.FC = () => {
  const { editingPost, setEditingPost, updatePost, showToast } = useApp();

  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content);
      setMediaUrls(editingPost.mediaUrls || []);
      setLocation(editingPost.location || '');
      setTags(editingPost.tags || []);
    }
  }, [editingPost]);

  if (!editingPost) return null;

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags((prev) => [...prev, clean]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((item) => item !== t));
  };

  const removeImage = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) {
      showToast('Post cannot be empty', 'error');
      return;
    }

    updatePost(editingPost.id, {
      content,
      mediaUrls,
      location: location.trim() || undefined,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Edit Post</h2>
          <button
            onClick={() => setEditingPost(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#7667FF] text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none"
          />

          {mediaUrls.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs text-slate-500">Media</span>
              <div className="grid grid-cols-2 gap-2">
                {mediaUrls.map((url, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                    <img src={url} alt={`Media ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <Tag className="w-4 h-4 text-[#7667FF] shrink-0" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="w-full text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="text-xs font-semibold text-[#7667FF] shrink-0 px-2"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#7667FF]/10 text-[#7667FF]"
                  >
                    #{t}
                    <button type="button" onClick={() => removeTag(t)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setEditingPost(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#7667FF] hover:bg-[#6352ff] rounded-xl transition-colors shadow-sm"
          >
            Update Post
          </button>
        </div>
      </div>
    </div>
  );
};
