import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
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
          shadowOffset: {
            width: 0,
            height: -2,
          },
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
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={25}
              color={color}
            />
          ),
        }}
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
        options={{ title: "Camera Traps" }}
      />

    </Tabs>
  );
}