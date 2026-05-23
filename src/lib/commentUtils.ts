import type { BlogCommentRow } from './supabase';

export type CommentNode = BlogCommentRow & {
  replies: CommentNode[];
};

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function buildCommentTree(rows: BlogCommentRow[]): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const row of rows) {
    byId.set(row.id, { ...row, replies: [] });
  }

  for (const node of byId.values()) {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function countReplies(node: CommentNode): number {
  let total = node.replies.length;
  for (const reply of node.replies) {
    total += countReplies(reply);
  }
  return total;
}

export function shouldTruncate(body: string, maxLength = 320): boolean {
  return body.length > maxLength;
}

export function truncateBody(body: string, maxLength = 320): string {
  if (body.length <= maxLength) return body;
  return `${body.slice(0, maxLength).trimEnd()}…`;
}

export const MAX_COMMENT_CHARS = 1200;

export function isWithinCharLimit(text: string, maxChars = MAX_COMMENT_CHARS): boolean {
  return text.length <= maxChars;
}

export function removeCommentSubtree(rows: BlogCommentRow[], targetId: string): BlogCommentRow[] {
  const toRemove = new Set<string>();

  const mark = (id: string) => {
    toRemove.add(id);
    for (const row of rows) {
      if (row.parent_id === id) mark(row.id);
    }
  };

  mark(targetId);
  return rows.filter((row) => !toRemove.has(row.id));
}
