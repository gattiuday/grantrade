-- ==============================================================================
-- GRAN TRADE INC. — PRODUCTION DATABASE SCHEMA (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Create Stones Catalog Table
create table if not exists public.stones (
  id text primary key,
  name text not null,
  gt_number text,
  lot_number text,
  category text not null check (category in ('quartz', 'granite', 'marble', 'quartzite', 'monuments', 'semi', 'soapstone', 'tile')),
  category_label text,
  type text not null default 'natural' check (type in ('natural', 'engineered')),
  type_label text,
  finish text default 'Polished',
  thickness text default '2 cm · 3 cm',
  size text,
  origin text,
  colors text[] default '{}',
  color_label text,
  application text,
  description text,
  image1 text not null,
  image2 text,
  in_stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for high-performance multi-facet filtering and search
create index if not exists idx_stones_category on public.stones (category);
create index if not exists idx_stones_instock on public.stones (in_stock);
create index if not exists idx_stones_gt on public.stones (gt_number);
create index if not exists idx_stones_lot on public.stones (lot_number);

-- 3. Create Wholesale Inquiries Table (Lead Capture from contact.html)
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null check (char_length(full_name) between 1 and 120 and full_name !~* '<\s*script|<\?php'),
  company text check (company is null or char_length(company) <= 160),
  email text not null check (char_length(email) <= 160 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  role text default 'fabricator' check (char_length(role) <= 60),
  stone_interest text check (stone_interest is null or char_length(stone_interest) <= 200),
  message text not null check (char_length(message) between 1 and 3000 and message !~* '<\s*script|<\?php|javascript:'),
  status text not null default 'new' check (status in ('new', 'contacted', 'held', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_status on public.inquiries (status);
create index if not exists idx_inquiries_created on public.inquiries (created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.stones enable row level security;
alter table public.inquiries enable row level security;

-- 5. Define Public & Admin Policies

-- STONES: Public can view all stones (read-only)
drop policy if exists "Public stones are viewable by everyone" on public.stones;
create policy "Public stones are viewable by everyone"
  on public.stones for select
  using (true);

-- STONES: Authenticated admins can insert, update, and delete
drop policy if exists "Admins can manage stones" on public.stones;
create policy "Admins can manage stones"
  on public.stones for all
  to authenticated
  using (true)
  with check (true);

-- INQUIRIES: Public can submit inquiries
drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

-- INQUIRIES: Authenticated admins can view and update inquiries
drop policy if exists "Admins can view inquiries" on public.inquiries;
create policy "Admins can view inquiries"
  on public.inquiries for select
  to authenticated
  using (true);

drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries"
  on public.inquiries for update
  to authenticated
  using (true)
  with check (true);

-- 6. Storage Bucket for Slab Photography & Showroom Assets
-- (Run this in the Supabase Dashboard -> Storage -> Create new bucket 'stone-media', public: true)
insert into storage.buckets (id, name, public)
values ('stone-media', 'stone-media', true)
on conflict (id) do nothing;

-- Storage RLS: Public read access
create policy "Public stone media read"
  on storage.objects for select
  using (bucket_id = 'stone-media');

-- Storage RLS: Admin upload and delete access
create policy "Admin stone media upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'stone-media');

create policy "Admin stone media delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'stone-media');

-- 7. Updated-At Trigger Function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_stones_updated_at on public.stones;
create trigger set_stones_updated_at
  before update on public.stones
  for each row execute function public.handle_updated_at();

