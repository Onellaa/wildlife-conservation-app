// src/components/log-field-incident/LogIncidentHeader.jsx
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import SyncBadge from "./SyncBadge";
import { logIncidentStyles as styles } from "../../styles/log-field-incident/logIncidentStyles";
import { COLORS } from "../../styles/log-field-incident/activePatrolStyles";

export default function LogIncidentHeader({
  step,
  totalSteps,
  onBack,
  canGoBack = true,
  onForward,
  canGoForward = false,
  syncStatus,
  title = "Log Incident",
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.headerBack}
        disabled={!canGoBack}
        accessibilityRole="button"
        accessibilityLabel="Previous step"
      >
        <ArrowLeft
          size={22}
          color={canGoBack ? COLORS.text : COLORS.textMuted}
          strokeWidth={2.5}
        />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerStep}>
          STEP {step} OF {totalSteps}
        </Text>
      </View>

      <View style={styles.headerActions}>
        {onForward ? (
          <TouchableOpacity
            onPress={onForward}
            style={styles.headerForward}
            disabled={!canGoForward}
            accessibilityRole="button"
            accessibilityLabel="Next step"
          >
            <ArrowRight
              size={22}
              color={canGoForward ? COLORS.text : COLORS.textMuted}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        ) : null}
        <SyncBadge status={syncStatus || "synced"} />
      </View>
    </View>
  );
}
