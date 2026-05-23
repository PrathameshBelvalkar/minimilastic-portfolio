import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildCommentTree, isWithinCharLimit, MAX_COMMENT_CHARS, removeCommentSubtree, type CommentNode } from '../lib/commentUtils';
import { getAuthorName, getVisitorAvatarKey, getVisitorKey, randomizeVisitorIdentity } from '../lib/commentVisitor';
import { getSupabase, isSupabaseConfigured, type BlogCommentRow } from '../lib/supabase';
import type { AvatarKey } from '../assets/avatars';

type UseBlogCommentsResult = {
  configured: boolean;
  loading: boolean;
  error: string | null;
  comments: CommentNode[];
  authorName: string;
  authorAvatarKey: AvatarKey;
  visitorKey: string;
  clappedIds: Set<string>;
  submitting: boolean;
  deletingId: string | null;
  randomizeIdentity: () => void;
  submitComment: (body: string, parentId?: string | null) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;
  toggleClap: (commentId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useBlogComments(postSlug: string): UseBlogCommentsResult {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<BlogCommentRow[]>([]);
  const [clappedIds, setClappedIds] = useState<Set<string>>(new Set());
  const [authorName, setAuthorName] = useState(getAuthorName);
  const [authorAvatarKey, setAuthorAvatarKey] = useState(getVisitorAvatarKey);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const visitorKey = useMemo(() => getVisitorKey(), []);
  const comments = useMemo(() => buildCommentTree(rows), [rows]);

  const refresh = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data: commentData, error: commentError } = await supabase
      .from('blog_comments')
      .select('id, post_slug, parent_id, author_name, author_avatar_key, visitor_key, body, clap_count, created_at')
      .eq('post_slug', postSlug)
      .order('created_at', { ascending: true });

    if (commentError) {
      setError(commentError.message);
      setLoading(false);
      return;
    }

    const nextRows = (commentData ?? []) as BlogCommentRow[];
    setRows(nextRows);

    if (nextRows.length === 0) {
      setClappedIds(new Set());
      setLoading(false);
      return;
    }

    const commentIds = nextRows.map((row) => row.id);
    const { data: clapData, error: clapError } = await supabase
      .from('blog_comment_claps')
      .select('comment_id')
      .eq('visitor_key', visitorKey)
      .in('comment_id', commentIds);

    if (clapError) {
      setError(clapError.message);
    } else {
      setClappedIds(new Set((clapData ?? []).map((row) => row.comment_id as string)));
    }

    setLoading(false);
  }, [postSlug, visitorKey]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const randomizeIdentity = useCallback(async () => {
    const next = randomizeVisitorIdentity();
    setAuthorName(next.name);
    setAuthorAvatarKey(next.avatarKey);

    const supabase = getSupabase();
    if (!supabase) return;

    const { error: updateError } = await supabase
      .from('blog_comments')
      .update({
        author_name: next.name,
        author_avatar_key: next.avatarKey,
      })
      .eq('visitor_key', visitorKey);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setRows((prev) =>
      prev.map((row) =>
        row.visitor_key === visitorKey
          ? { ...row, author_name: next.name, author_avatar_key: next.avatarKey }
          : row,
      ),
    );
  }, [visitorKey]);

  const submitComment = useCallback(
    async (body: string, parentId?: string | null) => {
      const supabase = getSupabase();
      const trimmedBody = body.trim();

      if (!supabase || !trimmedBody || !authorName) return false;
      if (!isWithinCharLimit(trimmedBody)) {
        setError(`Comments are limited to ${MAX_COMMENT_CHARS} characters.`);
        return false;
      }

      setSubmitting(true);
      setError(null);

      const payload = {
        post_slug: postSlug,
        parent_id: parentId ?? null,
        author_name: authorName,
        author_avatar_key: authorAvatarKey,
        visitor_key: visitorKey,
        body: trimmedBody,
      };

      const { data, error: insertError } = await supabase
        .from('blog_comments')
        .insert(payload)
        .select('id, post_slug, parent_id, author_name, author_avatar_key, visitor_key, body, clap_count, created_at')
        .single();

      setSubmitting(false);

      if (insertError) {
        setError(insertError.message);
        return false;
      }

      if (data) {
        setRows((prev) => [...prev, data as BlogCommentRow]);
      }
      return true;
    },
    [authorAvatarKey, authorName, postSlug, visitorKey],
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      const supabase = getSupabase();
      if (!supabase) return false;

      const target = rows.find((row) => row.id === commentId);
      if (!target || target.visitor_key !== visitorKey) return false;

      setDeletingId(commentId);
      setError(null);

      const { error: deleteError } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId)
        .eq('visitor_key', visitorKey);

      setDeletingId(null);

      if (deleteError) {
        setError(deleteError.message);
        return false;
      }

      const removedIds = new Set<string>();
      const markRemoved = (id: string) => {
        removedIds.add(id);
        for (const row of rows) {
          if (row.parent_id === id) markRemoved(row.id);
        }
      };
      markRemoved(commentId);

      setRows((prev) => removeCommentSubtree(prev, commentId));
      setClappedIds((prev) => new Set([...prev].filter((id) => !removedIds.has(id))));
      return true;
    },
    [rows, visitorKey],
  );

  const toggleClap = useCallback(
    async (commentId: string) => {
      const supabase = getSupabase();
      if (!supabase) return;

      const hasClapped = clappedIds.has(commentId);

      if (hasClapped) {
        const { error: deleteError } = await supabase
          .from('blog_comment_claps')
          .delete()
          .eq('comment_id', commentId)
          .eq('visitor_key', visitorKey);

        if (deleteError) {
          setError(deleteError.message);
          return;
        }

        setClappedIds((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
        setRows((prev) =>
          prev.map((row) =>
            row.id === commentId
              ? { ...row, clap_count: Math.max(row.clap_count - 1, 0) }
              : row,
          ),
        );
        return;
      }

      const { error: insertError } = await supabase.from('blog_comment_claps').insert({
        comment_id: commentId,
        visitor_key: visitorKey,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setClappedIds((prev) => new Set(prev).add(commentId));
      setRows((prev) =>
        prev.map((row) =>
          row.id === commentId ? { ...row, clap_count: row.clap_count + 1 } : row,
        ),
      );
    },
    [clappedIds, visitorKey],
  );

  return {
    configured: isSupabaseConfigured,
    loading,
    error,
    comments,
    authorName,
    authorAvatarKey,
    visitorKey,
    clappedIds,
    submitting,
    deletingId,
    randomizeIdentity,
    submitComment,
    deleteComment,
    toggleClap,
    refresh,
  };
}
