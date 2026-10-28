import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { getDb, saveDb, hashPassword, verifyPassword, generateToken, DbUser, DbLike, DbSaved, DbFollow } from '../db';
import { Post, Reel, Comment, NotificationItem, User } from '../../src/types';

export const apiRouter = Router();

// Store active Server-Sent Events (SSE) connections
interface SseClient {
  id: string;
  res: Response;
  userId?: string;
}
let sseClients: SseClient[] = [];

// Helper to broadcast real-time events to all or targeted clients
export function broadcastEvent(event: string, data: any, targetUserId?: string) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    if (!targetUserId || client.userId === targetUserId) {
      try {
        client.res.write(payload);
      } catch {
        // Handled in close listener
      }
    }
  });
}

// Upload directory setup
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ----------------------------------------------------
// Authentication Middleware
// ----------------------------------------------------
export interface AuthenticatedRequest extends Request {
  user?: DbUser;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const db = getDb();
  const tokenRecord = db.tokens.find((t) => t.token === token);

  if (!tokenRecord) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }

  const user = db.users.find((u) => u.id === tokenRecord.userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  req.user = user;
  next();
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const db = getDb();
    const tokenRecord = db.tokens.find((t) => t.token === token);
    if (tokenRecord) {
      req.user = db.users.find((u) => u.id === tokenRecord.userId);
    }
  }
  next();
}

// ----------------------------------------------------
// Real-time Server-Sent Events (SSE) Route
// ----------------------------------------------------
apiRouter.get('/realtime', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const token = req.query.token as string;
  let userId: string | undefined;

  if (token) {
    const db = getDb();
    const tokenRecord = db.tokens.find((t) => t.token === token);
    if (tokenRecord) {
      userId = tokenRecord.userId;
    }
  }

  const client: SseClient = { id: clientId, res, userId };
  sseClients.push(client);

  // Send initial connection event
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', clientId })}\n\n`);

  // Heartbeat every 20 seconds
  const heartbeatTimer = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeatTimer);
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// ----------------------------------------------------
// Auth Routes
// ----------------------------------------------------
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields (name, username, email, password) are required.' });
  }

  if (typeof password !== 'string' || password.length < 10) {
    return res.status(400).json({ success: false, message: 'Password must be at least 10 characters long.' });
  }
  if (typeof name !== 'string' || typeof username !== 'string' || typeof email !== 'string' || name.trim().length > 80 || username.length > 30 || email.length > 254) {
    return res.status(400).json({ success: false, message: 'Please provide valid name, username, and email values.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_.]/g, '');
  const cleanEmail = email.toLowerCase().trim();

  const db = getDb();

  const existingEmail = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existingEmail) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const existingUser = db.users.find((u) => u.username.toLowerCase() === cleanUsername);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'This username is already taken.' });
  }

  const newUserId = `user_${Date.now()}`;
  const defaultAvatar = `https://images.unsplash.com/photo-${1534528741775 + (db.users.length % 50)}?auto=format&fit=crop&w=400&q=80`;

  const newUser: DbUser = {
    id: newUserId,
    name: name.trim(),
    username: cleanUsername,
    email: cleanEmail,
    passwordHash: hashPassword(password),
    avatar: defaultAvatar,
    bio: '✨ Exploring ZENVI and connecting with the world.',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isVerified: false,
    joinedDate: 'Joined recently',
    highlights: [],
  };

  db.users.push(newUser);

  const token = generateToken(newUser.id);
  db.tokens.push({
    token,
    userId: newUser.id,
    createdAt: new Date().toISOString(),
  });

  saveDb();

  // Strip password hash from response
  const { passwordHash, ...safeUser } = newUser;
  return res.status(201).json({
    success: true,
    message: 'Registration successful! Welcome to ZENVI.',
    token,
    user: safeUser,
  });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email/username and password.' });
  }

  const db = getDb();
  const cleanId = identifier.trim().toLowerCase();

  const user = db.users.find(
    (u) => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId.replace('@', '')
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Account not found. Please check your credentials.' });
  }

    const passwordIsValid = verifyPassword(password, user.passwordHash);
  // Block the original shared demo password in production, even for legacy seeded records.
  if (!passwordIsValid || (process.env.NODE_ENV === 'production' && password === 'password123')) {
    return res.status(401).json({ success: false, message: 'Incorrect password. Please check your credentials.' });
  }
  if (!user.passwordHash.startsWith('scrypt$')) {
    user.passwordHash = hashPassword(password);
  }

  const token = generateToken(user.id);
  db.tokens.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  });

  saveDb();

  const { passwordHash, ...safeUser } = user;
  return res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: safeUser,
  });
});

apiRouter.get('/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { passwordHash, ...safeUser } = req.user;
  return res.json({ success: true, user: safeUser });
});

apiRouter.post('/auth/logout', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  const db = getDb();
  if (token) {
    db.tokens = db.tokens.filter((t) => t.token !== token);
    saveDb();
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// ----------------------------------------------------
// Users & Profiles Routes
// ----------------------------------------------------
apiRouter.get('/users', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const search = (req.query.q as string || '').toLowerCase().trim();
  const currentUserId = req.user?.id;

  let result = db.users.map(({ passwordHash, ...safe }) => {
    const isFollowing = currentUserId
      ? db.followers.some((f) => f.followerId === currentUserId && f.followingId === safe.id)
      : false;
    return { ...safe, isFollowing };
  });

  if (search) {
    result = result.filter(
      (u) => u.name.toLowerCase().includes(search) || u.username.toLowerCase().includes(search)
    );
  }

  return res.json({ success: true, users: result });
});

apiRouter.get('/users/:username', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const username = req.params.username.toLowerCase().replace('@', '');
  const user = db.users.find((u) => u.username.toLowerCase() === username);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const currentUserId = req.user?.id;
  const isFollowing = currentUserId
    ? db.followers.some((f) => f.followerId === currentUserId && f.followingId === user.id)
    : false;

  const { passwordHash, ...safeUser } = user;
  return res.json({
    success: true,
    user: {
      ...safeUser,
      isFollowing,
    },
  });
});

apiRouter.put('/users/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const userIndex = db.users.findIndex((u) => u.id === req.user!.id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { name, bio, website, location, profession, avatar, coverImage } = req.body;

  if (name !== undefined) db.users[userIndex].name = name.trim();
  if (bio !== undefined) db.users[userIndex].bio = bio;
  if (website !== undefined) db.users[userIndex].website = website;
  if (location !== undefined) db.users[userIndex].location = location;
  if (profession !== undefined) db.users[userIndex].profession = profession;
  if (avatar !== undefined) db.users[userIndex].avatar = avatar;
  if (coverImage !== undefined) db.users[userIndex].coverImage = coverImage;

  saveDb();

  const { passwordHash, ...safeUser } = db.users[userIndex];
  return res.json({ success: true, message: 'Profile updated successfully', user: safeUser });
});

apiRouter.post('/users/:id/follow', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.id;
  const currentUserId = req.user!.id;

  if (targetId === currentUserId) {
    return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
  }

  const db = getDb();
  const targetUserIndex = db.users.findIndex((u) => u.id === targetId);
  const currentUserIndex = db.users.findIndex((u) => u.id === currentUserId);

  if (targetUserIndex === -1) {
    return res.status(404).json({ success: false, message: 'User to follow not found' });
  }

  const existingFollowIndex = db.followers.findIndex(
    (f) => f.followerId === currentUserId && f.followingId === targetId
  );

  let isFollowingNow = false;

  if (existingFollowIndex > -1) {
    // Unfollow
    db.followers.splice(existingFollowIndex, 1);
    db.users[targetUserIndex].followersCount = Math.max(0, (db.users[targetUserIndex].followersCount || 1) - 1);
    db.users[currentUserIndex].followingCount = Math.max(0, (db.users[currentUserIndex].followingCount || 1) - 1);
    isFollowingNow = false;
  } else {
    // Follow
    db.followers.push({
      followerId: currentUserId,
      followingId: targetId,
      createdAt: new Date().toISOString(),
    });
    db.users[targetUserIndex].followersCount = (db.users[targetUserIndex].followersCount || 0) + 1;
    db.users[currentUserIndex].followingCount = (db.users[currentUserIndex].followingCount || 0) + 1;
    isFollowingNow = true;

    // Send notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: targetId,
      actorId: currentUserId,
      actorName: req.user!.name,
      actorUsername: req.user!.username,
      actorAvatar: req.user!.avatar,
      type: 'follow',
      text: 'started following you.',
      timestamp: 'Just now',
      isRead: false,
    };
    db.notifications.unshift(newNotif);
    broadcastEvent('NEW_NOTIFICATION', newNotif, targetId);
  }

  saveDb();

  broadcastEvent('USER_FOLLOW_UPDATED', {
    targetId,
    followerId: currentUserId,
    isFollowing: isFollowingNow,
    followersCount: db.users[targetUserIndex].followersCount,
  });

  return res.json({
    success: true,
    isFollowing: isFollowingNow,
    followersCount: db.users[targetUserIndex].followersCount,
    followingCount: db.users[currentUserIndex].followingCount,
  });
});

// ----------------------------------------------------
// Posts Routes (Create, Read, Edit, Delete, Like, Save)
// ----------------------------------------------------
apiRouter.get('/posts', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '20', 10);
  const authorUsername = req.query.username as string;
  const currentUserId = req.user?.id;

  let filtered = [...db.posts];

  if (authorUsername) {
    const cleanU = authorUsername.toLowerCase().replace('@', '');
    filtered = filtered.filter((p) => p.authorUsername.toLowerCase() === cleanU);
  }

  // Attach isLiked and isSaved dynamic flags based on the user's DB records
  const result = filtered.map((post) => {
    const isLiked = currentUserId
      ? db.likes.some((l) => l.entityId === post.id && l.userId === currentUserId && l.entityType === 'post')
      : false;
    const isSaved = currentUserId
      ? db.saved.some((s) => s.entityId === post.id && s.userId === currentUserId && s.entityType === 'post')
      : false;
    return {
      ...post,
      isLiked: currentUserId ? isLiked : post.isLiked,
      isSaved: currentUserId ? isSaved : post.isSaved,
    };
  });

  const startIndex = (page - 1) * limit;
  const paginated = result.slice(startIndex, startIndex + limit);

  return res.json({
    success: true,
    posts: paginated,
    total: result.length,
    page,
    hasMore: startIndex + limit < result.length,
  });
});

apiRouter.get('/posts/:id', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const currentUserId = req.user?.id;
  const isLiked = currentUserId
    ? db.likes.some((l) => l.entityId === post.id && l.userId === currentUserId && l.entityType === 'post')
    : post.isLiked;
  const isSaved = currentUserId
    ? db.saved.some((s) => s.entityId === post.id && s.userId === currentUserId && s.entityType === 'post')
    : post.isSaved;

  return res.json({
    success: true,
    post: { ...post, isLiked, isSaved },
  });
});

apiRouter.post('/posts', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { content, mediaUrls, videoUrl, mediaType, aspectRatio, filter, location, tags, audience } = req.body;

  if (!content && (!mediaUrls || mediaUrls.length === 0) && !videoUrl) {
    return res.status(400).json({ success: false, message: 'Post must contain content or media' });
  }

  const db = getDb();
  const newPostId = `post_${Date.now()}`;

  const newPost: Post = {
    id: newPostId,
    authorId: req.user!.id,
    authorName: req.user!.name,
    authorUsername: req.user!.username,
    authorAvatar: req.user!.avatar,
    authorVerified: req.user!.isVerified,
    content: content || '',
    mediaUrls: mediaUrls || [],
    videoUrl: videoUrl || undefined,
    mediaType: mediaType || (videoUrl ? 'video' : 'image'),
    aspectRatio: aspectRatio || 'square',
    filter: filter || 'normal',
    location: location || '',
    tags: tags || [],
    audience: audience || 'everyone',
    timestamp: 'Just now',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    isLiked: false,
    isSaved: false,
  };

  db.posts.unshift(newPost);

  // Update user's post count
  const userIdx = db.users.findIndex((u) => u.id === req.user!.id);
  if (userIdx > -1) {
    db.users[userIdx].postsCount = (db.users[userIdx].postsCount || 0) + 1;
  }

  saveDb();

  // Broadcast to all connected clients
  broadcastEvent('NEW_POST', newPost);

  return res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post: newPost,
  });
});

apiRouter.put('/posts/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const postId = req.params.id;
  const db = getDb();
  const postIndex = db.posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // Authorization check: ensure only author can edit
  if (db.posts[postIndex].authorId !== req.user!.id) {
    return res.status(403).json({ success: false, message: 'Unauthorized: You can only edit your own posts' });
  }

  const { content, location, tags, mediaUrls } = req.body;

  if (content !== undefined) db.posts[postIndex].content = content;
  if (location !== undefined) db.posts[postIndex].location = location;
  if (tags !== undefined) db.posts[postIndex].tags = tags;
  if (mediaUrls !== undefined && Array.isArray(mediaUrls) && mediaUrls.length > 0) {
    db.posts[postIndex].mediaUrls = mediaUrls;
  }

  saveDb();

  broadcastEvent('POST_UPDATED', db.posts[postIndex]);

  return res.json({
    success: true,
    message: 'Post updated successfully',
    post: db.posts[postIndex],
  });
});

apiRouter.delete('/posts/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const postId = req.params.id;
  const db = getDb();
  const post = db.posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // Authorization check: ensure only author can delete
  if (post.authorId !== req.user!.id) {
    return res.status(403).json({ success: false, message: 'Unauthorized: You can only delete your own posts' });
  }

  db.posts = db.posts.filter((p) => p.id !== postId);
  db.comments = db.comments.filter((c) => c.postId !== postId);
  db.likes = db.likes.filter((l) => l.entityId !== postId);
  db.saved = db.saved.filter((s) => s.entityId !== postId);

  // Decrement user post count
  const userIdx = db.users.findIndex((u) => u.id === req.user!.id);
  if (userIdx > -1) {
    db.users[userIdx].postsCount = Math.max(0, (db.users[userIdx].postsCount || 1) - 1);
  }

  saveDb();

  broadcastEvent('POST_DELETED', { postId });

  return res.json({
    success: true,
    message: 'Post deleted successfully',
    postId,
  });
});

apiRouter.post('/posts/:id/like', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const postId = req.params.id;
  const currentUserId = req.user!.id;
  const db = getDb();
  const postIndex = db.posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const existingLikeIndex = db.likes.findIndex(
    (l) => l.entityId === postId && l.userId === currentUserId && l.entityType === 'post'
  );

  let isLikedNow = false;

  if (existingLikeIndex > -1) {
    // Unlike
    db.likes.splice(existingLikeIndex, 1);
    db.posts[postIndex].likesCount = Math.max(0, db.posts[postIndex].likesCount - 1);
    isLikedNow = false;
  } else {
    // Like
    db.likes.push({
      id: `like_${postId}_${currentUserId}`,
      entityId: postId,
      entityType: 'post',
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    });
    db.posts[postIndex].likesCount += 1;
    isLikedNow = true;

    // Send notification to author if not liking own post
    if (db.posts[postIndex].authorId !== currentUserId) {
      const targetAuthorId = db.posts[postIndex].authorId;
      const notif: NotificationItem = {
        id: `notif_like_${Date.now()}`,
        userId: targetAuthorId,
        actorId: currentUserId,
        actorName: req.user!.name,
        actorUsername: req.user!.username,
        actorAvatar: req.user!.avatar,
        type: 'like',
        text: 'liked your post.',
        postId,
        targetPreview: db.posts[postIndex].mediaUrls[0] || undefined,
        timestamp: 'Just now',
        isRead: false,
      };
      db.notifications.unshift(notif);
      broadcastEvent('NEW_NOTIFICATION', notif, targetAuthorId);
    }
  }

  saveDb();

  broadcastEvent('POST_LIKED', {
    postId,
    likesCount: db.posts[postIndex].likesCount,
    userId: currentUserId,
    isLiked: isLikedNow,
  });

  return res.json({
    success: true,
    isLiked: isLikedNow,
    likesCount: db.posts[postIndex].likesCount,
  });
});

apiRouter.post('/posts/:id/save', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const postId = req.params.id;
  const currentUserId = req.user!.id;
  const db = getDb();
  const post = db.posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const existingSavedIndex = db.saved.findIndex(
    (s) => s.entityId === postId && s.userId === currentUserId && s.entityType === 'post'
  );

  let isSavedNow = false;

  if (existingSavedIndex > -1) {
    db.saved.splice(existingSavedIndex, 1);
    isSavedNow = false;
  } else {
    db.saved.push({
      id: `save_${postId}_${currentUserId}`,
      entityId: postId,
      entityType: 'post',
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    });
    isSavedNow = true;
  }

  saveDb();

  return res.json({
    success: true,
    isSaved: isSavedNow,
  });
});

// ----------------------------------------------------
// Comments Routes
// ----------------------------------------------------
apiRouter.get('/posts/:id/comments', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const postId = req.params.id;
  const currentUserId = req.user?.id;

  const comments = db.comments
    .filter((c) => c.postId === postId)
    .map((c) => ({
      ...c,
      isLiked: currentUserId
        ? db.likes.some((l) => l.entityId === c.id && l.userId === currentUserId)
        : false,
    }));

  return res.json({ success: true, comments });
});

apiRouter.post('/posts/:id/comments', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const postId = req.params.id;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
  }

  const db = getDb();
  const postIndex = db.posts.findIndex((p) => p.id === postId);
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  const newComment: Comment = {
    id: `comment_${Date.now()}`,
    postId,
    userId: req.user!.id,
    userName: req.user!.name,
    userUsername: req.user!.username,
    userAvatar: req.user!.avatar,
    text: text.trim(),
    timestamp: 'Just now',
    likesCount: 0,
    isLiked: false,
  };

  db.comments.push(newComment);
  db.posts[postIndex].commentsCount += 1;

  // Send notification if not commenting on own post
  if (db.posts[postIndex].authorId !== req.user!.id) {
    const authorId = db.posts[postIndex].authorId;
    const notif: NotificationItem = {
      id: `notif_comment_${Date.now()}`,
      userId: authorId,
      actorId: req.user!.id,
      actorName: req.user!.name,
      actorUsername: req.user!.username,
      actorAvatar: req.user!.avatar,
      type: 'comment',
      text: `commented: "${text.trim().substring(0, 40)}${text.trim().length > 40 ? '...' : ''}"`,
      postId,
      targetPreview: db.posts[postIndex].mediaUrls[0] || undefined,
      timestamp: 'Just now',
      isRead: false,
    };
    db.notifications.unshift(notif);
    broadcastEvent('NEW_NOTIFICATION', notif, authorId);
  }

  saveDb();

  broadcastEvent('NEW_COMMENT', {
    postId,
    comment: newComment,
    commentsCount: db.posts[postIndex].commentsCount,
  });

  return res.status(201).json({
    success: true,
    comment: newComment,
    commentsCount: db.posts[postIndex].commentsCount,
  });
});

apiRouter.delete('/comments/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const commentId = req.params.id;
  const db = getDb();
  const comment = db.comments.find((c) => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  // Authorization check: comment author or post author can delete
  const post = db.posts.find((p) => p.id === comment.postId);
  if (comment.userId !== req.user!.id && (!post || post.authorId !== req.user!.id)) {
    return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
  }

  db.comments = db.comments.filter((c) => c.id !== commentId);

  if (post) {
    const postIdx = db.posts.findIndex((p) => p.id === post.id);
    if (postIdx > -1) {
      db.posts[postIdx].commentsCount = Math.max(0, db.posts[postIdx].commentsCount - 1);
    }
  }

  saveDb();

  return res.json({ success: true, message: 'Comment deleted successfully' });
});

// ----------------------------------------------------
// Reels Routes
// ----------------------------------------------------
apiRouter.get('/reels', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const currentUserId = req.user?.id;

  const reels = db.reels.map((reel) => {
    const isLiked = currentUserId
      ? db.likes.some((l) => l.entityId === reel.id && l.userId === currentUserId && l.entityType === 'reel')
      : reel.isLiked;
    const isSaved = currentUserId
      ? db.saved.some((s) => s.entityId === reel.id && s.userId === currentUserId && s.entityType === 'reel')
      : reel.isSaved;
    return { ...reel, isLiked, isSaved };
  });

  return res.json({ success: true, reels });
});

apiRouter.post('/reels/:id/like', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const reelId = req.params.id;
  const currentUserId = req.user!.id;
  const db = getDb();
  const reelIndex = db.reels.findIndex((r) => r.id === reelId);

  if (reelIndex === -1) {
    return res.status(404).json({ success: false, message: 'Reel not found' });
  }

  const existingLikeIndex = db.likes.findIndex(
    (l) => l.entityId === reelId && l.userId === currentUserId && l.entityType === 'reel'
  );

  let isLikedNow = false;

  if (existingLikeIndex > -1) {
    db.likes.splice(existingLikeIndex, 1);
    db.reels[reelIndex].likesCount = Math.max(0, db.reels[reelIndex].likesCount - 1);
    isLikedNow = false;
  } else {
    db.likes.push({
      id: `like_reel_${reelId}_${currentUserId}`,
      entityId: reelId,
      entityType: 'reel',
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    });
    db.reels[reelIndex].likesCount += 1;
    isLikedNow = true;
  }

  saveDb();

  return res.json({
    success: true,
    isLiked: isLikedNow,
    likesCount: db.reels[reelIndex].likesCount,
  });
});

// ----------------------------------------------------
// Notifications Routes
// ----------------------------------------------------
apiRouter.get('/notifications', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  const userNotifications = db.notifications.filter(
    (n) => n.userId === req.user!.id || !n.userId || n.userId === 'user_current'
  );
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  return res.json({
    success: true,
    notifications: userNotifications,
    unreadCount,
  });
});

apiRouter.put('/notifications/:id/read', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const notifId = req.params.id;
  const db = getDb();
  const index = db.notifications.findIndex((n) => n.id === notifId);

  if (index > -1) {
    db.notifications[index].isRead = true;
    saveDb();
  }

  return res.json({ success: true });
});

apiRouter.put('/notifications/read-all', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const db = getDb();
  db.notifications.forEach((n) => {
    if (n.userId === req.user!.id || !n.userId || n.userId === 'user_current') {
      n.isRead = true;
    }
  });

  saveDb();
  return res.json({ success: true, message: 'All notifications marked as read' });
});

// ----------------------------------------------------
// Image & Video File Uploads Route (/api/upload)
// ----------------------------------------------------
apiRouter.post('/upload', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { dataUrl, fileName, fileType } = req.body;

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ success: false, message: 'dataUrl string is required for file upload' });
    }

    // Match data:[<mediatype>];base64,<data>
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'Invalid base64 Data URL format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'].includes(mimeType)) {
      return res.status(415).json({ success: false, message: 'Unsupported upload type.' });
    }
    const buffer = Buffer.from(base64Data, 'base64');
    if (buffer.length > 15 * 1024 * 1024) {
      return res.status(413).json({ success: false, message: 'Uploads must be 15 MB or smaller.' });
    }

    // Determine extension
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('mp4')) ext = 'mp4';
    else if (mimeType.includes('webm')) ext = 'webm';
    else if (mimeType.includes('quicktime')) ext = 'mov';

    const { randomBytes } = await import('crypto');
    const safeName = `zenvi_${Date.now()}_${randomBytes(6).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
      fileName: safeName,
      mimeType,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process file upload: ' + error.message });
  }
});
