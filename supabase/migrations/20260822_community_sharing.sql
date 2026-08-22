alter table public.community_posts add column if not exists trip_id uuid references public.trips(id) on delete set null;
create table if not exists public.community_post_likes (
  id uuid primary key default gen_random_uuid(), post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, created_at timestamptz not null default now(), unique(post_id,user_id)
);
create index if not exists community_posts_trip_idx on public.community_posts(trip_id);
alter table public.community_post_likes enable row level security;
drop policy if exists "community likes visible" on public.community_post_likes;
create policy "community likes visible" on public.community_post_likes for select to authenticated using (exists(select 1 from public.community_posts p where p.id=post_id and (p.is_public or p.user_id=auth.uid())));
drop policy if exists "community likes insert public" on public.community_post_likes;
create policy "community likes insert public" on public.community_post_likes for insert to authenticated with check (user_id=auth.uid() and exists(select 1 from public.community_posts p where p.id=post_id and p.is_public));
drop policy if exists "community likes delete own" on public.community_post_likes;
create policy "community likes delete own" on public.community_post_likes for delete to authenticated using (user_id=auth.uid());
