create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 5000),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_posts_feed_idx on public.community_posts(is_public, created_at desc);
create index if not exists community_posts_user_idx on public.community_posts(user_id, created_at desc);
create index if not exists community_comments_post_idx on public.community_comments(post_id, created_at);

alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;

drop policy if exists "community posts visible" on public.community_posts;
create policy "community posts visible" on public.community_posts for select to authenticated
  using (is_public or user_id = auth.uid());
drop policy if exists "community posts insert own" on public.community_posts;
create policy "community posts insert own" on public.community_posts for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "community posts update own" on public.community_posts;
create policy "community posts update own" on public.community_posts for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "community posts delete own" on public.community_posts;
create policy "community posts delete own" on public.community_posts for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "community comments visible" on public.community_comments;
create policy "community comments visible" on public.community_comments for select to authenticated
  using (exists (select 1 from public.community_posts p where p.id = post_id and (p.is_public or p.user_id = auth.uid())));
drop policy if exists "community comments insert visible" on public.community_comments;
create policy "community comments insert visible" on public.community_comments for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.community_posts p where p.id = post_id and (p.is_public or p.user_id = auth.uid())));
drop policy if exists "community comments update own" on public.community_comments;
create policy "community comments update own" on public.community_comments for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "community comments delete own" on public.community_comments;
create policy "community comments delete own" on public.community_comments for delete to authenticated
  using (user_id = auth.uid());
