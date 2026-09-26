// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

import { supabase } from "../../../lib/supabase";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // full profile row
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  const loadProfile = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return null;
    }

    try {
      const userProfile = await authService.getProfile(authUser.id);
      setProfile(userProfile);
      console.log("👤 Loaded profile:", userProfile?.role);
      return userProfile;
    } catch (error) {
      console.error("❌ Error loading profile:", error);
      setProfile(null);
      return null;
    }
  };

  // =====================================================
  // INITIAL SESSION
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // ===================================================
    // LISTEN FOR AUTH CHANGES
    // ===================================================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // SIGN IN
  // =====================================================

  const signIn = async (email, password) => {
    const data = await authService.signIn(email, password);
    // Auth state listener will update user/session/profile
    return data;
  };

  // =====================================================
  // SIGN OUT
  // =====================================================

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // =====================================================
  // REFRESH PROFILE
  // =====================================================

  const refreshProfile = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setProfile(null);
        return null;
      }

      const userProfile = await authService.getProfile(currentUser.id);
      setProfile(userProfile);
      console.log("🔐 Refreshed profile:", userProfile?.role);
      return userProfile;
    } catch (error) {
      console.error("❌ Error refreshing profile:", error);
      return null;
    }
  };

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    user,
    session,
    profile,
    role: profile?.role ?? null, // convenience
    isRanger: profile?.role === "ranger", // convenience
    isAdmin: profile?.role === "admin",
    isParkManager: profile?.role === "park_manager",
    loading,
    signIn,
    signOut,
    refreshProfile,
    getCurrentUser: authService.getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =======================================================
// USE AUTH
// =======================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
