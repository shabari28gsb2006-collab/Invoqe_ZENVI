import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Image as ImageIcon,
  Video,
  MapPin,
  Tag,
  Globe,
  Users,
  Plus,
  Trash2,
  Check,
  Film,
  PenSquare,
  Clock,
  Music,
  Smile,
  Layers,
  UploadCloud,
  Play,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type CreationType = 'post' | 'reel' | 'story';
type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, createPost, createReel, addStory, uploadFile, showToast } = useApp();

  const [creationType, setCreationType] = useState<CreationType>('post');
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<('image' | 'video')[]>([]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [location, setLocation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['zenvi']);
  const [audioTrack, setAudioTrack] = useState('Nee Singam Dhan · AR Rahman');
  const [audience, setAudience] = useState<'everyone' | 'followers' | 'close_friends'>('everyone');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { id: 'none', name: 'Normal', css: '' },
    { id: 'vivid', name: 'Vivid', css: 'saturate-150 contrast-105' },
    { id: 'warm', name: 'Sunset Warm', css: 'sepia-25 hue-rotate-[-10deg] contrast-105' },
    { id: 'cinematic', name: 'Cinematic', css: 'contrast-125 brightness-95 saturate-110' },
    { id: 'mono', name: 'Noir Mono', css: 'grayscale contrast-125' },
  ];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        showToast('Please select valid image or video files (PNG, JPG, MP4, WebM)', 'error');
        continue;
      }

      if (file.size > 100 * 1024 * 1024) {
        showToast('File size exceeds 100MB limit', 'error');
        continue;
      }

      const objectUrl = URL.createObjectURL(file);
      setMediaUrls((prev) => [...prev, objectUrl].slice(0, 5));
      const fileType: 'image' | 'video' = isVideo ? 'video' : 'image';
      setMediaTypes((prev) => [...prev, fileType].slice(0, 5));

      if (isVideo && creationType === 'post') {
        setCreationType('reel');
        setAspectRatio('9:16');
      }

      // Upload to server storage
      setIsUploading(true);
      try {
        const serverUrl = await uploadFile(file);
        setMediaUrls((prev) => prev.map((u) => (u === objectUrl ? serverUrl : u)));
      } catch (err) {
        console.warn('Backend file upload fallback:', err);
      } finally {
        setIsUploading(false);
      }
    }

    showToast(`Media ready for post`);
  };

  const handleAddSample = (url: string, type: 'image' | 'video' = 'image') => {
    setMediaUrls((prev) => [...prev, url].slice(0, 5));
    setMediaTypes((prev) => [...prev, type].slice(0, 5));
    if (type === 'video') {
      setCreationType('reel');
      setAspectRatio('9:16');
    }
  };

  const removeMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
    setMediaTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (t?: string) => {
    const clean = (t || tagInput).trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags((prev) => [...prev, clean]);
    }
    setTagInput('');
  };

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((item) => item !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) {
      showToast('Please upload media or write a caption before publishing', 'error');
      return;
    }

    const firstIsVideo = mediaTypes[0] === 'video';
    const mainMedia = mediaUrls[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

    if (creationType === 'reel') {
      createReel({
        mediaUrl: mainMedia,
        caption: content.trim() || 'New moment on ZENVI ✨',
        audioTrack,
        tags,
        mediaType: firstIsVideo ? 'video' : 'image',
        videoUrl: firstIsVideo ? mainMedia : undefined,
      });
      navigate('/reels');
      return;
    }

    if (creationType === 'story') {
      addStory(mainMedia);
      navigate('/');
      return;
    }

    // Default: Feed Post
    createPost({
      content,
      mediaUrls,
      mediaType: firstIsVideo ? 'video' : 'image',
      videoUrl: firstIsVideo ? mainMedia : undefined,
      location: location.trim() || undefined,
      tags,
      audience,
      filter: selectedFilter,
    });

    navigate('/');
  };

  const activeFilterClass = filters.find((f) => f.id === selectedFilter)?.css || '';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/70 dark:border-slate-800/80">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#7667FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PenSquare className="w-4 h-4 text-[#7667FF]" />
          <span>Creator Studio</span>
        </h1>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-[#7667FF] hover:bg-[#6352ff] text-white text-xs font-bold transition-all shadow-md shadow-[#7667FF]/25 flex items-center gap-1.5"
        >
          <Check className="w-4 h-4 stroke-[2.5px]" />
          <span>Share</span>
        </button>
      </div>

      {/* Creation Mode Tabs: Post | Reel | Story */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => {
              setCreationType('post');
              if (aspectRatio === '9:16') setAspectRatio('1:1');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              creationType === 'post'
                ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#7667FF]" />
            <span>Feed Post</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCreationType('reel');
              setAspectRatio('9:16');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              creationType === 'reel'
                ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Film className="w-4 h-4 text-pink-500" />
            <span>Reel Video</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCreationType('story');
              setAspectRatio('9:16');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              creationType === 'story'
                ? 'bg-white dark:bg-[#12182B] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Story</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid (Left: Preview & Upload; Right: Caption & Metadata) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Media Stage (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Media Preview Canvas */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`relative rounded-3xl overflow-hidden bg-slate-900 border-2 transition-all flex items-center justify-center ${
              isDragging ? 'border-[#7667FF] bg-[#7667FF]/5' : 'border-slate-200/80 dark:border-slate-800'
            } ${
              aspectRatio === '1:1'
                ? 'aspect-square max-h-[500px]'
                : aspectRatio === '4:5'
                ? 'aspect-[4/5] max-h-[520px]'
                : aspectRatio === '16:9'
                ? 'aspect-video'
                : 'aspect-[9/16] max-h-[540px]'
            }`}
          >
            {mediaUrls.length > 0 ? (
              <div className="w-full h-full relative group">
                {mediaTypes[0] === 'video' ? (
                  <video
                    src={mediaUrls[0]}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className={`w-full h-full object-cover ${activeFilterClass}`}
                  />
                ) : (
                  <img
                    src={mediaUrls[0]}
                    alt="Preview"
                    className={`w-full h-full object-cover transition-all ${activeFilterClass}`}
                  />
                )}

                {/* Aspect Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm pointer-events-none">
                  <span>{aspectRatio}</span>
                  {mediaTypes[0] === 'video' && <Video className="w-3 h-3 text-pink-400" />}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeMedia(0)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-rose-600 text-white transition-colors shadow-md"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Empty Dropzone State */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 text-center space-y-4 cursor-pointer text-slate-400 hover:text-[#7667FF] transition-colors"
              >
                <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-800/80 flex items-center justify-center text-[#7667FF]">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Drag photos and videos here</p>
                  <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, MP4, WebM (up to 100MB)</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#7667FF] text-white text-xs font-semibold hover:bg-[#6352ff] transition-all"
                >
                  Select from device
                </button>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#12182B] border border-slate-200/80 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Aspect Ratio:</span>
            <div className="flex items-center gap-1">
              {(['1:1', '4:5', '16:9', '9:16'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    aspectRatio === ratio
                      ? 'bg-[#7667FF] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Presets */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#12182B] border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-[#7667FF]" />
              <span>Filter Presets</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                    selectedFilter === f.id
                      ? 'bg-[#7667FF] text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Presets Strip */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quick samples to test upload
            </span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {[
                { title: 'Ocean Waves (Video)', url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4', type: 'video' as const },
                { title: 'Breeze Tree (Video)', url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4', type: 'video' as const },
                { title: 'Sunset Cliff (Photo)', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', type: 'image' as const },
                { title: 'Himalayas (Photo)', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', type: 'image' as const },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSample(item.url, item.type)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-[#7667FF]/10 hover:text-[#7667FF] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Caption, Audio, Location, Hashtags (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#12182B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-5 shadow-xs">
          {/* Creator Profile & Audience */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[#7667FF]/30"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-400">@{currentUser.username}</p>
              </div>
            </div>

            {/* Audience */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setAudience('everyone')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  audience === 'everyone'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
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
                    : 'text-slate-500'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Caption Input with Quick Emoji Bar */}
          <div className="space-y-2">
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a caption or story description..."
              maxLength={2200}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#7667FF] text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {['✨', '🔥', '🌅', '🏏', '💻', '🚀', '❤️', '☕️', '⚡️'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setContent((prev) => prev + emoji)}
                    className="hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[11px]">{content.length}/2200</span>
            </div>
          </div>

          {/* Audio Track Selector (for Reels & Stories) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-pink-500" />
              <span>Audio Track</span>
            </label>
            <select
              value={audioTrack}
              onChange={(e) => setAudioTrack(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#7667FF]"
            >
              <option value="Nee Singam Dhan · AR Rahman">Nee Singam Dhan · A.R. Rahman (Tamil)</option>
              <option value="Hukum · Anirudh Ravichander">Hukum · Anirudh Ravichander (Alappara)</option>
              <option value="Ambient Chill · Tycho">Chasing Sunsets · Tycho Ambient</option>
              <option value="Original Audio · Gokul Shabari">Original Audio · Gokul Shabari Balaji</option>
              <option value="Lofi 4AM · Chillhop">Aesthetic Lofi Beats 4AM · Chillhop</option>
            </select>
          </div>

          {/* Location Field with Quick Suggestions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location (e.g. Varkala Beach)"
                className="w-full text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {['Chennai', 'Varkala Beach', 'Bengaluru', 'Mumbai', 'Tokyo'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-[#7667FF]"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Hashtags Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
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
                onClick={() => handleAddTag()}
                className="text-xs font-bold text-[#7667FF] px-2"
              >
                Add
              </button>
            </div>

            {/* Active Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs bg-[#7667FF]/10 text-[#7667FF] font-medium"
                  >
                    #{t}
                    <button type="button" onClick={() => removeTag(t)}>
                      <Trash2 className="w-3 h-3 text-rose-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 rounded-2xl bg-[#7667FF] hover:bg-[#6352ff] text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#7667FF]/30 active:scale-98 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5px]" />
              <span>
                Publish {creationType === 'reel' ? 'Reel' : creationType === 'story' ? 'Story' : 'Post'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
