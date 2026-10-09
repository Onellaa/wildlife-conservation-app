import { supabase } from "../../../lib/supabase";

export const createCommunityConflictReport = async ({
  userId,
  incidentType,
  description,
  latitude,
  longitude,
  manualLocation,
}) => {
  const reportId = `RPT-${Date.now()}`;

  const { data, error } = await supabase
    .from("community_conflict_reports")
    .insert([
      {
        report_id: reportId,
        user_id: userId,
        incident_type: incidentType,
        description: description || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        manual_location: manualLocation || null,
        reporting_channel: "MOBILE_APP",
        status: "NEW",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating community conflict report:", error);
    throw error;
  }

  return data;
};