// src/services/patrolService.js
import { supabase } from "../../../lib/supabase";

export const patrolService = {
  async getActivePatrol(rangerId) {
    // 1. Fetch the active patrol
    const { data: patrol, error: patrolError } = await supabase
      .from("patrols")
      .select("id, route_name, started_at, created_at, park_id")
      .eq("ranger_id", rangerId)
      .eq("is_active", true)
      .maybeSingle();

    if (patrolError) throw patrolError;
    if (!patrol) return null;

    // 2. Fetch the park separately
    const { data: park, error: parkError } = await supabase
      .from("parks")
      .select("id, name, region, boundary_geojson")
      .eq("id", patrol.park_id)
      .maybeSingle();

    if (parkError) throw parkError;

    // 3. Merge and return
    return { ...patrol, parks: park };
  },

  async startPatrol({ rangerId, parkId, routeName }) {
    const { data, error } = await supabase
      .from("patrols")
      .insert({
        ranger_id: rangerId,
        park_id: parkId,
        route_name: routeName,
        is_active: true,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;

    const { data: park, error: parkError } = await supabase
      .from("parks")
      .select("id, name, region, boundary_geojson")
      .eq("id", data.park_id)
      .maybeSingle();

    if (parkError) throw parkError;

    return { ...data, parks: park };
  },

  async endPatrol(patrolId) {
    const { data, error } = await supabase
      .from("patrols")
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq("id", patrolId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
