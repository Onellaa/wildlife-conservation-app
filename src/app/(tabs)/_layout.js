// src/app/(tabs)/_layout.js

import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function TabLayout() {
  const { session, loading } = useAuth();

  // Show spinner while session is loading
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

  // Redirect to login if not authenticated
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
      <Tabs.Screen
        name="log-field-incident"
        options={{ title: "Log Incident" }}
      />

      <Tabs.Screen
        name="camera-trap"
        options={{ title: "Camera Traps" }}
      />

      <Tabs.Screen
        name="settings"
        options={{ title: "Settings" }}
      />
    </Tabs>
  );
}