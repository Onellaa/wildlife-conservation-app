// src/services/log-field-incident/syncService.js
import { supabase } from "../../../lib/supabase";
import {
  getPendingIncidents,
  markAsSynced,
  markAsFailed,
} from "./incidentService";
import { uploadPhoto } from "./cloudinaryService";

const MAX_RETRIES = 3;

/**
 * Push a single incident to Supabase.
 * Uploads the photo to Cloudinary first (if any).
 * Returns true on success, throws on failure.
 */
async function pushIncident(incident) {
  // 1. Upload photo to Cloudinary (if any)
  let photoUrl = null;
  if (incident.photo_uri) {
    photoUrl = await uploadPhoto(incident.photo_uri);
  }

  // 2. Upsert incident into Supabase
  const { error } = await supabase.from("incidents").upsert(
    {
      id: incident.id,
      client_id: incident.client_id,
      ranger_id: incident.ranger_id,
      patrol_id: incident.patrol_id,
      park_id: incident.park_id,
      incident_type: incident.incident_type,
      description: incident.description,
      latitude: incident.latitude,
      longitude: incident.longitude,
      location_source: incident.location_source,
      photo_status: incident.photo_status,
      sync_status: "synced",
      retry_count: incident.retry_count,
      captured_at: incident.captured_at,
      synced_at: new Date().toISOString(),
    },
    { onConflict: "client_id" },
  );

  if (error) throw error;

  // 3. Save the photo reference (if uploaded)
  if (photoUrl) {
    const { error: photoError } = await supabase.from("incident_photos").insert({
      incident_id: incident.id,
      storage_path: photoUrl,
      mime_type: "image/jpeg",
    });
    if (photoError) throw photoError;
  }

  return true;
}

/**
 * Sync all pending incidents. Called:
 * - After a successful submit
 * - When network connectivity is restored
 * - Manually by the user from the pending sync screen
 */
export async function syncPending() {
  const pending = await getPendingIncidents();
  const results = { synced: 0, failed: 0, skipped: 0 };

  for (const incident of pending) {
    if (incident.retry_count >= MAX_RETRIES) {
      await markAsFailed(
        incident.id,
        "Retry threshold exceeded",
        "sync_failed_manual_review",
      );
      results.skipped += 1;
      continue;
    }

    try {
      await pushIncident(incident);
      await markAsSynced(incident.id);
      results.synced += 1;
    } catch (err) {
      const status =
        incident.retry_count + 1 >= MAX_RETRIES
          ? "sync_failed_manual_review"
          : "sync_failed_retry_pending";

      await markAsFailed(incident.id, err.message, status);
      results.failed += 1;
    }
  }

  return results;
}
