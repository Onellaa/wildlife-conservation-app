// src/components/log-field-incident/SyncBadge.jsx
import { View, StyleSheet } from "react-native";
import { Text } from "../NunitoText";
import { COLORS } from "../../styles/log-field-incident/activePatrolStyles";

export default function SyncBadge({ status = "synced" }) {
  const config = {
    synced: { label: "Synced", color: COLORS.success, bg: COLORS.successLight },
    pending_sync: {
      label: "Pending",
      color: COLORS.warning,
      bg: COLORS.warningLight,
    },
    offline: { label: "Offline", color: COLORS.textMuted, bg: COLORS.border },
  }[status] || { label: "Unknown", color: COLORS.textMuted, bg: COLORS.border };

  return (
    <View style={[styles.pill, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: "700" },
});
