# PokeTracker - Pokemon Card Spending Tracker

## Project Overview
A single-page web app (pure HTML/CSS/JS, no build step) for tracking Pokemon TCG spending. Hosted on GitHub Pages at `anthonynadjari.github.io`.

## Architecture
- **Single file**: `index.html` contains all HTML, CSS, and JavaScript
- **Data files**: `data.json` (purchase seed data), `card_data.json` (card tracker seed data)
- **Storage**: localStorage for persistence (`poketracker_purchases`, `poketracker_cards`, `poketracker_stores`, `poketracker_theme`)
- **No framework**: Vanilla JS, Chart.js for bar charts, Google Fonts (DM Sans, Exo 2)
- **Currency**: GBP as base currency, with live EUR/USD conversion via `open.er-api.com`

## Key Data Structures

### Purchase Entry
```json
{
  "id": "uuid",
  "date": "YYYY-MM-DD",
  "item": "string",
  "quantity": 1,
  "price_gbp": 0.00,
  "price_eur": 0.00,
  "price_usd": 0.00,
  "source": "store|online|market",
  "store_name": "string",
  "notes": "string",
  "delivery_fee_gbp": 0.00
}
```

### Card Entry
```json
{
  "id": "uuid",
  "series": "string",
  "weight": 0.000,
  "cover_picture": "string|null",
  "bipped": false,
  "had_rare": false,
  "created_at": "ISO datetime"
}
```

## Features
- **Spending tab**: Dashboard cards, bar chart (month or 23-to-23 payday periods), filterable/sortable table
- **Card Tracker tab**: Weight & pull rate tracking for booster packs
- **Delivery fees**: Online purchases can have a separate delivery fee field
- **Period toggle**: Chart supports "Month" or "23–23" (payday) grouping; clicking a bar filters the table
- **Dark/Light mode**: Toggle with system preference detection
- **Import/Export**: JSON files for both purchase and card data
- **Mobile responsive**: Card-style layout on mobile, desktop table on larger screens

## Important Notes
- All prices stored in GBP as base; EUR/USD computed from rates
- The user gets paid on the 23rd, so "23–23" period mode is the default
- **Sync:** Spends and cards are synced via Supabase (`store` table: rows `{syncId}_purchases` and `{syncId}_cards`). Same data on all devices when you open the "Copy link" URL. localStorage is used as cache; cloud is source of truth when sync is configured.
- The user is UK-based, prices are typically in GBP
- Store names are persisted separately and auto-synced from purchases

## Branch
Main development branch: `claude/pokemon-expense-tracker-CKSKd`
