# One-time Supabase setup (2 minutes)

Your app uses **https://dccsgzsjxooepyzirsul.supabase.co**. Create the tables once:

1. **Open the SQL Editor** for your project:  
   **https://supabase.com/dashboard/project/dccsgzsjxooepyzirsul/sql/new**

2. **Paste the SQL below** into the editor (replace any existing text).

3. Click **Run** (or press Ctrl+Enter).

4. Reload your website. Data will load from and save to Supabase.

---

Copy everything below this line into the SQL Editor:

```
-- Remove old table if it exists (from a previous setup)
drop table if exists public.store;

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
```
