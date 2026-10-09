// src/app/(tabs)/_layout.js
import { Tabs, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { ClipboardList, House, Settings } from "lucide-react-native";
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

  // Auto-sync pending incidents when the device comes online
  useAutoSync();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
      {/* Visible tabs */}
      <Tabs.Screen
        name="index"
        options={getTabOptions(isRanger, "Dashboard", House)}
      />
      <Tabs.Screen
        name="settings"
        options={getTabOptions(isRanger, "Settings", Settings)}
      />

      {/* Hidden navigable screens (not in tab bar) — UC-01 */}
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
      <Tabs.Screen
        name="features/log-field-incident/PendingSyncScreen"
        options={getTabOptions(isRanger, "Incidents", ClipboardList)}
      />
      <Tabs.Screen name="features/home/dispatcher" options={{ href: null }} />
      <Tabs.Screen name="features/home/DefaultHome" options={{ href: null }} />
      <Tabs.Screen
        name="features/settings/SettingsScreen"
        options={{ href: null }}
      />

      {/* ⭐ Friends: add your hidden screens here with href: null */}
    </Tabs>
  );
}
