// src/components/log-field-incident/components/CameraChip.jsx
import { View, Text, StyleSheet } from "react-native";
import { photoCaptureStyles as styles } from "../../../styles/log-field-incident/photoCaptureStyles";

export default function CameraChip({ label, variant = "dark" }) {
  return (
    <View style={[styles.chip, variant === "accent" && styles.chipAccent]}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}
