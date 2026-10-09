// src/components/TodayIncidentsList.jsx
import { View } from "react-native";
import { Text } from "../NunitoText";
import { activePatrolStyles as styles } from "../../styles/log-field-incident/activePatrolStyles";
import IncidentListItem from "./IncidentListItem";

export default function TodayIncidentsList({ incidents }) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={styles.sectionHeader}>TODAY&apos;S INCIDENTS</Text>
      {incidents.length === 0 ? (
        <Text style={{ color: "#94A3B8", fontSize: 13 }}>
          No incidents logged yet.
        </Text>
      ) : (
        incidents.map((incident) => (
          <IncidentListItem key={incident.id} incident={incident} />
        ))
      )}
    </View>
  );
}
