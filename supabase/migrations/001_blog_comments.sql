create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null check (char_length(trim(post_slug)) > 0),
  parent_id uuid references public.blog_comments (id) on delete cascade,
  author_name text not null check (char_length(trim(author_name)) between 1 and 60),
  author_avatar_key text check (
    author_avatar_key is null or char_length(trim(author_avatar_key)) between 1 and 32
  ),
  visitor_key uuid,
  body text not null check (char_length(trim(body)) between 1 and 1200),
  clap_count integer not null default 0 check (clap_count >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.blog_comment_claps (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.blog_comments (id) on delete cascade,
  visitor_key uuid not null,
  created_at timestamptz not null default now(),
  unique (comment_id, visitor_key)
);

alter table public.blog_comments
  add column if not exists author_avatar_key text;

alter table public.blog_comments
  add column if not exists visitor_key uuid;

alter table public.blog_comments
  drop constraint if exists blog_comments_author_avatar_key_check;

alter table public.blog_comments
  add constraint blog_comments_author_avatar_key_check
  check (author_avatar_key is null or char_length(trim(author_avatar_key)) between 1 and 32);

alter table public.blog_comments
  drop constraint if exists blog_comments_body_check;

alter table public.blog_comments
  add constraint blog_comments_body_check
  check (char_length(trim(body)) between 1 and 1200);

create index if not exists blog_comments_post_slug_created_at_idx
  on public.blog_comments (post_slug, created_at);

create index if not exists blog_comments_parent_id_idx
  on public.blog_comments (parent_id);

create index if not exists blog_comments_visitor_key_idx
  on public.blog_comments (visitor_key);

create index if not exists blog_comment_claps_comment_id_idx
  on public.blog_comment_claps (comment_id);

create or replace function public.sync_blog_comment_clap_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.blog_comments
    set clap_count = clap_count + 1
    where id = new.comment_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.blog_comments
    set clap_count = greatest(clap_count - 1, 0)
    where id = old.comment_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists blog_comment_claps_sync_count on public.blog_comment_claps;

create trigger blog_comment_claps_sync_count
after insert or delete on public.blog_comment_claps
for each row
execute function public.sync_blog_comment_clap_count();

alter table public.blog_comments enable row level security;
alter table public.blog_comment_claps enable row level security;

drop policy if exists "blog_comments_select" on public.blog_comments;
create policy "blog_comments_select"
  on public.blog_comments
  for select
  to anon, authenticated
  using (true);

drop policy if exists "blog_comments_insert" on public.blog_comments;
create policy "blog_comments_insert"
  on public.blog_comments
  for insert
  to anon, authenticated
  with check (
    char_length(trim(post_slug)) > 0
    and char_length(trim(author_name)) between 1 and 60
    and char_length(trim(body)) between 1 and 1200
  );

drop policy if exists "blog_comments_update_identity" on public.blog_comments;
create policy "blog_comments_update_identity"
  on public.blog_comments
  for update
  to anon, authenticated
  using (visitor_key is not null)
  with check (
    char_length(trim(author_name)) between 1 and 60
    and author_avatar_key is not null
    and char_length(trim(author_avatar_key)) between 1 and 32
  );

drop policy if exists "blog_comments_delete_own" on public.blog_comments;
create policy "blog_comments_delete_own"
  on public.blog_comments
  for delete
  to anon, authenticated
  using (visitor_key is not null);

drop policy if exists "blog_comment_claps_select" on public.blog_comment_claps;
create policy "blog_comment_claps_select"
  on public.blog_comment_claps
  for select
  to anon, authenticated
  using (true);

drop policy if exists "blog_comment_claps_insert" on public.blog_comment_claps;
create policy "blog_comment_claps_insert"
  on public.blog_comment_claps
  for insert
  to anon, authenticated
  with check (visitor_key is not null);

drop policy if exists "blog_comment_claps_delete" on public.blog_comment_claps;
create policy "blog_comment_claps_delete"
  on public.blog_comment_claps
  for delete
  to anon, authenticated
  using (true);
