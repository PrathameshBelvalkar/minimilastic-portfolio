import { getAvatar, avatarKeys, type AvatarKey } from '../../../assets/avatars';
import { getAvatarKeyForName } from '../../../lib/commentVisitor';

type Props = {
  name: string;
  avatarKey?: AvatarKey | string | null;
};

function resolveAvatarKey(name: string, stored?: AvatarKey | string | null): AvatarKey {
  if (stored && avatarKeys.includes(stored as AvatarKey)) {
    return stored as AvatarKey;
  }
  return getAvatarKeyForName(name);
}

export function CommentAvatar({ name, avatarKey }: Props) {
  const key = resolveAvatarKey(name, avatarKey);
  const src = getAvatar(key);

  return (
    <img
      src={src}
      alt=""
      width={32}
      height={32}
      className="h-8 w-8 shrink-0 rounded-full object-cover"
      aria-hidden
    />
  );
}
