import { useCallback, useState } from "react";
import {
  Alert,
  ImageBackground,
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
  acknowledgePoacherAlert,
  getCameraTrapImageById,
  updateInvestigationStatus,
} from "../services/cameraTrapRepository";
import { feature4Theme as t } from "../theme";

const statuses = ["PENDING", "UNDER_INVESTIGATION", "RESOLVED"];

export default function InvestigationScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();

  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("PENDING");
  const [assignedOfficer, setAssignedOfficer] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(() => {
    getCameraTrapImageById(String(imageId)).then((data) => {
      setImage(data);
      setStatus(data.investigationStatus || "PENDING");
      setAssignedOfficer(data.assignedOfficer || "");
      setNotes(data.investigationNotes || "");
    });
  }, [imageId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!image) return null;

  const acknowledge = async () => {
    try {
      const updated = await acknowledgePoacherAlert(String(imageId), {
        acknowledgedBy: "Park Manager",
      });

      setImage(updated);

      Alert.alert(
        "Notification acknowledged",
        "The Park Manager acknowledgement has been recorded."
      );
    } catch (error) {
      Alert.alert("Unable to acknowledge", error.message);
    }
  };

  const update = async () => {
    try {
      await updateInvestigationStatus(String(imageId), {
        status,
        assignedOfficer,
        notes,
      });

      Alert.alert(
        "Updated",
        "Investigation status has been updated."
      );

      router.replace("/(tabs)/camera-trap");
    } catch (error) {
      Alert.alert("Unable to update", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <ImageBackground
          source={{ uri: image.imageUrl }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.overlay}>
            <StatusBadge status={status} />

            <View>
              <Text style={styles.kicker}>PARK MANAGER REVIEW</Text>
              <Text style={styles.heroTitle}>{image.cameraTrapId}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Poacher evidence alert</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Evidence</Text>
            <Text style={styles.summaryValue}>
              {image.suspiciousReason || "—"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Severity</Text>
            <Text style={styles.summaryValue}>
              {image.severity || "—"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Location</Text>
            <Text style={styles.summaryValue}>
              {image.location}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.ackCard,
            image.acknowledged && styles.ackCardDone,
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.ackTitle}>
              {image.acknowledged
                ? "Park Manager acknowledged"
                : "Park Manager acknowledgement required"}
            </Text>

            <Text style={styles.ackText}>
              {image.acknowledged
                ? `Acknowledged by ${image.acknowledgedBy || "Park Manager"}.`
                : "This step directly matches the received UC-03 alternate flow."}
            </Text>
          </View>

          {!image.acknowledged ? (
            <Pressable style={styles.ackButton} onPress={acknowledge}>
              <Text style={styles.ackButtonText}>ACKNOWLEDGE</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.enhancementCard}>
          <Text style={styles.enhancementLabel}>ASSIGNMENT 2 ENHANCEMENT</Text>
          <Text style={styles.enhancementText}>
            The original design ends after acknowledgement. The controls below
            extend that flow so the response can be tracked to resolution.
          </Text>
        </View>

        <Text style={styles.label}>Investigation Status</Text>

        <View style={styles.statusWrap}>
          {statuses.map((item) => {
            const active = status === item;

            return (
              <Pressable
                key={item}
                onPress={() => setStatus(item)}
                style={[
                  styles.statusOption,
                  active && styles.statusActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    active && styles.statusTextActive,
                  ]}
                >
                  {item.replaceAll("_", " ")}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Assigned Officer</Text>

        <TextInput
          value={assignedOfficer}
          onChangeText={setAssignedOfficer}
          placeholder="Officer name"
          placeholderTextColor={t.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Investigation Notes</Text>

        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Add investigation notes..."
          placeholderTextColor={t.muted}
          style={styles.notes}
        />

        <PrimaryButton
          title="Update Investigation"
          onPress={update}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: t.bg },
  content: { padding: 18, paddingBottom: 50 },
  hero: { height: 275, justifyContent: "flex-end" },
  heroImage: { borderRadius: 24 },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    borderRadius: 24,
    backgroundColor: "rgba(8,5,2,0.20)",
  },
  kicker: {
    color: t.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: t.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },
  summaryCard: {
    marginTop: 18,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 20,
    padding: 16,
  },
  summaryTitle: {
    color: t.accent,
    fontWeight: "900",
    marginBottom: 7,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: t.border,
  },
  summaryLabel: { color: t.muted },
  summaryValue: {
    color: t.text,
    fontWeight: "800",
    maxWidth: "60%",
    textAlign: "right",
  },
  ackCard: {
    marginTop: 14,
    padding: 15,
    borderRadius: 18,
    backgroundColor: "#332617",
    borderWidth: 1,
    borderColor: "#66502A",
    gap: 12,
  },
  ackCardDone: {
    backgroundColor: "#1E382A",
    borderColor: "#345C45",
  },
  ackTitle: {
    color: t.text,
    fontWeight: "900",
  },
  ackText: {
    color: t.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  ackButton: {
    alignSelf: "flex-start",
    backgroundColor: t.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  ackButtonText: {
    color: t.black,
    fontSize: 11,
    fontWeight: "900",
  },
  enhancementCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: t.cardAlt,
    borderWidth: 1,
    borderColor: t.border,
  },
  enhancementLabel: {
    color: t.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  enhancementText: {
    color: t.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  label: {
    color: t.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 24,
    marginBottom: 10,
  },
  statusWrap: { gap: 9 },
  statusOption: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  statusActive: {
    backgroundColor: t.cardAlt,
    borderColor: t.accent,
  },
  statusText: {
    color: t.muted,
    fontWeight: "800",
  },
  statusTextActive: {
    color: t.accent,
  },
  input: {
    minHeight: 52,
    color: t.text,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 18,
    paddingHorizontal: 14,
  },
  notes: {
    minHeight: 125,
    color: t.text,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 18,
    padding: 14,
    textAlignVertical: "top",
  },
});
