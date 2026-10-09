// src/components/log-field-incident/steps/TypeSelectionStep.jsx
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import IncidentTypeCard from "../IncidentTypeCard";
import { INCIDENT_TYPES } from "../../../constants/log-field-incident/incidentTypes";
import { useIncidentTypeSelection } from "../../../hooks/log-field-incident/useIncidentTypeSelection";
import { logIncidentStyles as styles } from "../../../styles/log-field-incident/logIncidentStyles";

export default function TypeSelectionStep({
  initialValue,
  onContinue,
  onSelectionChange,
}) {
  const { selectedKey, canContinue, continueLabel, select } =
    useIncidentTypeSelection(initialValue);

  const handleContinue = () => {
    if (!canContinue) return;
    onContinue({ incidentType: selectedKey });
  };

  const handleSelect = (key) => {
    select(key);
    onSelectionChange?.(key);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.body}>
        {/* Subtitle */}
        <Text style={styles.stepSubtitle}>
          Tap the incident type — no typing needed
        </Text>

        {/* Type grid */}
        <View style={styles.typeGrid}>
          {INCIDENT_TYPES.map((type) => (
            <IncidentTypeCard
              key={type.key}
              type={type}
              selected={selectedKey === type.key}
              onPress={() => handleSelect(type.key)}
            />
          ))}
        </View>

        {canContinue && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>{continueLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
