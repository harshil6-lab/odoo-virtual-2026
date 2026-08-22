create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '', avatar_url text, language text not null default 'English',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.cities (
  id text primary key, name text not null, country text not null, image_url text,
  cost_index smallint not null check(cost_index between 1 and 5), popularity smallint not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.activities (
  id text primary key, city_id text not null references public.cities(id) on delete cascade,
  name text not null, category text not null check(category in ('sightseeing','food','culture','adventure','nature','nightlife')),
  cost numeric(10,2) not null default 0 check(cost>=0), duration_minutes integer not null check(duration_minutes>0),
  description text not null default '', image_url text, created_at timestamptz not null default now()
);
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null, description text, start_date date not null, end_date date not null check(end_date>=start_date), cover_image text,
  budget numeric(12,2) not null default 0 check(budget>=0), is_public boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.trip_stops (
  id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.trips(id) on delete cascade,
  city_id text not null references public.cities(id), start_date date, end_date date, position integer not null default 0,
  created_at timestamptz not null default now(), constraint stop_dates check(end_date is null or start_date is null or end_date>=start_date)
);
create table if not exists public.trip_activities (
  id uuid primary key default gen_random_uuid(), trip_stop_id uuid not null references public.trip_stops(id) on delete cascade,
  activity_id text not null references public.activities(id), scheduled_date date, scheduled_time time, custom_cost numeric(10,2) check(custom_cost>=0), notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.trip_expenses (
  id uuid primary key default gen_random_uuid(), trip_id uuid not null references public.trips(id) on delete cascade,
  category text not null check(category in ('transport','accommodation','activities','meals','other')),
  description text not null default '', amount numeric(10,2) not null check(amount>=0), date date, created_at timestamptz not null default now()
);
create index if not exists trips_user_id_idx on public.trips(user_id);
create index if not exists trips_public_idx on public.trips(id) where is_public=true;
create index if not exists stops_trip_position_idx on public.trip_stops(trip_id,position);
create index if not exists activities_city_idx on public.activities(city_id);
create index if not exists trip_activities_stop_date_idx on public.trip_activities(trip_stop_id,scheduled_date);
create index if not exists expenses_trip_idx on public.trip_expenses(trip_id);
create table if not exists public.trip_likes (id uuid primary key default gen_random_uuid(),trip_id uuid not null references public.trips(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,created_at timestamptz not null default now(),unique(trip_id,user_id));
create table if not exists public.trip_comments (id uuid primary key default gen_random_uuid(),trip_id uuid not null references public.trips(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,content text not null check(char_length(trim(content)) between 1 and 500),created_at timestamptz not null default now());

alter table public.profiles enable row level security;alter table public.cities enable row level security;alter table public.activities enable row level security;
alter table public.trips enable row level security;alter table public.trip_stops enable row level security;alter table public.trip_activities enable row level security;alter table public.trip_expenses enable row level security;
alter table public.trip_likes enable row level security;alter table public.trip_comments enable row level security;
create policy "public likes readable" on public.trip_likes for select using(exists(select 1 from public.trips t where t.id=trip_id and t.is_public));
create policy "own likes insert" on public.trip_likes for insert with check(user_id=auth.uid() and exists(select 1 from public.trips t where t.id=trip_id and t.is_public));
create policy "own likes delete" on public.trip_likes for delete using(user_id=auth.uid());
create policy "public comments readable" on public.trip_comments for select using(exists(select 1 from public.trips t where t.id=trip_id and t.is_public));
create policy "own comments insert" on public.trip_comments for insert with check(user_id=auth.uid() and exists(select 1 from public.trips t where t.id=trip_id and t.is_public));
create policy "own comments delete" on public.trip_comments for delete using(user_id=auth.uid());
create policy "catalog cities readable" on public.cities for select using(true);
create policy "catalog activities readable" on public.activities for select using(true);
create policy "own profile" on public.profiles for all using(auth.uid()=id) with check(auth.uid()=id);
create policy "own or public trips readable" on public.trips for select using(user_id=auth.uid() or is_public);
create policy "own trips insert" on public.trips for insert with check(user_id=auth.uid());
create policy "own trips update" on public.trips for update using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "own trips delete" on public.trips for delete using(user_id=auth.uid());
create policy "own or public stops readable" on public.trip_stops for select using(exists(select 1 from public.trips t where t.id=trip_id and (t.user_id=auth.uid() or t.is_public)));
create policy "own stops write" on public.trip_stops for all using(exists(select 1 from public.trips t where t.id=trip_id and t.user_id=auth.uid())) with check(exists(select 1 from public.trips t where t.id=trip_id and t.user_id=auth.uid()));
create policy "own or public trip activities readable" on public.trip_activities for select using(exists(select 1 from public.trip_stops s join public.trips t on t.id=s.trip_id where s.id=trip_stop_id and (t.user_id=auth.uid() or t.is_public)));
create policy "own trip activities write" on public.trip_activities for all using(exists(select 1 from public.trip_stops s join public.trips t on t.id=s.trip_id where s.id=trip_stop_id and t.user_id=auth.uid())) with check(exists(select 1 from public.trip_stops s join public.trips t on t.id=s.trip_id where s.id=trip_stop_id and t.user_id=auth.uid()));
create policy "own or public expenses readable" on public.trip_expenses for select using(exists(select 1 from public.trips t where t.id=trip_id and (t.user_id=auth.uid() or t.is_public)));
create policy "own expenses write" on public.trip_expenses for all using(exists(select 1 from public.trips t where t.id=trip_id and t.user_id=auth.uid())) with check(exists(select 1 from public.trips t where t.id=trip_id and t.user_id=auth.uid()));
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$begin insert into public.profiles(id,name) values(new.id,coalesce(new.raw_user_meta_data->>'name',''));return new;end;$$;
drop trigger if exists on_auth_user_created on auth.users;create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
