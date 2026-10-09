// src/app/(tabs)/features/settings/SettingsScreen.jsx
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../../../../components/NunitoText";
import { useAuth } from "../../../../context/AuthContext";

export default function SettingsScreen() {
  const { signOut, profile } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.value}>{profile?.full_name || "Unknown"}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{profile?.role || "Unknown"}</Text>

        <Text style={styles.label}>Assigned Park</Text>
        <Text style={styles.value}>
          {profile?.parks?.name || profile?.assigned_park_id || "Not assigned"}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F8FAFC", gap: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#0F172A" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  label: { fontSize: 12, color: "#64748B", marginTop: 8 },
  value: { fontSize: 16, color: "#0F172A", fontWeight: "500" },
  logoutButton: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 8,
  },
  logoutText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
