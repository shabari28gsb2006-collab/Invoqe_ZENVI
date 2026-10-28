export type ThemeMode = 'system' | 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  website?: string;
  location?: string;
  profession?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isVerified?: boolean;
  joinedDate?: string;
  highlights?: StoryHighlight[];
}

export interface HighlightItem {
  id: string;
  mediaUrl: string;
  type: 'story' | 'post' | 'reel';
  title?: string;
}

export interface StoryHighlight {
  id: string;
  title: string;
  coverImage: string;
  items?: HighlightItem[];
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  mediaUrl: string;
  timestamp: string;
  hasViewed?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorVerified?: boolean;
  content: string;
  mediaUrls: string[];
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'reel';
  filter?: string;
  location?: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  tags?: string[];
  audience?: 'everyone' | 'followers' | 'close_friends';
}

export interface Reel {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  caption: string;
  audioTrack: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
  messages: Message[];
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'reel_like';

export interface NotificationItem {
  id: string;
  userId?: string;
  type: NotificationType;
  actorId: string;
  actorName: string;
  actorUsername: string;
  actorAvatar: string;
  postId?: string;
  postThumbnail?: string;
  targetPreview?: string;
  commentText?: string;
  text?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Community {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  description: string;
  membersCount: number;
  isJoined: boolean;
  category: string;
  postsCount: number;
}

export interface TrendingHashtag {
  tag: string;
  category: string;
  postsCount: string;
}

export interface UserSettings {
  account: {
    displayName: string;
    username: string;
    email: string;
    phone: string;
    bio: string;
    website: string;
    location: string;
    gender: string;
  };
  privacy: {
    isPrivateAccount: boolean;
    showActivityStatus: boolean;
    allowTagging: 'everyone' | 'following' | 'no_one';
    readReceipts: boolean;
  };
  notifications: {
    pushLikes: boolean;
    pushComments: boolean;
    pushFollowers: boolean;
    pushMessages: boolean;
    pushStories: boolean;
    emailDigests: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}
