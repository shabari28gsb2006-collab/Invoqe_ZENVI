import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Story,
  StoryHighlight,
  HighlightItem,
  Reel,
  Comment,
  Conversation,
  NotificationItem,
  Community,
  UserSettings,
} from '../types';
import {
  initialCurrentUser,
  initialUsers,
  initialPosts,
  initialStories,
  initialComments,
  initialReels,
  initialConversations,
  initialNotifications,
  initialCommunities,
  initialUserSettings,
} from '../data/mockData';
import { api, getAuthToken } from '../services/api';

export interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  stories: Story[];
  reels: Reel[];
  comments: Comment[];
  conversations: Conversation[];
  notifications: NotificationItem[];
  communities: Community[];
  settings: UserSettings;
  isAuthenticated: boolean;
  recentSearches: string[];
  toasts: ToastInfo[];

  // Modal triggers
  isCreatePostModalOpen: boolean;
  setCreatePostModalOpen: (open: boolean) => void;
  editingPost: Post | null;
  setEditingPost: (post: Post | null) => void;
  deletingPostId: string | null;
  setDeletingPostId: (postId: string | null) => void;
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
  activeHighlight: StoryHighlight | null;
  setActiveHighlight: (hl: StoryHighlight | null) => void;
  isCreateHighlightModalOpen: boolean;
  setCreateHighlightModalOpen: (open: boolean) => void;
  sharePostData: Post | null;
  setSharePostData: (post: Post | null) => void;
  appearanceModalOpen: boolean;
  setAppearanceModalOpen: (open: boolean) => void;
  isRecentFriendsOpen: boolean;
  setRecentFriendsOpen: (open: boolean) => void;

  // Actions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
  createPost: (data: {
    content: string;
    mediaUrls: string[];
    location?: string;
    tags?: string[];
    audience?: 'everyone' | 'followers' | 'close_friends';
    mediaType?: 'image' | 'video';
    videoUrl?: string;
    aspectRatio?: 'square' | 'portrait' | 'landscape' | 'reel';
    filter?: string;
  }) => void;
  createReel: (data: {
    mediaUrl: string;
    caption: string;
    audioTrack?: string;
    tags?: string[];
    mediaType?: 'image' | 'video';
    videoUrl?: string;
  }) => void;
  updatePost: (postId: string, data: { content: string; mediaUrls: string[]; location?: string; tags?: string[] }) => void;
  deletePost: (postId: string) => void;
  toggleFollowUser: (userId: string) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  createHighlight: (title: string, coverImage: string, items: HighlightItem[]) => void;
  deleteHighlight: (highlightId: string) => void;
  toggleJoinCommunity: (communityId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  markConversationAsRead: (conversationId: string) => void;
  markAllMessagesAsRead: () => void;
  addStory: (mediaUrl: string) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  updateSettings: (section: keyof UserSettings, updates: Record<string, any>) => void;
  addRecentSearch: (term: string) => void;
  removeRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  loginMock: (emailOrUser?: string) => void;
  logoutMock: () => void;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (params: { name: string; username: string; email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'zenvi_app_state_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent states from localStorage if available, or initialize from mockData
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
      return saved ? JSON.parse(saved) : initialCurrentUser;
    } catch {
      return initialCurrentUser;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}users`);
      return saved ? JSON.parse(saved) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}posts`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 50) return parsed;
      }
      return initialPosts;
    } catch {
      return initialPosts;
    }
  });

  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}stories`);
      return saved ? JSON.parse(saved) : initialStories;
    } catch {
      return initialStories;
    }
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}reels`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 50) return parsed;
      }
      return initialReels;
    } catch {
      return initialReels;
    }
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}comments`);
      return saved ? JSON.parse(saved) : initialComments;
    } catch {
      return initialComments;
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}conversations`);
      return saved ? JSON.parse(saved) : initialConversations;
    } catch {
      return initialConversations;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}communities`);
      return saved ? JSON.parse(saved) : initialCommunities;
    } catch {
      return initialCommunities;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
      return saved ? JSON.parse(saved) : initialUserSettings;
    } catch {
      return initialUserSettings;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '#sunsetvibes',
    'Sneha Art',
    '#webdev',
    'Travel Lovers',
    'Rohan Kumar',
  ]);

  // Modals
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<StoryHighlight | null>(null);
  const [isCreateHighlightModalOpen, setCreateHighlightModalOpen] = useState(false);
  const [sharePostData, setSharePostData] = useState<Post | null>(null);
  const [appearanceModalOpen, setAppearanceModalOpen] = useState(false);
  const [isRecentFriendsOpen, setRecentFriendsOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}posts`, JSON.stringify(posts));
    } catch {}
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
    } catch {}
  }, [users]);

  // Synchronize with Backend Database and establish Real-Time SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const syncBackend = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          try {
            const meRes = await api.auth.getMe();
            if (meRes.user) {
              setCurrentUser(meRes.user);
              setIsAuthenticated(true);
            }
          } catch {
            // Token expired or invalid
          }
        }

        // Fetch latest posts from backend
        const postsRes = await api.posts.getAll(1, 100);
        if (postsRes.posts && postsRes.posts.length > 0) {
          setPosts(postsRes.posts);
        }

        // Fetch latest reels from backend
        const reelsRes = await api.reels.getAll();
        if (reelsRes.reels && reelsRes.reels.length > 0) {
          setReels(reelsRes.reels);
        }

        // Fetch users from backend
        const usersRes = await api.users.getAll();
        if (usersRes.users && usersRes.users.length > 0) {
          setUsers(usersRes.users);
        }

        // Fetch notifications if logged in
        if (token) {
          const notifsRes = await api.notifications.getAll();
          if (notifsRes.notifications) {
            setNotifications(notifsRes.notifications);
          }
        }
      } catch (err) {
        console.warn('Backend sync warning (continuing with cached state):', err);
      }
    };

    syncBackend();

    // Establish real-time SSE event stream
    try {
      const token = getAuthToken();
      const sseUrl = `/api/realtime${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('NEW_POST', (e: MessageEvent) => {
        try {
          const newPost = JSON.parse(e.data) as Post;
          setPosts((prev) => (prev.some((p) => p.id === newPost.id) ? prev : [newPost, ...prev]));
        } catch {}
      });

      eventSource.addEventListener('POST_LIKED', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setPosts((prev) =>
            prev.map((p) => (p.id === data.postId ? { ...p, likesCount: data.likesCount } : p))
          );
        } catch {}
      });

      eventSource.addEventListener('POST_UPDATED', (e: MessageEvent) => {
        try {
          const updated = JSON.parse(e.data) as Post;
          setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        } catch {}
      });

      eventSource.addEventListener('POST_DELETED', (e: MessageEvent) => {
        try {
          const { postId } = JSON.parse(e.data);
          setPosts((prev) => prev.filter((p) => p.id !== postId));
        } catch {}
      });

      eventSource.addEventListener('NEW_COMMENT', (e: MessageEvent) => {
        try {
          const { postId, comment, commentsCount } = JSON.parse(e.data);
          setComments((prev) => [comment, ...prev.filter((c) => c.id !== comment.id)]);
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, commentsCount } : p))
          );
        } catch {}
      });

      eventSource.addEventListener('NEW_NOTIFICATION', (e: MessageEvent) => {
        try {
          const notif = JSON.parse(e.data) as NotificationItem;
          setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)]);
          showToast(`${notif.actorName} ${notif.text}`, 'info');
        } catch {}
      });

      eventSource.addEventListener('USER_FOLLOW_UPDATED', (e: MessageEvent) => {
        try {
          const { targetId, followersCount } = JSON.parse(e.data);
          setUsers((prev) =>
            prev.map((u) => (u.id === targetId ? { ...u, followersCount } : u))
          );
        } catch {}
      });
    } catch (err) {
      console.warn('Real-time updates SSE unavailable:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // Actions
  const toggleLikePost = async (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.isLiked;
          const nextCount = nextLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
          return {
            ...post,
            isLiked: nextLiked,
            likesCount: nextCount,
          };
        }
        return post;
      })
    );
    try {
      await api.posts.toggleLike(postId);
    } catch {}
  };

  const toggleSavePost = async (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const nextSaved = !post.isSaved;
          showToast(nextSaved ? 'Post saved to your collection' : 'Post removed from saved collection');
          return {
            ...post,
            isSaved: nextSaved,
          };
        }
        return post;
      })
    );
    try {
      await api.posts.toggleSave(postId);
    } catch {}
  };

  const addComment = async (postId: string, text: string) => {
    if (!text.trim()) return;

    const tempComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setComments((prev) => [tempComment, ...prev]);

    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );

    showToast('Comment posted');

    try {
      const res = await api.posts.addComment(postId, text);
      if (res.comment) {
        setComments((prev) =>
          prev.map((c) => (c.id === tempComment.id ? res.comment : c))
        );
      }
    } catch (err) {
      console.warn('Comment backend sync:', err);
    }
  };

  const deleteComment = async (commentId: string) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;

    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setPosts((prev) =>
      prev.map((p) => (p.id === target.postId ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p))
    );
    showToast('Comment deleted', 'info');

    try {
      await api.posts.deleteComment(commentId);
    } catch {}
  };

  const createPost = async (data: {
    content: string;
    mediaUrls: string[];
    location?: string;
    tags?: string[];
    audience?: 'everyone' | 'followers' | 'close_friends';
    mediaType?: 'image' | 'video';
    videoUrl?: string;
    aspectRatio?: 'square' | 'portrait' | 'landscape' | 'reel';
    filter?: string;
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorVerified: currentUser.isVerified,
      content: data.content,
      mediaUrls: data.mediaUrls,
      mediaType: data.mediaType || (data.videoUrl ? 'video' : 'image'),
      videoUrl: data.videoUrl,
      aspectRatio: data.aspectRatio || 'square',
      filter: data.filter,
      location: data.location,
      timestamp: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      tags: data.tags || [],
      audience: data.audience || 'everyone',
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setCreatePostModalOpen(false);
    showToast('Your post has been published to ZENVI!');

    try {
      const res = await api.posts.create(newPost);
      if (res.post) {
        setPosts((prev) => prev.map((p) => (p.id === newPost.id ? res.post : p)));
      }
    } catch (err) {
      console.warn('Backend post creation sync:', err);
    }
  };

  const createReel = (data: {
    mediaUrl: string;
    caption: string;
    audioTrack?: string;
    tags?: string[];
    mediaType?: 'image' | 'video';
    videoUrl?: string;
  }) => {
    const newReel: Reel = {
      id: `reel_${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorUsername: currentUser.username,
      creatorAvatar: currentUser.avatar,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType || 'video',
      videoUrl: data.videoUrl,
      caption: data.caption,
      audioTrack: data.audioTrack || `Original Audio · ${currentUser.name}`,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: true,
      isSaved: false,
      tags: data.tags || ['zenvi', 'reels'],
    };

    setReels((prev) => [newReel, ...prev]);
    showToast('Your Reel has been published to ZENVI!');
  };

  const updatePost = async (
    postId: string,
    data: { content: string; mediaUrls: string[]; location?: string; tags?: string[] }
  ) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            content: data.content,
            mediaUrls: data.mediaUrls,
            location: data.location,
            tags: data.tags || p.tags,
          };
        }
        return p;
      })
    );
    setEditingPost(null);
    showToast('Post updated successfully');

    try {
      await api.posts.update(postId, data);
    } catch (err) {
      console.warn('Backend post update sync:', err);
    }
  };

  const deletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setCurrentUser((prev) => ({ ...prev, postsCount: Math.max(0, prev.postsCount - 1) }));
    setDeletingPostId(null);
    showToast('Post deleted', 'info');

    try {
      await api.posts.delete(postId);
    } catch (err) {
      console.warn('Backend post deletion sync:', err);
    }
  };

  const toggleFollowUser = async (userId: string) => {
    let nextFollowing = false;
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          nextFollowing = !u.isFollowing;
          const nextFollowersCount = nextFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1);
          showToast(nextFollowing ? `Followed @${u.username}` : `Unfollowed @${u.username}`);
          return {
            ...u,
            isFollowing: nextFollowing,
            followersCount: nextFollowersCount,
          };
        }
        return u;
      })
    );

    // Update current user following count
    setCurrentUser((prev) => {
      const targetUser = users.find((u) => u.id === userId);
      const isNowFollowing = targetUser ? !targetUser.isFollowing : true;
      return {
        ...prev,
        followingCount: isNowFollowing ? prev.followingCount + 1 : Math.max(0, prev.followingCount - 1),
      };
    });

    try {
      await api.users.toggleFollow(userId);
    } catch (err) {
      console.warn('Backend follow toggle sync:', err);
    }
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
    showToast('Profile updated successfully');

    try {
      await api.users.updateProfile(updates);
    } catch (err) {
      console.warn('Backend user profile update sync:', err);
    }
  };

  const toggleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const nextJoined = !c.isJoined;
          showToast(nextJoined ? `Joined ${c.name}` : `Left ${c.name}`);
          return {
            ...c,
            isJoined: nextJoined,
            membersCount: nextJoined ? c.membersCount + 1 : Math.max(0, c.membersCount - 1),
          };
        }
        return c;
      })
    );
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: 'Just now',
      isRead: true,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: {
              text: newMessage.text,
              timestamp: 'Just now',
              isRead: true,
            },
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    // Friendly auto-reply simulation after 1.5s
    setTimeout(() => {
      const replies = [
        'Awesome, totally agree! 🚀',
        'Thanks for sharing that!',
        'Got it! Looking forward to it.',
        'Sounds good to me! Let me know if you need anything else.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            const replyMsg = {
              id: `msg_reply_${Date.now()}`,
              senderId: conv.participant.id,
              text: randomReply,
              timestamp: 'Just now',
              isRead: false,
            };
            return {
              ...conv,
              lastMessage: {
                text: replyMsg.text,
                timestamp: 'Just now',
                isRead: false,
              },
              unreadCount: conv.unreadCount + 1,
              messages: [...conv.messages, replyMsg],
            };
          }
          return conv;
        })
      );
    }, 1500);
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await api.notifications.markRead(id);
    } catch {}
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.notifications.markAllRead();
    } catch {}
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            unreadCount: 0,
            lastMessage: { ...c.lastMessage, isRead: true },
            messages: c.messages.map((m) => ({ ...m, isRead: true })),
          };
        }
        return c;
      })
    );
  };

  const markAllMessagesAsRead = () => {
    setConversations((prev) =>
      prev.map((c) => ({
        ...c,
        unreadCount: 0,
        lastMessage: { ...c.lastMessage, isRead: true },
        messages: c.messages.map((m) => ({ ...m, isRead: true })),
      }))
    );
  };

  const createHighlight = (title: string, coverImage: string, items: HighlightItem[]) => {
    const newHighlight: StoryHighlight = {
      id: `hl_${Date.now()}`,
      title: title.trim() || 'Highlight',
      coverImage: coverImage || (items[0]?.mediaUrl || currentUser.avatar),
      items: items.length > 0 ? items : [
        { id: `hli_${Date.now()}`, mediaUrl: coverImage, type: 'story', title }
      ],
    };

    setCurrentUser((prev) => {
      const updatedHighlights = [...(prev.highlights || []), newHighlight];
      const updated = { ...prev, highlights: updatedHighlights };
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });

    setCreateHighlightModalOpen(false);
    showToast(`Highlight "${title}" added to your profile!`);
  };

  const deleteHighlight = (highlightId: string) => {
    setCurrentUser((prev) => {
      const updatedHighlights = (prev.highlights || []).filter((h) => h.id !== highlightId);
      const updated = { ...prev, highlights: updatedHighlights };
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
    showToast('Highlight removed', 'info');
  };

  const addStory = (mediaUrl: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      userAvatar: currentUser.avatar,
      mediaUrl,
      timestamp: 'Just now',
      hasViewed: false,
    };
    setStories((prev) => [newStory, ...prev]);
    showToast('Story added to your moments!');
  };

  const toggleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextLiked = !r.isLiked;
          return {
            ...r,
            isLiked: nextLiked,
            likesCount: nextLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );
  };

  const toggleSaveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextSaved = !r.isSaved;
          showToast(nextSaved ? 'Reel saved' : 'Reel removed from saved');
          return {
            ...r,
            isSaved: nextSaved,
          };
        }
        return r;
      })
    );
  };

  const updateSettings = (section: keyof UserSettings, updates: Record<string, any>) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
    showToast('Settings saved successfully');
  };

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => [term.trim(), ...prev.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 8));
  };

  const removeRecentSearch = (term: string) => {
    setRecentSearches((prev) => prev.filter((t) => t !== term));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const login = async (identifier: string, password: string) => {
    try {
      const res = await api.auth.login(identifier, password);
      if (res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        showToast(res.message || `Welcome back, ${res.user.name}!`);
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (params: { name: string; username: string; email: string; password: string }) => {
    try {
      const res = await api.auth.register(params);
      if (res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        showToast(res.message || `Welcome to ZENVI, ${res.user.name}!`);
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {}
    setIsAuthenticated(false);
    showToast('Signed out of ZENVI', 'info');
  };

  const uploadFile = async (file: File) => {
    return await api.upload.file(file);
  };

  const loginMock = (emailOrUser?: string) => {
    setIsAuthenticated(true);
    if (emailOrUser) {
      showToast(`Welcome back, ${emailOrUser}!`);
    } else {
      showToast('Logged in as Gokul OS');
    }
  };

  const logoutMock = () => {
    setIsAuthenticated(false);
    showToast('Signed out of ZENVI', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        posts,
        stories,
        reels,
        comments,
        conversations,
        notifications,
        communities,
        settings,
        isAuthenticated,
        recentSearches,
        toasts,
        isCreatePostModalOpen,
        setCreatePostModalOpen,
        editingPost,
        setEditingPost,
        deletingPostId,
        setDeletingPostId,
        activeStory,
        setActiveStory,
        activeHighlight,
        setActiveHighlight,
        isCreateHighlightModalOpen,
        setCreateHighlightModalOpen,
        sharePostData,
        setSharePostData,
        appearanceModalOpen,
        setAppearanceModalOpen,
        isRecentFriendsOpen,
        setRecentFriendsOpen,
        toggleLikePost,
        toggleSavePost,
        addComment,
        deleteComment,
        createPost,
        createReel,
        updatePost,
        deletePost,
        toggleFollowUser,
        updateCurrentUser,
        createHighlight,
        deleteHighlight,
        toggleJoinCommunity,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        markConversationAsRead,
        markAllMessagesAsRead,
        addStory,
        toggleLikeReel,
        toggleSaveReel,
        updateSettings,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        loginMock,
        logoutMock,
        login,
        register,
        logout,
        uploadFile,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
