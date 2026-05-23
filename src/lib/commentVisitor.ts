import { randomNames } from '../data';
import { avatarKeys, type AvatarKey } from '../assets/avatars';

const VISITOR_KEY = 'blog_comment_visitor_key';
const AUTHOR_NAME = 'blog_comment_author_name';
const AUTHOR_AVATAR = 'blog_comment_author_avatar';

const MYTHICAL_NAMES = [
  ...randomNames[0].maleMythicalNames,
  ...randomNames[0].femaleMythicalNames,
];

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function pickRandomName(exclude?: string): string {
  const pool = exclude ? MYTHICAL_NAMES.filter((name) => name !== exclude) : MYTHICAL_NAMES;
  return pool[Math.floor(Math.random() * pool.length)] ?? MYTHICAL_NAMES[0];
}

function pickRandomAvatarKey(exclude?: AvatarKey): AvatarKey {
  const pool = exclude ? avatarKeys.filter((key) => key !== exclude) : avatarKeys;
  return pool[Math.floor(Math.random() * pool.length)] ?? avatarKeys[0];
}

export function getVisitorKey(): string {
  const existing = readStorage(VISITOR_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  writeStorage(VISITOR_KEY, next);
  return next;
}

export function getAuthorName(): string {
  const existing = readStorage(AUTHOR_NAME)?.trim();
  if (existing) return existing;
  const name = pickRandomName();
  writeStorage(AUTHOR_NAME, name);
  return name;
}

export function getAvatarKeyForName(name: string): AvatarKey {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarKeys[Math.abs(hash) % avatarKeys.length];
}

export function getVisitorAvatarKey(): AvatarKey {
  const stored = readStorage(AUTHOR_AVATAR) as AvatarKey | null;
  if (stored && avatarKeys.includes(stored)) return stored;
  const key = pickRandomAvatarKey();
  writeStorage(AUTHOR_AVATAR, key);
  return key;
}

export function randomizeVisitorIdentity(): { name: string; avatarKey: AvatarKey } {
  const name = pickRandomName(getAuthorName());
  const avatarKey = pickRandomAvatarKey(getVisitorAvatarKey());
  writeStorage(AUTHOR_NAME, name);
  writeStorage(AUTHOR_AVATAR, avatarKey);
  return { name, avatarKey };
}
