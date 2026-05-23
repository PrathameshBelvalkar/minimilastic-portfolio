import { Shuffle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { AvatarKey } from '../../../assets/avatars';
import { MAX_COMMENT_CHARS } from '../../../lib/commentUtils';
import { CommentAvatar } from './CommentAvatar';

type Props = {
  authorName: string;
  authorAvatarKey?: AvatarKey;
  onRandomize?: () => void;
  onSubmit: (body: string) => Promise<boolean>;
  onCancel?: () => void;
  submitting?: boolean;
  compact?: boolean;
  autoFocus?: boolean;
};

export function CommentComposer({
  authorName,
  authorAvatarKey,
  onRandomize,
  onSubmit,
  onCancel,
  submitting = false,
  compact = false,
  autoFocus = false,
}: Props) {
  const [body, setBody] = useState('');
  const [expanded, setExpanded] = useState(compact ? true : false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  const trimmedBody = body.trim();
  const charCount = body.length;
  const atCharLimit = charCount >= MAX_COMMENT_CHARS;
  const canSubmit = trimmedBody.length > 0 && charCount <= MAX_COMMENT_CHARS && !submitting;

  const handleBodyChange = (value: string) => {
    setBody(value.length > MAX_COMMENT_CHARS ? value.slice(0, MAX_COMMENT_CHARS) : value);
  };

  const handleCancel = () => {
    setBody('');
    setExpanded(false);
    onCancel?.();
  };

  const handleSubmit = async () => {
    if (honeypotRef.current?.value) return;
    if (!canSubmit) return;

    const ok = await onSubmit(trimmedBody);
    if (ok) {
      setBody('');
      if (!compact) setExpanded(false);
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${compact ? '' : 'pb-8'}`}>
      <div className="flex items-start gap-3">
        {onRandomize ? (
          <button
            type="button"
            onClick={onRandomize}
            className="shrink-0 rounded-full transition-opacity hover:opacity-80"
            aria-label="Randomize name and avatar"
          >
            <CommentAvatar name={authorName} avatarKey={authorAvatarKey} />
          </button>
        ) : (
          <CommentAvatar name={authorName} avatarKey={authorAvatarKey} />
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {authorName}
            </span>
            {onRandomize && (
              <button
                type="button"
                onClick={onRandomize}
                className="flex h-5 w-5 items-center justify-center rounded opacity-35 transition-opacity hover:opacity-70"
                aria-label="Randomize name and avatar"
              >
                <Shuffle size={11} strokeWidth={2.25} />
              </button>
            )}
          </div>

          <div
            className="rounded-xl border border-theme overflow-hidden"
            style={{ background: 'var(--color-card-bg)' }}
          >
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => {
                handleBodyChange(e.target.value);
                if (!expanded) setExpanded(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
              onFocus={() => setExpanded(true)}
              placeholder="What are your thoughts?"
              rows={expanded ? 4 : 2}
              maxLength={MAX_COMMENT_CHARS}
              className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed outline-none placeholder:opacity-40"
              style={{ color: 'var(--color-text)', minHeight: expanded ? '120px' : '72px' }}
            />

            {expanded && (
              <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1">
                <span
                  className={`font-mono text-[10px] uppercase tracking-widest ${
                    atCharLimit ? 'text-red-500' : 'opacity-35'
                  }`}
                >
                  {charCount}/{MAX_COMMENT_CHARS}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm opacity-50 transition-opacity hover:opacity-80"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={!canSubmit}
                    className="rounded-full px-4 py-1.5 text-sm font-medium transition-opacity disabled:opacity-35"
                    style={{
                      background: 'var(--color-text)',
                      color: 'var(--color-bg)',
                    }}
                  >
                    {submitting ? 'Posting…' : 'Respond'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-px w-px opacity-0 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
