// One-time setup: creates purchases and card_entries tables.
// Deploy: supabase functions deploy run-migration
// Set secret: supabase secrets set SUPABASE_DB_URL="postgresql://..." (from Dashboard → Settings → Database → URI)
// Then call POST /functions/v1/run-migration with Authorization: Bearer <anon_key>

const MIGRATION_SQL = `
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
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors() });
  }
  const dbUrl = Deno.env.get("SUPABASE_DB_URL") ?? Deno.env.get("DATABASE_URL");
  if (!dbUrl?.startsWith("postgres")) {
    return new Response(
      JSON.stringify({ error: "SUPABASE_DB_URL or DATABASE_URL secret not set" }),
      { status: 500, headers: { ...cors(), "Content-Type": "application/json" } }
    );
  }
  try {
    const { default: postgres } = await import("npm:postgres@3.4.3");
    const sql = postgres(dbUrl, { max: 1, ssl: "require" });
    await sql.unsafe(MIGRATION_SQL);
    await sql.end();
    return new Response(
      JSON.stringify({ ok: true, message: "Tables created." }),
      { status: 200, headers: { ...cors(), "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...cors(), "Content-Type": "application/json" } }
    );
  }
});

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
  };
}
