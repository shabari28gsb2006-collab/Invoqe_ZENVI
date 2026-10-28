import { Post, Reel, Comment, NotificationItem, User } from '../types';

const TOKEN_KEY = 'zenvi_auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  auth: {
    login: async (identifier: string, password: string) => {
      const data = await request<{ success: boolean; token: string; user: User; message: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ identifier, password }),
        }
      );
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    },

    register: async (params: { name: string; username: string; email: string; password: string }) => {
      const data = await request<{ success: boolean; token: string; user: User; message: string }>(
        '/api/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(params),
        }
      );
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    },

    getMe: async () => {
      return request<{ success: boolean; user: User }>('/api/auth/me');
    },

    logout: async () => {
      try {
        await request<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
      } finally {
        setAuthToken(null);
      }
    },
  },

  users: {
    getAll: async (search?: string) => {
      const query = search ? `?q=${encodeURIComponent(search)}` : '';
      return request<{ success: boolean; users: User[] }>(`/api/users${query}`);
    },

    getByUsername: async (username: string) => {
      return request<{ success: boolean; user: User }>(`/api/users/${encodeURIComponent(username)}`);
    },

    updateProfile: async (updates: Partial<User>) => {
      return request<{ success: boolean; user: User }>('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    toggleFollow: async (userId: string) => {
      return request<{
        success: boolean;
        isFollowing: boolean;
        followersCount: number;
        followingCount: number;
      }>(`/api/users/${userId}/follow`, { method: 'POST' });
    },
  },

  posts: {
    getAll: async (page = 1, limit = 20, username?: string) => {
      let url = `/api/posts?page=${page}&limit=${limit}`;
      if (username) url += `&username=${encodeURIComponent(username)}`;
      return request<{
        success: boolean;
        posts: Post[];
        total: number;
        page: number;
        hasMore: boolean;
      }>(url);
    },

    getById: async (id: string) => {
      return request<{ success: boolean; post: Post }>(`/api/posts/${id}`);
    },

    create: async (postData: Partial<Post>) => {
      return request<{ success: boolean; post: Post; message: string }>('/api/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
    },

    update: async (id: string, updates: Partial<Post>) => {
      return request<{ success: boolean; post: Post; message: string }>(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    delete: async (id: string) => {
      return request<{ success: boolean; message: string; postId: string }>(`/api/posts/${id}`, {
        method: 'DELETE',
      });
    },

    toggleLike: async (id: string) => {
      return request<{ success: boolean; isLiked: boolean; likesCount: number }>(`/api/posts/${id}/like`, {
        method: 'POST',
      });
    },

    toggleSave: async (id: string) => {
      return request<{ success: boolean; isSaved: boolean }>(`/api/posts/${id}/save`, {
        method: 'POST',
      });
    },

    getComments: async (postId: string) => {
      return request<{ success: boolean; comments: Comment[] }>(`/api/posts/${postId}/comments`);
    },

    addComment: async (postId: string, text: string) => {
      return request<{ success: boolean; comment: Comment; commentsCount: number }>(
        `/api/posts/${postId}/comments`,
        {
          method: 'POST',
          body: JSON.stringify({ text }),
        }
      );
    },

    deleteComment: async (commentId: string) => {
      return request<{ success: boolean; message: string }>(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
    },
  },

  reels: {
    getAll: async () => {
      return request<{ success: boolean; reels: Reel[] }>('/api/reels');
    },

    toggleLike: async (id: string) => {
      return request<{ success: boolean; isLiked: boolean; likesCount: number }>(`/api/reels/${id}/like`, {
        method: 'POST',
      });
    },
  },

  notifications: {
    getAll: async () => {
      return request<{ success: boolean; notifications: NotificationItem[]; unreadCount: number }>(
        '/api/notifications'
      );
    },

    markRead: async (id: string) => {
      return request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'PUT' });
    },

    markAllRead: async () => {
      return request<{ success: boolean }>('/api/notifications/read-all', { method: 'PUT' });
    },
  },

  upload: {
    file: async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const dataUrl = reader.result as string;
            const res = await request<{ success: boolean; url: string }>('/api/upload', {
              method: 'POST',
              body: JSON.stringify({
                dataUrl,
                fileName: file.name,
                fileType: file.type,
              }),
            });
            resolve(res.url);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    },
  },
};
