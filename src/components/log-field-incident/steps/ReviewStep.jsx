// src/components/log-field-incident/steps/ReviewStep.jsx
import { Image, View, Text, TouchableOpacity, ScrollView } from "react-native";

import SummaryRow from "../components/SummaryRow";
import { getIncidentType } from "../../../constants/log-field-incident/incidentTypes";
import { reviewStepStyles as styles } from "../../../styles/log-field-incident/reviewStepStyles";

export default function ReviewStep({
  formData,
  capturedAt,
  onEdit,
  onSubmit,
  submitting,
}) {
  const incidentType = getIncidentType(formData.incidentType);

  // Format helpers
  const formatCoords = () => {
    if (formData.latitude != null && formData.longitude != null) {
      return `${formData.latitude.toFixed(5)}°N, ${formData.longitude.toFixed(5)}°E`;
    }
    return "No location captured";
  };

  const formatLocationSource = () => {
    switch (formData.locationSource) {
      case "auto_gps":
        return "GPS · Auto-captured";
      case "manual":
        return "Manual map selection";
      case "missing_requires_follow_up":
        return "Missing — requires follow-up";
      default:
        return "—";
    }
  };

  const formatTimestamp = () => {
    if (!capturedAt) return "—";
    const d = new Date(capturedAt);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.body}>
        {/* Photo preview (top) */}
        <View style={styles.photoCard}>
          {formData.photoUris?.length > 0 ? (
            <Image
              source={{ uri: formData.photoUris[0] }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                [No photo attached]
              </Text>
            </View>
          )}

          {/* Type chip overlay */}
          {incidentType ? (
            <View style={styles.photoChip}>
              <Text style={styles.photoChipText}>
                {incidentType.label.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Summary rows */}
        <View style={styles.summaryCard}>
          <SummaryRow label="INCIDENT TYPE" value={incidentType?.label} />
          <SummaryRow label="LOCATION (GPS)" value={formatCoords()} />
          <SummaryRow label="LOCATION SOURCE" value={formatLocationSource()} />
          <SummaryRow
            label="PHOTO"
            value={
              formData.photoStatus === "attached"
                ? "Attached"
                : "Missing — pending upload"
            }
          />
          <SummaryRow label="NOTE" value={formData.description} />
          <SummaryRow label="TIMESTAMP" value={formatTimestamp()} />
        </View>
      </View>

      {/* Footer actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
          onPress={onSubmit}
          activeOpacity={0.85}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Submitting…" : "Submit Incident"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
