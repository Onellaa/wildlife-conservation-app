import { supabase } from "../../../lib/supabase";

export async function getDashboardStats() {
  const [
    activeAlertsResult,
    animalsResult,
    zonesResult,
  ] = await Promise.all([
    supabase
      .from("alerts")
      .select("*", {
        count: "exact",
        head: true,
      })
      .in("status", [
        "NEW",
        "ACKNOWLEDGED",
        "RESPONDING",
        "MONITORING",
        "ESCALATED",
      ]),

    supabase
      .from("animals")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("high_risk_zones")
      .select("*", {
        count: "exact",
        head: true,
      }),
  ]);

  if (activeAlertsResult.error) {
    throw activeAlertsResult.error;
  }

  if (animalsResult.error) {
    throw animalsResult.error;
  }

  if (zonesResult.error) {
    throw zonesResult.error;
  }

  return {
    activeAlerts:
      activeAlertsResult.count || 0,

    trackedAnimals:
      animalsResult.count || 0,

    highRiskZones:
      zonesResult.count || 0,
  };
}