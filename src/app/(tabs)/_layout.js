import React from "react";
import { Tabs, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { House, Settings } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

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
        tabBarStyle: isRanger
          ? {
              height: 75 + insets.bottom,
              paddingTop: 8,
              paddingBottom: 10 + insets.bottom,
              backgroundColor: "#FFFFFF",
              borderTopWidth: 0,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 8,
            }
          : { display: "none" },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* Only Home and Settings are visible Ranger tabs. */}
      <Tabs.Screen
        name="index"
        options={getTabOptions(isRanger, "Home", House)}
      />
      <Tabs.Screen
        name="features/settings/SettingsScreen"
        options={getTabOptions(isRanger, "Settings", Settings)}
      />

      {/* Other route files remain navigable but are not tab destinations. */}
      <Tabs.Screen
        name="features/log-field-incident/ActivePatrolScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="features/log-field-incident/PendingSyncScreen"
        options={{ href: null }}
      />
      <Tabs.Screen name="community-report" options={{ href: null }} />
      <Tabs.Screen name="camera-trap" options={{ href: null }} />
      <Tabs.Screen name="alerts/index" options={{ href: null }} />
      <Tabs.Screen name="alerts/[id]" options={{ href: null }} />
      <Tabs.Screen name="alerts/action" options={{ href: null }} />
      <Tabs.Screen name="alerts/response" options={{ href: null }} />
      <Tabs.Screen name="alerts/resolution" options={{ href: null }} />
      <Tabs.Screen name="feature4" options={{ href: null }} />
      <Tabs.Screen name="features/home/dispatcher" options={{ href: null }} />
      <Tabs.Screen name="features/home/DefaultHome" options={{ href: null }} />
      <Tabs.Screen name="features/officer/dashboard" options={{ href: null }} />
      <Tabs.Screen
        name="features/officer/report-details"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="features/community-report/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="features/community-report/report-form"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="features/community-report/my-reports"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="features/log-field-incident/StartPatrolScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="features/log-field-incident/LogIncidentFormScreen"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="features/log-field-incident/LogIncidentSuccessScreen"
        options={{ href: null }}
      />
    </Tabs>
  );
}
