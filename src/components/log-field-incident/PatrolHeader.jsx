// src/components/log-field-incident/PatrolHeader.jsx
import { View, StyleSheet } from "react-native";
import { Text } from "../NunitoText";
import SyncBadge from "./SyncBadge";
import { COLORS } from "../../styles/log-field-incident/activePatrolStyles";

export default function PatrolHeader({ parkName, sector, syncStatus }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title} numberOfLines={1}>
        {parkName}
        {sector ? ` — ${sector}` : ""}
      </Text>
      <SyncBadge status={syncStatus} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },
});
