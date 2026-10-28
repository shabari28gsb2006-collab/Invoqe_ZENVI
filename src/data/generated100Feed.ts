import { Post, Reel } from '../types';

// High-reliability verified image collection
export const verifiedImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
];

// Sample public MP4 video clips
export const sampleVideos = [
  'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-playing-a-video-game-41604-large.mp4',
];

const creators = [
  {
    id: 'user_current',
    name: 'Gokul Shabari Balaji 🇮🇳',
    username: 'shabari_28_gsb',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'user_1',
    name: 'Sneha Art',
    username: 'sneha_art',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'user_2',
    name: 'Rohan Kumar',
    username: 'rohan_kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    verified: false,
  },
  {
    id: 'user_3',
    name: 'Tech Bytes',
    username: 'tech.bytes',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'user_4',
    name: 'Ananya Das',
    username: 'ananya.das',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'user_5',
    name: 'Nature Hub',
    username: 'nature.hub',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'user_6',
    name: 'Food Diaries',
    username: 'food.diaries',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    verified: false,
  },
  {
    id: 'user_7',
    name: 'Travel Buddies',
    username: 'travel.mani',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    verified: false,
  },
  {
    id: 'user_8',
    name: 'Creative Soul',
    username: 'creative.soul',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd25218?auto=format&fit=crop&w=400&q=80',
    verified: false,
  },
  {
    id: 'user_priya',
    name: 'Priya Sharma',
    username: 'priya_sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'user_11',
    name: 'Aarav Sports',
    username: 'aarav_cricket',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    verified: true,
  },
  {
    id: 'user_12',
    name: 'Maya Lens',
    username: 'maya.streetphoto',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    verified: false,
  },
];

const postThemes = [
  {
    caption: 'Match day under the floodlights 🏏 Nothing beats the adrenaline rush of cricket season! Dedicated to the legend MS Dhoni. Attitude is everything! 🇮🇳⚡️',
    tags: ['cricket', 'dhoni', 'sports', 'matchday', 'passion'],
    location: 'Chepauk Stadium, Chennai',
  },
  {
    caption: 'Golden hour at Varkala Cliff 🌅 The ocean horizon reflecting pure peace. Take a breath and let the breeze wash away the week.',
    tags: ['sunsetvibes', 'varkala', 'kerala', 'ocean', 'peace'],
    location: 'Varkala Beach, Kerala',
  },
  {
    caption: 'New design system architecture complete! 💻 When typography, tactile motion, and clean dark mode come together effortlessly. Zenvi v2.0 is born.',
    tags: ['webdev', 'uiux', 'frontend', 'react', 'minimalist'],
    location: 'Design Studio, Bengaluru',
  },
  {
    caption: 'Sunday long run: 14km clocked through misty morning trails 🏃‍♂️ Early hours are when legends are shaped. Stay disciplined.',
    tags: ['fitness', 'running', 'discipline', 'training', 'healthy'],
    location: 'Ooty Hills, Tamil Nadu',
  },
  {
    caption: 'Authentic stone-oven sourdough pizza with fresh basil & stracciatella 🍕 Simple, artisanal ingredients executed with perfection.',
    tags: ['foodie', 'pizza', 'culinary', 'goodfood', 'italian'],
    location: 'Trattoria Romano, Rome',
  },
  {
    caption: 'Brutalist architecture in central Kyoto ⛩️ Concrete, water reflection, and evergreen moss. Minimalist harmony.',
    tags: ['architecture', 'kyoto', 'minimalism', 'design', 'japan'],
    location: 'Kyoto, Japan',
  },
  {
    caption: '35mm analogue street capture on the streets of Shinjuku 📸 Rain drenched neon reflections and quiet umbrellas.',
    tags: ['streetphotography', 'tokyo', 'filmwave', 'leica', 'neon'],
    location: 'Shinjuku, Tokyo',
  },
  {
    caption: 'Exploring high-altitude Himalayan passes at 4,400 meters 🏔️ The thinner the air, the clearer the thoughts.',
    tags: ['himalayas', 'travel', 'mountains', 'adventure', 'wanderlust'],
    location: 'Rohtang Pass, Manali',
  },
  {
    caption: 'Fresh espresso pour-over with notes of jasmine and wild berries ☕️ Morning ritual before entering deep flow state.',
    tags: ['coffee', 'pourover', 'morningroutine', 'aesthetic'],
    location: 'Blue Tokai, Mumbai',
  },
  {
    caption: 'Late night keyboard building session: lubed linear switches, custom brass plate & stealth keycaps ⌨️ Tactile bliss.',
    tags: ['mechanicalkeyboard', 'desksetup', 'tech', 'gadgets'],
    location: 'Desk Setup, Bengaluru',
  },
];

// Generate 100 Posts
export const generated100Posts: Post[] = Array.from({ length: 100 }).map((_, index) => {
  const creator = creators[index % creators.length];
  const theme = postThemes[index % postThemes.length];
  const imgIndex1 = (index * 2) % verifiedImages.length;
  const imgIndex2 = (index * 2 + 1) % verifiedImages.length;
  const hasMultiple = index % 3 === 0;
  const isVideo = index % 7 === 4;
  const videoSample = sampleVideos[index % sampleVideos.length];

  const hoursAgo = index < 10 ? `${index + 1}h ago` : index < 30 ? `${Math.floor(index / 3)}d ago` : `${Math.floor(index / 10)}w ago`;

  return {
    id: `post_${index + 1}`,
    authorId: creator.id,
    authorName: creator.name,
    authorUsername: creator.username,
    authorAvatar: creator.avatar,
    authorVerified: creator.verified,
    content: `${theme.caption} #${index + 1}`,
    mediaUrls: isVideo ? [verifiedImages[imgIndex1]] : hasMultiple ? [verifiedImages[imgIndex1], verifiedImages[imgIndex2]] : [verifiedImages[imgIndex1]],
    mediaType: isVideo ? 'video' : 'image',
    videoUrl: isVideo ? videoSample : undefined,
    location: theme.location,
    timestamp: hoursAgo,
    likesCount: 350 + (index * 247) % 18400,
    commentsCount: 14 + (index * 29) % 890,
    sharesCount: 8 + (index * 13) % 420,
    isLiked: index % 4 === 1,
    isSaved: index % 5 === 0,
    tags: theme.tags,
    audience: 'everyone',
  };
});

// Audio Tracks list for 100 Reels
const audioTracks = [
  'Nee Singam Dhan · A.R. Rahman (Tamil)',
  'Hukum · Anirudh Ravichander (Alappara)',
  'Chasing Sunsets · Tycho Ambient',
  'Tokyo Drift Chillwave · Phonk Beats',
  'Original Audio · Gokul Shabari Balaji',
  'Aesthetic Lofi Beats 4AM · Chillhop',
  'Interstellar Main Theme · Hans Zimmer',
  'Vibe of Tamil Nadu · Folk Fusion',
  'Nightcall · Kavinsky Synthwave',
  'Bones · Imagine Dragons High Energy',
];

const reelCaptions = [
  'Attitude is everything 🏏 MS Dhoni inspiration forever! Keep moving forward #sports #cricket',
  'Ocean waves at high tide 🌊 Best sunset spot in South India #travel #vibe #kerala',
  'Late night coding aesthetic 💻 Building ZENVI social web app #developer #react #frontend',
  'Gym motivation: Never skip leg day ⚡️ 180kg deadlift checkpoint #fitness #workout',
  'Artisan matcha latte art 🍵 Slow mornings in Kyoto #aesthetic #japan #coffeetime',
  'Cruising through mountain curves 🏔️ Drone aerial shot of Himachal #nature #wanderlust',
  'Street portrait with natural window lighting 📸 85mm f/1.4 lens #photography #portraits',
  'Sourdough baking time-lapse 🥖 That oven spring is so satisfying #baking #foodie',
  'Speed sketch on iPad Pro 🖌️ 30 minute digital illustration #digitalart #procreate',
  'Midnight city highway drive in the rain 🚗 Neon reflections #cyberpunk #cars #nightdrive',
];

// Generate 100 Reels
export const generated100Reels: Reel[] = Array.from({ length: 100 }).map((_, index) => {
  const creator = creators[(index + 3) % creators.length];
  const audio = audioTracks[index % audioTracks.length];
  const caption = reelCaptions[index % reelCaptions.length];
  const mediaImg = verifiedImages[(index * 3) % verifiedImages.length];
  const isVideo = index % 3 === 0;
  const videoSample = sampleVideos[index % sampleVideos.length];

  return {
    id: `reel_${index + 1}`,
    creatorId: creator.id,
    creatorName: creator.name,
    creatorUsername: creator.username,
    creatorAvatar: creator.avatar,
    mediaUrl: mediaImg,
    mediaType: isVideo ? 'video' : 'image',
    videoUrl: isVideo ? videoSample : undefined,
    caption: `${caption} [Moment #${index + 1}]`,
    audioTrack: audio,
    likesCount: 1200 + (index * 1380) % 95000,
    commentsCount: 45 + (index * 73) % 4200,
    sharesCount: 120 + (index * 190) % 18000,
    isLiked: index % 3 === 1,
    isSaved: index % 4 === 0,
    tags: ['zenvi', 'reels', 'viral', 'explore'],
  };
});
