// src/components/log-field-incident/LogIncidentButton.jsx
import { TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { Text } from "../NunitoText";
import { activePatrolStyles as styles } from "../../styles/log-field-incident/activePatrolStyles";

export default function LogIncidentButton({ onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.ctaButton, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <AlertTriangle size={22} color="#FFFFFF" strokeWidth={2.5} />
      <Text style={styles.ctaButtonText}>Log Incident</Text>
    </TouchableOpacity>
  );
}
