// src/services/authService.js

import { supabase } from "../../../lib/supabase";

export const authService = {
  // =====================================================
  // SIGN IN
  // =====================================================

  async signIn(email, password) {
    console.log("🔄 authService: signIn called with:", { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ authService: signIn error:", error);
      throw error;
    }

    console.log("✅ authService: signIn successful");
    return data;
  },

  // =====================================================
  // SIGN OUT
  // =====================================================

  async signOut() {
    console.log("🔄 authService: signOut called");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ authService: signOut error:", error);
      throw error;
    }

    console.log("✅ authService: signOut successful");
  },

  // =====================================================
  // GET CURRENT USER (auth user only)
  // =====================================================

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("❌ authService: getCurrentUser error:", error);
      throw error;
    }

    return user;
  },

  // =====================================================
  // GET PROFILE (from public.profiles)
  // =====================================================

  async getProfile(userId) {
    if (!userId) {
      const user = await this.getCurrentUser();
      if (!user) return null;
      userId = user.id;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        role,
        phone,
        is_active,
        assigned_park_id,
        parks:assigned_park_id (
          id,
          name,
          region
        )
      `,
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ authService: getProfile error:", error);
      throw error;
    }

    return data;
  },

  // =====================================================
  // GET USER ROLE (convenience)
  // =====================================================

  async getUserRole() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("❌ authService: getUserRole error:", error);
      throw error;
    }

    console.log("🔐 Database role:", data?.role);
    return data?.role || null;
  },

  // =====================================================
  // GET SESSION
  // =====================================================

  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  // =====================================================
  // ACTIVE PATROL (UC-01 specific)
  // =====================================================

  async getActivePatrol(rangerId) {
    if (!rangerId) {
      const user = await this.getCurrentUser();
      if (!user) return null;
      rangerId = user.id;
    }

    const { data, error } = await supabase
      .from("patrols")
      .select(
        `
        id,
        route_name,
        started_at,
        park_id,
        parks:park_id (
          id,
          name,
          region
        )
      `,
      )
      .eq("ranger_id", rangerId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("❌ authService: getActivePatrol error:", error);
      throw error;
    }

    return data;
  },

  async startPatrol({ rangerId, parkId, routeName }) {
    const { data, error } = await supabase
      .from("patrols")
      .insert({
        ranger_id: rangerId,
        park_id: parkId,
        route_name: routeName,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ authService: startPatrol error:", error);
      throw error;
    }

    return data;
  },

  async endPatrol(patrolId) {
    const { data, error } = await supabase
      .from("patrols")
      .update({
        is_active: false,
        ended_at: new Date().toISOString(),
      })
      .eq("id", patrolId)
      .select()
      .single();

    if (error) {
      console.error("❌ authService: endPatrol error:", error);
      throw error;
    }

    return data;
  },

  // =====================================================
  // RESET PASSWORD (optional — kept for parity)
  // =====================================================

  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },

  // =====================================================
  // UPDATE USER (optional)
  // =====================================================

  async updateUser(updates) {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },
};
