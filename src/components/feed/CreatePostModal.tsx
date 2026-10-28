import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Video,
  MapPin,
  Tag,
  Globe,
  Users,
  Plus,
  Trash2,
  Film,
  PlusSquare,
  Music,
  Sliders,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreatePostModal: React.FC = () => {
  const {
    isCreatePostModalOpen,
    setCreatePostModalOpen,
    currentUser,
    createPost,
    createReel,
    addStory,
    uploadFile,
    showToast,
  } = useApp();

  const [creationType, setCreationType] = useState<'post' | 'reel' | 'story'>('post');
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<('image' | 'video')[]>([]);
  const [location, setLocation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['zenvi']);
  const [audioTrack, setAudioTrack] = useState('Nee Singam Dhan · AR Rahman');
  const [audience, setAudience] = useState<'everyone' | 'followers' | 'close_friends'>('everyone');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCreatePostModalOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        showToast('Please select valid image or video files', 'error');
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      setMediaUrls((prev) => [...prev, previewUrl].slice(0, 4));
      const fileType: 'image' | 'video' = isVideo ? 'video' : 'image';
      setMediaTypes((prev) => [...prev, fileType].slice(0, 4));

      if (isVideo && creationType === 'post') {
        setCreationType('reel');
      }

      // Upload to backend storage
      setIsUploading(true);
      try {
        const serverUrl = await uploadFile(file);
        setMediaUrls((prev) => prev.map((u) => (u === previewUrl ? serverUrl : u)));
      } catch (err) {
        console.warn('Backend file upload fallback:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
    setMediaTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags((prev) => [...prev, clean]);
      }
      setTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) {
      showToast('Please add text or media to share', 'error');
      return;
    }

    const firstIsVideo = mediaTypes[0] === 'video';
    const mainMedia = mediaUrls[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

    if (creationType === 'reel') {
      createReel({
        mediaUrl: mainMedia,
        caption: content.trim() || 'New Reel ✨',
        audioTrack,
        tags,
        mediaType: firstIsVideo ? 'video' : 'image',
        videoUrl: firstIsVideo ? mainMedia : undefined,
      });
    } else if (creationType === 'story') {
      addStory(mainMedia);
    } else {
      createPost({
        content,
        mediaUrls,
        mediaType: firstIsVideo ? 'video' : 'image',
        videoUrl: firstIsVideo ? mainMedia : undefined,
        location: location.trim() || undefined,
        tags,
        audience,
      });
    }

    // Reset & Close
    setContent('');
    setMediaUrls([]);
    setMediaTypes([]);
    setLocation('');
    setTags(['zenvi']);
    setCreatePostModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#12182B] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <PlusSquare className="w-5 h-5 text-[#7667FF]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Create New Moment</h2>
          </div>
          <button
            onClick={() => setCreatePostModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3 pb-2 flex justify-center border-b border-slate-100 dark:border-slate-800/80">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setCreationType('post')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                creationType === 'post'
                  ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Feed Post
            </button>
            <button
              type="button"
              onClick={() => setCreationType('reel')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                creationType === 'reel'
                  ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Reel Video
            </button>
            <button
              type="button"
              onClick={() => setCreationType('story')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                creationType === 'story'
                  ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Story
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* User & Audience */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#7667FF]/30"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-400">@{currentUser.username}</p>
              </div>
            </div>

            {/* Audience Picker */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setAudience('everyone')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  audience === 'everyone'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#7667FF]" />
                <span>Public</span>
              </button>
              <button
                type="button"
                onClick={() => setAudience('followers')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  audience === 'followers'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Caption */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              creationType === 'reel'
                ? 'Write a caption for your Reel...'
                : 'Share a thought, creative update, or story...'
            }
            rows={3}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#7667FF] text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none"
          />

          {/* Media Previews (Supports Videos & Images) */}
          {mediaUrls.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Attached Media ({mediaUrls.length}/4)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {mediaUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl overflow-hidden group aspect-video bg-black"
                  >
                    {mediaTypes[i] === 'video' ? (
                      <video src={url} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                    )}

                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Upload Call to Action */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-[#7667FF] cursor-pointer text-center space-y-2 transition-all bg-slate-50/50 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-center gap-3 text-slate-400">
                <ImageIcon className="w-6 h-6 text-emerald-500" />
                <Video className="w-6 h-6 text-pink-500" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upload Photos or Videos
              </p>
              <p className="text-[11px] text-slate-400">Tap to select from your device</p>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* Audio Track Selector (when in Reel mode) */}
          {creationType === 'reel' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-pink-500" />
                <span>Audio Track</span>
              </label>
              <select
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="Nee Singam Dhan · AR Rahman">Nee Singam Dhan · A.R. Rahman</option>
                <option value="Hukum · Anirudh">Hukum · Anirudh Ravichander</option>
                <option value="Ambient Horizons · Tycho">Ambient Horizons · Tycho</option>
                <option value="Original Audio · Gokul">Original Audio · Gokul Shabari</option>
              </select>
            </div>
          )}

          {/* Location field */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (e.g. Varkala Beach, Chennai)"
              className="w-full text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          {/* Hashtags field */}
          <div className="space-y-1.5">
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
                placeholder="Add hashtag & press Enter"
                className="w-full text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="text-xs font-semibold text-[#7667FF] px-2"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] bg-[#7667FF]/10 text-[#7667FF] font-medium"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((item) => item !== t))}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCreatePostModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#7667FF] hover:bg-[#6352ff] rounded-xl transition-all shadow-md shadow-[#7667FF]/30 active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[2.5px]" />
            <span>Publish {creationType === 'reel' ? 'Reel' : creationType === 'story' ? 'Story' : 'Post'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
