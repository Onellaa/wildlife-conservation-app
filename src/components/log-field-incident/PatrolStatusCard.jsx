// src/components/log-field-incident/PatrolStatusCard.jsx
import { View } from "react-native";
import { Text } from "../NunitoText";
import { activePatrolStyles as styles } from "../../styles/log-field-incident/activePatrolStyles";

export default function PatrolStatusCard({ elapsed, rangerLabel, coverageKm }) {
  return (
    <View style={styles.patrolCard}>
      <Text style={styles.patrolLabel}>PATROL IN PROGRESS</Text>
      <Text style={styles.patrolTime}>{elapsed}</Text>
      <Text style={styles.patrolMeta}>
        {rangerLabel} · Coverage today: {coverageKm} km
      </Text>
    </View>
  );
}
