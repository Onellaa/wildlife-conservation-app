// src/app/(tabs)/features/log-field-incident/LogIncidentSuccessScreen.jsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, CloudOff } from "lucide-react-native";
import { COLORS } from "../../../../styles/log-field-incident/activePatrolStyles";

const FONTS = {
  bold: "Nunito_700Bold",
  semibold: "Nunito_600SemiBold",
  regular: "Nunito_400Regular",
};

export default function LogIncidentSuccessScreen() {
  const router = useRouter();
  const { pending } = useLocalSearchParams();
  const isPending = pending === "1";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: isPending ? "#FFEDD5" : "#DCFCE7" },
        ]}
      >
        {isPending ? (
          <CloudOff size={48} color={COLORS.warning} strokeWidth={2} />
        ) : (
          <CheckCircle2 size={48} color={COLORS.success} strokeWidth={2} />
        )}
      </View>

      <Text style={styles.title}>
        {isPending ? "Saved Locally" : "Incident Submitted"}
      </Text>
      <Text style={styles.subtitle}>
        {isPending
          ? "No connection right now. This incident will sync automatically once you're back online."
          : "This incident has been submitted to the operations dashboard."}
      </Text>

      {isPending && (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            router.replace(
              "/(tabs)/features/log-field-incident/PendingSyncScreen",
            )
          }
        >
          <Text style={styles.secondaryButtonText}>View Pending Sync</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          router.replace(
            "/(tabs)/features/log-field-incident/ActivePatrolScreen",
          )
        }
      >
        <Text style={styles.primaryButtonText}>Back to Patrol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  primaryButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: "#FFFFFF",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    width: "100%",
  },
  secondaryButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.primary,
  },
});
