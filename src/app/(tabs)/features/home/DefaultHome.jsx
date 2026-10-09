// src/app/(tabs)/features/home/DefaultHome.jsx
import { View, StyleSheet } from "react-native";
import { Text } from "../../../../components/NunitoText";

export default function DefaultHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Your home screen is coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#0F172A", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#64748B", textAlign: "center" },
});
