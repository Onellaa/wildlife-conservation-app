// src/hooks/useActivePatrolScreen.js
// Business logic separation: screen only renders; this hook handles data.

import { useEffect, useMemo, useState } from "react";
import { usePatrol } from "../../context/log-field-incident/PatrolContext";
import { useNetworkStatus } from "./useNetworkStatus";

export function useActivePatrolScreen() {
  const { activePatrol, pendingIncidents, loading, patrolIncidents } = usePatrol();
  const { isOnline: networkIsOnline } = useNetworkStatus();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const syncStatus = useMemo(() => {
    if (!networkIsOnline) return "offline";
    if (pendingIncidents?.length > 0) return "pending_sync";
    return "synced";
  }, [networkIsOnline, pendingIncidents]);

  const elapsed = useMemo(() => {
    const patrolStart = activePatrol?.started_at ?? activePatrol?.created_at;
    if (!patrolStart) return "00:00:00";
    const start = new Date(patrolStart).getTime();
    if (!Number.isFinite(start)) return "00:00:00";
    const diff = Math.max(0, currentTime - start);
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }, [activePatrol?.created_at, activePatrol?.started_at, currentTime]);

  return {
    activePatrol,
    incidents: patrolIncidents || [],
    syncStatus,
    elapsed,
    loading,
    isOnline: networkIsOnline,
  };
}

const pad = (n) => String(n).padStart(2, "0");
