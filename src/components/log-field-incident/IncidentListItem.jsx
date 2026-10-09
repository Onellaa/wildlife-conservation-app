// src/components/IncidentListItem.jsx
import { View } from "react-native";
import { Text } from "../NunitoText";
import { activePatrolStyles as styles } from "../../styles/log-field-incident/activePatrolStyles";
import { getIncidentType } from "../../constants/log-field-incident/incidentTypes";

export default function IncidentListItem({ incident }) {
  const type = getIncidentType(incident.incident_type);
  const Icon = type?.Icon;

  return (
    <View style={styles.incidentRow}>
      <View style={[styles.incidentIcon, { backgroundColor: type.background }]}>
        {Icon ? <Icon size={20} color={type.color} strokeWidth={2.4} /> : null}
      </View>
      <View style={styles.incidentInfo}>
        <Text style={styles.incidentTitle}>{type.shortLabel}</Text>
        <Text style={styles.incidentMeta}>
          {formatTime(incident.captured_at)} ·{" "}
          {incident.sync_status === "synced" ? "Synced" : "Pending"}
        </Text>
      </View>
    </View>
  );
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
