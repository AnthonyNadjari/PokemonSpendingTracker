'use strict';
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!dbUrl || !dbUrl.startsWith('postgres')) {
  console.error('Set SUPABASE_DB_URL (or DATABASE_URL) to your Supabase database connection string.');
  console.error('Get it from: Supabase Dashboard → Project Settings → Database → Connection string (URI).');
  process.exit(1);
}

const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260213000001_create_poketracker_tables.sql');
const sql = fs.readFileSync(migrationPath, 'utf8');

async function run() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration applied: purchases and card_entries tables are ready.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
