import { Stack } from "expo-router";

export default function Feature4Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#17352C" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "800" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Camera Trap Images" }} />
      <Stack.Screen name="image-details" options={{ title: "Image Details" }} />
      <Stack.Screen name="classify" options={{ title: "Classify Wildlife" }} />
      <Stack.Screen name="suspicious-review" options={{ title: "Suspicious Review" }} />
      <Stack.Screen name="flag-suspicious" options={{ title: "Flag Activity" }} />
      <Stack.Screen name="investigation" options={{ title: "Investigation Status" }} />
    </Stack>
  );
}
