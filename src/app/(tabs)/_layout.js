// src/app/(tabs)/_layout.js

import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function TabLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1A5C4A" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1A5C4A",
        tabBarInactiveTintColor: "#94A3B8",
      }}
    >
      {/* =========================
          MAIN BOTTOM TABS
          ========================= */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
        }}
      />

      <Tabs.Screen
        name="log-field-incident"
        options={{
          title: "Log Incident",
          tabBarLabel: "Log Incident",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
        }}
      />

      {/* =========================
          COMMUNITY CONFLICT REPORT
          These are NOT bottom tabs
          ========================= */}

      <Tabs.Screen
        name="features/community-report/index"
        options={{
          href: null,
          title: "Community Conflict Report",
        }}
      />

      <Tabs.Screen
        name="features/community-report/report-form"
        options={{
          href: null,
          title: "Submit a Report",
        }}
      />

      <Tabs.Screen
        name="features/community-report/my-reports"
        options={{
          href: null,
          title: "My Reports",
        }}
      />
        <Tabs.Screen
          name="features/officer/dashboard"
          options={{
            href: null,
            title: "Officer Dashboard",
          }}
        />

        <Tabs.Screen
          name="features/officer/report-details"
          options={{
            href: null,
            title: "Report Details",
          }}
        />

    </Tabs>

    
  );
}