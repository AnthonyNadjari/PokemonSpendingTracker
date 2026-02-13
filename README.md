# PokeTracker – Pokemon Card Spending Tracker

Single-page app for tracking Pokemon TCG spending and card pulls. Data is stored in **Supabase** at `https://dccsgzsjxooepyzirsul.supabase.co`.

## One-time setup: create tables

The app needs two tables in Supabase. No terminal, no password:

1. Open **SETUP-SUPABASE.md** in this folder.
2. Follow the 3 steps: open the SQL Editor link, paste the SQL, click Run.
3. Reload the website. The app will load and save data to Supabase.

**Seeded data:** Open the app with `?sync=main` in the URL to see the 6 purchases and 86 cards. To re-seed: `node scripts/seed-supabase.js "path/to/data.json" "path/to/card_entries.json"`.

After that: open the site → data loads from Supabase; add or edit entries → they are pushed to Supabase. Same data on every device that uses the same sync link (use “Copy link” in the app).
