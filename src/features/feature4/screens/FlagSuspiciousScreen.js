import { useEffect, useState } from "react";
import {
  ImageBackground,
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
  flagImageAsPoacherEvidence,
  getCameraTrapImageById,
} from "../services/cameraTrapRepository";
import { feature4Theme as t } from "../theme";

const reasons = [
  "Human Presence",
  "Weapon / Hunting Gear",
  "Snare / Trap",
  "Illegal Camp / Activity",
  "Other",
];

const severities = ["LOW", "MEDIUM", "HIGH"];

export default function FlagSuspiciousScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();

  const [image, setImage] = useState(null);
  const [reason, setReason] = useState("Human Presence");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("HIGH");

  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const data = await getCameraTrapImageById(String(imageId));
        setImage(data);
      } catch (error) {
        console.error("Failed to load image:", error);

        setErrorMessage(
          "Unable to load this camera trap image. Please return to the review queue."
        );
      }
    };

    loadImage();
  }, [imageId]);

  if (!image) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Loading camera trap image...
          </Text>

          {errorMessage ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  const submit = async () => {
    try {
      setErrorMessage("");

      if (!reason) {
        setErrorMessage("Please select an evidence type.");
        return;
      }

      if (!description.trim()) {
        setErrorMessage(
          "Please enter staff notes describing the evidence visible in the image."
        );
        return;
      }

      if (description.trim().length < 10) {
        setErrorMessage(
          "Please provide a little more detail in the staff notes."
        );
        return;
      }

      if (!severity) {
        setErrorMessage("Please select a severity level.");
        return;
      }

      setSaving(true);

      console.log("Submitting poacher evidence:", {
        imageId: String(imageId),
        reason,
        description,
        severity,
      });

      const result = await flagImageAsPoacherEvidence(
        String(imageId),
        {
          reason,
          description: description.trim(),
          severity,
        }
      );

      console.log("Poacher evidence saved:", result);

      router.replace({
        pathname: "/feature4/investigation",
        params: {
          imageId: String(imageId),
        },
      });
    } catch (error) {
      console.error("Flag poacher evidence error:", error);

      const validation = error.validationErrors || {};

      const message =
        validation.reason ||
        validation.description ||
        validation.severity ||
        error.message ||
        "Unable to flag poacher evidence.";

      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ImageBackground
          source={{ uri: image.imageUrl }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.overlay}>
            <Text style={styles.kicker}>
              POACHER EVIDENCE
            </Text>

            <Text style={styles.heroTitle}>
              {image.cameraTrapId}
            </Text>

            <Text style={styles.heroLocation}>
              {image.location}
            </Text>
          </View>
        </ImageBackground>

        <Text style={styles.title}>
          Flag Poacher Evidence
        </Text>

        <Text style={styles.subtitle}>
          Record why the capture is considered evidence and notify the Park Manager.
        </Text>

        <Text style={styles.label}>
          Evidence Type
        </Text>

        <View style={styles.chips}>
          {reasons.map((item) => {
            const active = reason === item;

            return (
              <Pressable
                key={item}
                onPress={() => {
                  setReason(item);
                  setErrorMessage("");
                }}
                style={[
                  styles.chip,
                  active && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active && styles.chipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>
          Staff Notes
        </Text>

        <TextInput
          value={description}
          onChangeText={(value) => {
            setDescription(value);
            setErrorMessage("");
          }}
          multiline
          placeholder="Describe the evidence visible in the image..."
          placeholderTextColor={t.muted}
          style={styles.notes}
        />

        <Text style={styles.characterHint}>
          Minimum 10 characters
        </Text>

        <Text style={styles.label}>
          Severity
        </Text>

        <View style={styles.severityRow}>
          {severities.map((item) => {
            const active = severity === item;

            return (
              <Pressable
                key={item}
                onPress={() => {
                  setSeverity(item);
                  setErrorMessage("");
                }}
                style={[
                  styles.severity,
                  active && styles.severityActive,
                ]}
              >
                <Text
                  style={[
                    styles.severityText,
                    active && styles.severityTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.notifyCard}>
          <Text style={styles.notifyIcon}>
            !
          </Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.notifyTitle}>
              Notify Park Manager
            </Text>

            <Text style={styles.notifyText}>
              A Park Manager notification will be created automatically after the evidence is flagged.
            </Text>
          </View>
        </View>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              Unable to continue
            </Text>

            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <PrimaryButton
          title={
            saving
              ? "Saving Evidence..."
              : "Flag Evidence & Notify Park Manager"
          }
          danger
          onPress={saving ? undefined : submit}
        />

        <Text style={styles.footerNote}>
          Once submitted, this capture will be marked as poacher evidence and sent to the Park Manager for acknowledgement.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: t.bg,
  },

  content: {
    padding: 18,
    paddingBottom: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    color: t.muted,
    fontSize: 14,
  },

  hero: {
    height: 235,
    justifyContent: "flex-end",
  },

  heroImage: {
    borderRadius: 24,
  },

  overlay: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: "rgba(15,3,3,0.30)",
  },

  kicker: {
    color: "#FFB4B4",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  heroTitle: {
    color: t.text,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 4,
  },

  heroLocation: {
    color: t.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  title: {
    color: t.text,
    fontSize: 25,
    fontWeight: "900",
    marginTop: 22,
  },

  subtitle: {
    color: t.muted,
    marginTop: 6,
    lineHeight: 20,
  },

  label: {
    color: t.accent,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 24,
    marginBottom: 10,
    letterSpacing: 0.6,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  chip: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 999,
  },

  chipActive: {
    backgroundColor: t.accent,
    borderColor: t.accent,
  },

  chipText: {
    color: t.muted,
    fontSize: 12,
    fontWeight: "800",
  },

  chipTextActive: {
    color: t.black,
  },

  notes: {
    minHeight: 130,
    color: t.text,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 18,
    padding: 14,
    textAlignVertical: "top",
  },

  characterHint: {
    color: t.muted,
    fontSize: 10,
    marginTop: 6,
    marginLeft: 4,
  },

  severityRow: {
    flexDirection: "row",
    gap: 10,
  },

  severity: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    alignItems: "center",
    justifyContent: "center",
  },

  severityActive: {
    backgroundColor: "#3A1819",
    borderColor: t.danger,
  },

  severityText: {
    color: t.muted,
    fontWeight: "900",
  },

  severityTextActive: {
    color: "#FFB4B4",
  },

  notifyCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: t.cardAlt,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 18,
    padding: 14,
    marginTop: 22,
  },

  notifyIcon: {
    width: 30,
    height: 30,
    lineHeight: 30,
    borderRadius: 15,
    backgroundColor: t.accent,
    color: t.black,
    textAlign: "center",
    fontWeight: "900",
  },

  notifyTitle: {
    color: t.text,
    fontWeight: "900",
  },

  notifyText: {
    color: t.muted,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },

  errorCard: {
    marginTop: 16,
    backgroundColor: "#3A1819",
    borderWidth: 1,
    borderColor: t.danger,
    borderRadius: 16,
    padding: 14,
  },

  errorTitle: {
    color: "#FFD0D0",
    fontSize: 13,
    fontWeight: "900",
  },

  errorText: {
    color: "#FFB4B4",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  footerNote: {
    color: t.muted,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
});