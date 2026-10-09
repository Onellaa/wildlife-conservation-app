// src/components/log-field-incident/components/SummaryRow.jsx
import { View, Text } from "react-native";
import { reviewStepStyles as styles } from "../../../styles/log-field-incident/reviewStepStyles";

export default function SummaryRow({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value || "—"}</Text>
    </View>
  );
}
