import { supabase } from "../../lib/supabase";

// export async function getActiveAlerts() {
//   const { data, error } = await supabase
//     .from("alerts")
//     .select(
//       `
//       *,
//       animals (
//         id,
//         animal_code,
//         name,
//         species,
//         collar_id
//       ),
//       high_risk_zones (
//         id,
//         zone_name,
//         risk_level,
//         latitude,
//         longitude,
//         description
//       )
//     `,
//     )
//     .neq("status", "RESOLVED")
//     .order("alert_time", {
//       ascending: false,
//     });

//   if (error) {
//     throw error;
//   }

//   return data;
// }
export async function getActiveAlerts() {
  const { data, error } = await supabase
    .from("alerts")
    .select(`
      *,
      animals (
        id,
        animal_code,
        name,
        species,
        collar_id
      ),
      high_risk_zones (
        id,
        zone_name,
        risk_level,
        latitude,
        longitude,
        description
      )
    `)
    .in("status", [
      "NEW",
      "ACKNOWLEDGED",
      "RESPONDING",
      "MONITORING",
      "ESCALATED",
    ])
    .order("alert_time", {
      ascending: false,
    });

  console.log("ACTIVE ALERTS:", data);
  console.log("ACTIVE ALERT ERROR:", error);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getAlertById(alertId) {
  const { data, error } = await supabase
    .from("alerts")
    .select(
      `
      *,
      animals (
        id,
        animal_code,
        name,
        species,
        collar_id
      ),
      high_risk_zones (
        id,
        zone_name,
        risk_level,
        latitude,
        longitude,
        description
      )
    `,
    )
    .eq("id", alertId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function acknowledgeAlert(alertId) {
  const { data, error } = await supabase
    .from("alerts")
    .update({
      status: "ACKNOWLEDGED",
      acknowledged_at: new Date().toISOString(),
    })
    .eq("id", alertId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveAlertResponse({
  alertId,
  responseType,
  status,
  notes,
}) {
  const { data: response, error: responseError } = await supabase
    .from("alert_responses")
    .insert({
      alert_id: alertId,
      response_type: responseType,
      status,
      notes,
    })
    .select()
    .single();

  if (responseError) {
    throw responseError;
  }

  const { data: alert, error: alertError } = await supabase
    .from("alerts")
    .update({
      status,
    })
    .eq("id", alertId)
    .select()
    .single();

  if (alertError) {
    throw alertError;
  }

  return {
    response,
    alert,
  };
}


export async function getAlertResponses(alertId) {
  const { data, error } = await supabase
    .from("alert_responses")
    .select("*")
    .eq("alert_id", alertId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function resolveAlert(alertId, notes) {
  // Check current alert
  const { data: currentAlert, error: alertError } = await supabase
    .from("alerts")
    .select("id, status")
    .eq("id", alertId)
    .single();

  if (alertError) {
    throw alertError;
  }

  if (currentAlert.status === "RESOLVED") {
    throw new Error("This alert is already resolved.");
  }

  // Check whether at least one response exists
  const { data: existingResponses, error: responseCheckError } = await supabase
    .from("alert_responses")
    .select("id")
    .eq("alert_id", alertId)
    .neq("response_type", "RESOLVE")
    .limit(1);

  if (responseCheckError) {
    throw responseCheckError;
  }

  if (!existingResponses || existingResponses.length === 0) {
    throw new Error(
      "At least one response must be recorded before resolving the alert.",
    );
  }

  // Save resolution record
  const { data: response, error: responseError } = await supabase
    .from("alert_responses")
    .insert({
      alert_id: alertId,
      response_type: "RESOLVE",
      status: "RESOLVED",
      notes,
    })
    .select()
    .single();

  if (responseError) {
    throw responseError;
  }

  // Mark alert resolved
  const { data: alert, error: updateError } = await supabase
    .from("alerts")
    .update({
      status: "RESOLVED",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", alertId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return {
    response,
    alert,
  };
}
