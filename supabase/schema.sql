-- Categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- System links table
create table public.system_links (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  url text not null,
  icon text,
  logo_url text,
  category_id uuid references public.categories(id) on delete set null,
  is_active boolean default true,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Announcements table
create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Favorites table (links to user auth.uid())
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  system_link_id uuid references public.system_links(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, system_link_id)
);

-- Profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) setup

-- Enable RLS
alter table public.categories enable row level security;
alter table public.system_links enable row level security;
alter table public.announcements enable row level security;
alter table public.favorites enable row level security;
alter table public.profiles enable row level security;

-- Categories RLS
create policy "Categories are viewable by everyone" on public.categories for select using (true);
create policy "Categories are insertable by admins" on public.categories for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Categories are updatable by admins" on public.categories for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Categories are deletable by admins" on public.categories for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- System Links RLS
create policy "System links are viewable by everyone" on public.system_links for select using (is_active = true or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "System links are insertable by admins" on public.system_links for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "System links are updatable by admins" on public.system_links for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "System links are deletable by admins" on public.system_links for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Announcements RLS
create policy "Announcements are viewable by everyone" on public.announcements for select using (is_active = true or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Announcements are insertable by admins" on public.announcements for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Announcements are updatable by admins" on public.announcements for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Announcements are deletable by admins" on public.announcements for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Favorites RLS
create policy "Users can view their own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "Users can insert their own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete their own favorites" on public.favorites for delete using (auth.uid() = user_id);

-- Profiles RLS
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed data for testing
insert into public.categories (name, description, icon, "order") values 
('IT Systems', 'ระบบสำหรับแผนก IT', 'Monitor', 1),
('Operations', 'ระบบการดำเนินงาน', 'Settings', 2),
('Documents', 'เอกสารและคู่มือ', 'FileText', 3);

-- Note: In real app, replace the category_id with actual UUIDs generated above.
