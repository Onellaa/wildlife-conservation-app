// src/services/log-field-incident/incidentService.js
import { getDb } from "../../../lib/db";

const nowIso = () => new Date().toISOString();

/**
 * Saves a new incident locally. Always called first — before any network attempt.
 */
export async function saveLocally(incident) {
  const db = await getDb();
  const now = nowIso();

  await db.runAsync(
    `INSERT INTO incidents (
       id, client_id, ranger_id, patrol_id, park_id,
       incident_type, description, latitude, longitude,
       location_source, photo_status, photo_uri,
       sync_status, retry_count,
       captured_at, synced_at, created_at, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      incident.id,
      incident.clientId,
      incident.rangerId,
      incident.patrolId,
      incident.parkId,
      incident.incidentType,
      incident.description ?? "",
      incident.latitude ?? null,
      incident.longitude ?? null,
      incident.locationSource ?? "auto_gps",
      incident.photoStatus ?? "attached",
      incident.photoUris?.[0] ?? null,
      "pending_sync",
      0,
      incident.capturedAt,
      null,
      now,
      now,
    ],
  );

  return incident.id;
}

export async function getPendingIncidents() {
  const db = await getDb();
  return await db.getAllAsync(
    `SELECT * FROM incidents
     WHERE sync_status IN ('pending_sync', 'sync_failed_retry_pending')
     ORDER BY captured_at ASC`,
  );
}

export async function getTodaysIncidentsForPatrol(patrolId) {
  if (!patrolId) return [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const db = await getDb();
  return await db.getAllAsync(
    `SELECT * FROM incidents
     WHERE patrol_id = ? AND captured_at >= ? AND captured_at < ?
     ORDER BY captured_at DESC`,
    [patrolId, startOfToday.toISOString(), startOfTomorrow.toISOString()],
  );
}

export async function getAllIncidents() {
  const db = await getDb();
  return await db.getAllAsync(
    `SELECT * FROM incidents ORDER BY captured_at DESC`,
  );
}

export async function getIncidentById(id) {
  const db = await getDb();
  return await db.getFirstAsync(`SELECT * FROM incidents WHERE id = ?`, [id]);
}

export async function markAsSynced(id) {
  const db = await getDb();
  await db.runAsync(
    `UPDATE incidents
     SET sync_status = 'synced', synced_at = ?, updated_at = ?
     WHERE id = ?`,
    [nowIso(), nowIso(), id],
  );
}

export async function markAsFailed(id, errorMessage, nextStatus) {
  const db = await getDb();
  await db.runAsync(
    `UPDATE incidents
     SET sync_status = ?, retry_count = retry_count + 1,
         last_error = ?, updated_at = ?
     WHERE id = ?`,
    [nextStatus, errorMessage, nowIso(), id],
  );
}

export async function deleteIncident(id) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM incidents WHERE id = ?`, [id]);
}

export async function getPendingCount() {
  const db = await getDb();
  const row = await db.getFirstAsync(
    `SELECT COUNT(*) as count FROM incidents
     WHERE sync_status IN ('pending_sync', 'sync_failed_retry_pending')`,
  );
  return row?.count ?? 0;
}
