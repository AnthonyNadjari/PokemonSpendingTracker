# What happened to the spending data

## You didn’t run any script

The wipe was **not** from you running the seed script. It was from the **app** writing to Supabase.

When you add, edit, or delete a purchase, the app saves by:
1. Deleting all purchases for your sync_id in Supabase  
2. Posting the current list from the page  

If the page ever had **zero** purchases in memory (e.g. load failed, or another tab had empty data) and then a save was triggered, the app would send “delete all, then post nothing” → **database emptied**.

## Fix that’s in place now

The app **no longer syncs when the list is empty**:

- If purchases = 0 → it does **not** run the delete/save. The database is left as-is.
- Same for cards: if cardEntries = 0 → no sync.

So the app can **no longer** wipe the database by accident. Refreshing or a failed load might show empty on screen, but it will not overwrite Supabase with empty.

## Your data right now

Data has been restored again from the project’s `data.json` and `card_data.json` (10 purchases, 86 card entries). After a refresh you should see it.

## Same for cards

Spending and cards both use the same **sync_id** (`main`). The app no longer reads sync_id from localStorage, so on every refresh it loads both purchases and card entries from `main`. Cards should no longer revert or show empty after refresh.

## For later

- **Refreshing** only loads; it doesn’t write. Safe.
- **Add/edit/delete** in the app writes to Supabase. Safe.
- **Empty list** is never written anymore; the safeguard above prevents that.
- **sync_id** is always `main` (unless you use `?sync=...` in the URL), so no stale id from localStorage.
