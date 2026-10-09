// src/lib/db.js
import * as SQLite from "expo-sqlite";

let dbPromise = null;

/**
 * Opens (or creates) the local SQLite database.
 * Runs the schema migration on first open.
 * Cached — subsequent calls return the same handle.
 */
export function getDb() {
  if (!dbPromise) {
    dbPromise = openAndMigrate();
  }
  return dbPromise;
}

async function openAndMigrate() {
  const db = await SQLite.openDatabaseAsync("wildlife.db");

  // Enable WAL for better concurrency
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS incidents (
      id                TEXT PRIMARY KEY NOT NULL,
      client_id         TEXT NOT NULL UNIQUE,
      ranger_id         TEXT NOT NULL,
      patrol_id         TEXT,
      park_id           TEXT,
      incident_type     TEXT NOT NULL,
      description       TEXT,
      latitude          REAL,
      longitude         REAL,
      location_source   TEXT NOT NULL DEFAULT 'auto_gps',
      photo_status      TEXT NOT NULL DEFAULT 'attached',
      photo_uri         TEXT,
      sync_status       TEXT NOT NULL DEFAULT 'pending_sync',
      retry_count       INTEGER NOT NULL DEFAULT 0,
      last_error        TEXT,
      captured_at       TEXT NOT NULL,
      synced_at         TEXT,
      created_at        TEXT NOT NULL,
      updated_at        TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_incidents_sync_status
      ON incidents(sync_status);

    CREATE INDEX IF NOT EXISTS idx_incidents_captured_at
      ON incidents(captured_at DESC);
  `);

  return db;
}
