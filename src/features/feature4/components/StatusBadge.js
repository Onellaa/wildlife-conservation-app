import { StyleSheet, Text, View } from "react-native";

const statusStyles = {
  NEW: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
  REVIEWED: { backgroundColor: "#DCFCE7", color: "#166534" },
  FLAGGED: { backgroundColor: "#FEE2E2", color: "#B91C1C" },
  PENDING: { backgroundColor: "#FEF3C7", color: "#92400E" },
  UNDER_INVESTIGATION: { backgroundColor: "#FFEDD5", color: "#C2410C" },
  RESOLVED: { backgroundColor: "#DCFCE7", color: "#166534" },
};

export default function StatusBadge({ status }) {
  const selected =
    statusStyles[status] || { backgroundColor: "#E5E7EB", color: "#374151" };

  return (
    <View style={[styles.badge, { backgroundColor: selected.backgroundColor }]}>
      <Text style={[styles.text, { color: selected.color }]}>
        {String(status || "UNKNOWN").replaceAll("_", " ")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});
