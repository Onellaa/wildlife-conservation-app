// src/app/_layout.js
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { PatrolProvider } from "../context/log-field-incident/PatrolContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PatrolProvider>
          <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </SafeAreaView>
        </PatrolProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
