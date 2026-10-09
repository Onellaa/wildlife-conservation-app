import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import StatusBadge from "../components/StatusBadge";
import {
  getCameraTrapImageById,
  markImageInconclusive,
} from "../services/cameraTrapRepository";
import { feature4Theme as t } from "../theme";

function InfoCard({ label, value }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ImageDetailsScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();

  const [image, setImage] = useState(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setImageLoadFailed(false);
      getCameraTrapImageById(String(imageId)).then(setImage);
    }, [imageId])
  );

  if (!image) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={t.accent} />
      </SafeAreaView>
    );
  }

  const markInconclusive = async () => {
    try {
      await markImageInconclusive(image.id);
      Alert.alert(
        "Marked inconclusive",
        "The capture has been reviewed and recorded as inconclusive."
      );
      router.replace("/(tabs)/camera-trap");
    } catch (error) {
      Alert.alert("Unable to update", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {imageLoadFailed ? (
          <View style={styles.imageErrorCard}>
            <Text style={styles.imageErrorIcon}>!</Text>
            <Text style={styles.imageErrorTitle}>Image failed to load</Text>
            <Text style={styles.imageErrorText}>
              This capture will remain unreviewed so it can be attempted again later.
            </Text>
            <Pressable
              onPress={() => setImageLoadFailed(false)}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>RETRY IMAGE</Text>
            </Pressable>
          </View>
        ) : (
          <ImageBackground
            source={{ uri: image.imageUrl }}
            style={styles.hero}
            imageStyle={styles.heroImage}
            onError={() => setImageLoadFailed(true)}
          >
            <View style={styles.heroOverlay}>
              <StatusBadge status={image.reviewStatus} />

              <View>
                <Text style={styles.camera}>{image.cameraTrapId}</Text>
                <Text style={styles.location}>{image.location}</Text>
              </View>
            </View>
          </ImageBackground>
        )}

        <Text style={styles.sectionTitle}>Capture details</Text>

        <View style={styles.grid}>
          <InfoCard
            label="Captured"
            value={new Date(image.timestamp).toLocaleString()}
          />
          <InfoCard
            label="Coordinates"
            value={`${image.latitude?.toFixed?.(4) ?? "—"}, ${
              image.longitude?.toFixed?.(4) ?? "—"
            }`}
          />
        </View>

        <View style={styles.observation}>
          <Text style={styles.observationTitle}>Review outcome</Text>

          <View style={styles.observationRow}>
            <Text style={styles.observationLabel}>Species</Text>
            <Text style={styles.observationValue}>
              {image.species || "Not identified"}
            </Text>
          </View>

          <View style={styles.observationRow}>
            <Text style={styles.observationLabel}>Animal count</Text>
            <Text style={styles.observationValue}>
              {image.animalCount ?? "—"}
            </Text>
          </View>

          <View style={styles.observationRow}>
            <Text style={styles.observationLabel}>Outcome</Text>
            <Text style={styles.observationValue}>
              {image.reviewOutcome
                ? image.reviewOutcome.replaceAll("_", " ")
                : "Pending review"}
            </Text>
          </View>
        </View>

        {!imageLoadFailed ? (
          <>
            <PrimaryButton
              title="Classify Species"
              onPress={() =>
                router.push({
                  pathname: "/feature4/classify",
                  params: { imageId: image.id },
                })
              }
            />

            <PrimaryButton
              title="Review Poacher Evidence"
              outline
              onPress={() =>
                router.push({
                  pathname: "/feature4/suspicious-review",
                  params: { imageId: image.id },
                })
              }
            />

            <Pressable
              style={styles.inconclusiveButton}
              onPress={markInconclusive}
            >
              <Text style={styles.inconclusiveTitle}>Mark as Inconclusive</Text>
              <Text style={styles.inconclusiveText}>
                Use when neither a species nor poacher evidence can be identified.
              </Text>
            </Pressable>
          </>
        ) : null}

        {image.flagged ? (
          <PrimaryButton
            title="Park Manager Review"
            danger
            onPress={() =>
              router.push({
                pathname: "/feature4/investigation",
                params: { imageId: image.id },
              })
            }
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: t.bg },
  center: {
    flex: 1,
    backgroundColor: t.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 18,
    paddingBottom: 50,
  },
  hero: {
    height: 360,
    justifyContent: "flex-end",
  },
  heroImage: {
    borderRadius: 26,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 26,
    backgroundColor: "rgba(4,10,3,0.22)",
  },
  camera: {
    color: t.text,
    fontSize: 28,
    fontWeight: "900",
  },
  location: {
    color: t.accent,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionTitle: {
    color: t.text,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  infoCard: {
    flex: 1,
    minHeight: 95,
    backgroundColor: t.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: t.border,
  },
  infoLabel: {
    color: t.accent,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  infoValue: {
    color: t.text,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  observation: {
    backgroundColor: t.card,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: t.border,
  },
  observationTitle: {
    color: t.accent,
    fontWeight: "900",
    marginBottom: 6,
  },
  observationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: t.border,
  },
  observationLabel: { color: t.muted },
  observationValue: {
    color: t.text,
    fontWeight: "800",
    maxWidth: "58%",
    textAlign: "right",
  },
  inconclusiveButton: {
    marginTop: 14,
    borderRadius: 18,
    padding: 15,
    backgroundColor: "#2B281B",
    borderWidth: 1,
    borderColor: "#5C5432",
  },
  inconclusiveTitle: {
    color: "#FDE68A",
    fontWeight: "900",
    textAlign: "center",
  },
  inconclusiveText: {
    color: "#CFC7A7",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 4,
  },
  imageErrorCard: {
    minHeight: 280,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#281516",
    borderWidth: 1,
    borderColor: "#5B2A2D",
  },
  imageErrorIcon: {
    width: 48,
    height: 48,
    lineHeight: 48,
    textAlign: "center",
    borderRadius: 24,
    color: "#FFB4B4",
    backgroundColor: "#3A1819",
    fontSize: 24,
    fontWeight: "900",
  },
  imageErrorTitle: {
    color: "#FFD0D0",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 14,
  },
  imageErrorText: {
    color: "#D7BABA",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 7,
  },
  retryButton: {
    marginTop: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: t.danger,
  },
  retryText: {
    color: "#FFB4B4",
    fontWeight: "900",
    fontSize: 11,
  },
});
