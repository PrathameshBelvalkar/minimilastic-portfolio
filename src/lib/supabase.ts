import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url!, key!);
  }
  return client;
}

export type BlogCommentRow = {
  id: string;
  post_slug: string;
  parent_id: string | null;
  author_name: string;
  author_avatar_key: string | null;
  visitor_key: string | null;
  body: string;
  clap_count: number;
  created_at: string;
};

export type BlogCommentClapRow = {
  id: string;
  comment_id: string;
  visitor_key: string;
  created_at: string;
};
