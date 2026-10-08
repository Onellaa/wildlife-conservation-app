import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import {
  flagImageAsSuspicious,
  getCameraTrapImageById,
} from "../services/cameraTrapRepository";

const reasons = ["Human Presence", "Vehicle Detected", "Snare / Trap", "Other"];
const severities = ["LOW", "MEDIUM", "HIGH"];

export default function FlagSuspiciousScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();

  const [image, setImage] = useState(null);
  const [reason, setReason] = useState("Human Presence");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("HIGH");

  useEffect(() => {
    getCameraTrapImageById(String(imageId)).then(setImage);
  }, [imageId]);

  if (!image) return null;

  const submit = async () => {
    try {
      await flagImageAsSuspicious(String(imageId), {
        reason,
        description,
        severity,
        notifyEnforcement: true,
      });

      Alert.alert(
        "Flagged",
        "The image has been sent to the enforcement review queue."
      );

      router.replace({
        pathname: "/feature4/investigation",
        params: { imageId: String(imageId) },
      });
    } catch (error) {
      const validation = error.validationErrors || {};

      Alert.alert(
        "Check details",
        validation.reason ||
          validation.description ||
          validation.severity ||
          "Unable to flag image."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: image.imageUrl }} style={styles.image} />
        <Text style={styles.title}>Flag Suspicious Activity</Text>

        <Text style={styles.label}>Reason</Text>
        <View style={styles.options}>
          {reasons.map((item) => (
            <Pressable
              key={item}
              onPress={() => setReason(item)}
              style={[
                styles.option,
                reason === item && styles.optionActive,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  reason === item && styles.optionTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Describe what can be seen in the image..."
          style={styles.textArea}
        />

        <Text style={styles.label}>Severity</Text>
        <View style={styles.options}>
          {severities.map((item) => (
            <Pressable
              key={item}
              onPress={() => setSeverity(item)}
              style={[
                styles.severity,
                severity === item && styles.severityActive,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  severity === item && styles.optionTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.notify}>✓ Notify Enforcement Officer</Text>

        <PrimaryButton title="Flag Image" danger onPress={submit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F3" },
  container: { padding: 18, paddingBottom: 40 },
  image: { width: "100%", height: 280, borderRadius: 18 },
  title: { marginTop: 18, fontSize: 25, fontWeight: "900", color: "#17352C" },
  label: { marginTop: 20, marginBottom: 8, fontWeight: "800", color: "#374151" },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999, backgroundColor: "#E5E7EB" },
  optionActive: { backgroundColor: "#1F6B4F" },
  severity: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: "#F3F4F6" },
  severityActive: { backgroundColor: "#C62828" },
  optionText: { fontSize: 12, color: "#374151" },
  optionTextActive: { color: "#FFFFFF", fontWeight: "800" },
  textArea: { minHeight: 120, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 14, padding: 12, backgroundColor: "#FFFFFF", textAlignVertical: "top" },
  notify: { marginTop: 20, color: "#17352C", fontWeight: "700" },
});
