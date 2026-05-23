import { Heart, MessageCircle } from 'lucide-react';
import type { Components } from 'react-markdown';
import Markdown from 'react-markdown';
import { useState } from 'react';
import type { AvatarKey } from '../../../assets/avatars';
import {
  countReplies,
  formatRelativeTime,
  shouldTruncate,
  truncateBody,
  type CommentNode,
} from '../../../lib/commentUtils';
import { CommentAvatar } from './CommentAvatar';
import { CommentComposer } from './CommentComposer';

type Props = {
  comment: CommentNode;
  depth?: number;
  authorName: string;
  authorAvatarKey: AvatarKey;
  visitorKey: string;
  clappedIds: Set<string>;
  submitting: boolean;
  deletingId: string | null;
  onSubmit: (body: string, parentId?: string | null) => Promise<boolean>;
  onDelete: (commentId: string) => Promise<boolean>;
  onToggleClap: (commentId: string) => Promise<void>;
};

const MAX_VISIBLE_DEPTH = 1;

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

export function CommentItem({
  comment,
  depth = 0,
  authorName,
  authorAvatarKey,
  visitorKey,
  clappedIds,
  submitting,
  deletingId,
  onSubmit,
  onDelete,
  onToggleClap,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const replyCount = countReplies(comment);
  const hasClapped = clappedIds.has(comment.id);
  const truncated = !expanded && shouldTruncate(comment.body);
  const displayBody = truncated ? truncateBody(comment.body) : comment.body;
  const hasHiddenReplies =
    depth >= MAX_VISIBLE_DEPTH && comment.replies.length > 0 && !repliesExpanded;
  const showReplies = comment.replies.length > 0 && !hasHiddenReplies;
  const nestedClass =
    depth < MAX_VISIBLE_DEPTH
      ? 'mt-5 pl-4  flex flex-col gap-5'
      : 'mt-5 flex flex-col gap-5';

  const handleReplySubmit = async (body: string) => {
    const ok = await onSubmit(body, comment.id);
    if (ok) setReplyOpen(false);
    return ok;
  };

  const isOwnComment = comment.visitor_key === visitorKey;
  const displayName = isOwnComment ? authorName : comment.author_name;
  const displayAvatarKey = isOwnComment ? authorAvatarKey : comment.author_avatar_key;

  const canDelete = isOwnComment && Boolean(comment.visitor_key);
  const isDeleting = deletingId === comment.id;

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;
    if (!window.confirm('Delete this comment?')) return;
    await onDelete(comment.id);
  };

  return (
    <article className={`flex flex-col ${depth > 0 ? 'mt-5' : ''}`}>
      <div className="flex items-start gap-3">
        <CommentAvatar name={displayName} avatarKey={displayAvatarKey} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5 mb-2">
            <span className="text-sm font-semibold leading-none">{displayName}</span>
            <time
              className="text-xs opacity-45"
              dateTime={comment.created_at}
            >
              {formatRelativeTime(comment.created_at)}
            </time>
          </div>

          <div className="text-[15px] leading-relaxed opacity-90">
            <Markdown components={markdownComponents}>{displayBody}</Markdown>
            {truncated && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="mt-1 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: 'var(--color-accent)' }}
              >
                more
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => void onToggleClap(comment.id)}
              className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
              aria-pressed={hasClapped}
              aria-label="Like"
            >
              <Heart
                size={16}
                strokeWidth={hasClapped ? 2.25 : 1.75}
                fill={hasClapped ? '#ef4444' : 'none'}
                color="#ef4444"
                className={hasClapped ? 'opacity-100' : 'opacity-50'}
              />
              <span className={hasClapped ? 'text-red-500' : 'text-red-500 opacity-50'}>
                {comment.clap_count > 0 ? comment.clap_count : ''}
              </span>
            </button>

            {replyCount > 0 && (
              <span className="flex items-center gap-1.5 opacity-50">
                <MessageCircle size={15} strokeWidth={1.75} />
                <span>
                  {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                </span>
              </span>
            )}

            <button
              type="button"
              onClick={() => setReplyOpen((open) => !open)}
              className="opacity-50 transition-opacity hover:opacity-80"
            >
              Reply
            </button>

            {canDelete && (
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="opacity-50 transition-opacity hover:opacity-80 disabled:opacity-30"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>

          {replyOpen && (
            <div className="mt-4">
              <CommentComposer
                authorName={authorName}
                authorAvatarKey={authorAvatarKey}
                onSubmit={handleReplySubmit}
                onCancel={() => setReplyOpen(false)}
                submitting={submitting}
                compact
                autoFocus
              />
            </div>
          )}

          {hasHiddenReplies && (
            <button
              type="button"
              onClick={() => setRepliesExpanded(true)}
              className="mt-4 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-accent)' }}
            >
              {replyCount} more {replyCount === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {showReplies && (
            <div className={nestedClass}>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  authorName={authorName}
                  authorAvatarKey={authorAvatarKey}
                  visitorKey={visitorKey}
                  clappedIds={clappedIds}
                  submitting={submitting}
                  deletingId={deletingId}
                  onSubmit={onSubmit}
                  onDelete={onDelete}
                  onToggleClap={onToggleClap}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
