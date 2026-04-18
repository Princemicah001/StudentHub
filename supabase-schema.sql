
-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_stat_statements";

-- 2.1 profiles - Extended User Data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  student_id text unique,
  avatar_url text,
  is_vendor boolean default false,
  approval_status text default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2.2 vendors - Business Listings
create table if not exists public.vendors (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  name text not null,
  role text not null, -- specialty from doc
  bio text,
  image text, -- image_url
  whatsapp_number text,
  operating_hours text,
  portfolio_images text[] default '{}',
  specializations text[] default '{}', -- services from doc
  verified boolean default false, -- is_verified
  top_vendor boolean default false, -- is_top_vendor
  is_published boolean default false,
  rating decimal default 5.0, -- score from doc
  success_rate text default '98%',
  experience text default '12y+',
  sales integer default 0,
  followers integer default 0,
  endorsements integer default 0,
  created_at timestamptz default now()
);

-- 2.3 products - Vendor Inventory
create table if not exists public.products (
  id bigint generated always as identity primary key,
  vendor_id bigint references public.vendors(id) on delete cascade,
  name text not null,
  description text,
  price decimal not null,
  image_url text,
  created_at timestamptz default now()
);

-- 2.4 events - Campus Happenings
create table if not exists public.events (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  date timestamptz not null,
  location text,
  image_url text,
  total_seats integer not null default 100,
  seats_remaining integer not null default 100,
  is_featured boolean default false,
  created_at timestamptz default now(),
  constraint seats_range check (seats_remaining >= 0 and seats_remaining <= total_seats)
);

-- 2.5 event_rsvps - Attendance Tracking
create table if not exists public.event_rsvps (
  id bigint generated always as identity primary key,
  event_id bigint references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

-- 2.6 gallery_images - Community Photo Feed
create table if not exists public.gallery_images (
  id bigint generated always as identity primary key,
  image_url text not null,
  tag text,
  tagged_vendor_ids bigint[] default '{}',
  created_at timestamptz default now()
);

-- 2.7 feedback - The Vault (Anonymous Submissions)
create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  content text not null,
  created_at timestamptz default now()
);

-- 2.8 posts - News & Content Management
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  title text not null,
  content text,
  blocks jsonb default '[]',
  published boolean default false,
  scheduled_for timestamptz,
  created_at timestamptz default now()
);

-- 2.9 post_versions - Version History
create table if not exists public.post_versions (
  id bigint generated always as identity primary key,
  post_id bigint references public.posts(id) on delete cascade,
  title text,
  blocks jsonb,
  created_at timestamptz default now()
);

-- 2.10 vendor_applications - Pending Registrations
create table if not exists public.vendor_applications (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  business_name text not null,
  business_description text,
  business_email text,
  business_phone text,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamptz default now()
);

-- 2.11 audit_logs - Admin Accountability
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  action text not null,
  tag text, -- 'DELETE', 'APPROVAL', 'PUBLISH'
  details jsonb default '{}',
  created_at timestamptz default now()
);

-- RLS POLICIES

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Vendors
alter table public.vendors enable row level security;
create policy "Anyone can view published vendors" on public.vendors for select using (is_published = true);
create policy "Vendor owners can view own vendor" on public.vendors for select using (auth.uid() = user_id);
create policy "Vendor owners can update own vendor" on public.vendors for update using (auth.uid() = user_id);

-- Feedback (Vault)
alter table public.feedback enable row level security;
create policy "Anyone can submit feedback" on public.feedback for insert with check (true);
create policy "No one can read feedback" on public.feedback for select using (false);

-- Events
alter table public.events enable row level security;
create policy "Events are viewable by everyone" on public.events for select using (true);

-- Gallery
alter table public.gallery_images enable row level security;
create policy "Gallery is viewable by everyone" on public.gallery_images for select using (true);

-- AUTOMATION TRIGGERS

-- Profile creation on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Event capacity management
create or replace function public.on_rsvp_created()
returns trigger as $$
begin
  update public.events
  set seats_remaining = seats_remaining - 1
  where id = new.event_id and seats_remaining > 0;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_rsvp_added
  after insert on public.event_rsvps
  for each row execute procedure public.on_rsvp_created();

-- Post versioning
create or replace function public.post_versioning()
returns trigger as $$
begin
  insert into public.post_versions (post_id, title, blocks)
  values (old.id, old.title, old.blocks);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_post_updated
  before update on public.posts
  for each row execute procedure public.post_versioning();

-- Realtime Publication
alter publication supabase_realtime add table public.vendors;
alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.event_rsvps;
alter publication supabase_realtime add table public.gallery_images;
alter publication supabase_realtime add table public.posts;
