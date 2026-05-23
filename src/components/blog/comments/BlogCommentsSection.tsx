import { useBlogComments } from '../../../hooks/useBlogComments';
import { CommentComposer } from './CommentComposer';
import { CommentItem } from './CommentItem';

type Props = {
  postSlug: string;
};

function CommentSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-card-theme shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 w-28 rounded bg-card-theme" />
            <div className="h-3 w-16 rounded bg-card-theme" />
            <div className="h-4 w-full rounded bg-card-theme mt-1" />
            <div className="h-4 w-4/5 rounded bg-card-theme" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlogCommentsSection({ postSlug }: Props) {
  const {
    configured,
    loading,
    error,
    comments,
    authorName,
    authorAvatarKey,
    clappedIds,
    submitting,
    deletingId,
    randomizeIdentity,
    submitComment,
    deleteComment,
    toggleClap,
    visitorKey,
  } = useBlogComments(postSlug);

  if (!configured) {
    return (
      <section className="mt-12 pt-10">
        <p className="text-sm opacity-40">Comments unavailable.</p>
      </section>
    );
  }

  return (
    <section className="mt-12 pt-10 ">
      <div className="flex items-baseline justify-between gap-4 mb-8">
        <h2 className="section-label" style={{ fontSize: '11px' }}>
          Responses
        </h2>
        {!loading && comments.length > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-35">
            {comments.length} {comments.length === 1 ? 'response' : 'responses'}
          </span>
        )}
      </div>

      <CommentComposer
        authorName={authorName}
        authorAvatarKey={authorAvatarKey}
        onRandomize={randomizeIdentity}
        onSubmit={(body) => submitComment(body)}
        submitting={submitting}
      />

      {error && (
        <p className="mb-6 text-sm" style={{ color: 'var(--color-accent)' }}>
          {error}
        </p>
      )}

      {loading ? (
        <CommentSkeleton />
      ) : comments.length === 0 ? (
        <p className="text-sm opacity-40 py-2">Be the first to respond.</p>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {comments.map((comment) => (
            <div key={comment.id} className="py-8 first:pt-0">
              <CommentItem
                comment={comment}
                authorName={authorName}
                authorAvatarKey={authorAvatarKey}
                visitorKey={visitorKey}
                clappedIds={clappedIds}
                submitting={submitting}
                deletingId={deletingId}
                onSubmit={submitComment}
                onDelete={deleteComment}
                onToggleClap={toggleClap}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
