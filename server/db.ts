import fs from 'fs';
import path from 'path';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { initialCurrentUser, initialUsers, initialPosts, initialStories, initialComments, initialReels, initialConversations, initialNotifications, initialCommunities, initialUserSettings } from '../src/data/mockData';
import { User, Post, Reel, Comment, NotificationItem, Story, Community, UserSettings } from '../src/types';

export interface DbUser extends User {
  email: string;
  passwordHash: string;
}

export interface DbFollow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface DbLike {
  id: string;
  entityId: string;
  entityType: 'post' | 'reel';
  userId: string;
  createdAt: string;
}

export interface DbSaved {
  id: string;
  entityId: string;
  entityType: 'post' | 'reel';
  userId: string;
  createdAt: string;
}

export interface DbAuthToken {
  token: string;
  userId: string;
  createdAt: string;
}

export interface DatabaseSchema {
  users: DbUser[];
  followers: DbFollow[];
  posts: Post[];
  reels: Reel[];
  comments: Comment[];
  likes: DbLike[];
  saved: DbSaved[];
  notifications: NotificationItem[];
  stories: Story[];
  communities: Community[];
  settings: Record<string, UserSettings>;
  tokens: DbAuthToken[];
}

const DATA_DIR = path.resolve(process.env.ZENVI_DATA_DIR || path.join(process.cwd(), 'server', 'data'));
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Scrypt is deliberately slow and salted; never store plaintext passwords.
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

function legacyHashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `zenvi_hashed_${Math.abs(hash)}_${password.length}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (storedHash.startsWith('scrypt$')) {
    const [, saltHex, hashHex] = storedHash.split('$');
    try {
      const expected = Buffer.from(hashHex, 'hex');
      const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
      return expected.length === actual.length && timingSafeEqual(expected, actual);
    } catch { return false; }
  }
  // Legacy records are upgraded after a successful login.
  return storedHash === legacyHashPassword(password);
}

export function generateToken(_userId: string): string {
  return randomBytes(32).toString('base64url');
}

let inMemoryDb: DatabaseSchema | null = null;

function seedDatabase(): DatabaseSchema {
  const defaultPasswordHash = hashPassword('password123');

  const seededUsers: DbUser[] = [
    {
      ...initialCurrentUser,
      email: 'gokul@zenvi.social',
      passwordHash: defaultPasswordHash,
    },
    ...initialUsers.map((u, i) => ({
      ...u,
      email: `${u.username}@zenvi.social`,
      passwordHash: defaultPasswordHash,
    })),
  ];

  const initialFollows: DbFollow[] = [];
  // Setup standard follower relationships
  initialUsers.slice(0, 5).forEach((u) => {
    initialFollows.push({
      followerId: initialCurrentUser.id,
      followingId: u.id,
      createdAt: new Date().toISOString(),
    });
  });

  const initialLikes: DbLike[] = [];
  initialPosts.slice(0, 10).forEach((p) => {
    if (p.isLiked) {
      initialLikes.push({
        id: `like_${p.id}_${initialCurrentUser.id}`,
        entityId: p.id,
        entityType: 'post',
        userId: initialCurrentUser.id,
        createdAt: new Date().toISOString(),
      });
    }
  });

  const initialSaved: DbSaved[] = [];
  initialPosts.slice(0, 5).forEach((p) => {
    if (p.isSaved) {
      initialSaved.push({
        id: `save_${p.id}_${initialCurrentUser.id}`,
        entityId: p.id,
        entityType: 'post',
        userId: initialCurrentUser.id,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return {
    users: seededUsers,
    followers: initialFollows,
    posts: initialPosts,
    reels: initialReels,
    comments: initialComments,
    likes: initialLikes,
    saved: initialSaved,
    notifications: initialNotifications,
    stories: initialStories,
    communities: initialCommunities,
    settings: {
      [initialCurrentUser.id]: initialUserSettings,
    },
    tokens: [
      {
        token: `zenvi_tk_${initialCurrentUser.id}_default`,
        userId: initialCurrentUser.id,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

export function initDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(data);
      if (inMemoryDb && Array.isArray(inMemoryDb.posts) && inMemoryDb.posts.length > 0) {
        // Upgrade legacy password hashes on next successful login; retain existing data.
        return inMemoryDb;
      }
    }
  } catch (err) {
    console.error('Error loading db.json, generating new seed:', err);
  }

  const seeded = seedDatabase();
  inMemoryDb = seeded;
  saveDb();
  return inMemoryDb;
}

export function getDb(): DatabaseSchema {
  if (!inMemoryDb) {
    return initDb();
  }
  return inMemoryDb;
}

export function saveDb(): void {
  if (!inMemoryDb) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}
