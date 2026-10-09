// src/context/log-field-incident/PatrolContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "../AuthContext";
import { patrolService } from "../../services/log-field-incident/patrolService";
import {
  getPendingIncidents,
  getTodaysIncidentsForPatrol,
} from "../../services/log-field-incident/incidentService";

const PatrolContext = createContext();

export function PatrolProvider({ children }) {
  const { user, profile } = useAuth();
  const [activePatrol, setActivePatrol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patrolIncidents, setPatrolIncidents] = useState([]);
  const [pendingIncidents, setPendingIncidents] = useState([]);

  const refreshPatrolIncidents = useCallback(async () => {
    const patrolId = activePatrol?.id;
    if (!patrolId) {
      setPatrolIncidents([]);
      setPendingIncidents([]);
      return;
    }

    const [todaysIncidents, pending] = await Promise.all([
      getTodaysIncidentsForPatrol(patrolId),
      getPendingIncidents(),
    ]);
    setPatrolIncidents(todaysIncidents);
    setPendingIncidents(pending.filter((incident) => incident.patrol_id === patrolId));
  }, [activePatrol?.id]);

  useEffect(() => {
    refreshPatrolIncidents().catch((err) => {
      console.error("Patrol incident load error:", err);
    });
  }, [refreshPatrolIncidents]);

  // ----- Load active patrol when user / role changes -----
  useEffect(() => {
    (async () => {
      if (!user?.id || profile?.role !== "ranger") {
        setActivePatrol(null);
        setLoading(false);
        return;
      }
      try {
        const patrol = await patrolService.getActivePatrol(user.id);
        setActivePatrol(patrol);
      } catch (err) {
        console.error("Patrol load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, profile?.role]);

  // ----- Start a new patrol -----
  const startPatrol = async ({ parkId, routeName }) => {
    if (!user?.id) throw new Error("Not logged in");
    const patrol = await patrolService.startPatrol({
      rangerId: user.id,
      parkId,
      routeName,
    });
    setActivePatrol(patrol);
    return patrol;
  };

  // ----- End the current patrol -----
  const endPatrol = async () => {
    if (!activePatrol?.id) throw new Error("No active patrol");
    await patrolService.endPatrol(activePatrol.id);
    setActivePatrol(null);
  };

  return (
    <PatrolContext.Provider
      value={{
        activePatrol,
        patrolIncidents,
        pendingIncidents,
        loading,
        startPatrol,
        endPatrol,
        refreshPatrolIncidents,
        setActivePatrol, // kept for internal / advanced use
      }}
    >
      {children}
    </PatrolContext.Provider>
  );
}

export const usePatrol = () => {
  const ctx = useContext(PatrolContext);
  if (!ctx) throw new Error("usePatrol must be used within PatrolProvider");
  return ctx;
};
