// src/app/(tabs)/features/log-field-incident/StartPatrolScreen.jsx
import { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text } from "../../../../components/NunitoText";
import { useRouter } from "expo-router";
import { useAuth } from "../../../../context/AuthContext";
import { usePatrol } from "../../../../context/log-field-incident/PatrolContext";

export default function StartPatrolScreen() {
  const { profile } = useAuth();
  const { startPatrol } = usePatrol();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleStartPatrol = async () => {
    if (!profile?.assigned_park_id) {
      Alert.alert("Error", "You are not assigned to a park.");
      return;
    }

    setLoading(true);
    try {
      await startPatrol({
        parkId: profile.assigned_park_id,
        routeName: "Default Route",
      });
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Start patrol failed:", err);
      Alert.alert("Failed to start patrol", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>No Active Patrol</Text>
      <Text style={styles.subtitle}>
        You need an active patrol to log incidents in{" "}
        {profile?.parks?.name || "your park"}.
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleStartPatrol}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Start Patrol</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#EA7B2C",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 180,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#F9B77D",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
