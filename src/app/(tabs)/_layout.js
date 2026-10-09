
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { ClipboardList, House, Settings } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { useAutoSync } from "../../hooks/log-field-incident/useAutoSync";

const getTabOptions = (isRanger, title, Icon) =>
  isRanger
    ? {
        title,
        tabBarIcon: ({ color, size }) => (
          <Icon color={color} size={size} strokeWidth={2} />
        ),
      }
    : { href: null };

export default function TabLayout() {
  const { session, loading, isRanger } = useAuth();

  // Automatically sync pending incidents
  useAutoSync();

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
        tabBarActiveTintColor: "#176B4D",
        tabBarInactiveTintColor: "#7A8580",
        tabBarStyle: {
          height: 75,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* MAIN BOTTOM TABS */}

      <Tabs.Screen
        name="index"
        options={getTabOptions(isRanger, "Dashboard", House)}
      />

      <Tabs.Screen
        name="log-field-incident"
        options={{
          title: "Log Incident",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={getTabOptions(isRanger, "Settings", Settings)}
      />

      <Tabs.Screen
        name="features/log-field-incident/PendingSyncScreen"
        options={getTabOptions(isRanger, "Incidents", ClipboardList)}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          title: "High-Risk Alerts",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "warning" : "warning-outline"}
              size={25}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="camera-trap"
        options={{
          title: "Camera Traps",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />

      {/* LOG FIELD INCIDENT SCREENS */}

      <Tabs.Screen
        name="features/log-field-incident/LogIncidentFormScreen"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="features/log-field-incident/StartPatrolScreen"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="features/log-field-incident/ActivePatrolScreen"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="features/log-field-incident/LogIncidentSuccessScreen"
        options={{ href: null }}
      />

      {/* HOME SCREENS */}

      <Tabs.Screen
        name="features/home/dispatcher"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="features/home/DefaultHome"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="features/settings/SettingsScreen"
        options={{ href: null }}
      />

      {/* COMMUNITY CONFLICT REPORT SCREENS */}

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

      {/* OFFICER SCREENS */}

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
