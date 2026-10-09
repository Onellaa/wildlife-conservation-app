// src/components/log-field-incident/components/ViewfinderOverlay.jsx
import { View, Text } from "react-native";
import { photoCaptureStyles as styles } from "../../../styles/log-field-incident/photoCaptureStyles";

export default function ViewfinderOverlay({ hint }) {
  return (
    <View style={styles.viewfinder} pointerEvents="none">
      {/* Corner brackets */}
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />

      {/* Hint */}
      {hint ? <Text style={styles.viewfinderHint}>{hint}</Text> : null}
    </View>
  );
}
