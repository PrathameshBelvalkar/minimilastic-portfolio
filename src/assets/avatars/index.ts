import artist from './artist.png';
import bedouin from './bedouin.png';
import blonde from './blonde.png';
import brownWoman from './brown_woman.png';
import grownMan from './grown_man.png';
import grownWoman from './grown_woman.png';
import man from './man.png';
import wizard from './wizard.png';
import woman from './woman.png';

export const avatars = {
  artist,
  bedouin,
  blonde,
  brown_woman: brownWoman,
  grown_man: grownMan,
  grown_woman: grownWoman,
  man,
  wizard,
  woman,
} as const;

export type AvatarKey = keyof typeof avatars;

export const avatarKeys = Object.keys(avatars) as AvatarKey[];

export function getAvatar(key: AvatarKey) {
  return avatars[key];
}
