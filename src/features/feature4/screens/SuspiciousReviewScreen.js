import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";
import {
  getCameraTrapImageById,
  markImageReviewed,
} from "../services/cameraTrapRepository";

export default function SuspiciousReviewScreen() {
  const router = useRouter();
  const { imageId } = useLocalSearchParams();
  const [image, setImage] = useState(null);

  useEffect(() => {
    getCameraTrapImageById(String(imageId)).then(setImage);
  }, [imageId]);

  if (!image) return null;

  const notSuspicious = async () => {
    await markImageReviewed(image.id);
    Alert.alert("Recorded", "Image marked as not suspicious.");
    router.replace("/feature4");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: image.imageUrl }} style={styles.image} />

        <Text style={styles.title}>Suspicious Activity Review</Text>
        <Text style={styles.question}>
          Does this image show suspicious activity?
        </Text>

        <Text style={styles.meta}>
          {image.cameraTrapId} · {image.location}
        </Text>
        <Text style={styles.meta}>
          {new Date(image.timestamp).toLocaleString()}
        </Text>

        <PrimaryButton
          title="Not Suspicious"
          outline
          onPress={notSuspicious}
        />

        <PrimaryButton
          title="Flag as Suspicious"
          danger
          onPress={() =>
            router.push({
              pathname: "/feature4/flag-suspicious",
              params: { imageId: image.id },
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F3" },
  container: { padding: 18 },
  image: { width: "100%", height: 360, borderRadius: 18, backgroundColor: "#DDD" },
  title: { marginTop: 18, fontSize: 25, fontWeight: "900", color: "#17352C" },
  question: { marginTop: 12, fontSize: 18, fontWeight: "700", color: "#1F2937" },
  meta: { marginTop: 8, color: "#6B7280" },
});
