import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import {
  getCameraTrapImageById,
  markImageInconclusive,
} from "../services/cameraTrapRepository";
import { feature4Theme as t } from "../theme";

function DetailPill({ label, value }) {
  return (
    <View style={styles.detailPill}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function SuspiciousReviewScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();

  const [image, setImage] = useState(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  useEffect(() => {
    getCameraTrapImageById(String(imageId)).then(setImage);
  }, [imageId]);

  if (!image) return null;

  const inconclusive = async () => {
    try {
      await markImageInconclusive(image.id);
      Alert.alert(
        "Marked inconclusive",
        "The capture has been recorded as inconclusive."
      );
      router.replace("/(tabs)/camera-trap");
    } catch (error) {
      Alert.alert("Unable to update", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>POACHER EVIDENCE REVIEW</Text>
          <Text style={styles.title}>Inspect the Capture</Text>
          <Text style={styles.subtitle}>
            Determine whether the image contains poacher evidence or is inconclusive.
          </Text>
        </View>

        {imageLoadFailed ? (
          <View style={styles.loadError}>
            <Text style={styles.loadErrorTitle}>Image failed to load</Text>
            <Text style={styles.loadErrorText}>
              The capture remains unreviewed and stays in the queue for a later attempt.
            </Text>
          </View>
        ) : (
          <ImageBackground
            source={{ uri: image.imageUrl }}
            style={styles.hero}
            imageStyle={styles.heroImage}
            onError={() => setImageLoadFailed(true)}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.warningBadge}>
                <View style={styles.warningDot} />
                <Text style={styles.warningText}>MANUAL REVIEW</Text>
              </View>

              <View style={styles.heroBottom}>
                <View>
                  <Text style={styles.camera}>{image.cameraTrapId}</Text>
                  <Text style={styles.location}>{image.location}</Text>
                </View>

                <View style={styles.riskBubble}>
                  <Text style={styles.riskIcon}>!</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        )}

        <View style={styles.detailsRow}>
          <DetailPill
            label="Captured"
            value={new Date(image.timestamp).toLocaleDateString()}
          />
          <DetailPill
            label="Time"
            value={new Date(image.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </View>

        {!imageLoadFailed ? (
          <>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Possible evidence</Text>
              <Text style={styles.reviewSubtitle}>
                The original design leaves this decision to staff judgement; no automated poacher detection is assumed.
              </Text>

              <View style={styles.signalGrid}>
                {[
                  "Unidentified person",
                  "Weapon / hunting gear",
                  "Snare / trap",
                  "Illegal camp / activity",
                ].map((item) => (
                  <View style={styles.signalItem} key={item}>
                    <Text style={styles.signalIcon}>◉</Text>
                    <Text style={styles.signalLabel}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.decisionCard}>
              <Text style={styles.decisionTitle}>Review outcome</Text>
              <Text style={styles.decisionText}>
                Flag the capture only when staff judge it to contain poacher evidence.
                Otherwise mark it inconclusive.
              </Text>

              <PrimaryButton
                title="Flag as Poacher Evidence"
                danger
                onPress={() =>
                  router.push({
                    pathname: "/feature4/flag-suspicious",
                    params: { imageId: image.id },
                  })
                }
              />

              <PrimaryButton
                title="Mark as Inconclusive"
                outline
                onPress={inconclusive}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: t.bg },
  content: { padding: 18, paddingBottom: 60 },
  header: { marginBottom: 18 },
  eyebrow: {
    color: t.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  title: {
    color: t.text,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 5,
  },
  subtitle: {
    color: t.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  hero: { height: 390 },
  heroImage: { borderRadius: 28 },
  heroOverlay: {
    flex: 1,
    padding: 16,
    borderRadius: 28,
    justifyContent: "space-between",
    backgroundColor: "rgba(10, 6, 4, 0.18)",
  },
  warningBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(69,32,32,0.92)",
    borderWidth: 1,
    borderColor: t.danger,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  warningDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: t.danger,
  },
  warningText: {
    color: "#FFB4B4",
    fontSize: 10,
    fontWeight: "900",
  },
  heroBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "rgba(8,16,6,0.78)",
    borderRadius: 20,
    padding: 15,
  },
  camera: {
    color: t.text,
    fontSize: 24,
    fontWeight: "900",
  },
  location: {
    color: t.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  riskBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3A1819",
    borderWidth: 1,
    borderColor: t.danger,
  },
  riskIcon: {
    color: "#FFB4B4",
    fontSize: 22,
    fontWeight: "900",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  detailPill: {
    flex: 1,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 18,
    padding: 14,
  },
  detailLabel: {
    color: t.accent,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  detailValue: {
    color: t.text,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 7,
  },
  reviewCard: {
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 22,
    padding: 16,
    marginTop: 14,
  },
  reviewTitle: {
    color: t.text,
    fontSize: 18,
    fontWeight: "900",
  },
  reviewSubtitle: {
    color: t.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  signalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  signalItem: {
    width: "48%",
    backgroundColor: t.cardAlt,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 16,
    padding: 13,
  },
  signalIcon: {
    color: t.accent,
    fontSize: 18,
    fontWeight: "900",
  },
  signalLabel: {
    color: t.text,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 7,
  },
  decisionCard: {
    backgroundColor: "#17120F",
    borderWidth: 1,
    borderColor: "#433328",
    borderRadius: 22,
    padding: 16,
    marginTop: 14,
  },
  decisionTitle: {
    color: t.text,
    fontSize: 18,
    fontWeight: "900",
  },
  decisionText: {
    color: t.muted,
    lineHeight: 20,
    marginTop: 6,
  },
  loadError: {
    minHeight: 260,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
    backgroundColor: "#281516",
    borderWidth: 1,
    borderColor: "#5B2A2D",
  },
  loadErrorTitle: {
    color: "#FFD0D0",
    fontSize: 20,
    fontWeight: "900",
  },
  loadErrorText: {
    color: "#D7BABA",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
});
