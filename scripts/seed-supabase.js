'use strict';
const fs = require('fs');
const path = require('path');

const SUPABASE_BASE = process.env.SUPABASE_BASE || 'https://dccsgzsjxooepyzirsul.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjY3NnenNqeG9vZXB5emlyc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTg1NjEsImV4cCI6MjA4NjU5NDU2MX0._87ALMlLFK_b8pjuARDymzWg5GyyGG6dsBhhsewi8Eo';
const SYNC_ID = process.env.SYNC_ID || 'main';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal'
};

async function run() {
  const dataPath = process.argv[2] || path.join(__dirname, '..', 'data.json');
  const cardsPath = process.argv[3] || path.join(__dirname, '..', 'card_data.json');

  let purchases = [];
  let cards = [];
  try {
    purchases = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    console.error('Could not read purchases from', dataPath, e.message);
    process.exit(1);
  }
  try {
    cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
  } catch (e) {
    console.error('Could not read cards from', cardsPath, e.message);
    process.exit(1);
  }

  if (!Array.isArray(purchases)) purchases = [];
  if (!Array.isArray(cards)) cards = [];

  const purchaseRows = purchases.map(function (p) {
    return {
      id: p.id,
      sync_id: SYNC_ID,
      date: p.date,
      item: p.item || '',
      quantity: p.quantity != null ? p.quantity : 1,
      price_gbp: p.price_gbp != null ? p.price_gbp : 0,
      price_eur: p.price_eur != null ? p.price_eur : null,
      price_usd: p.price_usd != null ? p.price_usd : null,
      input_currency: p.input_currency || 'gbp',
      source: p.source || 'store',
      store_name: p.store_name || '',
      notes: p.notes || '',
      delivery_fee_gbp: p.delivery_fee_gbp != null ? p.delivery_fee_gbp : 0,
      delivery_fee_eur: p.delivery_fee_eur != null ? p.delivery_fee_eur : null,
      delivery_fee_usd: p.delivery_fee_usd != null ? p.delivery_fee_usd : null
    };
  });

  const cardRows = cards.map(function (c) {
    return {
      id: c.id,
      sync_id: SYNC_ID,
      series: c.series || '',
      weight: c.weight != null ? c.weight : 0,
      cover_picture: c.cover_picture || '',
      bipped: !!c.bipped,
      had_rare: !!c.had_rare,
      created_at: c.created_at || new Date().toISOString()
    };
  });

  const base = SUPABASE_BASE.replace(/\/$/, '');

  // Clear existing rows for this sync_id, then insert
  const delPurchases = fetch(base + '/rest/v1/purchases?sync_id=eq.' + encodeURIComponent(SYNC_ID), {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
  });
  const delCards = fetch(base + '/rest/v1/card_entries?sync_id=eq.' + encodeURIComponent(SYNC_ID), {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
  });
  await delPurchases;
  await delCards;

  if (purchaseRows.length) {
    const res = await fetch(base + '/rest/v1/purchases', {
      method: 'POST',
      headers,
      body: JSON.stringify(purchaseRows)
    });
    if (!res.ok) {
      console.error('Purchases insert failed:', res.status, await res.text());
      process.exit(1);
    }
    console.log('Inserted', purchaseRows.length, 'purchases.');
  }
  if (cardRows.length) {
    const res = await fetch(base + '/rest/v1/card_entries', {
      method: 'POST',
      headers,
      body: JSON.stringify(cardRows)
    });
    if (!res.ok) {
      console.error('Card entries insert failed:', res.status, await res.text());
      process.exit(1);
    }
    console.log('Inserted', cardRows.length, 'card entries.');
  }

  console.log('Done. Open your app with ?sync=' + SYNC_ID + ' to see this data (e.g. bookmark that URL).');
}

run().catch(function (err) {
  console.error(err);
  process.exit(1);
});
