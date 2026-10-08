import { useCallback, useState } from "react";
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
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import StatusBadge from "../components/StatusBadge";
import {
  getCameraTrapImageById,
  updateInvestigationStatus,
} from "../services/cameraTrapRepository";

const statuses = ["PENDING", "UNDER_INVESTIGATION", "RESOLVED"];

export default function InvestigationScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();

  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [assignedOfficer, setAssignedOfficer] = useState("");
  const [notes, setNotes] = useState("");

  useFocusEffect(
    useCallback(() => {
      getCameraTrapImageById(String(imageId)).then((data) => {
        setImage(data);
        setStatus(data.investigationStatus || "PENDING");
        setAssignedOfficer(data.assignedOfficer || "");
        setNotes(data.investigationNotes || "");
      });
    }, [imageId])
  );

  if (!image) return null;

  const update = async () => {
    try {
      await updateInvestigationStatus(String(imageId), {
        status,
        assignedOfficer,
        notes,
      });

      Alert.alert("Updated", "Investigation status has been updated.");
      router.replace("/feature4");
    } catch (error) {
      Alert.alert("Unable to update", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: image.imageUrl }} style={styles.image} />

        <View style={styles.row}>
          <Text style={styles.title}>Investigation</Text>
          <StatusBadge status={status} />
        </View>

        <Text style={styles.meta}>{image.cameraTrapId}</Text>
        <Text style={styles.meta}>{image.location}</Text>
        <Text style={styles.meta}>
          Reason: {image.suspiciousReason || "—"}
        </Text>
        <Text style={styles.meta}>
          Severity: {image.severity || "—"}
        </Text>

        <Text style={styles.label}>Investigation Status</Text>
        <View style={styles.options}>
          {statuses.map((item) => (
            <Pressable
              key={item}
              onPress={() => setStatus(item)}
              style={[
                styles.option,
                status === item && styles.optionActive,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  status === item && styles.optionTextActive,
                ]}
              >
                {item.replaceAll("_", " ")}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Assigned Officer</Text>
        <TextInput
          value={assignedOfficer}
          onChangeText={setAssignedOfficer}
          placeholder="Officer name"
          style={styles.input}
        />

        <Text style={styles.label}>Investigation Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Add investigation notes..."
          style={styles.textArea}
        />

        <PrimaryButton title="Update Investigation" onPress={update} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F3" },
  container: { padding: 18, paddingBottom: 40 },
  image: { width: "100%", height: 260, borderRadius: 18 },
  row: { marginTop: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "900", color: "#17352C" },
  meta: { marginTop: 7, color: "#4B5563" },
  label: { marginTop: 20, marginBottom: 8, fontWeight: "800", color: "#374151" },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { paddingHorizontal: 10, paddingVertical: 9, borderRadius: 999, backgroundColor: "#E5E7EB" },
  optionActive: { backgroundColor: "#1F6B4F" },
  optionText: { fontSize: 11, color: "#374151" },
  optionTextActive: { color: "#FFFFFF", fontWeight: "800" },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 14, paddingHorizontal: 12, backgroundColor: "#FFFFFF" },
  textArea: { minHeight: 120, borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 14, padding: 12, backgroundColor: "#FFFFFF", textAlignVertical: "top" },
});
