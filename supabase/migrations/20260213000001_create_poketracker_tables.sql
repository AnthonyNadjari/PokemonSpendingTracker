-- PokeTracker: Supabase-backed tables.
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → paste and Run.

-- Purchases (spending tracker)
create table if not exists public.purchases (
  id text primary key,
  sync_id text not null,
  date date not null,
  item text not null,
  quantity int not null default 1,
  price_gbp numeric(12,2) not null default 0,
  price_eur numeric(12,2),
  price_usd numeric(12,2),
  input_currency text not null default 'gbp',
  source text not null default 'store',
  store_name text default '',
  notes text default '',
  delivery_fee_gbp numeric(12,2) not null default 0,
  delivery_fee_eur numeric(12,2),
  delivery_fee_usd numeric(12,2)
);

create index if not exists idx_purchases_sync_id on public.purchases(sync_id);

alter table public.purchases enable row level security;
drop policy if exists "anon_all_purchases" on public.purchases;
create policy "anon_all_purchases" on public.purchases for all to anon using (true) with check (true);

-- Card entries (card tracker)
create table if not exists public.card_entries (
  id text primary key,
  sync_id text not null,
  series text not null default '',
  weight numeric(10,3) not null default 0,
  cover_picture text default '',
  bipped boolean not null default false,
  had_rare boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_card_entries_sync_id on public.card_entries(sync_id);

alter table public.card_entries enable row level security;
drop policy if exists "anon_all_card_entries" on public.card_entries;
create policy "anon_all_card_entries" on public.card_entries for all to anon using (true) with check (true);

-- Optional: drop old store table if it exists (was used for jsonb blob)
-- drop table if exists public.store;
