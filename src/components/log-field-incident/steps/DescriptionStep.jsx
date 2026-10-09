// src/components/log-field-incident/steps/DescriptionStep.jsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { descriptionStepStyles as styles } from "../../../styles/log-field-incident/descriptionStepStyles";

export default function DescriptionStep({
  initialValue,
  onContinue,
  onChange,
}) {
  const [description, setDescription] = useState(initialValue ?? "");

  const handleChange = (value) => {
    setDescription(value);
    onChange?.(value);
  };

  const handleContinue = () => {
    onContinue({ description: description.trim() });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.body}>
        <Text style={styles.prompt}>ADD A NOTE (OPTIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Wire snare, ~40cm diameter, fresh disturbance nearby."
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={handleChange}
          multiline
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={styles.hint}>{description.length}/500 characters</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Review Incident</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
