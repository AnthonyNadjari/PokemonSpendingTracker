# Multi-Category Support (Pokemon + One Piece)

## Data Model

Add `category: "pokemon" | "onepiece"` to both purchases and card entries.
- Default for new entries: `"onepiece"`
- Migration: all existing entries get `"pokemon"`
- Supabase: column `category TEXT DEFAULT 'pokemon'` on both tables

## Spending Tab

### Dashboard Cards
1. **Total Spent** - all categories combined
2. **This Period** - all categories, current payday period
3. **Pokemon Only** (replaces Total Items) - Pokemon spending total + count
4. **Category Breakdown** (replaces Source Breakdown) - Pokemon vs One Piece % bars

### Category Toggle (Pokemon / One Piece / All)
- Filters table and chart only
- Dashboard cards stay fixed as described above
- Default: All

## Card Tracker Tab

### Category Toggle (Pokemon / One Piece / Both)
- Filters dashboard stats, card table, pull rate table
- Default: Pokemon

### Add/Edit Form
- Category selector, default One Piece

## Exchange Rate Fix
- Add cache-busting to rate fetch request

## Database Safety
- Upsert merge-duplicates handles new column gracefully
- sync_id + id composite key untouched
- No DELETE operations, no schema changes needed
