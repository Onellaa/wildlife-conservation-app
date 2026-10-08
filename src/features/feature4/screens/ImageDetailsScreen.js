import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import StatusBadge from "../components/StatusBadge";
import { getCameraTrapImageById } from "../services/cameraTrapRepository";

export default function ImageDetailsScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();
  const [image, setImage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getCameraTrapImageById(String(imageId)).then(setImage);
    }, [imageId])
  );

  if (!image) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1F6B4F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: image.imageUrl }} style={styles.hero} />

        <View style={styles.row}>
          <Text style={styles.title}>{image.cameraTrapId}</Text>
          <StatusBadge status={image.reviewStatus} />
        </View>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{image.location}</Text>

        <Text style={styles.label}>Captured</Text>
        <Text style={styles.value}>
          {new Date(image.timestamp).toLocaleString()}
        </Text>

        <Text style={styles.label}>GPS Coordinates</Text>
        <Text style={styles.value}>
          {image.latitude.toFixed(4)}, {image.longitude.toFixed(4)}
        </Text>

        {image.species ? (
          <>
            <Text style={styles.label}>Classification</Text>
            <Text style={styles.value}>
              {image.species} · Count {image.animalCount}
            </Text>
          </>
        ) : null}

        <PrimaryButton
          title="Classify Wildlife"
          onPress={() =>
            router.push({
              pathname: "/feature4/classify",
              params: { imageId: image.id },
            })
          }
        />

        <PrimaryButton
          title="Review Suspicious Activity"
          outline
          onPress={() =>
            router.push({
              pathname: "/feature4/suspicious-review",
              params: { imageId: image.id },
            })
          }
        />

        {image.flagged ? (
          <PrimaryButton
            title="View Investigation"
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
  safe: { flex: 1, backgroundColor: "#F4F7F3" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 18, paddingBottom: 40 },
  hero: { width: "100%", height: 300, borderRadius: 20, backgroundColor: "#DDD" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 18 },
  title: { fontSize: 25, fontWeight: "900", color: "#17352C" },
  label: { marginTop: 18, fontSize: 12, fontWeight: "800", color: "#6B7280", textTransform: "uppercase" },
  value: { marginTop: 4, fontSize: 16, color: "#1F2937" },
});
