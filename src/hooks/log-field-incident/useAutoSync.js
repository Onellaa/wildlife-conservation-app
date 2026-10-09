// src/hooks/log-field-incident/useAutoSync.js
import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePatrol } from "../../context/log-field-incident/PatrolContext";
import { useNetworkStatus } from "./useNetworkStatus";
import { syncPending } from "../../services/log-field-incident/syncService";

/**
 * Automatically syncs pending incidents when the device comes online.
 * Also triggers once when the user first logs in.
 */
export function useAutoSync() {
  const { session } = useAuth();
  const { refreshPatrolIncidents } = usePatrol();
  const { isOnline } = useNetworkStatus();
  const lastAttemptRef = useRef(0);

  useEffect(() => {
    if (!session || !isOnline) return;

    // Throttle: don't fire more than once every 10 seconds
    const now = Date.now();
    if (now - lastAttemptRef.current < 10_000) return;
    lastAttemptRef.current = now;

    syncPending()
      .then(() => refreshPatrolIncidents())
      .catch((err) => {
        console.warn("Auto-sync or incident refresh failed:", err);
      });
  }, [session, isOnline, refreshPatrolIncidents]);
}
