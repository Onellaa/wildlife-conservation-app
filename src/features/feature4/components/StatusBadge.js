import { StyleSheet, Text, View } from "react-native";
import { feature4Theme as t } from "../theme";

const palette = {
  NEW: { bg: "#2F4317", fg: t.accent },
  REVIEWED: { bg: "#1E382A", fg: "#A7F3D0" },
  FLAGGED: { bg: "#452020", fg: "#FFAAAA" },
  PENDING: { bg: "#4B3A13", fg: "#F8D477" },
  UNDER_INVESTIGATION: { bg: "#4A2C13", fg: "#FDBA74" },
  RESOLVED: { bg: "#1E382A", fg: "#A7F3D0" },
};

export default function StatusBadge({ status }) {
  const selected = palette[status] || { bg: t.cardAlt, fg: t.muted };

  return (
    <View style={[styles.badge, { backgroundColor: selected.bg }]}>
      <Text style={[styles.text, { color: selected.fg }]}>
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
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: t.border,
  },
  text: {
    fontSize: 10,
    fontWeight: "900",
  },
});
